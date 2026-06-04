import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "");
const SENDER = process.env.SYSTEM_SENDER_EMAIL || "noreply@interviewforge.ai";

/**
 * Weekly email digest cron job.
 * Call via Vercel Cron or external scheduler: POST /api/cron/digest
 * Protected by CRON_SECRET header.
 */
export async function POST(req: NextRequest) {
    // Verify cron secret
    const authHeader = req.headers.get("authorization");
    const cronSecret = process.env.CRON_SECRET;
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

        // Find users with sessions in the last 7 days
        const activeUsers = await prisma.user.findMany({
            where: {
                sessions: {
                    some: {
                        createdAt: { gte: oneWeekAgo },
                        status: "completed",
                    },
                },
                deletedAt: null,
            },
            include: {
                userProgress: true,
                sessions: {
                    where: {
                        createdAt: { gte: oneWeekAgo },
                        status: "completed",
                    },
                    orderBy: { createdAt: "desc" },
                },
            },
        });

        let sentCount = 0;
        let errorCount = 0;

        for (const user of activeUsers) {
            const sessionsThisWeek = user.sessions.length;
            const avgScore =
                user.sessions.length > 0
                    ? Math.round(
                        user.sessions.reduce((acc, s) => acc + Number(s.overallScore || 0), 0) /
                        user.sessions.length
                    )
                    : 0;
            const readiness = user.userProgress
                ? Number(user.userProgress.readinessScore).toFixed(0)
                : "N/A";
            const streak = user.userProgress?.currentStreak || 0;
            const weakTopics =
                user.userProgress?.weakTopics?.length
                    ? user.userProgress.weakTopics.join(", ")
                    : "None identified yet";

            const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica', 'Arial', sans-serif; background: #f7f7f7; padding: 0; margin: 0; }
          .container { max-width: 560px; margin: 0 auto; background: #ffffff; border-radius: 16px; overflow: hidden; }
          .header { background: #0A0A0A; padding: 32px; text-align: center; }
          .header h1 { color: #FF5C00; font-size: 24px; margin: 0; font-weight: 900; }
          .header p { color: #A3A3A3; font-size: 13px; margin-top: 8px; }
          .content { padding: 32px; }
          .greeting { font-size: 16px; font-weight: 600; margin-bottom: 20px; color: #1a1a1a; }
          .stat-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 20px 0; }
          .stat-card { background: #f9f9f9; padding: 16px; border-radius: 10px; text-align: center; }
          .stat-value { font-size: 28px; font-weight: 900; color: #FF5C00; }
          .stat-label { font-size: 11px; color: #666; text-transform: uppercase; font-weight: 700; letter-spacing: 0.5px; margin-top: 4px; }
          .cta { display: block; background: #FF5C00; color: #fff !important; padding: 14px 28px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 15px; text-align: center; margin: 24px 0; }
          .weak-topics { background: #FFF5ED; border: 1px solid #FFE0CC; padding: 14px; border-radius: 8px; font-size: 13px; color: #664400; }
          .footer { padding: 20px 32px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🔥 InterviewForge AI</h1>
            <p>Your Weekly Progress Report</p>
          </div>
          <div class="content">
            <div class="greeting">Hey ${user.name || "Engineer"}, here's your week in review 👇</div>
            
            <div class="stat-grid">
              <div class="stat-card">
                <div class="stat-value">${sessionsThisWeek}</div>
                <div class="stat-label">Sessions</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${avgScore}%</div>
                <div class="stat-label">Avg Score</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${readiness}%</div>
                <div class="stat-label">Readiness</div>
              </div>
              <div class="stat-card">
                <div class="stat-value">${streak}🔥</div>
                <div class="stat-label">Streak</div>
              </div>
            </div>

            <div class="weak-topics">
              <strong>📌 Focus Areas:</strong> ${weakTopics}
            </div>

            <a href="${process.env.NEXTAUTH_URL || "https://interviewforge.ai"}/dashboard/progress" class="cta">
              View Full Analytics →
            </a>

            <p style="font-size: 13px; color: #666; line-height: 1.6;">
              Keep pushing — consistency is the #1 predictor of interview success. See you on the mat! 💪
            </p>
          </div>
          <div class="footer">
            InterviewForge AI · You're receiving this because you practiced this week
          </div>
        </div>
      </body>
      </html>`;

            try {
                if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.startsWith("PLACEHOLDER")) {
                    await resend.emails.send({
                        from: SENDER,
                        to: user.email,
                        subject: `🔥 Weekly Forge Digest: ${sessionsThisWeek} sessions, ${avgScore}% avg`,
                        html,
                    });
                }
                sentCount++;
            } catch (err) {
                console.error(`Failed to send digest to ${user.email}:`, err);
                errorCount++;
            }
        }

        return NextResponse.json({
            success: true,
            sent: sentCount,
            errors: errorCount,
            totalUsers: activeUsers.length,
        });
    } catch (error) {
        console.error("Digest cron error:", error);
        return NextResponse.json({ error: "Digest cron failed" }, { status: 500 });
    }
}
