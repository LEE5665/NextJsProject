"use client";

import { signOut } from 'next-auth/react';
import Link from 'next/link';
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
            <div className="auth-buttons">
            <Link href="/login"><button>
                로그인
              </button></Link>
              <Link href="/signup"><button>
                회원가입
              </button></Link>
            </div>
        );
    }

    // 세션 정보가 있을 때
    return (
        <div className="auth-buttons">
            <span>{session.user.nickname}님 환영합니다!</span>
              <Link href="/"><button onClick={() => signOut()}>
                로그아웃
              </button></Link>
        </div>
    );
}