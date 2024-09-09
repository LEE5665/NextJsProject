"use client"

import Link from 'next/link';
import { signIn, useSession } from 'next-auth/react'
import { useEffect } from "react";
import styles from '../page.module.css'

export default function Login() {
    const { data: session, status } = useSession();

    useEffect(() => {
      if (status === "authenticated" && session) {
        // JWT에서 저장된 사용자 id 출력
        console.log("User ID:", session.user.id);
      }
    }, [session, status]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        console.log("ID:", formData.get('id'));
        console.log("Password:", formData.get('password'));
        const result = await signIn('credentials', {
            redirect: false,
            id: formData.get('id'),
            password: formData.get('password')
        });
        // if(result.error){
        //     console.log("오류!");
        // }
        // else {
        //     console.log("성공!");
        // }
    }

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