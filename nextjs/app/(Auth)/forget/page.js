'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import axios from 'axios';

export default function ResetPassword() {
    const { theme } = useTheme();
    const router = useRouter();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const response = await axios.post('/api/auth/reset-password', {
                email: formData.get('email') }
            );
            if (response.status === 200) {
                alert("이메일 인증을 성공적으로 보냈습니다!");
                router.push('/');
            }
        } catch (error) {
            setError('서버에 연결하는 중 오류가 발생했습니다.');
            if(error.response.data.error){
                setError(error.response.data.error);
            }
        }
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-${theme === 'dark' ? '[var(--background-color-dark)]' : '[var(--background-color)]'} text-${theme === 'dark' ? '[var(--text-primary-dark)]' : '[var(--text-primary)]'} p-6`}>
            <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-[var(--card-bg-dark)] shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">계정 재설정</h2>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 사용자의 ID를 표시 */}
                    <div>
                        <label>이메일</label>
                        <input
                            type="text"
                            name="email"
                            className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                        />
                    </div>
                    <button type="submit" className="w-full bg-[var(--button-bg)] text-[var(--button-text)] py-2 rounded-lg transition-all hover:bg-[var(--button-hover-bg)] dark:bg-[var(--button-bg)] dark:hover:bg-[var(--button-hover-bg)]">
                        이메일 인증 보내기
                    </button>
                </form>
            </div>
        </div>
    );
}
