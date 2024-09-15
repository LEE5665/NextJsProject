'use client'

import Link from 'next/link';
import Auth from '../component/navlogin';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useEffect } from 'react';
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();

  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');

  useEffect(() => 
    setMounted(true)
  , []);

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
      router.push(`/posts?filter=${searchFilter}&search=${searchQuery}`);
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
                    value="tag"
                    checked={searchFilter === 'tag'}
                    onChange={(e) => setSearchFilter(e.target.value)}
                  />
                  태그
                </label>
              </div>
              <input
                type="text"
                placeholder="검색..."
                id="searchInput"
                aria-label="검색어 입력"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                key="key"
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
      </>
    );
}