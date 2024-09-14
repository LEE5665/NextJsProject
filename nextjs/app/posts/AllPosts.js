'use client'; // 클라이언트 컴포넌트 선언

import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Pagination from './Pagination.js';

// 클라이언트 컴포넌트로 게시글과 페이지네이션 처리
export default function AllPosts({ searchParams }) {
  const [posts, setPosts] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const currentPage = parseInt(searchParams?.page || '1');
  const pageSize = 12;
  const groupSize = 5;

  useEffect(() => {
    // 데이터 패칭
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
        console.error('Error fetching posts:', error);
      }
    };

    fetchData();
  }, [currentPage]);

  const getFirstImageFromContent = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    const img = doc.querySelector('img');
    return img ? img.src : null;
  };

  const getTextFromContent = (content) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(content, 'text/html');
    return doc.body.textContent || '';
  };

  if (!posts)
    return (
      <div>
        <section>
          <h2>게시글 목록</h2>
          <div className="articles">
            {Array.from({ length: 12 }).map((_, index) => (
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
      </div>
    );

  return (
    <div>
      <section>
        <h2>게시글 목록</h2>
        <div className="articles">
          {posts.map((post) => {
            const firstImage = getFirstImageFromContent(post.content);
            const postText = getTextFromContent(post.content);
            return (
              <article key={post.id} className={`article ${!firstImage ? 'no-image' : 'yes'}`}>
                <Link href={`/post/${post.id}`} className="no-underline">
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
                    <p>{postText.length > 100 ? `${postText.substring(0, 100)}...` : postText}</p>
                    {post.tags && post.tags.length > 0 && (
                      <div className="tags">
                        {post.tags.map((tag) => (
                          <span key={tag.id} className="tag">
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    )}
                    <div className="footer-info">
                      <span className="author">
                        {post.isPrivate && '[Private] '}
                        <span className={post.author?.nickname ? 'highlight-author' : ''}>
                          {post.author?.nickname || '익명'}
                        </span>
                      </span>
                      <span className="view-count">VIEW {post.views || 0}</span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      {/* 페이지네이션 */}
      <footer>
        <Pagination currentPage={currentPage} totalPages={totalPages} groupSize={groupSize} />
      </footer>
    </div>
  );
}