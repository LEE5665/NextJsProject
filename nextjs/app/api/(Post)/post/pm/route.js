import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/route.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const prisma = new PrismaClient();
dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req) {
    const kstNow = dayjs().tz('Asia/Seoul').format();
    const session = getServerSession(authOptions);
    const { name, title, content, id } = await req.json();
    try {
        const pm = await prisma.pm.create({
            data: {
                name,
                title,
                content,
                createdAt: kstNow,
                user: {
                    connect: id,  // connect를 사용하여 기존 사용자 연결
                  },
            }
        })
        return new Response(JSON.stringify(), ({ status: 200 }));
    } catch (error) {
    return new Response(JSON.stringify({ error: 에러 }), ({ status: 400 }));
}
}