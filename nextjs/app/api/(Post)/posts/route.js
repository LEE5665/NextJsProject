import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route.js';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const pageSize = parseInt(searchParams.get('pageSize')) || 15;

    const skip = (page - 1) * pageSize;
    const take = pageSize;

    try {
        // 모든 게시글을 가져오기
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id || null;
        const userNickname = session?.user?.nickname || null;

        const conditions = [
            { isPrivate: false } // 공개된 게시글
        ];

        // 세션이 있는 경우 추가적인 조건 추가
        if (session) {
            conditions.push({ authorId: userId }); // 내가 작성한 게시글
            conditions.push({ viewers: { some: { nickname: userNickname } } }); // 내가 볼 수 있는 비공개 게시글
        }

        const posts = await prisma.post.findMany({
            skip,
            take,
            where: {
                OR: conditions, // 조건 배열
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: true,
                tags: true,
                viewers: true, // viewer 정보도 포함
            },
        });
        const totalPosts = await prisma.post.count({
            where: {
                OR: conditions, // 조건 배열
            },
        });
        console.log("가져온 게시글 수:", posts.length);
        return new Response(JSON.stringify({ posts, totalPosts }), {
            status: 200,
        });
    } catch (error) {
        console.error("에러 발생:", error.message);
        console.error("에러 스택:", error.stack);
        return new Response(JSON.stringify({ error: '에러 발생', details: error.message }), { status: 500 });
    }
}