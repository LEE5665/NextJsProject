"use client"

import Link from 'next/link';
import { signIn } from 'next-auth/react';
import styles from '../page.module.css';
import { useRouter } from 'next/navigation'
import axios from 'axios';

export default function Login() {
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log("ID:", formData.get('id'));
        console.log("Password:", formData.get('password'));
        try {
            const result = await signIn('credentials', {
                redirect: false, // 자동 리다이렉트 방지
                id: formData.get('id'),
                password: formData.get('password'),
                callbackUrl: '/'
            });
    
            if (result.ok) {
                console.log('로그인 성공');
                router.push('/');
            } else {
                // 401 상태 코드가 반환되었을 때 클라이언트에서 직접 처리
                console.log('로그인 실패: 잘못된 자격 증명');
                alert("로그인에 실패했습니다. 아이디 또는 비밀번호를 확인하세요.");
            }
        } catch (error) {
            console.error("로그인 처리 중 오류 발생:", error);
            alert("오류가 발생했습니다. 나중에 다시 시도하세요.");
        }
    };
    return (
        <div className={styles.body}>
            <div className={styles.loginContainer}>
                <h2 className={styles.title}>로그인</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="id"
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