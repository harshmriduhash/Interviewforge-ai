import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: sessionId } = params;
  const body = await req.json();
  const {
    aiQuestion,
    userAnswerText,
    scoreTechnical,
    scoreCommunication,
    scoreStructure,
    aiFeedback,
    exchangeOrder,
  } = body;

  const newExchange = await prisma.sessionExchange.create({
    data: {
      sessionId,
      exchangeOrder: exchangeOrder || 0,
      aiQuestion,
      userAnswerText,
      scoreTechnical,
      scoreCommunication,
      scoreStructure,
      aiFeedback,
    },
  });

  // Increment session questionsAsked counter
  await prisma.session.update({
    where: { id: sessionId },
    data: {
      questionsAsked: { increment: 1 },
    },
  });

  return NextResponse.json(newExchange, { status: 201 });
}
