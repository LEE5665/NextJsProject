import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();

export async function POST(req, { params }) {
  const { id } = params;
  const { password } = await req.json();

  // 게시물 찾기
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
  });

  if (!post) {
    return new Response(JSON.stringify({ message: '게시글을 찾을 수 없습니다.' }), { status: 404 });
  }

  // 비밀번호 검증 (익명 게시물의 경우)
  if (!post.authorId && post.password !== password) {
    return new Response(JSON.stringify({ success: false, message: '비밀번호가 일치하지 않습니다.' }), { status: 403 });
  }

  // 로그인된 사용자라면 패스워드 검증 없이 처리 가능
  if (post.authorId && post.password !== password) {
    return new Response(JSON.stringify({ success: false, message: '작성자만 수정할 수 있습니다.' }), { status: 403 });
  }

  // 비밀번호가 맞으면 JWT 토큰 생성
  const token = jwt.sign(
    { postId: post.id, userId: post.authorId || null },  // authorId가 없으면 null
    process.env.JWT_SECRET,  // 환경 변수에 저장된 JWT 비밀 키
    { expiresIn: '1h' }  // 토큰의 유효 기간 설정 (1시간)
  );

  return new Response(JSON.stringify({ success: true, token }), { status: 200 });
}