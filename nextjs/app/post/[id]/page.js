"use client"

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import 'react-quill/dist/quill.snow.css';

export default function PostDetail({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = params;
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

  const handleDelete = async () => {
    let password = null;

    // 익명 사용자는 비밀번호 입력을 받음
    if (!post.author) {
      password = prompt("비밀번호를 입력하세요");
      if (!password) {
        return; // 비밀번호가 없으면 종료
      }
    }
    if (isAuthor) {
      const confirmed = confirm("정말로 게시글을 삭제하시겠습니까?");
      if (!confirmed) {
        return;
      }
    }
    try {
      const response = await axios.post(`/api/posts/${id}/delete`, { password });
      if (response.data.success) {
        alert("게시글이 삭제되었습니다.");
        router.push('/posts');
      } else {
        alert("비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      console.error('삭제 요청 중 오류 발생:', error);
      if (error.response && error.response.data.error) {
        alert(error.response.data.error);
      }
    }
  }

  if (!post) {
    return <p>로딩 중...</p>; // 게시글을 로딩 중일 때
  }

  const isAuthor = session && post.author && session.user.id === post.author.id;

  return (
    <div>
      <header>
        <h1>게시글 상세</h1>
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
          {/* Quill 에디터로 작성된 HTML을 렌더링 */}
          <div 
            className="ql-editor" dangerouslySetInnerHTML={{ __html: post.content }} 
          /> 
          <p className="author">작성자: {post.author?.nickname || '익명'}</p> {/* 작성자 정보 */}
        </div>

        {/* 삭제 버튼 */}
        {isAuthor || !post.author ? (
          <div>
            <button onClick={handleDelete}>
              삭제하기
            </button>
          </div>
        ) : null}
      </section>
      <footer>
      </footer>
    </div>
  );
}