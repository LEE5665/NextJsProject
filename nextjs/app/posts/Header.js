import Link from 'next/link';
import Auth from '../component/navlogin';
import Button from './Button';

// 서버 컴포넌트로 네비게이션 바와 헤더 처리
export default function Header({headername}) {
  return (
    <>
      <header>
        <h1>{headername}</h1>
      </header>
      <nav>
        <Button/>
        <div className="nav-links">
          <Link href="/">홈</Link>
          <Link href="/posts">모든 글</Link>
          <a href="#">검색</a>
          <Link href="/post">게시글 작성</Link>
        </div>
        <Auth />
      </nav>
    </>
  );
}