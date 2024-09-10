import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
    try {
        // 모든 게시글을 가져오기
        const posts = await prisma.post.findMany({
            include: {
                author: true, // 작성자 정보 포함
            },
        });
        return new Response(JSON.stringify(posts), { status: 200 });
    } catch (error) {
        return new Response(JSON.stringify({ error: '에러' }), { status: 500 });
    }
}