import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response("세션 없음", { status: 401 });
  }
  const newTask = await req.json();
  const date = new Date(newTask.date);
  date.setUTCHours(date.getUTCHours() + 9);
  try {
    const Task = await prisma.toDo.findFirst({
      where: {
        userId: session.user.id,
        date,
      },
    });
    if(Task){
      return new Response(JSON.stringify({error: "해당 날짜에 이미 할 일이 있습니다."}), { status: 400 });
    }
    const todo = await prisma.toDo.create({
      data: {
        title: newTask.name,
        description: JSON.stringify(newTask.description),
        date,
        user: { connect: { id: session.user.id } }, // 로그인한 사용자와 연결
      },
    });
    return new Response("성공", { status: 200 });
  } catch (error) {
    console.log(error);
    return new Response("에러", { status: 500 });
  }
}