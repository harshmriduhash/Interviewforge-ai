import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

const COMPANIES = [
  { name: "Google", slug: "google", tier: "faang", isActive: true },
  { name: "Meta", slug: "meta", tier: "faang", isActive: true },
  { name: "Amazon", slug: "amazon", tier: "faang", isActive: true },
  { name: "Apple", slug: "apple", tier: "faang", isActive: true },
  { name: "Netflix", slug: "netflix", tier: "faang", isActive: true },
  { name: "Stripe", slug: "stripe", tier: "tier1", isActive: true },
  { name: "Airbnb", slug: "airbnb", tier: "tier1", isActive: true },
  { name: "Uber", slug: "uber", tier: "tier1", isActive: true },
  { name: "OpenAI", slug: "openai", tier: "startup", isActive: true },
  { name: "Anthropic", slug: "anthropic", tier: "startup", isActive: true },
];

const QUESTIONS = [
  // Google
  {
    companySlug: "google",
    title: "Global Distributed News Feed System",
    body: "Design a globally distributed news feed system like Google Currents or Google+ News. The system must support high-throughput writes (users publishing updates), low-latency reads (users viewing their feed), eventual vs strong consistency tradeoffs, and efficient timeline caching strategies. Address scale, network partition partitioning, and DB replication bottlenecks.",
    roundType: "system_design",
    difficulty: "hard",
    topicTags: ["system_design", "distributed_systems", "caching", "databases"],
    roleLevels: ["IC4", "IC5", "IC6"],
    source: "curated",
    verified: true,
  },
  {
    companySlug: "google",
    title: "Binary Tree Maximum Path Sum",
    body: "Given a non-empty binary tree, find the maximum path sum. For this problem, a path is defined as any sequence of nodes from some starting node to any node in the tree along the parent-child connections. The path must contain at least one node and does not need to go through the root.",
    roundType: "algorithms",
    difficulty: "hard",
    topicTags: ["algorithms", "trees", "dfs", "recursion"],
    roleLevels: ["IC3", "IC4"],
    source: "curated",
    verified: true,
  },
  {
    companySlug: "google",
    title: "Google Googlebot Web Crawler",
    body: "Design a web crawler (Googlebot) that can crawl billions of web pages daily. It must fetch, parse, extract URLs, and store content, while respecting robots.txt protocols, dealing with duplicate pages, handling loops/spider traps, and optimizing for network bandwidth, polite crawling, and parallel scheduling.",
    roundType: "system_design",
    difficulty: "uber_hard",
    topicTags: ["system_design", "crawlers", "queues", "storage"],
    roleLevels: ["IC5", "IC6"],
    source: "curated",
    verified: true,
  },
  {
    companySlug: "google",
    title: "Google's 'Why Google' & Career Arc",
    body: "Why are you interested in joining Google specifically, and how does your career arc align with Google's mission to organize the world's information? Tell me about a time you worked on a highly ambiguous technical project, made a critical mistake, and how you handled the fallout with stakeholders.",
    roundType: "behavioral",
    difficulty: "medium",
    topicTags: ["behavioral", "googleyness", "leadership", "ambiguity"],
    roleLevels: ["IC3", "IC4", "IC5", "IC6"],
    source: "curated",
    verified: true,
  },

  // Meta
  {
    companySlug: "meta",
    title: "Live Video Streaming Scale",
    body: "Design a real-time live video streaming infrastructure like Facebook Live. The system must support millions of concurrent viewers, video transcoding pipelines on-the-fly, low-latency live chats, geographical load balancing, and dynamic bitrate adaptive streaming.",
    roundType: "system_design",
    difficulty: "uber_hard",
    topicTags: ["system_design", "streaming", "cdn", "websockets"],
    roleLevels: ["IC5", "IC6"],
    source: "curated",
    verified: true,
  },
  {
    companySlug: "meta",
    title: "Valid Palindrome II with Single Deletion",
    body: "Given a non-empty string s, you may delete at most one character. Judge whether you can make it a palindrome.",
    roundType: "algorithms",
    difficulty: "easy",
    topicTags: ["algorithms", "strings", "two_pointers"],
    roleLevels: ["IC3"],
    source: "curated",
    verified: true,
  },
  {
    companySlug: "meta",
    title: "STAR: Handling Severe Interpersonal Conflict",
    body: "Describe a time at your previous role when you had a severe technical conflict with a senior engineer or product manager. You disagreed on the architecture of a critical path. Walk me through the details using the STAR method (Situation, Task, Action, Result) explaining the trade-offs, how you reached consensus, and what you learned.",
    roundType: "behavioral",
    difficulty: "medium",
    topicTags: ["behavioral", "conflict_resolution", "collaboration", "communication"],
    roleLevels: ["IC3", "IC4", "IC5", "IC6"],
    source: "curated",
    verified: true,
  },

  // Stripe
  {
    companySlug: "stripe",
    title: "Idempotent Payment API Gateway",
    body: "Design an API gateway that ensures idempotent payment requests in Stripe. The system must guarantee that a payment is processed exactly once even if a client retries due to network failure. Explain distributed locking mechanisms, API key validations, deduplication token caching, and ACID transaction safety.",
    roundType: "system_design",
    difficulty: "hard",
    topicTags: ["system_design", "payments", "idempotency", "redis"],
    roleLevels: ["IC4", "IC5"],
    source: "curated",
    verified: true,
  },
  {
    companySlug: "stripe",
    title: "Key-Value Store with Time-to-Live (TTL)",
    body: "Design and implement an in-memory Key-Value store that supports standard GET and SET operations, along with a TTL setting for keys. Keys must expire and be cleaned up efficiently, supporting high concurrency and low latency reads.",
    roundType: "algorithms",
    difficulty: "medium",
    topicTags: ["algorithms", "hashmap", "concurrency", "design"],
    roleLevels: ["IC3", "IC4"],
    source: "curated",
    verified: true,
  },
  {
    companySlug: "stripe",
    title: "STAR: Elevating Product Metrics & UX",
    body: "Stripe values clean developer experiences obsessively. Tell me about a time you identified a massive user experience bottleneck in a codebase, initiated a rewrite or feature development, and how you measured the positive impact on business performance or user retention.",
    roundType: "behavioral",
    difficulty: "medium",
    topicTags: ["behavioral", "initiative", "analytics", "product_mindset"],
    roleLevels: ["IC3", "IC4", "IC5"],
    source: "curated",
    verified: true,
  },
];

async function main() {
  console.log("🌱 Starting database seeding...");

  // Seed Companies
  console.log("🏢 Seeding companies...");
  const companyMap = new Map<string, string>();
  for (const c of COMPANIES) {
    const record = await prisma.company.upsert({
      where: { slug: c.slug },
      update: { tier: c.tier, isActive: c.isActive },
      create: { name: c.name, slug: c.slug, tier: c.tier, isActive: c.isActive },
    });
    companyMap.set(c.slug, record.id);
  }

  // Seed Questions
  console.log("🎙 Seeding questions...");
  for (const q of QUESTIONS) {
    const companyId = companyMap.get(q.companySlug) || null;
    await prisma.question.create({
      data: {
        title: q.title,
        body: q.body,
        roundType: q.roundType,
        difficulty: q.difficulty,
        topicTags: q.topicTags,
        roleLevels: q.roleLevels,
        source: q.source,
        verified: q.verified,
        companyId: companyId,
      },
    });
  }

  // Recalculate company question counts
  console.log("📊 Updating company stats...");
  for (const [slug, id] of companyMap.entries()) {
    const count = await prisma.question.count({
      where: { companyId: id },
    });
    await prisma.company.update({
      where: { id },
      data: { questionCount: count },
    });
  }

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
