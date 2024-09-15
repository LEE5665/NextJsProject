'use client';

import { useState } from 'react';
import Link from 'next/link';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export default function Login() {
    const { theme } = useTheme();  // 테마 가져오기
    const router = useRouter();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const result = await signIn('credentials', {
                redirect: false, // 자동 리다이렉트 방지
                id: formData.get('id'),
                password: formData.get('password'),
            });
    
            if (result.ok) {
                router.push('/');
            } else {
                setError('로그인 실패: 잘못된 자격 증명');
            }
        } catch (error) {
            console.error("로그인 처리 중 오류 발생:", error);
            setError('오류가 발생했습니다. 나중에 다시 시도하세요.');
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-${theme === 'dark' ? '[var(--background-color-dark)]' : '[var(--background-color)]'} text-${theme === 'dark' ? '[var(--text-primary-dark)]' : '[var(--text-primary)]'} p-6`}>
            <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-[var(--card-bg-dark)] shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">로그인</h2>
                {error && <p className="text-red-500">{error}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="text"
                        name="id"
                        placeholder="사용자 이름"
                        required
                        className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="비밀번호"
                        required
                        className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                    />
                    <button type="submit" className="w-full bg-[var(--button-bg)] text-[var(--button-text)] py-2 rounded-lg transition-all hover:bg-[var(--button-hover-bg)] dark:bg-[var(--button-bg)] dark:hover:bg-[var(--button-hover-bg)]">
                        로그인
                    </button>
                </form>
                <Link href="/">
                    <button className="w-full mt-3 bg-[var(--toggle-bg)] text-[var(--toggle-text)] py-2 rounded-lg transition-all hover:bg-[var(--toggle-hover-bg)] dark:bg-[var(--toggle-bg)] dark:hover:bg-[var(--toggle-hover-bg)]">
                        돌아가기
                    </button>
                </Link>
                <div className="text-center text-[var(--text-secondary)] dark:text-[var(--text-secondary-dark)] mt-4">
                    <p>아직 회원이 아니신가요? <Link href="/signup" className="text-[var(--secondary-color)] dark:text-[var(--secondary-color)] hover:underline">회원가입</Link></p>
                </div>
            </div>
        </div>
    );
}
