"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function PostDetail({params}) {
  const router = useRouter();
  const {id} = params;
  console.log(id);
  const [post, setPost] = useState(null);

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/posts/${id}`);
          const data = await response.json();
          setPost(data);
        } catch (error) {
          console.error('게시글을 가져오는 데 실패했습니다.', error);
        }
      };
      fetchPost();
    }
  }, [id]);

  if (!post) {
    return <p></p>; // 게시글이 없을 때
  }

  return (
    <div>
      <header>
        <h1>게시글 상세</h1> {/* 게시글 제목 */}
      </header>
      <nav>
        <div className="nav-links">
          <Link href="/">홈</Link> {/* 홈으로 이동 */}
          <Link href="/posts">모든 글</Link> {/* 전체 글 페이지로 이동 */}
        </div>
      </nav>
      <section>
        <h2>{post.title}</h2>
        <div className="post-detail">
          <p>{post.content}</p> {/* 게시글 본문 */}
          <p className="author">작성자: {post.author?.nickname || '익명'}</p> {/* 작성자 정보 */}
        </div>
      </section>
      <footer>
        {/* <p>&copy; 2024 개발 게시판</p> */}
      </footer>
    </div>
  );
}