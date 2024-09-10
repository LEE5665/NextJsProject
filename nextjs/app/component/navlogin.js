"use client"

import { signOut, useSession } from 'next-auth/react'
import Link from 'next/link';
import { useState } from 'react';
import styles from '../Home.module.css'

export default function Auth() {
    const { login, setlogin } = useState(false);
    const { data: session, status } = useSession();
    if (status === "loading") {

    }

    if (!session) {
        return (
            <div className={styles.loginLogout}>
                <Link href="/login">로그인</Link>
                <Link href="/signup">회원가입</Link>
            </div>//test2
        );
    } else {
        return (
            <div className={styles.loginLogout}>
                <a>{session.user.id}</a>
            </div>
        );
    }

    console.log(session.user.id);

    return (
        <div>
        </div>
    );
}
