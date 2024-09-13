"use client";

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
          const response = await axios.get(`/api/posts/${id}`);
          const data = response.data;
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

    if (!post.author) {
      password = prompt("비밀번호를 입력하세요");
      if (!password) {
        return;
      }
    }
    const confirmed = confirm("정말로 게시글을 삭제하시겠습니까?");
    if (!confirmed) {
      return;
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
  };

  const handleEdit = async () => {
    if (!post.author) {
      const password = prompt("비밀번호를 입력하세요");
      if (!password) {
        return;
      }
  
      // 비밀번호를 서버로 보내 토큰 요청
      try {
        const response = await axios.post(`/api/posts/${id}/check-password`, { password });
  
        if (response.data.success) {
          const { token } = response.data; // 서버에서 발급한 토큰
          // 토큰을 수정 페이지로 넘김
          router.push(`/post/edit/${id}?token=${token}`);
        } else {
          alert("비밀번호가 틀렸습니다.");
        }
      } catch (error) {
        console.error('비밀번호 검증 중 오류 발생:', error);
        alert("비밀번호 검증에 실패했습니다.");
      }
    } else {
      router.push(`/post/edit/${id}`);
    }
  };

  if (!post) {
    return <p>로딩 중...</p>;
  }

  const isAuthor = session && post.author && session.user.id === post.author.id;

  return (
    <div>
      <header>
        <h1>게시글 상세</h1>
      </header>
      <nav>
        <div className="nav-links">
          <Link href="/">홈</Link>
          <Link href="/posts">모든 글</Link>
        </div>
      </nav>
      <section>
        <h2>{post.title}</h2>
        <div className="post-detail">
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: post.content }} />
          <p className="author">작성자: {post.author?.nickname || '익명'}</p>
        </div>

        {isAuthor || !post.author ? (
          <div>
            <button onClick={handleDelete}>삭제하기</button>
            <button onClick={handleEdit}>수정하기</button> {/* 수정 버튼 추가 */}
          </div>
        ) : null}
      </section>
      <footer></footer>
    </div>
  );
}
