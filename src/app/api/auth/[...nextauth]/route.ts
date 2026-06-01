import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Auth: Missing credentials");
            throw new Error("Invalid credentials");
          }

          console.log(`Auth: Attempting login for ${credentials.email}`);
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          });

          if (!user) {
            console.warn(`Auth: No user found for ${credentials.email}`);
            throw new Error("No user found with this email");
          }

          if (!user.passwordHash) {
            console.warn(`Auth: User ${credentials.email} has no password hash (OAuth account?)`);
            throw new Error("No password hash found for this user");
          }

          const isValid = await bcrypt.compare(credentials.password, user.passwordHash);

          if (!isValid) {
            console.warn(`Auth: Incorrect password for ${credentials.email}`);
            throw new Error("Incorrect password");
          }

          console.log(`Auth: Login successful for ${credentials.email}`);
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            tier: user.tier,
            onboardingCompleted: user.onboardingCompleted,
          };
        } catch (error) {
          console.error("Auth Error:", error);
          throw error;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.tier = (user as any).tier;
        token.onboardingCompleted = (user as any).onboardingCompleted;
      }

      // Allow dynamic token updates when onboarding is completed
      if (trigger === "update" && session) {
        token.onboardingCompleted = session.onboardingCompleted;
        token.name = session.name || token.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id as string;
        (session.user as any).tier = token.tier as string;
        (session.user as any).onboardingCompleted = token.onboardingCompleted as boolean;
      }
      return session;
    }
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/",
  },
  secret: process.env.NEXTAUTH_SECRET || "interviewforge-secret-key-12345",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
