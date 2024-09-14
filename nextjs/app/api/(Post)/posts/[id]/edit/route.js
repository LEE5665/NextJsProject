import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken'; // JWT 토큰을 사용하여 비밀번호 대체

const prisma = new PrismaClient();
const dbNow = dayjs().add(9, 'hour').toDate();

export async function PUT(req, { params }) {
  const { id } = params;
  const { title, content, token, userId, tags } = await req.json(); // 로그인 사용자와 익명 사용자 구분

  if (!tags || tags.length === 0) {
    return new Response(JSON.stringify({ message: '태그를 추가해야합니다.' }), { status: 400 });
  }

  // 태그 처리 함수
  const handleTags = async (tags) => {
    const tagConnectOrCreate = tags.map(tag => ({
      where: { name: tag },
      create: { name: tag },
    }));
    return tagConnectOrCreate;
  };

  try {
    const tagData = await handleTags(tags);
    console.log("tagData:", tagData);  // 태그 데이터가 올바르게 생성되었는지 로그 출력

    let post;

    // 로그인된 사용자인 경우
    if (userId) {
      post = await prisma.post.findUnique({
        where: { id: Number(id) },
      });

      if (!post) {
        return new Response(JSON.stringify({ message: '게시글을 찾을 수 없습니다.' }), { status: 404 });
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
        tags: {
          connectOrCreate: tagData,  // 태그 데이터 연결 또는 생성
        },
      },
    });

    return new Response(JSON.stringify({ message: '게시글이 성공적으로 수정되었습니다.' }), { status: 200 });
  } catch (error) {
    console.error("수정 중 오류 발생:", error);  // 오류 출력
    return new Response(JSON.stringify({ message: '수정 중 오류가 발생했습니다.' }), { status: 500 });
  }
}
