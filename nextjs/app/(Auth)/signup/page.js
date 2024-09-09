import Link from 'next/link';
import styles from '../page.module.css'

export default function Signup() {
    return (
        <div className={styles.body}>
            <div className={styles.loginContainer}>
                <h2 className={styles.title}>회원가입</h2>
                <form action="register-process.html" method="POST">
                <input
                        type="text"
                        name="nickname"
                        placeholder="사용할 닉네임"
                        required
                        className={styles.input}
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="사용자 이름"
                        required
                        className={styles.input}
                    />
                                        <input
                        type="text"
                        name="userid"
                        placeholder="아이디"
                        required
                        className={styles.input}
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        required
                        className={styles.input}
                    />
                    <input
                        type="password"
                        name="password1"
                        placeholder="비밀번호"
                        required
                        className={styles.input}
                    />
                                        <input
                        type="password"
                        name="password2"
                        placeholder="비밀번호 확인"
                        required
                        className={styles.input}
                    />
                    <button type="submit" className={styles.button}>회원가입</button>
                </form>
                <Link href="/"><button className={styles.backButton}>돌아가기</button></Link>
                <div className={styles.registerLink}>
                    <p>이미 회원이신가요? <Link href="/login">로그인</Link></p>
                </div>
            </div>
        </div>
    );
};