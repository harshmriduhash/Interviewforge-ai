import { Pinecone } from "@pinecone-database/pinecone";
import { GoogleGenerativeAI } from "@google/generative-ai";

let pineconeClient: Pinecone | null = null;

export function getPinecone(): Pinecone | null {
    if (!process.env.PINECONE_API_KEY) return null;
    if (!pineconeClient) {
        pineconeClient = new Pinecone({
            apiKey: process.env.PINECONE_API_KEY,
        });
    }
    return pineconeClient;
}

const INDEX_NAME = process.env.PINECONE_INDEX || "interviewforge-questions";

/**
 * Generate embedding via Gemini embedding model
 */
async function generateEmbedding(text: string): Promise<number[]> {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
    const model = genAI.getGenerativeModel({ model: "text-embedding-004" });
    const result = await model.embedContent(text);
    return result.embedding.values;
}

/**
 * Upsert questions into Pinecone index
 */
export async function upsertQuestions(
    questions: { id: string; title: string; body: string; roundType?: string; difficulty?: string; topicTags: string[] }[]
) {
    const pc = getPinecone();
    if (!pc) return;

    const index = pc.index(INDEX_NAME);

    const vectors = await Promise.all(
        questions.map(async (q) => {
            const text = `${q.title}\n${q.body}\nTags: ${q.topicTags.join(", ")}\nRound: ${q.roundType || "general"}\nDifficulty: ${q.difficulty || "medium"}`;
            const values = await generateEmbedding(text);
            return {
                id: q.id,
                values,
                metadata: {
                    title: q.title,
                    roundType: q.roundType || "general",
                    difficulty: q.difficulty || "medium",
                    topicTags: q.topicTags.join(","),
                },
            };
        })
    );

    // Upsert in batches of 100
    for (let i = 0; i < vectors.length; i += 100) {
        await index.upsert({ records: vectors.slice(i, i + 100) });
    }
}

/**
 * Query relevant questions from Pinecone
 */
export async function queryRelevantQuestions(
    context: {
        roundType?: string;
        difficulty?: string;
        weakTopics?: string[];
        company?: string;
        excludeIds?: string[];
    },
    topK: number = 5
): Promise<{ id: string; score: number; metadata: Record<string, any> }[]> {
    const pc = getPinecone();
    if (!pc) return [];

    const index = pc.index(INDEX_NAME);

    const queryText = [
        context.roundType && `Round type: ${context.roundType}`,
        context.difficulty && `Difficulty: ${context.difficulty}`,
        context.weakTopics?.length && `Weak topics to practice: ${context.weakTopics.join(", ")}`,
        context.company && `Company: ${context.company}`,
    ]
        .filter(Boolean)
        .join(". ");

    const queryVector = await generateEmbedding(queryText);

    const filter: Record<string, any> = {};
    if (context.roundType) {
        filter.roundType = { $eq: context.roundType };
    }

    const results = await index.query({
        vector: queryVector,
        topK,
        includeMetadata: true,
        filter: Object.keys(filter).length > 0 ? filter : undefined,
    });

    return (results.matches || [])
        .filter((m) => !context.excludeIds?.includes(m.id))
        .map((m) => ({
            id: m.id,
            score: m.score || 0,
            metadata: (m.metadata as Record<string, any>) || {},
        }));
}
