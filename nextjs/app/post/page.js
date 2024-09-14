"use client";
import React, { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import styles from "./page.module.css"; // 스타일 가져오기
import Link from "next/link";
import Auth from "../component/navlogin";

// 동적 import로 ReactQuill 로드
const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import("react-quill");
  return function comp({ forwardedRef, ...props }) {
    return <RQ ref={forwardedRef} {...props} />;
  };
}, { ssr: false });

const formats = [
  "font", "header", "bold", "italic", "underline", "strike", 
  "blockquote", "list", "bullet", "indent", "link", "align", 
  "color", "background", "size", "h1", "image"
];

export default function NoticeEditor({ postToEdit = null, token }) {
  const { data: session } = useSession();
  const [content, setContent] = useState(postToEdit ? postToEdit.content : "");
  const [title, setTitle] = useState(postToEdit ? postToEdit.title : "");
  const [tags, setTags] = useState([]); // 태그 상태 추가
  const [newTag, setNewTag] = useState(""); // 새로운 태그 입력 상태
  const [password, setPassword] = useState(""); // 비밀번호 상태 추가
  const [isPrivate, setIsPrivate] = useState(postToEdit ? postToEdit.isPrivate : false); // 비공개 여부
  const [viewers, setViewers] = useState([]); // 볼 수 있는 사용자 목록
  const [newViewer, setNewViewer] = useState(""); // 새로운 사용자 추가 상태
  const router = useRouter();
  const quillRef = useRef();


  useEffect(() => {
    if (postToEdit && postToEdit.tags) {
      setTags(postToEdit.tags.map(tag => tag.name)); // 태그 이름만 추출하여 설정
    }
  }, [postToEdit]);

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

  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ size: ["small", false, "large", "huge"] }],
        [{ align: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["image"]
      ],
      handlers: {
        image: handleImageUpload
      }
    }
  }), []);

  const handleSubmit = async (e) => {
    e.preventDefault();
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
            headers: { "Content-Type": "multipart/form-data" }
          });

          img.src = response.data.url;
        }
      });

      await Promise.all(imagePromises);
      const updatedContent = tempDiv.innerHTML;

      // 게시글과 태그 전송
      const response = await axios({
        method: postToEdit ? "PUT" : "POST",
        url: postToEdit ? `/api/posts/${postToEdit.id}/edit` : "/api/postcreate",
        data: {
          title,
          content: updatedContent,
          tags, // 태그 추가
          userId: session?.user?.id || null,
          password: session ? null : password, // 비밀번호 추가
          token: postToEdit ? token : null
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert(postToEdit ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다.");
        router.push("/posts");
      }
    } catch (error) {
      if (error.response && error.response.data) {
        alert(error.response.data.message);
      }
      console.log("게시글 처리 중 오류 발생:", error);
    }
  };

  // 태그 추가 핸들러 (태그는 최대 5개까지만 추가 가능)
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      setTags([...tags, newTag]);
      setNewTag("");
    } else if (tags.length >= 5) {
      alert("태그는 최대 5개까지 추가할 수 있습니다.");
    }
  };

  return (
    <div>
      <header>
        <h1>{postToEdit ? "게시글 수정" : "게시글 작성"}</h1>
      </header>
      <nav>
        <div className="nav-links">
          <Link href="/">홈</Link>
          <Link href="/posts">모든 글</Link>
        </div>
        <Auth />
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
          {/* 태그 입력 */}
          <div className={styles.tagSection}>
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="태그를 입력하세요"
              className={styles.tagInput}
            />
            <button type="button" onClick={handleAddTag} className={styles.addTagButton}>태그 추가</button>
            <small className={styles.tagLimitText}>최대 5개의 태그를 추가할 수 있습니다.</small>
            <div className={styles.tagContainer}>
              {tags.map((tag, index) => (
                <span key={index} className={styles.tag}>{`#${tag}`}</span>
              ))}
            </div>
          </div>

          {/* 비밀번호 입력 (로그인하지 않았고 새 게시물 작성 시) */}
          {!session && !postToEdit && (
            <div className={styles.passwordSection}>
              <label htmlFor="password">비밀번호</label>
              <input
                type="password"
                id="password"
                name="password"
                className={styles.passwordInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
