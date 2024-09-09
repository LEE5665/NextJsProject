import Link from 'next/link';
import styles from './Home.module.css'

export default function Home() {
  return (
      <div>
          {/* 헤더 */}
          <header className={styles.header}>
              <h1>JSP 게시판</h1>
              <p>JSP와 관련된 최신 게시글을 확인하세요</p>
          </header>

          {/* 네비게이션 메뉴 */}
          <nav className={styles.nav}>
              <Link href="/">홈</Link>
              <a href="#">모든 글</a>
              <a href="#">검색</a>
              <div className={styles.loginLogout}>
                  <Link href="/login">로그인</Link>
                  <Link href="/signup">회원가입</Link>
              </div>
          </nav>

          {/* 메인 화면 */}
          <main className={styles.main}>
              {/* 최근 올라온 게시물 */}
              <h2 className={styles.sectionTitle}>최근 게시물</h2>
              <div className={styles.recentPosts}>
                  {/* 첫 번째 게시물 */}
                  <div className={styles.post}>
                      <img src="https://via.placeholder.com/400x200" alt="게시물 1" />
                      <h3>JSP Basics</h3>
                      <p>이 게시물은 JSP에 관한 최신 정보를 담고 있습니다...</p>
                      <p><strong>작성자:</strong> 홍길동</p>
                  </div>

                  {/* 두 번째 게시물 */}
                  <div className={styles.post}>
                      <img src="https://via.placeholder.com/400x200" alt="게시물 2" />
                      <h3>Advanced JSP Techniques</h3>
                      <p>자바 최신 기술 트렌드와 관련된 내용을 확인해보세요...</p>
                      <p><strong>작성자:</strong> 이순신</p>
                  </div>

                  {/* 세 번째 게시물 */}
                  <div className={styles.post}>
                      <img src="https://via.placeholder.com/400x200" alt="게시물 3" />
                      <h3>JSP with Databases</h3>
                      <p>JSP와 데이터베이스를 연동하는 방법을 이해해보세요...</p>
                      <p><strong>작성자:</strong> 김유신</p>
                  </div>
              </div>

              {/* 인기 게시물 섹션 */}
              <h2 className={styles.sectionTitle}>인기 게시물</h2>
              <div className={styles.popularPosts}>
                  {/* 첫 번째 인기 게시물 */}
                  <div className={styles.post}>
                      <img src="https://via.placeholder.com/400x200" alt="인기 게시물 1" />
                      <h3>Understanding JSP Lifecycle</h3>
                      <p>JSP의 생명주기를 이해하고 활용하는 방법을 알아보세요...</p>
                      <p><strong>작성자:</strong> 박지성</p>
                  </div>

                  {/* 두 번째 인기 게시물 */}
                  <div className={styles.post}>
                      <img src="https://via.placeholder.com/400x200" alt="인기 게시물 2" />
                      <h3>JSP Error Handling</h3>
                      <p>JSP에서 오류를 처리하는 다양한 방법을 알아보세요...</p>
                      <p><strong>작성자:</strong> 김연아</p>
                  </div>

                  {/* 세 번째 인기 게시물 */}
                  <div className={styles.post}>
                      <img src="https://via.placeholder.com/400x200" alt="인기 게시물 3" />
                      <h3>Integrating JSP with Spring</h3>
                      <p>Spring과 JSP를 통합하는 방법에 대해 알아보세요...</p>
                      <p><strong>작성자:</strong> 이재명</p>
                  </div>
              </div>
          </main>

          {/* 게시글 작성 버튼을 오른쪽 아래에 고정 */}
          <a href="create-post.html" className={styles.createPostButton}>게시물 작성</a>
      </div>
  );
}