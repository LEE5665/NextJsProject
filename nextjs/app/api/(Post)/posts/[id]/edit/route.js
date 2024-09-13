import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken'; // JWT 토큰을 사용하여 비밀번호 대체

const prisma = new PrismaClient();
const dbNow = dayjs().add(9, 'hour').toDate();

export async function PUT(req, { params }) {
  const { id } = params;
  const { title, content, token, userId } = await req.json(); // userId를 추가로 받음

  try {
    let post;

    // 1. 로그인한 사용자인 경우, token이 없고 userId가 있을 때
    if (userId) {
      // 게시글을 userId와 postId를 기준으로 조회
      post = await prisma.post.findUnique({
        where: { id: Number(id) },
      });

      if (!post) {
        return new Response(JSON.stringify({ message: '게시글을 찾을 수 없습니다.' }), { status: 404 });
      }

      // 작성자가 동일한지 확인
      if (post.authorId !== userId) {
        return new Response(JSON.stringify({ message: '수정 권한이 없습니다.' }), { status: 403 });
      }

    } else if (token) {
      // 2. 익명 사용자인 경우, 토큰 검증
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const postId = decoded.postId;

      // 게시글 조회
      post = await prisma.post.findUnique({
        where: { id: Number(postId) },
      });

      if (!post) {
        return new Response(JSON.stringify({ message: '게시글을 찾을 수 없습니다.' }), { status: 404 });
      }
    } else {
      return new Response(JSON.stringify({ message: '인증 정보가 없습니다.' }), { status: 403 });
    }

    // 게시글 수정
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        updatedAt: dbNow,
      },
    });

    return new Response(JSON.stringify({ message: '게시글이 성공적으로 수정되었습니다.' }), { status: 200 });
  } catch (error) {
    console.error('에러 발생:', error);
    return new Response(JSON.stringify({ message: '수정 중 오류가 발생했습니다.' }), { status: 500 });
  }
}