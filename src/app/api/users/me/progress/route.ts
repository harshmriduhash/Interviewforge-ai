import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

/**
 * Recalculate user progress after session completion.
 * Updates weakTopics, strongTopics, dimensionHistory, readinessScore.
 */
export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id as string;

        // Fetch all completed sessions for this user
        const completedSessions = await prisma.session.findMany({
            where: { userId, status: "completed" },
            include: {
                exchanges: {
                    select: {
                        scoreTechnical: true,
                        scoreCommunication: true,
                        scoreStructure: true,
                        aiQuestion: true,
                        aiFeedback: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        const totalSessions = completedSessions.length;
        const totalDurationMinutes = Math.round(
            completedSessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0) / 60
        );

        // Calculate dimension averages from most recent 10 sessions
        const recentSessions = completedSessions.slice(0, 10);
        const dimensions = {
            technical: [] as number[],
            communication: [] as number[],
            structure: [] as number[],
            depth: [] as number[],
            confidence: [] as number[],
            fillerWords: [] as number[],
            responseTime: [] as number[],
        };

        for (const s of recentSessions) {
            if (s.scoreTechnical) dimensions.technical.push(Number(s.scoreTechnical));
            if (s.scoreCommunication) dimensions.communication.push(Number(s.scoreCommunication));
            if (s.scoreStructure) dimensions.structure.push(Number(s.scoreStructure));
            if (s.scoreDepth) dimensions.depth.push(Number(s.scoreDepth));
            if (s.scoreConfidence) dimensions.confidence.push(Number(s.scoreConfidence));
            if (s.scoreFillerWords) dimensions.fillerWords.push(Number(s.scoreFillerWords));
            if (s.scoreResponseTime) dimensions.responseTime.push(Number(s.scoreResponseTime));
        }

        const avg = (arr: number[]) => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0);

        const dimensionAverages: Record<string, number> = {
            technical: Math.round(avg(dimensions.technical)),
            communication: Math.round(avg(dimensions.communication)),
            structure: Math.round(avg(dimensions.structure)),
            depth: Math.round(avg(dimensions.depth)),
            confidence: Math.round(avg(dimensions.confidence)),
            fillerWords: Math.round(avg(dimensions.fillerWords)),
            responseTime: Math.round(avg(dimensions.responseTime)),
        };

        // Determine weak and strong topics
        const threshold = 70;
        const weakTopics = Object.entries(dimensionAverages)
            .filter(([, v]) => v > 0 && v < threshold)
            .map(([k]) => k);
        const strongTopics = Object.entries(dimensionAverages)
            .filter(([, v]) => v >= 80)
            .map(([k]) => k);

        // Calculate overall readiness score
        const allDimensionValues = Object.values(dimensionAverages).filter((v) => v > 0);
        const readinessScore = allDimensionValues.length
            ? Math.round(allDimensionValues.reduce((a, b) => a + b, 0) / allDimensionValues.length)
            : 0;

        // Build dimension history (append current averages)
        const existingProgress = await prisma.userProgress.findUnique({
            where: { userId },
            select: { dimensionHistory: true },
        });

        const history = (existingProgress?.dimensionHistory as Record<string, number[]>) || {};
        for (const [key, value] of Object.entries(dimensionAverages)) {
            if (!history[key]) history[key] = [];
            history[key].push(value);
            // Keep last 20 data points
            if (history[key].length > 20) history[key] = history[key].slice(-20);
        }

        // Calculate streak
        const sessionDates = completedSessions
            .map((s) => s.endedAt || s.createdAt)
            .map((d) => new Date(d).toISOString().split("T")[0]);
        const uniqueDates = [...new Set(sessionDates)].sort().reverse();

        let currentStreak = 0;
        const today = new Date().toISOString().split("T")[0];
        let checkDate = new Date(today);

        for (let i = 0; i < 365; i++) {
            const dateStr = checkDate.toISOString().split("T")[0];
            if (uniqueDates.includes(dateStr)) {
                currentStreak++;
            } else if (i > 0) {
                break;
            }
            checkDate.setDate(checkDate.getDate() - 1);
        }

        // Collect all seen question IDs
        const questionsSeen = completedSessions
            .flatMap((s) => s.exchanges)
            .map(() => "")
            .filter(Boolean);

        // Readiness by company
        const readinessByCompany: Record<string, number> = {};
        for (const s of completedSessions) {
            if (s.companyId) {
                if (!readinessByCompany[s.companyId]) readinessByCompany[s.companyId] = 0;
                readinessByCompany[s.companyId] = Math.round(
                    (readinessByCompany[s.companyId] + Number(s.overallScore || 0)) / 2
                );
            }
        }

        // Upsert progress
        await prisma.userProgress.upsert({
            where: { userId },
            create: {
                userId,
                readinessScore,
                totalSessions,
                totalDurationMinutes,
                currentStreak,
                longestStreak: currentStreak,
                lastSessionAt: completedSessions[0]?.endedAt || new Date(),
                weakTopics,
                strongTopics,
                dimensionHistory: history,
                readinessByCompany,
            },
            update: {
                readinessScore,
                totalSessions,
                totalDurationMinutes,
                currentStreak,
                longestStreak: { set: Math.max(currentStreak, 0) },
                lastSessionAt: completedSessions[0]?.endedAt || new Date(),
                weakTopics,
                strongTopics,
                dimensionHistory: history,
                readinessByCompany,
            },
        });

        return NextResponse.json({
            success: true,
            readinessScore,
            totalSessions,
            weakTopics,
            strongTopics,
            currentStreak,
        });
    } catch (error) {
        console.error("Progress update error:", error);
        return NextResponse.json({ error: "Failed to update progress" }, { status: 500 });
    }
}
