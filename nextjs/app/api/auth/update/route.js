import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";
import bcrypt from "bcryptjs"
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

const prisma = new PrismaClient();
dayjs.extend(utc);
dayjs.extend(timezone);

export async function POST(req) {
    const kstNow = dayjs().tz('Asia/Seoul').toDate();
    const dbkstNow = dayjs().tz('Asia/Seoul').format();
    const session = await getServerSession(authOptions);
    const { nickname, email, password, password2 } = await req.json();
    //const oneWeekInMs = 7 * 24 * 60 * 60 * 1000;
    //const threeDayInMs = 3 * 24 * 60 * 60 * 1000;

    const oneWeekInMs = 60 * 1000;
    const threeDayInMs = 60 * 1000;
    const errors = {}

    const koreanRegex = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/;
    if (koreanRegex.test(password)) errors.password = '비밀번호에 한글이 포함되어 있습니다.';
    if (!nickname) errors.nickname = '닉네임을 입력하세요.';
    if (nickname.length > 10) errors.nickname = '닉네임은 최대 10자까지 가능합니다.';
    if (!email) errors.email = '이메일을 입력하세요.';
    if (password.length < 8) errors.password = '비밀번호는 최소 8자 이상이어야 합니다.';
    if (password !== password2) errors.password2 = '비밀번호가 일치하지 않습니다.';
    const existingNickname = await prisma.user.findUnique({ where: { nickname } });
    if (existingNickname) {
        errors.nickname = '이미 사용 중인 닉네임입니다.';
    }
    const existingemail = await prisma.user.findUnique({ where: { email }, select:  {id: true}});
    if (existingemail && (existingemail.id !== session.user.id) ) {
        console.log(existingemail.id)
        console.log(session.user.id)
        errors.email = '이미 사용 중인 이메일입니다.'
    }
    
    const user = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { createdAt: true, updatedAt: true },
    });
    const createdAtTime = new Date(user.createdAt).getTime();
    let timeDiff = kstNow.getTime() - createdAtTime;

    // updatedAt이 없을 때 가입 후 3일 제한 검사
    if (!user.updatedAt && timeDiff < threeDayInMs) {
        errors.update = '가입 후 3일 이내에는 업데이트가 불가능합니다.';
    }

    // updatedAt이 있을 경우, 일주일 제한 검사
    if (user.updatedAt) {
        const updatedAtTime = new Date(user.updatedAt).getTime();
        timeDiff = kstNow.getTime() - updatedAtTime;
        console.log(timeDiff);
        if (timeDiff < oneWeekInMs) {
            errors.update = '최근 수정 후 일주일 이내에는 다시 업데이트할 수 없습니다.';
        }
    }


    if (Object.keys(errors).length > 0) {
        return new Response(JSON.stringify({ error: '유효성 검사 실패', errors }), { status: 400 });
    }


    try {
        const hashpassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.update({
            where: { nickname: session.user.nickname },
            data: {
                nickname,
                email,
                password: hashpassword,
                updatedAt: dbkstNow,
            }
        })
        return new Response(JSON.stringify(), { status: 200 });
    } catch(error) {
        console.log(error);
        return new Response(JSon.stringify({ error: "실패"}), {status: 500});
    }
}