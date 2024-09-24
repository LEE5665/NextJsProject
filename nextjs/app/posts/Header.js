'use client';

import Link from 'next/link';
import Auth from '../component/navlogin';
import { useTheme } from 'next-themes';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from "next/navigation";
import axios from 'axios';

export default function Header({ note }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');
  const [showNoteForm, setShowNoteForm] = useState(false);
  const noteButtonRef = useRef(null); // 버튼 위치 참조

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await axios.post("api/post/pm", {
        name: formData.get('receiver'),
        title: formData.get('title'),
        content: formData.get('content'),
      });
      console.log(response.status);
      if (response.status === 200) {
        alert("쪽지를 보냈습니다!");
      }
    } catch (error) {
      if (error.response.data.error) {
        alert(error.response.data.error);
      }
      console.log("실패");
    }
  };

  const toggleNoteForm = () => {
    setShowNoteForm(!showNoteForm);
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const toggleNavMenu = () => {
    setNavActive(!navActive);
  };

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      alert('검색어를 입력해주세요!');
      return;
    }
    router.push(`/posts?filter=${searchFilter}&search=${searchQuery}`);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <>
      <header>
        <div onClick={() => { router.push("/") }} className="logo hover:text-blue-500 cursor-pointer text-xl font-bold transition-colors duration-300">개발 게시판</div>
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
            {note === true && (
               <button
               onClick={toggleNoteForm}
               className="text-gray-800 dark:text-gray-200 hover:bg-transparent hover:text-blue-500 transition-colors duration-300 focus:outline-none inline-flex items-center"
               ref={noteButtonRef}
             >
               쪽지 작성
               <svg
                 className={`ml-2 w-4 h-4 transition-transform duration-300 ${showNoteForm ? 'rotate-180' : ''}`}
                 xmlns="http://www.w3.org/2000/svg"
                 fill="none"
                 viewBox="0 0 24 24"
                 stroke="currentColor"
               >
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
               </svg>
             </button>
            )}
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

      {showNoteForm && (
  <div
    className="absolute bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md w-full"
    style={{
      position: 'absolute',
      top: noteButtonRef.current?.getBoundingClientRect().bottom + window.scrollY + 'px',
      left: noteButtonRef.current?.getBoundingClientRect().left + 'px',
    }}
  >
    {/* 닫기 버튼 (X) */}
    <button
      onClick={toggleNoteForm}  // 폼 닫기
      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
    >
      ✕
    </button>

    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">쪽지 작성</h2>
    <form onSubmit={handleSubmit}>
      {/* 받는 사람 */}
      <div className="mb-4">
        <label htmlFor="receiver" className="block text-sm font-medium text-gray-700 dark:text-gray-300">받는 사람</label>
        <input
          type="text"
          id="receiver"
          name="receiver"
          placeholder="받는 사람 입력"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
        />
      </div>

      {/* 제목 */}
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">제목</label>
        <input
          type="text"
          id="title"
          name="title"
          placeholder="제목 입력"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
        />
      </div>

      {/* 내용 */}
      <div className="mb-4">
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">내용</label>
        <textarea
          id="content"
          name="content"
          placeholder="내용 입력"
          rows="4"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
        ></textarea>
      </div>

      {/* 전송 버튼 */}
      <div>
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
        >
          전송
        </button>
      </div>
    </form>
  </div>
)}
    </>
  );
}
