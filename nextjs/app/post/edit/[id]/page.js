"use client";
import React, { useState, useMemo, useRef, useEffect } from 'react';
import dynamic from "next/dynamic";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';
import styles from '../../page.module.css';
import Link from 'next/link';

const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import('react-quill');
  return function comp({ forwardedRef, ...props }) {
    return <RQ ref={forwardedRef} {...props} />;
  };
}, { ssr: false });

const formats = [
  'font', 'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent', 'link', 'align', 'color', 'background', 'size', 'image',
];

export default function NoticeEditor({ params, searchParams }) {
  const { data: session } = useSession();
  const [content, setContent] = useState(""); 
  const [title, setTitle] = useState(""); 
  const [password, setPassword] = useState(""); // 익명 사용자의 비밀번호 상태
  const router = useRouter();
  const quillRef = useRef();
  const { id } = params;

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`/api/posts/${id}`);
          const data = response.data;
          setTitle(data.title);
          setContent(data.content);
        } catch (error) {
          console.error("게시글 불러오기 중 오류 발생:", error);
        }
      };
      fetchPost();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = searchParams.token // URL 쿼리에서 토큰 가져오기
    
    try {
        // 로그인 사용자는 userId, 익명 사용자는 token을 전달
        const response = await axios.put(`/api/posts/${id}/edit`, {
          title,
          content,
          token, // 익명 사용자는 token을 사용
          userId: session?.user?.id || null, // 로그인된 사용자는 userId를 사용
        });
    
        if (response.status === 200) {
          alert("게시글이 수정되었습니다.");
          router.push(`/post/${id}`);
        } else {
          alert("게시글 수정에 실패했습니다.");
        }
      } catch (error) {
        console.error("게시글 수정 중 오류 발생:", error);
        alert("게시글 수정에 실패했습니다.");
      }
    };

  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const formData = new FormData();
      formData.append("file", file);

      try {
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = response.data.url;
        const quillEditor = quillRef.current.getEditor();
        const range = quillEditor.getSelection();
        quillEditor.insertEmbed(range.index, 'image', imageUrl);
        quillEditor.setSelection(range.index + 1);
      } catch (error) {
        console.error("이미지 업로드 실패:", error);
      }
    };
  };

  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ align: [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ color: [] }, { background: [] }],
          ['image'],
        ],
        handlers: {
          image: handleImageUpload,
        },
      },
    };
  }, []);

  return (
    <div>
      <header>
        <h1>게시글 수정</h1>
      </header>
      <nav className="nav-links">
        <Link href="/">홈</Link>
        <Link href="/posts">모든 글</Link>
        <a href="#">검색</a>
      </nav>

      <section className={styles.section}>
        <h2>게시글 수정하기</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="title"
            className={styles.titleInput}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
            required
          />
          <ReactQuill
            forwardedRef={quillRef}
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="내용을 입력하세요"
            className={styles.editor}
          />
          <button type="submit" className={styles.submitButton}>
            수정 완료
          </button>
        </form>
      </section>
    </div>
  );
}
