import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const session = await getServerSession(authOptions);
        if (!session?.user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const userId = (session.user as any).id as string;

        // Verify session ownership
        const interviewSession = await prisma.session.findFirst({
            where: { id, userId },
            include: { exchanges: true },
        });

        if (!interviewSession) {
            return NextResponse.json({ error: "Session not found" }, { status: 404 });
        }

        // Build HTML report
        const scores = [
            { label: "Technical Accuracy", val: Number(interviewSession.scoreTechnical || 0) },
            { label: "Communication", val: Number(interviewSession.scoreCommunication || 0) },
            { label: "Structure", val: Number(interviewSession.scoreStructure || 0) },
            { label: "Depth", val: Number(interviewSession.scoreDepth || 0) },
            { label: "Confidence", val: Number(interviewSession.scoreConfidence || 0) },
            { label: "Filler Control", val: Number(interviewSession.scoreFillerWords || 0) },
            { label: "Pacing", val: Number(interviewSession.scoreResponseTime || 0) },
        ];

        const overall = Number(interviewSession.overallScore || 0).toFixed(0);
        const duration = interviewSession.durationSeconds
            ? `${Math.floor(interviewSession.durationSeconds / 60)}m ${interviewSession.durationSeconds % 60}s`
            : "N/A";

        const exchangesHtml = interviewSession.exchanges
            .sort((a, b) => a.exchangeOrder - b.exchangeOrder)
            .map(
                (ex) => `
        <div style="margin-bottom:20px;padding:16px;background:#f9f9f9;border-radius:8px;border:1px solid #e0e0e0;">
          <p style="font-size:11px;color:#666;font-weight:700;text-transform:uppercase;margin-bottom:8px;">Exchange #${ex.exchangeOrder}</p>
          <p style="font-weight:600;margin-bottom:6px;">Q: ${ex.aiQuestion}</p>
          <p style="color:#444;font-style:italic;margin-bottom:8px;">A: "${ex.userAnswerText || "(No answer captured)"}"</p>
          ${ex.aiFeedback ? `<p style="font-size:12px;color:#2563eb;background:#eff6ff;padding:8px;border-radius:4px;">${ex.aiFeedback}</p>` : ""}
        </div>`
            )
            .join("");

        const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica', 'Arial', sans-serif; max-width: 800px; margin: 0 auto; padding: 40px; color: #1a1a1a; }
        h1 { font-size: 28px; font-weight: 900; border-bottom: 3px solid #FF5C00; padding-bottom: 12px; }
        .score-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin: 24px 0; }
        .score-item { padding: 12px; background: #f5f5f5; border-radius: 8px; }
        .score-label { font-size: 11px; color: #666; text-transform: uppercase; font-weight: 700; }
        .score-value { font-size: 24px; font-weight: 900; color: #FF5C00; }
        .overall { text-align: center; padding: 32px; background: linear-gradient(135deg, #FFF5ED 0%, #ffffff 100%); border-radius: 16px; border: 2px solid #FF5C00; margin: 24px 0; }
        .overall-score { font-size: 64px; font-weight: 900; color: #FF5C00; }
        .section-title { font-size: 18px; font-weight: 700; margin-top: 32px; margin-bottom: 16px; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px; }
        .meta { font-size: 13px; color: #666; }
        .footer { margin-top: 40px; padding-top: 16px; border-top: 1px solid #e0e0e0; font-size: 11px; color: #999; text-align: center; }
      </style>
    </head>
    <body>
      <h1>InterviewForge AI — Session Report</h1>
      <p class="meta">
        Round: ${interviewSession.roundType?.replace("_", " ") || "General"} · 
        Difficulty: ${interviewSession.difficulty?.replace("_", " ") || "Medium"} · 
        Duration: ${duration} · 
        Questions: ${interviewSession.questionsAsked || interviewSession.exchanges.length}
      </p>

      <div class="overall">
        <p style="font-size:12px;color:#666;text-transform:uppercase;font-weight:700;letter-spacing:2px;margin-bottom:8px;">Overall Readiness Score</p>
        <div class="overall-score">${overall}%</div>
      </div>

      <p class="section-title">7-Dimension Performance Breakdown</p>
      <div class="score-grid">
        ${scores.map((s) => `
          <div class="score-item">
            <div class="score-label">${s.label}</div>
            <div class="score-value">${s.val}%</div>
          </div>
        `).join("")}
      </div>

      ${exchangesHtml ? `<p class="section-title">Detailed Question Transcripts</p>${exchangesHtml}` : ""}
      
      <div class="footer">
        Generated by InterviewForge AI · ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
      </div>
    </body>
    </html>`;

        // Generate PDF using html-pdf-node
        const htmlPdf = await import("html-pdf-node");
        const options = { format: "A4" as const, margin: { top: 20, right: 20, bottom: 20, left: 20 } };
        const file = { content: html };
        const pdfBuffer = await htmlPdf.default.generatePdf(file, options);

        return new NextResponse(pdfBuffer, {
            status: 200,
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="interviewforge-report-${id.slice(0, 8)}.pdf"`,
            },
        });
    } catch (error) {
        console.error("PDF generation error:", error);
        return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
    }
}
