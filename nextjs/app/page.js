'use client';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import Nav from './component/navlogin.js';
import axios from 'axios';
import Header from './posts/Header.js';

export default function Home() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [navActive, setNavActive] = useState(false);
  const [recentPosts, setRecentPosts] = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가

  useEffect(() => {
    setMounted(true);
    
    // API 호출하여 최신 글과 인기 글 가져오기
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/post');
        setRecentPosts(response.data.recentPosts || []);
        setPopularPosts(response.data.popularPosts || []);
      } catch (error) {
        console.error('게시글을 가져오는 중 에러 발생:', error);
      } finally {
        setLoading(false); // API 호출 완료 후 로딩 상태 해제
      }
    };
    
    fetchPosts();
  }, []);

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

  return (
    <div>
      <Header/>
      <main>
      <section>
          <h2>환영합니다!</h2>
          <p>
            최신 기술과 개발 트렌드를 공유하고 토론하세요. 여러분의 지식과 경험을 나누는 공간입니다.
          </p>
        </section>
        {loading ? (
          <p>로딩 중...</p>
        ) : (
          <>
            {/* 최신 글 섹션 */}
            <section>
              <h2>최근 글</h2>
              <div className="articles">
                {recentPosts.length > 0 ? (
                  recentPosts.map((post) => {
                    const firstImage = getFirstImageFromContent(post.content);
                    const postText = getTextFromContent(post.content);
                    return (
                      <Link href={`/post/${post.id}`} className="no-underline" key={post.id}>
                        <article className="article">
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
                  })
                ) : (
                  <p>최근 글이 없습니다.</p>
                )}
              </div>
            </section>
  
            {/* 인기 글 섹션 */}
            <section>
              <h2>인기 글</h2>
              <div className="articles">
                {popularPosts.length > 0 ? (
                  popularPosts.map((post) => {
                    const firstImage = getFirstImageFromContent(post.content);
                    const postText = getTextFromContent(post.content);
                    return (
                      <Link href={`/post/${post.id}`} className="no-underline" key={post.id}>
                        <article className="article">
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
                  })
                ) : (
                  <p>인기 글이 없습니다.</p>
                )}
              </div>
            </section>
          </>
        )}
      </main>
  
      <footer>
        <p>&copy; 2024 개발 게시판. All rights reserved.</p>
      </footer>
    </div>
  );
}