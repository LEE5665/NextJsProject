import Link from 'next/link';
import styles from './page.module.css';

export default function PostDetail({ post }) {
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>게시물 상세</h1>
      </header>
      <section className={styles.content}>
        <h2>타이틀</h2>
        <p className={styles.author}>작성자: 작성자</p>
        <div className={styles.body}>
          <p>글 내용</p>
        </div>
      </section>
      <footer className={styles.footer}>

          <Link href="/posts" className={styles.backLink}>목록으로 돌아가기</Link>

      </footer>
    </div>
  );
}