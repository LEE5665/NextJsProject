"use client"

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link';
import styles from '../Home.module.css'

export default function Auth() {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return (
            <div className="auth-links">
                <Link href="/login">로그인</Link>
                <Link href="/signup">회원가입</Link>
          </div>
        );
    }

    if (!session) {
        return (
            <div className={styles.authlinks}>
                <Link href="/login">로그인</Link>
                <Link href="/signup">회원가입</Link>
          </div>
        );
    } else {
        return (
            <div className="auth-links">
                <span>{session.user.nickname}님 환영합니다!</span>
                <button onClick={() => signOut()} className={styles.logoutButton}>
                    로그아웃
                </button>
            </div>
        );
    }
}
