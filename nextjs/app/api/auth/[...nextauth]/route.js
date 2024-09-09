import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

const authOptions = {
    providers: [
        CredentialsProvider({
        name: "Credentials",
        credentials: {
          id: { label: "id", type: "text" },
          password: { label: "password", type: "password" }
        },
        async authorize(credentials) {
          const user = await prisma.user.findUnique({
            where: { id: credentials.id }
          });
  
          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return { id: user.id };
          }
          return null;
        }
      })
    ],
    session: {
      strategy: "jwt",
    },
    pages: {
      signIn: '/login',
    },
    callbacks: {
      async jwt({ token, user }) {
        console.log("jwt!!");
        if (user) {
          token.id = user.id;
        }
        return token;
      },
      // 세션 콜백에서 session.user.id에 토큰에서 가져온 id 추가
      async session({ session, token }) {
        session.user.id = token.id;
        return session;
      }
    }
  };

export const POST = NextAuth(authOptions);
export const GET = NextAuth(authOptions);