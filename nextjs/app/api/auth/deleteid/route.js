import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs"
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route";

const prisma = new PrismaClient();

//비밀번호 체크
export async function POST(req) {
    const { password } = await req.json();
    const session = await getServerSession(authOptions);

    if (session) {
        try {
            const user = await prisma.user.findUnique({
                where: { id: (await session).user.id }
            });

            if (user && await bcrypt.compare(password, user.password)) {
                return new Response(JSON.stringify(), { status: 200 });
            } else {
                return new Response(JSON.stringify({ error: '비밀번호가 틀렸습니다.' }), { status: 400 });
            }

        } catch (error) {
            console.log(error);
            return new Response(JSON.stringify(), { status: 404 });
        }
    }
    return new Response(JSON.stringify(), { status: 500 });
}

export async function DELETE(req) {
    const session = await getServerSession(authOptions);
    if (session) {
        try {
            await prisma.user.delete({
                where: { id: session.user.id },
            });
            await prisma.comment.deleteMany({
                where: { authorId: session.user.id },
            });
            return new Response(JSON.stringify(), { status: 200 });
        } catch (error) {
            return new Response(JSON.stringify(), { status: 400 });
        }
    }
    return new Response(JSON.stringify(), { status: 404 });
}