import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    const { email } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        return new Response({ error: "사용자를 찾을 수 없습니다." }, { status: 400 });
    }
    return new Response(JSON.stringify(user.id), { status: 200 });
}

export async function POST(req) {
    try {
        const { token, password, password2 } = await req.json();
        let error;
        if (password !== password2) error = '비밀번호가 일치하지 않습니다.';
        if (password.length < 8) error = '비밀번호는 최소 8자 이상이어야 합니다.';
        if(error){
            console.log("에러발생");
            return new Response(JSON.stringify({ error }), { status: 400 });
        }
        const { email } = jwt.verify(token, process.env.JWT_SECRET);
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return new Response(JSON.stringify({ error }), { status: 400 });
        }
        const hashpassword = await bcrypt.hash(password, 10);
        const updateuser = await prisma.user.update({
            where: { email },
            data: {
                password: hashpassword,
            }
        })
        return new Response(JSON.stringify(), { status: 200 });
    } catch (error) {
        console.log(error);
        return new Response(JSON.stringify({ error: '서버 오류가 발생했습니다.' }), { status: 500 });
    }
}