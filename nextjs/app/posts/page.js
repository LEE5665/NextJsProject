"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Auth from '../component/navlogin.js'
import { useRouter } from 'next/navigation'
import axios from 'axios';

export default function AllPosts() {
  const router = useRouter();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const pageSize = 12;
  const groupSize = 5;

  const totalPages = Math.ceil(totalPosts / pageSize);
  const totalPageGroups = Math.ceil(totalPages / groupSize);

  const currentPageGroup = Math.ceil(currentPage / groupSize);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts', {
          params: {
            page: currentPage,
            pageSize: pageSize
          }
        });
        const data = response.data
        setPosts(data.posts);
        setTotalPosts(data.totalPosts)
      } catch (error) {
        console.error('게시글을 가져오는 데 실패했습니다.', error);
      }
    };
    fetchPosts();
  }, [currentPage]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    router.push(`/posts/?page=${newPage}`);
  }

  const handlePreviousGroup = () => {
    if (currentPageGroup > 1) {
      const newPage = (currentPageGroup - 1) * groupSize;
      handlePageChange(newPage);
    }
  };

  const handleNextGroup = () => {
    if (currentPageGroup < totalPageGroups) {
      const newPage = currentPageGroup * groupSize + 1;
      handlePageChange(newPage);
    }
  };

  const getPageNumbersForCurrentGroup = () => {
    const start = (currentPageGroup - 1) * groupSize + 1;
    const end = Math.min(currentPageGroup * groupSize, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };


  return (
    <div>
      <header>
        <h1>모든 게시글</h1>
      </header>
      <nav>
        <div className="nav-links">
          <Link href="/">홈</Link>
          <Link href="/posts" onClick={() => { handlePageChange(1) }}>모든 글</Link>
          <a href="#">검색</a>
          <Link href="/post">게시글 작성</Link>
        </div>
        <Auth />
      </nav>
      <section>
        <h2>게시글 목록</h2>
        <div className="articles">
          {posts.map((post) => (
            <article key={post.id}>
              <Link href={`/post/${post.id}`} className="no-underline">
                <div className="content">
                  <h3>{post.title}</h3>
                  <p>{post.content.substring(0, 100)}...</p>
                  <p className="author">작성자: {post.author?.nickname || '익명'}</p>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>
      <footer>
        <div className="pagination">
          <button
            onClick={handlePreviousGroup}
            disabled={currentPageGroup === 1}
          >
            이전
          </button>
          {getPageNumbersForCurrentGroup().map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              disabled={page === currentPage}
            >
              {page}
            </button>
          ))}
          <button
            onClick={handleNextGroup}
            disabled={currentPageGroup === totalPageGroups}
          >
            다음
          </button>
        </div>
      </footer>
    </div>
  );
}