import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route.js';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(req) {
    try {
        let conditions = { isPrivate: false };
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || null;
        const userNickname = session?.user?.nickname || null;

        if (session) {
            conditions = {
                OR: [
                    { authorId: userId }, // 내가 작성한 게시글
                    { viewers: { some: { nickname: userNickname } } } // 내가 볼 수 있는 비공개 게시글
                ]
            };
        }

        // 최신글 3개 가져오기
        const recentPosts = await prisma.post.findMany({
            take: 3, // 3개만 가져오기
            where: conditions,
            orderBy: {
                createdAt: 'desc', // 최신 순 정렬
            },
            include: {
                author: true,
                tags: true,
            },
        });

        // 조회수가 가장 높은 인기글 3개 가져오기
        const popularPosts = await prisma.post.findMany({
            take: 3, // 3개만 가져오기
            where: conditions,
            orderBy: {
                views: 'desc', // 조회수 순 정렬
            },
            include: {
                author: true,
                tags: true,
            },
        });

        return new Response(
            JSON.stringify({ recentPosts, popularPosts }), 
            { status: 200 }
        );
    } catch (error) {
        console.error("에러 발생:", error.message);
        return new Response(JSON.stringify({ error: '에러 발생', details: error.message }), { status: 500 });
    }
}
