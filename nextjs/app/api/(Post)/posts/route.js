import { PrismaClient } from '@prisma/client';

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
        const posts = await prisma.post.findMany({
            skip,
            take,
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                author: true,
                tags: true,
            },
        });
        const totalPosts = await prisma.post.count();
        console.log("가져옴");
        return new Response(JSON.stringify({ posts, totalPosts }), {
            status: 200,
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: '에러' }), { status: 500 });
    }
}