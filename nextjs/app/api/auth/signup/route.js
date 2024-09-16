import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const prisma = new PrismaClient();
dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req) {
    const kstNow = dayjs().tz('Asia/Seoul').format();
    const { nickname, name, id, email, password, password2 } = await req.json();
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    const errors = {}

    // 유효성 검사

    if (koreanRegex.test(id)) errors.id = '아이디에 한글이 포함되어 있습니다.';
    if (koreanRegex.test(password)) errors.password = '비밀번호에 한글이 포함되어 있습니다.';

    if (!nickname) errors.nickname = '닉네임을 입력하세요.';
    if (!name) errors.name = '이름을 입력하세요.';
    if (!id) errors.id = '아이디를 입력하세요.';
    if (!email) errors.email = '이메일을 입력하세요.';
    if (password.length < 8) errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    if (password !== password2) errors.password2 = '비밀번호가 일치하지 않습니다.';
    const existingNickname = await prisma.user.findUnique({ where: { nickname } });
    if (existingNickname) {
        errors.nickname = '이미 사용 중인 닉네임입니다.';
    }
    const existingId = await prisma.user.findUnique({ where: { id } });
    if (existingId) {
        errors.id = '이미 사용 중인 아이디입니다.';
    }
    if (Object.keys(errors).length > 0) {
        return new Response(JSON.stringify({ error: '유효성 검사 실패', errors }), { status: 400 });
    }
    try {
        const hashpassword = await bcrypt.hash(password, 10);
        console.log(id);
        const user = await prisma.user.create({
            data: {
                nickname,
                name,
                id,
                email,
                password: hashpassword,
                createdAt: kstNow,
            }
        });
        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: '실패' }), { status: 400 });
    }
}