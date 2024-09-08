import Link from 'next/link';
import styles from './Home.module.css'

export default function Home() {
  return (
    <div>
      <header className={styles.header}>
        <h1>Java 개발 사이트</h1>
        <p>JSP와 자바 관련 최신 게시글을 확인하세요</p>
      </header>

      {/* 게시판 선택 메뉴 */}
      <nav className={styles.nav}>
        <Link href="/">홈</Link>
        <Link href="/jsp-board">JSP 게시판</Link>
        <Link href="/java-board">Java 게시판</Link>
        <Link href="/post">게시물 작성</Link>
        <Link href="/contact">문의하기</Link>
      </nav>

      {/* 메인 화면 */}
      <main className={styles.main}>
        {/* 게시판 선택 */}
        <div className={styles.boardSelection}>
          <h2>게시판 선택</h2>
          <Link href="/jsp-board">JSP 게시판</Link>
          <Link href="/java-board">Java 게시판</Link>
        </div>

        {/* 최근 올라온 게시물 */}
        <div className={styles.recentPosts}>
          {/* 첫 번째 게시물 */}
          <div className={styles.post}>
            <img src="https://via.placeholder.com/400x200" alt="게시물 1" />
            <h3>최근 게시물 1</h3>
            <p>이 게시물은 JSP에 관한 최신 정보를 담고 있습니다...</p>
            <p><strong>작성자:</strong> 홍길동</p>
          </div>

          {/* 두 번째 게시물 */}
          <div className={styles.post}>
            <img src="https://via.placeholder.com/400x200" alt="게시물 2" />
            <h3>최근 게시물 2</h3>
            <p>자바 최신 기술 트렌드와 관련된 내용을 확인해보세요...</p>
            <p><strong>작성자:</strong> 이순신</p>
          </div>
        </div>
      </main>
    </div>
  );
}