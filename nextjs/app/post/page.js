"use client";
import React, { useState, useEffect, useMemo, useRef } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import styles from "./page.module.css"; // 홈 스타일 가져오기
import Link from "next/link";

// 동적 import로 ReactQuill 로드
const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import("react-quill");
  return function comp({ forwardedRef, ...props }) {
    return <RQ ref={forwardedRef} {...props} />;
  };
}, { ssr: false });

const formats = [
  'font', 'header', 'bold', 'italic', 'underline', 'strike',
  'blockquote', 'list', 'bullet', 'indent', 'link', 'align',
  'color', 'background', 'size', 'h1', 'image',
];

export default function NoticeEditor({ postToEdit = null, token }) {
  const { data: session } = useSession();
  const [content, setContent] = useState(postToEdit ? postToEdit.content : ""); // 수정 모드일 경우 기존 내용 로드
  const [title, setTitle] = useState(postToEdit ? postToEdit.title : ""); // 수정 모드일 경우 제목 로드
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
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64Image = reader.result;
        const quillEditor = quillRef.current.getEditor();
        const range = quillEditor.getSelection();
        quillEditor.insertEmbed(range.index, "image", base64Image);
        quillEditor.setSelection(range.index + 1);
      };

      reader.onerror = (error) => {
        console.error("이미지 변환 중 오류 발생:", error);
      };
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
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const images = tempDiv.querySelectorAll("img");

      const imagePromises = Array.from(images).map(async (img) => {
        const base64 = img.src;
        if (base64.startsWith("data:image")) {
          const formData = new FormData();
          const blob = await fetch(base64).then((res) => res.blob());
          formData.append("file", blob, "image.png");

          const response = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          // 서버에서 반환된 이미지 URL로 교체
          img.src = response.data.url;
        }
      });

      await Promise.all(imagePromises);
      const updatedContent = tempDiv.innerHTML;

      // 게시글 전송: 수정 시는 PUT 요청, 새로 작성 시는 POST 요청
      const response = await axios({
        method: postToEdit ? "PUT" : "POST",
        url: postToEdit ? `/api/posts/${postToEdit.id}/edit` : "/api/postcreate",
        data: {
          title: formData.get("title"),
          content: updatedContent,
          userId: session?.user?.id || null,
          password: formData.get("password") || null,
          token: postToEdit ? token : null
        },
      });

      if (response.status === 200 || response.status === 201) {
        alert(postToEdit ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다.");
        router.push("/posts");
      }
    } catch (error) {
      console.error("게시글 처리 중 오류 발생:", error);
    }
  };

  return (
    <div>
      <header>
        <h1>{postToEdit ? "게시글 수정" : "게시글 작성"}</h1>
      </header>
      <nav className="nav-links">
        <Link href="/">홈</Link>
        <Link href="/posts">모든 글</Link>
        <Link href="#">검색</Link>
        <Link href="/post">게시글 작성</Link>
      </nav>

      <section className={styles.section}>
        <h2>{postToEdit ? "게시글 수정하기" : "새로운 글 작성하기"}</h2>
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
          {!session && !postToEdit && ( // 작성 중일 때만 비밀번호 입력 가능
            <div className={styles.passwordSection}>
              <label htmlFor="password">비밀번호</label>
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
            {postToEdit ? "수정 완료" : "작성 완료"}
          </button>
        </form>
      </section>
    </div>
  );
}
