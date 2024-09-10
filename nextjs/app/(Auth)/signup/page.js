"use client"

import Link from 'next/link';
import styles from '../page.module.css'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function Signup() {
    const router = useRouter();
    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const response = await axios.post('/api/auth/signup', {
                nickname: formData.get('nickname'),
                name: formData.get('username'),
                id: formData.get('userid'),
                email: formData.get('email'),
                password: formData.get('password1'),
            });
            if(response.status == 201) {
                alert("회원가입 완료");
                console.log("성공");
                router.push('/');
            }
        } catch (error){
            console.error("실패");
            alert("이미 사용 중인 아이디 입니다.");
        }
    };

    return (
        <div className={styles.body}>
            <div className={styles.loginContainer}>
                <h2 className={styles.title}>회원가입</h2>
                <form onSubmit={handleSubmit}>
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