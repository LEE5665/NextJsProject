// pages/posts/AllPosts.js
'use client'; // 클라이언트 컴포넌트 선언

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Head from 'next/head';
import { useTheme } from 'next-themes';

export default function AllPosts({ searchParams }) {
  const [posts, setPosts] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams?.page || '1');
  const pageSize = 12;
  const groupSize = 5;

  const { theme, setTheme } = useTheme(); // next-themes 사용
  const [navActive, setNavActive] = useState(false);
  const router = useRouter();

  // 테마 초기 설정
  useEffect(() => {
    // next-themes가 이미 테마를 설정하므로 추가 설정 불필요
  }, []);

  // 테마 토글 함수
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // 게시글 데이터 패칭
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`, {
          params: {
            page: currentPage,
            pageSize: pageSize,
          },
        });
        setPosts(response.data.posts);
        setTotalPages(Math.ceil(response.data.totalPosts / pageSize));
      } catch (error) {
        console.error('게시글 가져오기 오류:', error);
      }
    };

    fetchData();
  }, [currentPage]);

  // 모바일 네비게이션 토글
  const toggleNavMenu = () => {
    setNavActive(!navActive);
  };

  // 검색 관련 상태 관리
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      alert('검색어를 입력해주세요!');
      return;
    }
    alert(`"${searchFilter}" 기준으로 "${searchQuery}" 검색!`);
    // 실제 검색 로직 구현 필요
    // 예: router.push(`/search?filter=${searchFilter}&query=${searchQuery}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 로그인 및 회원가입 핸들러 (예시)
  const handleLogin = () => {
    alert('로그인 버튼 클릭!');
    // 실제 로그인 로직 구현 필요
  };

  const handleSignup = () => {
    alert('회원가입 버튼 클릭!');
    // 실제 회원가입 로직 구현 필요
  };

  // 페이징 핸들러
  const handlePageChange = (newPage) => {
    router.push(`/posts/?page=${newPage}`);
  };

  const handlePreviousGroup = () => {
    if (currentPage > groupSize) {
      const newPage = (Math.ceil(currentPage / groupSize) - 1) * groupSize;
      handlePageChange(newPage);
    }
  };

  const handleNextGroup = () => {
    if (currentPage < totalPages) {
      const newPage = Math.min(Math.ceil(currentPage / groupSize) * groupSize + 1, totalPages);
      handlePageChange(newPage);
    }
  };

  const getPageNumbersForCurrentGroup = () => {
    const currentPageGroup = Math.ceil(currentPage / groupSize);
    const start = (currentPageGroup - 1) * groupSize + 1;
    const end = Math.min(currentPageGroup * groupSize, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  // 게시글 내용에서 이미지와 텍스트 추출 함수
  const getFirstImageFromContent = (content) => {
    if (typeof window === 'undefined') return null;
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const img = doc.querySelector('img');
    return img ? img.src : null;
  };

  const getTextFromContent = (content) => {
    if (typeof window === 'undefined') return '';
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    return doc.body.textContent || '';
  };

  // 인증 버튼 컴포넌트 (실제 구현 필요)
  const Auth = () => (
    <div className="auth-buttons">
      <button onClick={handleLogin} id="loginButton">
        로그인
      </button>
      <button onClick={handleSignup} id="signupButton">
        회원가입
      </button>
    </div>
  );

  // 헤더 및 네비게이션 컴포넌트
  const Header = () => (
    <>
      <header>
        <div className="logo">개발 게시판</div>
        <Auth />
      </header>

      <nav>
        <button
          className="menu-toggle"
          id="menuToggle"
          aria-label={navActive ? '메뉴 닫기' : '메뉴 열기'}
          onClick={toggleNavMenu}
        >
          ☰
        </button>
        <div className={`nav-menu ${navActive ? 'active' : ''}`} id="navMenu">
          <div className="nav-links">
            <Link href="/">홈</Link>
            <Link href="/posts">모든 글</Link>
            <Link href="/post">게시글 작성</Link>
          </div>
          <div className="search-bar">
            <div className="search-options">
              <label>
                <input
                  type="radio"
                  name="search-filter"
                  value="title"
                  checked={searchFilter === 'title'}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
                제목
              </label>
              <label>
                <input
                  type="radio"
                  name="search-filter"
                  value="author"
                  checked={searchFilter === 'author'}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
                이름
              </label>
            </div>
            <input
              type="text"
              placeholder="검색..."
              id="searchInput"
              aria-label="검색어 입력"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <button
              className="search-button"
              id="searchButton"
              aria-label="검색"
              onClick={handleSearch}
            >
              검색
            </button>
          </div>
          <button className="theme-toggle" id="themeToggle" onClick={toggleTheme} suppressHydrationWarning>
            {theme === 'dark' ? '라이트 모드' : '다크 모드'}
          </button>
        </div>
      </nav>
    </>
  );

  // 게시글이 로드되지 않았을 때 로딩 상태 표시
  if (!posts)
    return (
      <div>
        <Header />
        <main>
          <section>
            <h2>게시글 목록</h2>
            <div className="articles">
              {Array.from({ length: pageSize }).map((_, index) => (
                <article key={index} className="article no-image">
                  <div className="content">
                    <h3>...</h3>
                    <p>...</p>
                    <div className="footer-info">
                      <span className="author">익명</span>
                      <span className="view-count">VIEW 0</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </main>
        <footer>
          <div className="pagination">
            <button onClick={() => {}} disabled>
              이전
            </button>
            {Array.from({ length: groupSize }).map((_, index) => (
              <button key={index} disabled>
                {index + 1}
              </button>
            ))}
            <button onClick={() => {}} disabled>
              다음
            </button>
          </div>
          <p>&copy; 2024 개발 게시판. All rights reserved.</p>
        </footer>
      </div>
    );

  return (
    <div>
      {/* 헤더 및 네비게이션 */}
      <Header />

      {/* 메인 콘텐츠 */}
      <main>
        {/* 게시글 목록 섹션 */}
        <section>
          <h2>게시글 목록</h2>
          <div className="articles">
            {posts.map((post) => {
              const firstImage = getFirstImageFromContent(post.content);
              const postText = getTextFromContent(post.content);
              return (
                <Link href={`/post/${post.id}`} className="no-underline">
                <article key={post.id} className="article">
                    {firstImage && (
                      <div
                        className="image"
                        style={{
                          backgroundImage: `url(${firstImage})`,
                        }}
                      ></div>
                    )}
                    <div className="content">
                      <h3>{post.title}</h3>
                      <p className="meta">
                        <span className="author">{post.isPrivate && '[Private] '}{post.author?.nickname || '익명'}</span>
                          <span className="views">VIEW {post.views || 0}</span>
                      </p>
                    <p className="preview">{postText.length > 100 ? `${postText.substring(0, 100)}...` : postText}</p>
                    {post.tags && post.tags.length > 0 && (
                        <div className="tags">
                          {post.tags.map((tag) => (
                            <span key={tag.id} className="tag javascript">
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                </article>
                </Link>
              );
            })}
          </div>
        </section>
                  {/* 페이징 처리 */}
                  <section className="pagination-container">
            <div className="pagination">
              <button onClick={handlePreviousGroup} disabled={currentPage <= groupSize}>
                이전
              </button>
              {getPageNumbersForCurrentGroup().map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={page === currentPage}
                  className={page === currentPage ? 'active' : ''}
                >
                  {page}
                </button>
              ))}
              <button onClick={handleNextGroup} disabled={currentPage >= totalPages}>
                다음
              </button>
            </div>
          </section>
      </main>
      <footer>
        <p>&copy; 2024 개발 게시판. All rights reserved.</p>
      </footer>
    </div>
  );
}
