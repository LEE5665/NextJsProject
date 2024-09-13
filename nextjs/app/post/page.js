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

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        const quillEditor = quillRef.current.getEditor();
        const range = quillEditor.getSelection(true);
        quillEditor.insertEmbed(range.index, 'image', e.target.result);
        quillEditor.setSelection(range.index + 1);
      };
      reader.readAsDataURL(file);
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
    formData.append('userId', session?.user?.id || null)
  
    // 이미지 파일 정보를 formData에 추가
    const images = document.querySelectorAll('img');
    images.forEach((img, index) => {
      const dataURL = img.src;
      const blob = dataURLtoBlob(dataURL); // DataURL을 Blob으로 변환하는 함수 필요
      formData.append(`image_${index}`, blob, `image_${index}.png`);
      console.log(`image_${index}`, blob, `image_${index}.png`);
    });
  
    try {
      const response = await axios.post("/api/postcreate", formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
  
      if (response.status === 201) {
        alert("게시글이 작성되었습니다.");
        router.push("/posts");
      }
    } catch (error) {
      console.error("게시글 작성 중 오류 발생:", error);
      alert('게시글 작성에 실패했습니다.');
    }
  };
  
  // DataURL을 Blob으로 변환하는 함수
  function dataURLtoBlob(dataurl) {
    var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], {type:mime});
  }

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
            name="content"
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
