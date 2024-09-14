import { NextRequest, NextResponse } from "next/server";
import path from "path";
import fs from "fs/promises";
import { existsSync, mkdirSync } from "fs";
import { v4 as uuidv4 } from 'uuid';

const UPLOAD_DIR = path.resolve(process.env.ROOT_PATH ?? process.cwd(), "public/uploads");

export const POST = async (req) => {
  try {
    const formData = await req.formData(); // formData 추출
    const file = formData.get("file"); // 'file' 필드에서 파일 추출

    if (!file) {
      return NextResponse.json({ success: false, message: "파일이 없습니다." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer()); // 파일 데이터를 배열 버퍼로 변환

    // 업로드 디렉토리가 없으면 생성
    if (!existsSync(UPLOAD_DIR)) {
      mkdirSync(UPLOAD_DIR, { recursive: true });
    }

    // 고유한 파일 이름을 생성하여 저장
    const fileName = `${uuidv4()}-${file.name}`;
    const filePath = path.join(UPLOAD_DIR, fileName);

    // 파일 저장
    await fs.writeFile(filePath, buffer);

    // 파일 업로드 성공 시 반환할 응답
    return NextResponse.json({
      success: true,
      name: fileName,
      url: `/uploads/${fileName}`, // 업로드된 파일 URL
    });
  } catch (error) {
    console.error("파일 업로드 중 오류 발생:", error);
    return NextResponse.json({ success: false, message: "파일 업로드 실패" }, { status: 500 });
  }
};
