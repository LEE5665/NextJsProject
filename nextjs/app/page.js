import Link from 'next/link';
import styles from './Home.module.css'
import Auth from './component/navlogin.js'

export default function Home() {
  return (
    <div>
      <header>
        <h1>개발 게시판</h1>
      </header>
      <nav>
        <div className="nav-links">
          <Link href="/">홈</Link>
          <Link href="/posts">모든 글</Link>
          <a href="#">검색</a>
          <Link href="/post">게시글 작성</Link>
        </div>
        <Auth />
      </nav>
      <section>
        <h2>최근 글</h2>
        <div className="articles">
          <article>
            <div className="content">
              <h3>제목 1</h3>
              <p>내용의 요약 1...</p>
              <p className="author">  홍길동</p> {/* .author 클래스 적용 */}
            </div>
          </article>
          <article>
            {/* <div className="image" style={{ backgroundImage: 'url(/your-image-url.jpg)' }}></div> */}
            <div className="content">
              <h3>제목 2</h3>
              <p>내용의 요약 2...</p>
              <p className="author">  김영희</p> {/* .author 클래스 적용 */}
            </div>
          </article>
          {/* ... 다른 게시글도 동일하게 수정 */}
        </div>
      </section>
      <section>
        <h2>인기 글</h2>
        <div className="articles">
          <article>
            <div className="content">
              <h3>제목 5</h3>
              <p>내용의 요약 5...</p>
              <p className="author">  최민수</p> {/* .author 클래스 적용 */}
            </div>
          </article>
          <article>
            <div className="image" style={{ backgroundImage: 'url(/your-image-url.jpg)' }}></div>
            <div className="content">
              <h3>제목 6</h3>
              <p>내용의 요약 6...</p>
              <p className="author">  김하늘</p> {/* .author 클래스 적용 */}
            </div>
          </article>
          <article>
            <div className="image" style={{ backgroundImage: 'url(/your-image-url.jpg)' }}></div>
            <div className="content">
              <h3>제목 6</h3>
              <p>내용의 요약 6...</p>
              <p className="author">  김하늘</p> {/* .author 클래스 적용 */}
            </div>
          </article>
        </div>
      </section>
      <footer>
        {/* <p>&copy; 2024 개발 게시판</p> */}
      </footer>
    </div>
  );
}