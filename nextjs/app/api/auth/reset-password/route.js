import { PrismaClient } from "@prisma/client";
import { createVerificationToken, sendVerificationEmail } from "../signup/email";

const prisma = new PrismaClient();

export async function POST(req){
    const { email } = await req.json();
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return new Response(JSON.stringify({ error: '존재하지 않는 이메일 입니다.' }), { status: 400 });
    }
    const token = createVerificationToken(user);
    await sendVerificationEmail(user.email, token, '테스트 웹 계정 찾기', '인증 URL : ', `${process.env.NEXTAUTH_URL}/passwordreset?token=`);
    return new Response(JSON.stringify(), { status: 200 });
}