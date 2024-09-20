import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

export const authOptions = {
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
          if (!user || !user.isVerified) {
            return null
          }
          if (user && await bcrypt.compare(credentials.password, user.password)) {
            return { nickname: user.nickname, id: user.id };
          }
          return null
        }
      })
    ],
    session: {
      strategy: "jwt",
      maxAge: 24 * 60 * 60,
      updateAge: 24 * 60 * 60
    },
    pages: {
      signIn: '/login',
    },
    callbacks: {
      async session({ session, token }) {
        // session.user.id에 토큰의 id를 추가
        session.user.id = token.id;
        session.user.nickname = token.nickname;
        return session;
      },
      async jwt({ token, user, session, trigger }) {
        // 처음 로그인 시 JWT에 user id를 저장
        if (user) {
          token.id = user.id;
          token.nickname = user.nickname;
        }
        if (trigger === 'update' && session) {
          token.nickname = session.nickname;
          return token;
        }

        return token;
      }
      // 세션 콜백에서 session.user.id에 토큰에서 가져온 id 추가
    }
  };

export const POST = NextAuth(authOptions);
export const GET = NextAuth(authOptions);