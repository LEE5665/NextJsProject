import Link from 'next/link';
import styles from '../page.module.css'

export default function Login() {
    return (
        <div className={styles.body}>
            <div className={styles.loginContainer}>
                <h2 className={styles.title}>로그인</h2>
                <form action="login-process.html" method="POST">
                    <input
                        type="text"
                        name="username"
                        placeholder="사용자 이름"
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>로그인</button>
                </form>
                <Link href="/"><button className={styles.backButton}>돌아가기</button></Link>
                <div className={styles.registerLink}>
                    <p>아직 회원이 아니신가요? <Link href="signup">회원가입</Link></p>
                </div>
            </div>
        </div>
    );
};