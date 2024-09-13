const { PrismaClient } = require("@prisma/client");
const path = require("path");
const fs = require("fs").promises;
const { existsSync, mkdirSync } = require("fs");

const prisma = new PrismaClient();
const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH || process.cwd(), "public/uploads");

if (!existsSync(UPLOAD_DIR)) {
    mkdirSync(UPLOAD_DIR, { recursive: true });
}

export const POST = async (req, res) => {

    try {
        const { title, content, id, password } = req.body;

        // Extract images from content and replace with server paths
        const updatedContent = await handleImages(content);

        const newPost = await prisma.post.create({
            data: {
                title,
                content: updatedContent,
                authorId: id,
                password,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });

        res.status(201).json({ message: "Post created successfully", post: newPost });
    } catch (error) {
        console.error("Failed to create post:", error);
        res.status(500).json({ message: "Failed to create post" });
    }
}

async function handleImages(content) {
    const imgRegex = /<img src="data:image\/[^;]+;base64,([^"]+)"/g;
    let match;
    let updatedContent = content;

    while ((match = imgRegex.exec(content)) !== null) {
        const base64Data = match[1];
        const buffer = Buffer.from(base64Data, 'base64');
        const imgFileName = `img-${Date.now()}.png`;
        const imgFilePath = path.join(UPLOAD_DIR, imgFileName);

        await fs.writeFile(imgFilePath, buffer);

        updatedContent = updatedContent.replace(`data:image/png;base64,${base64Data}`, `/uploads/${imgFileName}`);
    }

    return updatedContent;
}
