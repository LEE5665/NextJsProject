import { PrismaClient } from '@prisma/client';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function POST(req) {
    const session = await getServerSession(authOptions);
    const { password, authorId, commentId } = await req.json();
    if(session && authorId){
      if(authorId != session.user.id){
        return new Response(JSON.stringify({ error: '작성한 본인이 아닙니다!' }), { status: 500 });
      }
    }

    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
      select: { password: true }
  });
  if (!comment) {
    return new Response(JSON.stringify({ error: '댓글을 찾을 수 없습니다.' }), { status: 404 });
}
if (password && comment.password !== password) {
  return new Response(JSON.stringify({ error: '비밀번호가 일치하지 않습니다.' }), { status: 403 });
}

  try {
    const replies = await prisma.comment.findMany({
      where: { parentId: commentId },
    });
    
    if (replies.length > 0) {
      await prisma.comment.deleteMany({
        where: { parentId: commentId },
      });
    }

    await prisma.comment.delete({
      where: { id: commentId },
    });
    return new Response(JSON.stringify({ message: 'Comment deleted successfully' }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ message: 'Failed to delete comment' }), { status: 500 });
  }
}