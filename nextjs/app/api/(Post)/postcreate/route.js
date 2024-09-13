import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';

const prisma = new PrismaClient();
const dbNow = dayjs().add(9, 'hour').toDate();

export async function POST(req) {
  const { title, content, id, password } = await req.json();
  
  console.log("id:", id); // 세션의 ID가 제대로 전달되는지 확인
  console.log("password:", password); // 익명 사용자의 경우 비밀번호 확인

  if (id) {
    // 로그인된 사용자인 경우 (id가 존재하는 경우)
    console.log("성공: 로그인된 사용자");
    const response = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id } },
        createdAt: dbNow,
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
        createdAt: dbNow,
      },
    });
    return new Response(JSON.stringify({ message: '성공' }), { status: 201 });
  }
}