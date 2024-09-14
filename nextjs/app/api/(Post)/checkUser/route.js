import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const nickname = searchParams.get('nickname');

  if (!nickname) {
    return new Response(JSON.stringify({ message: '닉네임을 입력하세요.' }), { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { nickname },
  });

  if (!user) {
    return new Response(JSON.stringify({ message: '사용자를 찾을 수 없습니다.' }), { status: 404 });
  }

  return new Response(JSON.stringify({ message: '사용자를 찾았습니다.', user }), { status: 200 });
}