import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken'; // JWT 토큰을 사용하여 비밀번호 대체

const prisma = new PrismaClient();
const dbNow = dayjs().add(9, 'hour').toDate();

export async function PUT(req, { params }) {
  const { id } = params;
  const { title, content, token, userId } = await req.json(); // 로그인 사용자와 익명 사용자 구분

  try {
    let post;

    // 로그인된 사용자인 경우
    if (userId) {
      post = await prisma.post.findUnique({
        where: { id: Number(id) },
      });

      if (!post) {
        return new Response(JSON.stringify({ message: '게시글을 찾을 수 없습니다.' }), { status: 404 });
      }

      if (post.authorId !== userId) {
        return new Response(JSON.stringify({ message: '수정 권한이 없습니다.' }), { status: 403 });
      }

    } else if (token) {
      // 익명 사용자인 경우
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const postId = decoded.postId;

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
    return new Response(JSON.stringify({ message: '수정 중 오류가 발생했습니다.' }), { status: 500 });
  }
}
