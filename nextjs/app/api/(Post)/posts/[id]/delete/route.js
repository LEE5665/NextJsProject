import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';

const prisma = new PrismaClient();

export async function POST(req, { params }) {
    const { id } = params;
    const { password } = await req.json();
  
    // 세션 가져오기
    const session = await getServerSession();
  
    // 게시글 찾기
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
  
    if (!post) {
      return new Response(JSON.stringify({ success: false, error: '게시글을 찾을 수 없습니다.' }), {
        status: 404,
      });
    }
  
    // 로그인된 사용자인 경우 처리
    if (!password) {
      if (!session || session.user.id !== post.authorId) {
        return new Response(JSON.stringify({ success: false, error: '작성자가 아닙니다.' }), {
          status: 403,
        });
      }
    } else {
      // 익명 사용자인 경우 비밀번호 검증
      if (post.password !== password) {
        console.log(password);
        console.log(post.password);
        return new Response(JSON.stringify({ success: false, error: '비밀번호가 틀렸습니다.' }), {
          status: 401,
        });
      }
    }
  
    // 게시글 삭제
    await prisma.post.delete({ where: { id: parseInt(id) } });
    return new Response(JSON.stringify({ success: true, error: '게시글이 삭제되었습니다.' }), {
      status: 200,
    });
  }