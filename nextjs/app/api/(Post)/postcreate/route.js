import { PrismaClient } from "@prisma/client";
import dayjs from 'dayjs';

const prisma = new PrismaClient();
const dbNow = dayjs().add(9, 'hour').toDate();

export async function POST(req) {
    console.log("Current Time in KST:", dbNow);
    const now = Date();
    const { title, content, id, password } = await req.json();
    if (id) {
        const response = await prisma.post.create({
            data: {
                title,
                content,
                author: { connect: { id } },
                createdAt: dbNow,
            }
        });
        return new Response(JSON.stringify({ message: '성공' }), { status: 201 });
    } else {
        if(!password){
            return new Response(JSON.stringify({ message: '실패' }), { status: 400 });
        }
        const post = await prisma.post.create({
            data: {
                title,
                content,
                password,
                createdAt: dbNow,
            },
        });
        return new Response(JSON.stringify({ message: '성공' }), { status: 201 });
    }
}