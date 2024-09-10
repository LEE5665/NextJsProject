import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
    const { title, content, id } = await req.json();
    if (id) {
        const response = await prisma.post.create({
            data: {
                title,
                content,
                author: { connect: { id } }
            }
        });
        return new Response(JSON.stringify({ message: '성공' }), { status: 201 });
    } else {
        const post = await prisma.post.create({
            data: {
                title,
                content,
            },
        });
        return new Response(JSON.stringify({ message: '성공' }), { status: 201 });
    }
}