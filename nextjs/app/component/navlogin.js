"use client";

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import styles from './navlogin.module.css';
import { useSession } from 'next-auth/react';

export default function Auth({ sessions }) {
    // 상태로 세션과 로딩 상태 관리
    const { data: session, status } = useSession();

    if (status === "loading") {
        return <div></div>; // 로딩 스피너를 사용할 수도 있습니다.
    }

    // 세션 정보가 없을 때
    if (!session) {
        return (
            <div className={styles.authlinks}>
                <Link href="/login">로그인</Link>
                <Link href="/signup">회원가입</Link>
            </div>
        );
    }

    // 세션 정보가 있을 때
    return (
        <div className="auth-links">
            <span>{session.user.nickname}님 환영합니다!</span>
            <button onClick={() => signOut()} className={styles.logoutButton}>
                로그아웃
            </button>
        </div>
    );
}