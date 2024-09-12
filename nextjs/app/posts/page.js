"use client"

import Link from 'next/link';
import { useState, useEffect } from 'react';
import Auth from '../component/navlogin.js'
import axios from 'axios';

export default function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/posts');
        const data = response.data
        console.log(data);
        setPosts(data);
        setLoading(false);
      } catch (error) {
        console.error('게시글을 가져오는 데 실패했습니다.', error);
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  return (
    <div>
      <header>
        <h1>모든 게시글</h1>
      </header>
      <nav>
        <div className="nav-links">
        <Link href="/">홈</Link>
          <Link href="/posts">모든 글</Link>
          <a href="#">검색</a>
          <Link href="/post">게시글 작성</Link>
        </div>
        <Auth/>
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
        {/* <p>&copy; 2024 개발 게시판</p> */}
      </footer>
    </div>
  );
}