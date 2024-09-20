import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
const prisma = new PrismaClient();
dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');

    if (!token) {
        return new Response("유효하지 않은 토큰입니다.", { status: 400 });
    }
    try {
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        console.log(email);
            // 사용자 찾기
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return new Response("사용자를 찾을 수 없습니다.", { status: 400 });
        }
        // 이미 인증된 사용자 처리
        if (user.isVerified) {
            return new Response("이미 인증된 사용자입니다.", { status: 400 });
        }
        const now = dayjs().tz('Asia/Seoul').format();
        if (now > user.verificationExpires) {
            console.log(user.isVerified);
            return new Response("인증 링크가 만료되었습니다.", { status: 400 });
        }
        await prisma.user.update({
        where: { email },
        data: { isVerified: true }, // 인증 완료 및 만료 시간 제거
        });
        console.log("hi");
        return new Response("이메일 인증에 성공했습니다.", { status: 200 });
    } catch(error){
        console.log(error);
        return new Response("유효하지 않은 토큰이거나, 인증에 실패하였습니다.", { status: 400 });
    }
}