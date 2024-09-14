import Header from './Header.js';  // 서버 컴포넌트
import AllPosts from './AllPosts.js';  // 클라이언트 컴포넌트

export default function Page({ searchParams }) {

  return (
    <div>
      <Header headername="모든 게시글" /> {/* 서버 컴포넌트로 네비게이션과 헤더 처리 */}
      <AllPosts searchParams={searchParams} /> {/* 클라이언트 컴포넌트로 게시글 목록 처리 */}
    </div>
  );
}
