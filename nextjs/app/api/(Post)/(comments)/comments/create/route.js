import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';

const prisma = new PrismaClient();

export async function POST(req) {
  const dbNow = dayjs().add(9, 'hour').toDate();
  const { content, authorId, postId, parentId, password, nickname } = await req.json();

  if(!authorId){
    if(!password){
        return new Response(JSON.stringify({ error: '비밀번호를 입력해주세요.' }), { status: 500 });
    }
  }

  try {
    console.log (content, authorId, postId, parentId, password);
    const newComment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: Number(postId) } },
        author: authorId ? { connect: { id: authorId } } : undefined,
        parent: parentId ? { connect: { id: parentId } } : undefined,
        password: password,
        createdAt: dbNow,
      },
      include: {
        author: true,
      },
    });
    console.log('생성된 댓글:', newComment);
    return new Response(JSON.stringify({ newComment }), { status: 201 });
  } catch (error) {
    console.log('Prisma error:', error);
    return new Response(JSON.stringify({ error: '에러 발생' }), { status: 500 });
  }
}