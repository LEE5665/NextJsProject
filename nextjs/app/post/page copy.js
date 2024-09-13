"use client"

import styles from './page.module.css'
import axios from 'axios';
import Auth from '../component/navlogin.js'
import Link from 'next/link';
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation';

export default function PostForm() {
  const { data: session  } = useSession();
  const router = useRouter();

  const handleSubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      try {
        const response = await axios.post('/api/postcreate', {
            title: formData.get('title'),
            content: formData.get('content'),
            id: session?.user.id,
            password: formData.get('password') || null
        });
        if(response.status == 201) {
            alert("글 작성 완료!");
            router.push('/');
        }
    } catch (error){
        alert("글쓰기에 실패했습니다.");
    }
};

return (
  <div>
    <header className={styles.header}>
      <h1>게시글 작성</h1>
    </header>
    <nav>
      <div className="nav-links">
        <Link href="/">홈</Link>
        <a href="#">모든 글</a>
        <a href="#">검색</a>
        <Link href="/post">게시글 작성</Link>
      </div>
      <Auth />
    </nav>
    <section className={styles.section}>
      <div className={styles.formContainer}>
        <h2>새 게시글 작성</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.label}>제목</label>
            <input type="text" id="title" name="title" className={styles.input} placeholder="제목을 입력하세요" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.label}>이미지 업로드</label>
            <input type="file" id="image" name="image" className={styles.input} accept="image/*" />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="content" className={styles.label}>내용</label>
            <textarea id="content" name="content" className={styles.textarea} placeholder="내용을 입력하세요" required />
          </div>
          {!session && (
            <div className={styles.formGroup}>
              <label htmlFor="password" className={styles.label}>비밀번호</label>
              <input type="password" id="password" name="password" className={styles.input} placeholder="비밀번호를 입력하세요" required />
            </div>
          )}

          <div className={styles.formGroup}>
            <button type="submit" className={styles.button}>작성 완료</button>
          </div>
        </form>
      </div>
    </section>
    <footer className={styles.footer}>
      {/* <p>&copy; 2024 개발 게시판</p> */}
    </footer>
  </div>
);
}