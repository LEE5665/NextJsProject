'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useTheme } from 'next-themes';

export default function PostDetail({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = params;
  const [post, setPost] = useState(null);
  const { theme, setTheme } = useTheme();

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
    if (!post.author) {
      password = prompt("비밀번호를 입력하세요");
      if (!password) {
        return;
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
      alert("삭제에 실패했습니다.");
    }
  };

  const handleEdit = async () => {
    if (!post.author) {
      const password = prompt("비밀번호를 입력하세요");
      if (!password) {
        return;
      }
      try {
        const response = await axios.post(`/api/posts/${id}/check-password`, { password });
        if (response.data.success) {
          const { token } = response.data;
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

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!post) {
    return <p>로딩 중...</p>;
  }

  const isAuthor = session && post.author && session.user.id === post.author.id;

  return (
    <div
    className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-[var(--background-color)] text-[var(--text-primary)]' : 'bg-[var(--background-color)] text-[var(--text-primary)]'}`}
  >
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold">개발 게시판</div>
        <button className="theme-toggle p-2 bg-[var(--toggle-bg)] text-white rounded-lg" onClick={toggleTheme}>
          {theme === 'dark' ? '라이트 모드' : '다크 모드'}
        </button>
      </header>

      {/* Navigation */}
      <nav className="mb-6">
        <div className="flex space-x-4 text-lg">
          <Link href="/" className="hover:underline">
            홈
          </Link>
          <Link href="/posts" className="hover:underline">
            모든 글
          </Link>
        </div>
      </nav>

      {/* Post Detail */}
      <section>
        <h2 className="text-2xl font-bold mb-4">{post.title}</h2>
        <div
  className={`post-detail p-4 rounded-lg shadow-lg ${
    theme === 'dark'
      ? 'bg-[var(--card-bg-dark)] border border-[var(--card-border-dark)]'
      : 'bg-[var(--card-bg)] shadow-md'
  }`}
>
          {/* Render Quill Content */}
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: post.content }} />
          <p className={`mt-4 text-sm ${theme === 'dark' ? 'text-[var(--text-secondary)]' : 'text-[var(--text-primary)]'}`}>
            작성자: {post.author?.nickname || '익명'}
          </p>
          <p className="mt-2 text-sm text-[var(--views-color)]">조회수: {post.views}</p>
        </div>
      </section>

      {/* Footer Buttons */}
      <footer className="mt-6">
        {(isAuthor || !post.author) && (
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover-bg)] transition" onClick={handleDelete}>
              삭제하기
            </button>
            <button className="px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover-bg)] transition" onClick={handleEdit}>
              수정하기
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}
