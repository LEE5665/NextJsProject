import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';
import jwt from 'jsonwebtoken'; // JWT 토큰을 사용하여 비밀번호 대체
import path from 'path';
import fs from 'fs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const prisma = new PrismaClient();
dayjs.extend(utc);
dayjs.extend(timezone);

export async function PUT(req, { params }) {
  const { id } = params;
  const { title, content, token, userId, tags, isPrivate, viewers } = await req.json(); // 로그인 사용자와 익명 사용자 구분

  const kstNow = dayjs().tz('Asia/Seoul').format();

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

  const handleViewers = async (viewers) => {
    const viewerConnect = await Promise.all(viewers.map(async (viewerNickname) => {
      const user = await prisma.user.findUnique({
        where: { nickname: viewerNickname }
      });

      if (!user) {
        throw new Error(`사용자를 찾을 수 없습니다: ${viewerNickname}`);
      }

      return { id: user.id };  // User ID를 사용하여 연결
    }));

    return viewerConnect;
  };

    // 이미지 URL 추출 함수
    const extractImageUrls = (content) => {
      const regex = /<img src="(.*?)"/g;
      let match;
      const urls = [];
  
      while ((match = regex.exec(content)) !== null) {
        urls.push(match[1]); // 이미지 경로 추출
      }
  
      return urls;
    };
  
    // 로컬 이미지 삭제 함수
    const removeUnusedLocalImages = (unusedImages) => {
      unusedImages.forEach((imagePath) => {
        const localPath = path.join(process.cwd(), 'public', 'uploads', path.basename(imagePath)); // 로컬 경로 설정
        if (fs.existsSync(localPath)) {
          fs.unlinkSync(localPath); // 로컬 파일 삭제
          console.log(`로컬 이미지 삭제됨: ${localPath}`);
        }
      });
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
        where: { id: Number(id) },
      });

      if (!post) {
        return new Response(JSON.stringify({ message: '게시글을 찾을 수 없습니다.' }), { status: 404 });
      }
    } else {
      return new Response(JSON.stringify({ message: '인증 정보가 없습니다.' }), { status: 403 });
    }

    const originalImageUrls = extractImageUrls(post.content); // 원본 게시글에서 이미지 URL 추출
    const updatedImageUrls = extractImageUrls(content); // 업데이트된 게시글에서 이미지 URL 추출

        // 삭제할 이미지 URL 목록 (업데이트된 content에서 사라진 이미지)
        const unusedImageUrls = originalImageUrls.filter((url) => !updatedImageUrls.includes(url));

        // 로컬 파일 시스템에서 사라진 이미지 삭제
        removeUnusedLocalImages(unusedImageUrls);

    let viewerData = [];
    if (isPrivate && viewers && viewers.length > 0) {
      viewerData = await handleViewers(viewers);
    }

    // 게시글 수정
    const updatedPost = await prisma.post.update({
      where: { id: Number(id) },
      data: {
        title,
        content,
        updatedAt: kstNow,
        isPrivate, // 비공개 여부 업데이트
        tags: {
          set: [],
          connectOrCreate: tagData,  // 태그 데이터 연결 또는 생성
        },
        viewers: isPrivate ? {
          set: viewerData  // 기존 viewers를 대체
        } : {
          disconnect: post.viewers ? post.viewers.map(viewer => ({ id: viewer.id })) : []  // 비공개 해제 시 기존 viewers 제거
        }
      },
    });

    return new Response(JSON.stringify({ message: '게시글이 성공적으로 수정되었습니다.' }), { status: 200 });
  } catch (error) {
    console.error("수정 중 오류 발생:", error);  // 오류 출력
    return new Response(JSON.stringify({ message: '수정 중 오류가 발생했습니다.' }), { status: 500 });
  }
}
