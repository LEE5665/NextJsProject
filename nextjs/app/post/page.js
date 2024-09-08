"use client"

import { useState } from 'react';
import styles from './page.module.css'
import Link from 'next/link';

export default function PostForm() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [images, setImages] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('content', content);
    images.forEach((image, i) => formData.append(`images[${i}]`, image));

    const res = await fetch('/api/posts', {
      method: 'POST',
      body: formData,
    });

    const result = await res.json();
    if (res.ok) {
      alert(result.message);
      setTitle('');
      setContent('');
      setImages([]);
    } else {
      alert(result.error);
    }
  };

  return (
    <div>
      <header>
        <h1>게시물 작성</h1>
        <p>새로운 게시물을 작성하세요</p>
      </header>
      <nav>
        <Link href="/">홈</Link>
        <a href="#">JSP 게시판</a>
        <a href="#">Java 게시판</a>
        <a href="#">게시물 작성</a>
        <a href="#">문의하기</a>
      </nav>
      <main>
        <div className={styles['form-container']}>
          <h2>게시물 작성 폼</h2>
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className={styles['form-group']}>
              <label htmlFor="title">제목</label>
              <input
                type="text"
                id="title"
                name="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="content">내용</label>
              <textarea
                id="content"
                name="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
              />
            </div>
            <div className={styles['form-group']}>
              <label htmlFor="images">이미지 업로드</label>
              <input
                type="file"
                id="images"
                name="images"
                multiple
                onChange={(e) => setImages(e.target.files)}
              />
            </div>
            <div className={styles['form-group']}>
              <button type="submit">작성 완료</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}