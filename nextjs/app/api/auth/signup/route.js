import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt"

const prisma = new PrismaClient();

export async function POST(req) {
    const { nickname, name, id, email, password } = await req.json();

    try {
        const hashpassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                nickname,
                name,
                id,
                email,
                password: hashpassword,
            }
        });
        return new Response(JSON.stringify(user), { status: 201 });
    } catch (error) {
        return new Response(JSON.stringify({ error: '실패' }), { status: 400 });
    }
}