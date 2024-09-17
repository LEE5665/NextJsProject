import fs from 'fs/promises'; // fs를 프로미스 방식으로 사용

export async function GET(req, { params }) {
  const { slug } = params;

  if (slug && slug.length) {
    // 파일 경로 설정
    const publicDir = __dirname.split(".next")[0] + "public/";
    const fileUrl = slug.join('/');
    const filePath = publicDir + fileUrl;

    try {
      // 비동기로 파일 읽기
      const data = await fs.readFile(filePath);
      // 파일을 성공적으로 읽었으면 반환
      return new Response(data, {
        status: 200,
        headers: { 'Content-Type': 'application/octet-stream' }, // 기본 MIME 타입
      });
    } catch (error) {
      // 파일을 찾지 못하면 404 응답 반환
      return new Response("no", { status: 404 });
    }
  } else {
    // slug가 없는 경우 404 반환
    return new Response("no image", { status: 404 });
  }
}