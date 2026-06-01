import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email || typeof email !== "string") {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Always return success to prevent email enumeration
        const user = await prisma.user.findUnique({ where: { email } });

        if (user) {
            // Invalidate any existing unused tokens for this user
            await prisma.passwordResetToken.updateMany({
                where: { userId: user.id, usedAt: null },
                data: { usedAt: new Date() }, // mark old ones as used
            });

            // Generate a secure token
            const rawToken = crypto.randomUUID();
            const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
            const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 minutes

            await prisma.passwordResetToken.create({
                data: { userId: user.id, tokenHash, expiresAt },
            });

            const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${rawToken}`;

            await resend.emails.send({
                from: "InterviewForge AI <noreply@interviewforge.ai>",
                to: email,
                subject: "Reset your InterviewForge AI password",
                html: `
          <div style="font-family: Inter, sans-serif; background: #0D0D0D; color: #F5F5F5; padding: 40px; max-width: 560px; margin: 0 auto; border-radius: 16px;">
            <h1 style="color: #FF5C00; font-size: 24px; margin-bottom: 8px;">Password Reset</h1>
            <p style="color: #A3A3A3; margin-bottom: 24px;">You requested a password reset for your InterviewForge AI account.</p>
            <a href="${resetUrl}" style="display: inline-block; background: #FF5C00; color: white; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-weight: 700; font-size: 16px;">
              Reset My Password →
            </a>
            <p style="color: #525252; font-size: 13px; margin-top: 24px;">This link expires in 30 minutes. If you didn't request this, ignore this email.</p>
            <p style="color: #525252; font-size: 12px; margin-top: 8px;">Or paste this URL: ${resetUrl}</p>
          </div>
        `,
            });
        }

        return NextResponse.json({
            message: "If that email is registered, you'll receive a reset link shortly.",
        });
    } catch (error) {
        console.error("Forgot password error:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
