import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { createVerificationToken, sendVerificationEmail } from './email'

const prisma = new PrismaClient();
dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req) {
    const kstNow = dayjs().tz('Asia/Seoul').format();
    const kstNowhour = dayjs().tz('Asia/Seoul').add(1, 'hour').format();
    const { nickname, name, id, email, password, password2 } = await req.json();
    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    const emailDomainRegex = /@(gmail\.com|naver\.com)$/;
    const errors = {}

    // 유효성 검사

    if (koreanRegex.test(id)) errors.id = '아이디에 한글이 포함되어 있습니다.';
    if (koreanRegex.test(password)) errors.password = '비밀번호에 한글이 포함되어 있습니다.';

    if (!nickname) errors.nickname = '닉네임을 입력하세요.';
    if (nickname.length > 10) errors.nickname = '닉네임은 최대 10자까지 가능합니다.';
    if (!name) errors.name = '이름을 입력하세요.';
    if (!id) errors.id = '아이디를 입력하세요.';
    if (!email) errors.email = '이메일을 입력하세요.';
    if (!emailDomainRegex.test(email)) {
        errors.email = '이메일은 gmail.com 또는 naver.com으로 끝나야 합니다.';
    }
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
    const existingemail = await prisma.user.findUnique({ where: { email } });
    if (existingemail) {
        errors.email = '이미 사용 중인 이메일입니다.'
        const now = dayjs().tz('Asia/Seoul').format();
        // 만약 인증 기간이 지났다면 사용자를 삭제하고 다시 만들 수 있도록 처리
        if (now > existingemail.verificationExpires) {
            await prisma.user.delete({ where: { email } }); // 사용자 삭제
            console.log("만료된 사용자 삭제");
        } else {
            // 사용자가 만료되지 않았으면 오류 반환
            errors.email = '이메일 인증 중 입니다.';
        }
    }
    if (Object.keys(errors).length > 0) {
        return new Response(JSON.stringify({ error: '유효성 검사 실패', errors }), { status: 400 });
    }


    try {
        const verificationExpires = kstNowhour;
        const hashpassword = await bcrypt.hash(password, 10);
        console.log(id);
        const user = await prisma.user.create({
            data: {
                nickname,
                name,
                id,
                email,
                password: hashpassword,
                isVerified: false,
                createdAt: kstNow,
                verificationExpires
            }
        });
        const token = createVerificationToken(user);
        await sendVerificationEmail(user.email, token, '테스트 웹 이메일 인증', '인증 URL : ', `${process.env.NEXTAUTH_URL}/api/auth/verify-email?token=`);

        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: '실패' }), { status: 400 });
    }
}