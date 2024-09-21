import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PUT(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response("세션 없음", { status: 401 });
    }

    try {
        const { id, title, description, date } = await req.json(); // 수정할 데이터
        const updatedTask = await prisma.toDo.update({
            where: { id },
            data: {
                title,
                description: JSON.stringify(description), // JSON으로 다시 저장
                date: new Date(date), // 날짜 업데이트
            },
        });
        return new Response(JSON.stringify(updatedTask), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("수정 실패", { status: 500 });
    }
}