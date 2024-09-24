import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const prisma = new PrismaClient();
export const dynamic = "force-dynamic";
dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req) {
    const kstNow = dayjs().tz('Asia/Seoul').format();
    const session = await getServerSession(authOptions);
    const { name, title, content } = await req.json();
    try {
        const receiver = await prisma.user.findUnique({
            where: { nickname: name },  // 입력된 닉네임에 해당하는 수신자 검색
        });
        if (!receiver) {
            return new Response(JSON.stringify({ error: "해당 닉네임의 사용자가 존재하지 않습니다." }), { status: 400 });
        }
        const pm = await prisma.pm.create({
            data: {
                title,
                content,
                createdAt: kstNow,
                sender: {
                    connect: { id: session.user.id },
                },
                receiver: {
                    connect: { id: receiver.id },
                },
            },
        });
        return new Response(JSON.stringify(), ({ status: 200 }));
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: '에러' }), ({ status: 400 }));
    }
}

export async function GET(req) {
    const session = await getServerSession(authOptions);
  const receivedPms = await prisma.pm.findMany({
    where: { receiverId: session.user.id, isDeletedByReceiver: false },
    orderBy: { createdAt: 'desc' },
    include: {
      sender: {
        select: {
          nickname: true,
        },
      },
    },
  });
  const sentPms = await prisma.pm.findMany({
    where: { senderId: session.user.id, isDeletedBySender: false },
    orderBy: { createdAt: 'desc' },
    include: {
      receiver: {
        select: {
          nickname: true,
        },
      },
    },
  });
  const result = {
    receivedPms,
    sentPms,
  };
  return new Response(JSON.stringify(result), { status: 200 });
}

export async function PUT(req) {
    const session = await getServerSession(authOptions);
    const { id, role } = await req.json();
    
    try {
      const pm = await prisma.pm.findUnique({
        where: { id: id },
      });
  
      if (!pm) {
        return new Response(JSON.stringify({ error: "해당 쪽지가 존재하지 않습니다." }), { status: 404 });
      }
      if (role === 'sender' && pm.senderId === session.user.id) {
        await prisma.pm.update({
          where: { id: id },
          data: { isDeletedBySender: true },
        });
      } else if (role === 'receiver' && pm.receiverId === session.user.id) {
        await prisma.pm.update({
          where: { id: id },
          data: { isDeletedByReceiver: true },
        });
      } else {
        return new Response(JSON.stringify({ error: "권한이 없습니다." }), { status: 403 });
      }
  
      return new Response(JSON.stringify({ message: "쪽지 내역이 삭제되었습니다." }), { status: 200 });
    } catch (error) {
      console.log(error);
      return new Response(JSON.stringify({ error: '삭제 처리 중 에러 발생' }), { status: 400 });
    }
  }