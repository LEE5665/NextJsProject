'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { useState } from 'react';
import { useTheme } from 'next-themes';

export default function Signup() {
    const { theme } = useTheme(); // 테마 가져오기
    const [formErrors, setFormErrors] = useState({});
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
                password2: formData.get('password2'),
            });
            if(response.status === 201) {
                alert("이메일에서 인증을 완료 해 주세요. 이메일은 1시간동안 유효합니다.");
                router.push('/');
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setFormErrors(error.response.data.errors || {});
            }
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-${theme === 'dark' ? '[var(--background-color-dark)]' : '[var(--background-color)]'} text-${theme === 'dark' ? '[var(--text-primary-dark)]' : '[var(--text-primary)]'} p-6`}>
            <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-[var(--card-bg-dark)] shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">회원가입</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {formErrors.nickname && <p className="text-red-500 text-sm">{formErrors.nickname}</p>}
                    <input
                        type="text"
                        name="nickname"
                        placeholder="사용할 닉네임"
                        required
                        className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                    />
                    {formErrors.name && <p className="text-red-500 text-sm">{formErrors.name}</p>}
                    <input
                        type="text"
                        name="username"
                        placeholder="사용자 이름"
                        required
                        className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                    />
                    {formErrors.id && <p className="text-red-500 text-sm">{formErrors.id}</p>}
                    <input
                        type="text"
                        name="userid"
                        placeholder="아이디"
                        required
                        className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                    />
                    {formErrors.email && <p className="text-red-500 text-sm">{formErrors.email}</p>}
                    <input
                        type="email"
                        name="email"
                        placeholder="이메일"
                        required
                        className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                    />
                    {formErrors.password && <p className="text-red-500 text-sm">{formErrors.password}</p>}
                    <input
                        type="password"
                        name="password1"
                        placeholder="비밀번호"
                        required
                        className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                    />
                    {formErrors.password2 && <p className="text-red-500 text-sm">{formErrors.password2}</p>}
                    <input
                        type="password"
                        name="password2"
                        placeholder="비밀번호 확인"
                        required
                        className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                    />
                    <button type="submit" className="w-full bg-[var(--button-bg)] text-[var(--button-text)] py-2 rounded-lg transition-all hover:bg-[var(--button-hover-bg)] dark:bg-[var(--button-bg)] dark:hover:bg-[var(--button-hover-bg)]">
                        회원가입
                    </button>
                </form>
                <Link href="/">
                    <button className="w-full mt-3 bg-[var(--toggle-bg)] text-[var(--toggle-text)] py-2 rounded-lg transition-all hover:bg-[var(--toggle-hover-bg)] dark:bg-[var(--toggle-bg)] dark:hover:bg-[var(--toggle-hover-bg)]">
                        돌아가기
                    </button>
                </Link>
                <div className="text-center text-[var(--text-secondary)] dark:text-[var(--text-secondary-dark)] mt-4">
                    <p>이미 회원이신가요? <Link href="/login" className="text-[var(--secondary-color)] dark:text-[var(--secondary-color)] hover:underline">로그인</Link></p>
                </div>
            </div>
        </div>
    );
}
