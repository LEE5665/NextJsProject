import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req, { params }) {
    const {id} = params;
    try {
      const view = await prisma.post.update({
        where: { id: parseInt(id) },
        data: {
          views: {
            increment: 1,
          },
        },
      });
      
        const post = await prisma.post.findUnique({
          where: { id: parseInt(id) },
          include: { author: true, tags: true, viewers: true },
        });
    
        if (post) {
          return new Response(JSON.stringify(post), { status: 200 });
        } else {
          return new Response(JSON.stringify({ error: '게시글을 찾을 수 없습니다.' }), { status: 404 });
        }
      } catch (error) {
        return new Response(JSON.stringify({ error: '게시글을 불러오는 데 실패했습니다.' }), { status: 500 });
      }
    }