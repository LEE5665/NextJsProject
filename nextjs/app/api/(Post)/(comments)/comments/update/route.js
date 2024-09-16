import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export async function POST(req) {
    const dbNow = dayjs().add(9, 'hour').toDate();
    const { commentId, content, password } = await req.json();

    const comment = await prisma.comment.findUnique({
        where: { id: Number(commentId) },
        select: { password: true }
    });
    if (!comment) {
      return new Response(JSON.stringify({ error: '댓글을 찾을 수 없습니다.' }), { status: 404 });
  }
  if (password && comment.password !== password) {
    return new Response(JSON.stringify({ error: '비밀번호가 일치하지 않습니다.' }), { status: 403 });
  }

  try {
    const updatedComment = await prisma.comment.update({
      where: { id: Number(commentId) },
      data: {
        content,
        updatedAt: dbNow,
      },
    });
    return new Response(JSON.stringify({ message: "성공" }), { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response(JSON.stringify({ error: '에러 발생' }), { status: 500 });
  }
}