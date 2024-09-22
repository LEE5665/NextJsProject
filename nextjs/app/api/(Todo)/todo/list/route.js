import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const dynamic = "force-dynamic";

export async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response("세션 없음", { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page')) || 1;  // 페이지 번호 (기본값 1)
    const limit = parseInt(searchParams.get('limit')) || 2;  // 페이지 당 항목 수 (기본값 5)
    const skip = (page - 1) * limit;

    const todayStart = new Date();
    todayStart.setUTCHours(todayStart.getUTCHours() + 9);
    console.log(todayStart);
    todayStart.setUTCHours(0, 0, 0, 0);

    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setUTCHours(tomorrowStart.getUTCHours() + 9); //9시간 더하기


    const todayEnd = new Date(tomorrowStart);
    todayEnd.setUTCHours(tomorrowStart.getUTCHours() + 23); // 오늘의 마지막 시간 설정

    try {
        console.log(skip,limit);
        const todos = await prisma.toDo.findMany({
            where: {
                userId: session.user.id,
                OR: [
                    {
                        date: {
                            lt: tomorrowStart,  // 오늘 시작 시간보다 이전 (즉, 오늘 이전의 항목)
                        }
                    },
                    {
                        date: {
                            gt: todayEnd,  // 오늘 끝 시간보다 이후 (즉, 오늘 이후의 항목)
                        }
                    }
                ]
            },
            orderBy: { date: 'desc' },
            skip,  // 몇 개를 건너뛸지
            take: limit,  // 몇 개를 가져올지
        });

        const todayTodos = await prisma.toDo.findMany({
            where: {
                userId: session.user.id,
                date: {
                    gte: tomorrowStart,  // 오늘의 시작 시간 이상
                    lte: todayEnd,    // 오늘의 끝 시간 이하
                },
            },
            orderBy: { date: 'desc' },
        });

        const totalTodos = await prisma.toDo.count({
            where: {
                userId: session.user.id,
                OR: [
                    {
                        date: {
                            lt: tomorrowStart,  // 오늘 시작 시간보다 이전 (즉, 오늘 이전의 항목)
                        }
                    },
                    {
                        date: {
                            gt: todayEnd,  // 오늘 끝 시간보다 이후 (즉, 오늘 이후의 항목)
                        }
                    }
                ]
            },
        });

        const latestTask = await prisma.toDo.findFirst({
            where: { userId: session.user.id },
            orderBy: { id: 'desc' }, // 최근에 생성된 항목을 기준으로 정렬
          });


        return new Response(JSON.stringify({ todos, todayTodos, totalTodos, latestTask }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("세션 없음", { status: 500 });
    }
}

export async function PUT(req) {
    const { id, description } = await req.json();
    try {
        const updatedTask = await prisma.toDo.update({
            where: { id },
            data: { description: JSON.stringify(description) },
        });
        return new Response(JSON.stringify(updatedTask), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("세션 없음", { status: 500 });
    }
}

export async function DELETE(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response("세션 없음", { status: 401 });
    }

    try {
        const { id } = await req.json(); // 삭제할 할 일의 ID를 받아옴
        console.log(id);
        const deletedTask = await prisma.toDo.delete({
            where: { id }, // ID로 할 일 삭제
        });
        return new Response(JSON.stringify({ message: "삭제 성공", deletedTask }), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response("삭제 실패", { status: 500 });
    }
}