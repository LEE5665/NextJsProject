import Link from 'next/link';
import { Pagination } from './Pagination'; // 클라이언트 컴포넌트 불러오기
import axios from 'axios';
import { JSDOM } from 'jsdom'; // jsdom을 가져옵니다.
import Auth from '../component/navlogin';

export default async function AllPosts({ searchParams }) {
  const currentPage = parseInt(searchParams.page || '1');
  const pageSize = 12;
  const groupSize = 5;

  // 서버에서 데이터 요청
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
    params: {
      page: currentPage,
      pageSize: pageSize,
    },
  });
  const { posts, totalPosts } = response.data;

  const totalPages = Math.ceil(totalPosts / pageSize);

    // HTML에서 첫 번째 이미지를 추출하는 함수
    const getFirstImageFromContent = (content) => {
      const dom = new JSDOM(content);
      const img = dom.window.document.querySelector('img'); // 첫 번째 이미지 찾기
      return img ? img.src : null; // 이미지가 있으면 src 반환, 없으면 null 반환
    };
  
    // jsdom으로 HTML에서 텍스트만 추출하는 함수 (태그 제거)
    const getTextFromContent = (content) => {
      const dom = new JSDOM(content);
      return dom.window.document.body.textContent || ''; // HTML 태그 제거하고 텍스트만 반환
    };

  return (
    <div>
      <header>
        <h1>모든 게시글</h1>
      </header>
      <nav className="navbar">
        <div className="nav-links">
          <Link href="/">홈</Link>
          <Link href="/posts">모든 글</Link>
          <Link href="#">검색</Link>
          <Link href="/post">게시글 작성</Link>
        </div>
        <Auth/>
      </nav>
      <section>
        <h2>게시글 목록</h2>
        <div className="articles">
          {posts.map((post) => {
            const firstImage = getFirstImageFromContent(post.content);
            const postText = getTextFromContent(post.content); // HTML 태그 제거된 텍스트
            return (
              <article key={post.id} className={`article ${!firstImage ? 'no-image' : ''}`}>
                <Link href={`/post/${post.id}`} className="no-underline">
                  {firstImage ? (
                    <div
                      className="image"
                      style={{
                        backgroundImage: `url(${firstImage})`,
                      }}
                    ></div>
                  ) : null}
                  <div className="content">
                    <h3>{post.title}</h3>
                    <p>  {postText.length > 100 
                      ? `${postText.substring(0, 100)}...` 
                      : postText}</p> {/* 요약된 텍스트 */}
                    <div className="footer-info">
                      <span className="author">
                        {post.author?.nickname || '익명'}
                      </span>
                      <span className="view-count">
                        VIEW {post.views || 0}
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* 페이지네이션을 클라이언트 컴포넌트로 분리 */}
      <footer>
        <Pagination currentPage={currentPage} totalPages={totalPages} groupSize={groupSize} />
      </footer>
    </div>
  );
}