import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: sessionId } = await params;

  try {
    const session = await prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        exchanges: {
          orderBy: { exchangeOrder: 'asc' }
        },
        company: true,
      },
    });

    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const doc = new jsPDF();

    // Header
    doc.setFontSize(22);
    doc.setTextColor(255, 92, 0); // Forge Orange
    doc.text("INTERVIEWFORGE AI REPORT", 105, 20, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 28, { align: "center" });

    // Session Info
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text("Session Details", 20, 45);

    autoTable(doc, {
      startY: 50,
      head: [['Property', 'Value']],
      body: [
        ['Role', session.role || 'Software Engineer'],
        ['Company', session.company?.name || 'General Tech'],
        ['Overall Score', `${session.overallScore || 0}%`],
        ['Duration', `${session.durationMinutes || 0} minutes`],
        ['Status', session.status],
      ],
      theme: 'striped',
      headStyles: { fillColor: [255, 92, 0] }
    });

    // Scores Breakdown
    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.text("Dimension Scores", 20, finalY);

    autoTable(doc, {
      startY: finalY + 5,
      head: [['Dimension', 'Score']],
      body: [
        ['Technical Accuracy', `${session.scoreTechnical || 0}%`],
        ['Communication Clarity', `${session.scoreCommunication || 0}%`],
        ['Answer Structure', `${session.scoreStructure || 0}%`],
      ],
      theme: 'grid',
      headStyles: { fillColor: [40, 40, 40] }
    });

    // Transcript
    doc.addPage();
    doc.setFontSize(16);
    doc.text("Interview Transcript", 20, 20);

    const tableBody = session.exchanges.flatMap((ex, i) => [
      [{ content: `Q${i + 1}: ${ex.aiQuestion}`, styles: { fontStyle: 'bold' as const, textColor: [255, 92, 0] as [number, number, number] } }],
      [{ content: `A: ${ex.userAnswerText || "No response recorded."}`, styles: { textColor: [30, 30, 30] as [number, number, number] } }],
      [{ content: "", styles: { cellPadding: 1 } }] // Spacer
    ]);

    autoTable(doc, {
      startY: 30,
      body: tableBody,
      theme: 'plain',
      styles: { fontSize: 9, cellPadding: 2 }
    });

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=InterviewForge_Report_${sessionId}.pdf`,
      },
    });
  } catch (error) {
    console.error("PDF generation error:", error);
    return NextResponse.json({ error: "Failed to generate PDF" }, { status: 500 });
  }
}
