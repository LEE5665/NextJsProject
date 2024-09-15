'use client'
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Nav from './component/navlogin.js'

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');

  // When mounted on client, now we can show the UI
  useEffect(() => setMounted(true), []);

  // Handle theme change
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // Handle mobile menu toggle
  const toggleNavMenu = () => {
    setNavActive(!navActive);
  };

  // Handle search
  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      alert('검색어를 입력해주세요!');
      return;
    }
    alert(`"${searchFilter}" 기준으로 "${searchQuery}" 검색!`);
    // Implement actual search logic here, e.g., navigate or API call
  };

  // Handle Enter key for search
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <header>
        <div className="logo">개발 게시판</div>
        {/* <div className="auth-buttons">
        <Link href="/"><button>
            로그인
          </button></Link>
          <Link href="/"><button>
            회원가입
          </button></Link>
        </div> */}
        <Nav/>
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
          {mounted && (
            <button className="theme-toggle" id="themeToggle" onClick={toggleTheme}>
              {theme === 'dark' ? '라이트 모드' : '다크 모드'}
            </button>
          )}
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section>
          <h2>환영합니다!</h2>
          <p>
            최신 기술과 개발 트렌드를 공유하고 토론하세요. 여러분의 지식과 경험을 나누는 공간입니다.
          </p>
        </section>

        {/* Recent Posts Section */}
        <section>
          <h2>최근 글</h2>
          <div className="articles">
            {/* Post with Image */}
            <div className="article">
              <div
                className="image"
                style={{ backgroundImage: "url('https://via.placeholder.com/600x300')" }}
              ></div>
              <div className="content">
                <h3>제목 1</h3>
                <p className="meta">
                  <span className="author">홍길동</span>
                  <span className="views">조회수: 123</span>
                </p>
                <p className="preview">
                  여기는 게시글의 요약 내용이 들어갑니다. 사용자가 내용을 간략하게 파악할 수 있도록 도와줍니다.
                  추가적인 정보가 포함될 수 있습니다.
                </p>
                <div className="tags">
                  <span className="tag javascript">JavaScript</span>
                  <span className="tag webdev">웹개발</span>
                  <span className="tag frontend">프론트엔드</span>
                </div>
              </div>
            </div>
            {/* Post without Image */}
            <div className="article">
              <div className="content">
                <h3>제목 2</h3>
                <p className="meta">
                  <span className="author">김영희</span>
                  <span className="views">조회수: 98</span>
                </p>
                <p className="preview">
                  여기는 게시글의 요약 내용이 들어갑니다. 이미지가 없는 게시글의 경우 배경색으로 구분됩니다.
                </p>
                <div className="tags">
                  <span className="tag python">Python</span>
                  <span className="tag backend">백엔드</span>
                </div>
              </div>
            </div>
            {/* Another Post with Image */}
            <div className="article">
              <div
                className="image"
                style={{ backgroundImage: "url('https://via.placeholder.com/600x300')" }}
              ></div>
              <div className="content">
                <h3>제목 3</h3>
                <p className="meta">
                  <span className="author">이준호</span>
                  <span className="views">조회수: 205</span>
                </p>
                <p className="preview">
                  여기는 게시글의 요약 내용이 들어갑니다. 다양한 주제의 글들이 모여 있습니다. 추가적인 설명이
                  포함될 수 있습니다.
                </p>
                <div className="tags">
                  <span className="tag react">React</span>
                  <span className="tag frontend">프론트엔드</span>
                  <span className="tag uiux">UI/UX</span>
                  <span className="tag design">디자인</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Posts Section */}
        <section>
          <h2>인기 글</h2>
          <div className="articles">
            {/* Popular Post with Image */}
            <div className="article">
              <div
                className="image"
                style={{ backgroundImage: "url('https://via.placeholder.com/600x300')" }}
              ></div>
              <div className="content">
                <h3>제목 4</h3>
                <p className="meta">
                  <span className="author">최민수</span>
                  <span className="views">조회수: 512</span>
                </p>
                <p className="preview">
                  여기는 인기 게시글의 요약 내용이 들어갑니다. 많은 사람들이 관심을 가지는 주제입니다.
                </p>
                <div className="tags">
                  <span className="tag database">데이터베이스</span>
                  <span className="tag sql">SQL</span>
                  <span className="tag backend">백엔드</span>
                  <span className="tag server">서버</span>
                  <span className="tag optimization">최적화</span>
                </div>
              </div>
            </div>
            {/* Popular Post without Image */}
            <div className="article">
              <div className="content">
                <h3>제목 5</h3>
                <p className="meta">
                  <span className="author">김하늘</span>
                  <span className="views">조회수: 342</span>
                </p>
                <p className="preview">
                  여기는 인기 게시글의 요약 내용이 들어갑니다. 사용자들 간의 활발한 토론이 이루어집니다.
                </p>
                <div className="tags">
                  <span className="tag nodejs">Node.js</span>
                  <span className="tag server">서버</span>
                  <span className="tag api">API</span>
                </div>
              </div>
            </div>
            {/* Another Popular Post with Image */}
            <div className="article">
              <div
                className="image"
                style={{ backgroundImage: "url('https://via.placeholder.com/600x300')" }}
              ></div>
              <div className="content">
                <h3>제목 6</h3>
                <p className="meta">
                  <span className="author">박지성</span>
                  <span className="views">조회수: 275</span>
                </p>
                <p className="preview">여기는 인기 게시글의 요약 내용이 들어갑니다.</p>
                <div className="tags">
                  <span className="tag css">CSS</span>
                  <span className="tag design">디자인</span>
                  <span className="tag frontend">프론트엔드</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer>
        <p>&copy; 2024 개발 게시판. All rights reserved.</p>
      </footer>
    </>
  );
}
