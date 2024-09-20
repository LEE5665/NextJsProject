'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import axios from 'axios';

export default function ResetPassword({ searchParams }) {
    const { theme } = useTheme();
    const router = useRouter();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userId, setuserId] = useState('');
    const token = searchParams.token;

    useEffect(() => {
        const data = async () => {
            try {
                const response = await axios.get('/api/auth/veritypassword', {params: {token}})
                if (response.status === 200) {
                    setuserId(response.data);
                }
            } catch(error){
                alert("권한이 없습니다!");
                router.push('/');
            }
        }
        data();
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/auth/veritypassword', { token, password, password2: confirmPassword })
            if (response.status === 200) {
                alert("비밀번호가 변경되었습니다!");
                router.push('/');
            }
        } catch (error) {
            setError('서버에 연결하는 중 오류가 발생했습니다.');
            console.log(error.response.data.error);
            if(error.response.data.error){
                setError(error.response.data.error);
            }
        }
        return;
    };

    return (
        <div className={`min-h-screen flex items-center justify-center bg-${theme === 'dark' ? '[var(--background-color-dark)]' : '[var(--background-color)]'} text-${theme === 'dark' ? '[var(--text-primary-dark)]' : '[var(--text-primary)]'} p-6`}>
            <div className="w-full max-w-md p-8 space-y-4 bg-white dark:bg-[var(--card-bg-dark)] shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-4">비밀번호 재설정</h2>
                {error && <p className="text-red-500">{error}</p>}
                {success && <p className="text-green-500">{success}</p>}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* 사용자의 ID를 표시 */}
                    <div>
                        <label>아이디</label>
                        <input
                            type="text"
                            value={userId}
                            readOnly
                            className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                        />
                    </div>
                    {/* 새로운 비밀번호 입력 필드 */}
                    <input
                        type="password"
                        placeholder="새 비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                    />
                    {/* 비밀번호 확인 필드 */}
                    <input
                        type="password"
                        placeholder="비밀번호 확인"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-2 border border-[var(--card-border)] rounded-lg dark:bg-[var(--card-bg-dark)] dark:border-[var(--card-border-dark)]"
                    />
                    <button type="submit" className="w-full bg-[var(--button-bg)] text-[var(--button-text)] py-2 rounded-lg transition-all hover:bg-[var(--button-hover-bg)] dark:bg-[var(--button-bg)] dark:hover:bg-[var(--button-hover-bg)]">
                        비밀번호 재설정
                    </button>
                </form>
            </div>
        </div>
    );
}
