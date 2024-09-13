"use client";
import React, { useState, useMemo, useRef } from 'react';
import dynamic from "next/dynamic";
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import 'react-quill/dist/quill.snow.css';

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
        // 이미지 업로드 API 호출
        const response = await axios.post("/api/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        const imageUrl = response.data.url; // 서버에서 받은 이미지 URL
        // Quill 에디터에 이미지 삽입
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

  // 게시글 작성 핸들러
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
      <h1>게시글 작성</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
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
        />
        
        {!session && (
          <div>
            <label htmlFor="password">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="비밀번호를 입력하세요"
              required
            />
          </div>
        )}

        <button type="submit">작성 완료</button>
      </form>
    </div>
  );
}
