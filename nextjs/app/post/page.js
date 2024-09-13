"use client";
import React, { useState, useMemo, useRef } from 'react';
import dynamic from "next/dynamic";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';
import styles from './page.module.css'; // 홈 스타일 가져오기
import Link from 'next/link';

const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import('react-quill');
  return function comp({ forwardedRef, ...props }) {
    return <RQ ref={forwardedRef} {...props} />;
  };
}, { ssr: false });

const formats = [
  'font',
  'header',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'link',
  'align',
  'color',
  'background',
  'size',
  'h1',
  'image',
];

export default function NoticeEditor() {
  const { data: session } = useSession();
  const [content, setContent] = useState(""); // Quill 에디터의 내용 상태
  const [title, setTitle] = useState(""); // 제목 상태
  const router = useRouter();
  const quillRef = useRef();

  // 이미지 업로드 핸들러
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

        const imageUrl = response.data.url; // 서버에서 받은 이미지 URL
        const quillEditor = quillRef.current.getEditor(); // Quill 에디터 인스턴스 가져오기
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
          [
            { color: [] },
            { background: [] },
          ],
          ['image'], // 이미지 버튼 추가
        ],
        handlers: {
          image: handleImageUpload, // 이미지 업로드 핸들러 추가
        },
      },
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    try {
      const response = await axios.post("/api/postcreate", {
        title: formData.get('title'),
        content,
        id: session?.user?.id || null,
        password: formData.get('password') || null,
      });

      if (response.status === 201) {
        alert("게시글이 작성되었습니다.");
        router.push("/posts"); // 게시글 목록으로 리디렉션
      }
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <header>
        <h1>게시글 작성</h1>
      </header>
      <nav className="nav-links">
        <Link href="/">홈</Link>
        <Link href="/posts">모든 글</Link>
        <a href="#">검색</a>
        <Link href="/post">게시글 작성</Link>
      </nav>

      <section className={styles.section}>
        <h2>새로운 글 작성하기</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <input
            type="text"
            name="title"
            className={styles.titleInput}
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
          {!session && (
            <div className={styles.passwordSection}>
              <label htmlFor="password">ㅤ</label>
              <input
                type="password"
                id="password"
                name="password"
                className={styles.passwordInput}
                placeholder="비밀번호를 입력하세요"
                required
              />
            </div>
          )}

          <button type="submit" className={styles.submitButton}>
          ㅤ작성 완료
          </button>
        </form>
      </section>
    </div>
  );
}
