import { PrismaClient } from '@prisma/client';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const prisma = new PrismaClient();
dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req) {
  const kstNow = dayjs().tz('Asia/Seoul').format();
  
  const { content, authorId, postId, parentId, password } = await req.json();

  if(!authorId){
    if(!password){
        return new Response(JSON.stringify({ error: '비밀번호를 입력해주세요.' }), { status: 500 });
    }
  }

  try {
    const newComment = await prisma.comment.create({
      data: {
        content,
        post: { connect: { id: Number(postId) } },
        author: authorId ? { connect: { id: authorId } } : undefined,
        parent: parentId ? { connect: { id: parentId } } : undefined,
        password: password,
        createdAt: kstNow,
      },
      include: {
        author: true,
      },
    });
    return new Response(JSON.stringify({ newComment }), { status: 201 });
  } catch (error) {
    console.log('Prisma error:', error);
    return new Response(JSON.stringify({ error: '에러 발생' }), { status: 500 });
  }
}