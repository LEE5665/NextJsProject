import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const prisma = new PrismaClient();
dayjs.extend(utc);
dayjs.extend(timezone);

const path = require("path");
const fs = require("fs").promises;
const { existsSync, mkdirSync } = require("fs");
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH || process.cwd(), "public/uploads");

if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true });
}

export async function POST(req) {
  const kstNow = dayjs().tz('Asia/Seoul').format();
  const { title, content, userId, password, tags, isPrivate, viewers } = await req.json();

  //const updatedContent = await handleImages(content);

  if (!tags || tags.length === 0){
    return new Response(JSON.stringify({ message: '태그를 추가해야합니다.' }), { status: 400 });
  }

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

  const tagData = await handleTags(tags);
  const viewerData = await handleViewers(viewers);

  if (userId) {
    // 로그인된 사용자인 경우 (id가 존재하는 경우)
    console.log("성공: 로그인된 사용자");
    const response = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: userId } },
        createdAt: kstNow,
        isPrivate,
        tags: {
          connectOrCreate: tagData,
        },
        viewers: {
          connect: viewerData,  // connect를 사용하여 기존 사용자 연결
        },
      }
    });
    return new Response(JSON.stringify({ message: '성공' }), { status: 201 });
  } else {
    // 익명 사용자인 경우 (id가 없고 password로 확인)
    if (!password) {
      // 익명 사용자인데 비밀번호가 없으면 오류 반환
      return new Response(JSON.stringify({ message: '실패: 비밀번호가 필요합니다.' }), { status: 400 });
    }
    
    console.log("성공: 익명 사용자");
    const post = await prisma.post.create({
      data: {
        title,
        content,
        password,
        tags: {
          connectOrCreate: tagData,
        },
        createdAt: kstNow,
      },
    });
    return new Response(JSON.stringify({ message: '성공' }), { status: 201 });
  }
}

// async function handleImages(content) {
//   console.log(content);
//   const imgRegex = /<img src="data:image\/[^;]+;base64,([^"]+)"/g;
//   let match;
//   let updatedContent = content;
//   const imagePromises = []; // 여러 이미지를 비동기로 처리하기 위한 배열

//   // Base64 이미지 추출 및 처리
//   while ((match = imgRegex.exec(content)) !== null) {
//     const base64Data = match[1]; // Base64 이미지 데이터 추출
//     const buffer = Buffer.from(base64Data, 'base64'); // Base64 데이터를 버퍼로 변환
//     const imgFileName = `img-${Date.now()}-${Math.random()}.png`; // 파일 이름에 랜덤 값 추가
//     const imgFilePath = path.join(UPLOAD_DIR, imgFileName); // 파일 저장 경로

//     // 이미지 저장 작업을 비동기 처리 배열에 추가
//     const saveImage = fs.writeFile(imgFilePath, buffer).then(() => {
//       // content의 Base64 데이터를 실제 이미지 파일 URL로 대체
//       updatedContent = updatedContent.replace(
//         `data:image/png;base64,${base64Data}`,
//         `/uploads/${imgFileName}`
//       );
//     });

//     imagePromises.push(saveImage); // 저장 작업을 Promise 배열에 추가
//   }

//   // 모든 이미지 저장 작업이 완료될 때까지 대기
//   await Promise.all(imagePromises);

//   return updatedContent; // 수정된 content 반환
// }
