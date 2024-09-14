"use client"

import { useState, useEffect } from 'react'

export default function Home() {
  // 다크 모드 상태
  const [darkMode, setDarkMode] = useState(false)

  // 모바일 메뉴 상태
  const [menuActive, setMenuActive] = useState(false)

  // 검색 상태
  const [searchQuery, setSearchQuery] = useState('')
  const [searchFilter, setSearchFilter] = useState('title')

  // 사용자 시스템 선호도에 따른 초기 테마 설정
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true)
    }
  }, [])

  // 다크 모드 클래스 적용
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  // 다크 모드 토글 함수
  const handleThemeToggle = () => {
    setDarkMode(prevMode => !prevMode)
  }

  // 모바일 메뉴 토글 함수
  const handleMenuToggle = () => {
    setMenuActive(prevState => !prevState)
  }

  // 로그인 버튼 클릭 핸들러
  const handleLogin = () => {
    alert('로그인 버튼 클릭!')
    // 로그인 모달 또는 페이지로 이동
  }

  // 회원가입 버튼 클릭 핸들러
  const handleSignup = () => {
    alert('회원가입 버튼 클릭!')
    // 회원가입 모달 또는 페이지로 이동
  }

  // 검색 버튼 클릭 핸들러
  const handleSearch = () => {
    const query = searchQuery.trim()
    if (query === '') {
      alert('검색어를 입력해주세요!')
      return
    }
    alert(`"${searchFilter}" 기준으로 "${query}" 검색!`)
    // 실제 검색 로직 구현 (예: API 호출)
  }

  // 검색 입력창에서 Enter 키 누르면 검색 실행
  const handleSearchInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <div>
      {/* 헤더 */}
      <header>
        <div className="logo">개발 게시판</div>
        <div className="auth-buttons">
          <button id="loginButton" onClick={handleLogin}>로그인</button>
          <button id="signupButton" onClick={handleSignup}>회원가입</button>
        </div>
      </header>

      {/* 네비게이션 바 */}
      <nav>
        <button className="menu-toggle" id="menuToggle" onClick={handleMenuToggle}>☰</button>
        <div className={`nav-links ${menuActive ? 'active' : ''}`} id="navLinks">
          <a href="#">홈</a>
          <a href="#">모든 글</a>
          <a href="#">게시글 작성</a>
        </div>
        <div className="search-bar">
          <div className="search-options">
            <label>
              <input
                type="radio"
                name="search-filter"
                value="title"
                checked={searchFilter === 'title'}
                onChange={() => setSearchFilter('title')}
              />
              제목
            </label>
            <label>
              <input
                type="radio"
                name="search-filter"
                value="author"
                checked={searchFilter === 'author'}
                onChange={() => setSearchFilter('author')}
              />
              이름
            </label>
            <input
              type="text"
              placeholder="검색..."
              id="searchInput"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={handleSearchInputKeyPress}
            />
          </div>
          <button className="search-button" id="searchButton" onClick={handleSearch}>검색</button>
        </div>
        <button className="theme-toggle" id="themeToggle" onClick={handleThemeToggle}>
          {darkMode ? '라이트 모드' : '다크 모드'}
        </button>
      </nav>

      {/* 메인 콘텐츠 */}
      <main>
        {/* 히어로 섹션 */}
        <section>
          <h2>환영합니다!</h2>
          <p>최신 기술과 개발 트렌드를 공유하고 토론하세요. 여러분의 지식과 경험을 나누는 공간입니다.</p>
        </section>

        {/* 최근 글 섹션 */}
        <section>
          <h2>최근 글</h2>
          <div className="articles">
            <div className="article">
              <div className="image" style={{ backgroundImage: "url('https://via.placeholder.com/300x150')" }}></div>
              <div className="content">
                <h3>제목 1</h3>
                <p>여기는 게시글의 요약 내용이 들어갑니다. 사용자가 내용을 간략하게 파악할 수 있도록 도와줍니다.</p>
                <p className="author">홍길동</p>
              </div>
            </div>
            <div className="article">
              <div className="content">
                <h3>제목 2</h3>
                <p>여기는 게시글의 요약 내용이 들어갑니다. 이미지가 없는 게시글의 경우 배경색으로 구분됩니다.</p>
                <p className="author">김영희</p>
              </div>
            </div>
            <div className="article">
              <div className="image" style={{ backgroundImage: "url('https://via.placeholder.com/300x150')" }}></div>
              <div className="content">
                <h3>제목 3</h3>
                <p>여기는 게시글의 요약 내용이 들어갑니다. 다양한 주제의 글들이 모여 있습니다.</p>
                <p className="author">이준호</p>
              </div>
            </div>
          </div>
        </section>

        {/* 인기 글 섹션 */}
        <section>
          <h2>인기 글</h2>
          <div className="articles">
            <div className="article">
              <div className="image" style={{ backgroundImage: "url('https://via.placeholder.com/300x150')" }}></div>
              <div className="content">
                <h3>제목 4</h3>
                <p>여기는 인기 게시글의 요약 내용이 들어갑니다. 많은 사람들이 관심을 가지는 주제입니다.</p>
                <p className="author">최민수</p>
              </div>
            </div>
            <div className="article">
              <div className="content">
                <h3>제목 5</h3>
                <p>여기는 인기 게시글의 요약 내용이 들어갑니다. 사용자들 간의 활발한 토론이 이루어집니다.</p>
                <p className="author">김하늘</p>
              </div>
            </div>
            <div className="article">
              <div className="image" style={{ backgroundImage: "url('https://via.placeholder.com/300x150')" }}></div>
              <div className="content">
                <h3>제목 6</h3>
                <p>여기는 인기 게시글의 요약 내용이 들어갑니다. 다양한 의견과 정보를 공유합니다.</p>
                <p className="author">박지성</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 푸터 */}
      <footer>
        <p>&copy; 2024 개발 게시판. All rights reserved.</p>
      </footer>
    </div>
  )
}
