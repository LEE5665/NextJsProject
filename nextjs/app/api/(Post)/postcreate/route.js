import { PrismaClient } from "@prisma/client";
import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";

const prisma = new PrismaClient();
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? process.cwd(), "public/uploads");

if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const POST = async (req) => {
    try {
        const formData = await req.formData();
        const title = formData.get('title');
        const content = formData.get('content');
        const userId = formData.get('userId');
        const password = formData.get('password');

        let authorId = null;
        if (userId) {
            // `userId`가 실제로 존재하는지 확인
            const user = await prisma.user.findUnique({
                where: { id: userId }
            });

            if (user) {
                // 유효한 `userId`가 있는 경우 `authorId`로 설정
                authorId = userId;
            }
        }

        // 비밀번호가 없는 경우 익명 사용자는 게시글을 작성할 수 없음
        if (!authorId && !password) {
            return new Response(JSON.stringify({ message: "Password is required for anonymous users" }), {
                status: 400,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        // 이미지 데이터를 처리 (formData에서 이미지 추출 후 처리)
        const updatedContent = await handleImages(content, formData);

        // 게시글 생성
        const newPost = await prisma.post.create({
            data: {
                title,
                content: updatedContent,
                authorId, // 익명 사용자의 경우 `authorId`는 null로 저장
                password: authorId ? null : password, // 익명 사용자의 경우 비밀번호 저장
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return new Response(JSON.stringify({ message: "Post created successfully", post: newPost }), {
            status: 201,
            headers: {
                "Content-Type": "application/json",
            },
        });
    } catch (error) {
        console.error("Failed to create post:", error);
        return new Response(JSON.stringify({ message: "Failed to create post" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
};

// 이미지 핸들링 함수
async function handleImages(content, formData) {
    let updatedContent = content;

    // formData에서 이미지 파일 추출 및 처리
    for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
            const arrayBuffer = await value.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
            const imgFileName = `img-${Date.now()}-${value.name}`;
            const imgFilePath = path.join(UPLOAD_DIR, imgFileName);

            await fs.writeFile(imgFilePath, buffer); // 이미지 파일 저장

            // content 내의 이미지 경로를 저장된 경로로 업데이트
            const imageUrl = `/uploads/${imgFileName}`;
            updatedContent = updatedContent.replace(`data:image/png;base64,${key}`, imageUrl);
        }
    }

    return updatedContent;
}
