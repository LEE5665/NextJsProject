import formidable from 'formidable';
import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), 'public/uploads');

// Request handler for POST requests
export const POST = async (req) => {
  try {
    return new Promise((resolve, reject) => {
      // formidable 폼 파서 설정
      const form = new formidable.Formidable({ uploadDir, keepExtensions: true });
      
      form.parse(req, async (err, fields, files) => {
        if (err) {
          // 폼 파싱 오류 발생 시
          return resolve(new Response(JSON.stringify({ error: 'Form parsing error' }), { status: 500 }));
        }

        try {
          // 업로드된 파일 처리
          const uploadedFiles = Array.isArray(files.images) ? files.images : [files.images];

          // 데이터베이스에 게시글 생성
          const post = await prisma.post.create({
            data: {
              title: fields.title,
              content: fields.content,
            },
          });

          // 이미지 메타데이터 데이터베이스에 저장
          for (const file of uploadedFiles) {
            await prisma.image.create({
              data: {
                filename: file.originalFilename,
                filepath: file.filepath,
                mimetype: file.mimetype,
                postId: post.id,
              },
            });
          }

          // 성공 응답
          return resolve(new Response(JSON.stringify({ message: 'Post created successfully' }), { status: 200 }));
        } catch (dbError) {
          // 데이터베이스 오류 발생 시
          console.error('Database error:', dbError);
          return resolve(new Response(JSON.stringify({ error: 'Database error' }), { status: 500 }));
        }
      });
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(JSON.stringify({ error: 'Unexpected error' }), { status: 500 });
  }
};