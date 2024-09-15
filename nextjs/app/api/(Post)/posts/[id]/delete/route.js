import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../auth/[...nextauth]/route.js'
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export async function POST(req, { params }) {
    const { id } = params;
    const { password } = await req.json();
  
    // 세션 가져오기
    const session = await getServerSession(authOptions);
  
    // 게시글 찾기
    const post = await prisma.post.findUnique({ where: { id: parseInt(id) } });
  
    if (!post) {
      return new Response(JSON.stringify({ success: false, error: '게시글을 찾을 수 없습니다.' }), {
        status: 404,
      });
    }
  
    // 로그인된 사용자인 경우 처리
    if (!password) {
      console.log(session);
      if (!session || session.user.id !== post.authorId) {
        return new Response(JSON.stringify({ success: false, error: '작성자가 아닙니다.' }), {
          status: 403,
        });
      }
    } else {
      // 익명 사용자인 경우 비밀번호 검증
      if (post.password !== password) {
        return new Response(JSON.stringify({ success: false, error: '비밀번호가 틀렸습니다.' }), {
          status: 401,
        });
      }
    }
  
    // 게시글 삭제
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
    const originalImageUrls = extractImageUrls(post.content)
    removeUnusedLocalImages(originalImageUrls);


    await prisma.post.delete({ where: { id: parseInt(id) } });
    return new Response(JSON.stringify({ success: true, error: '게시글이 삭제되었습니다.' }), {
      status: 200,
    });
  }