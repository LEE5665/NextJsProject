'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import Header from '../posts/Header';
import Pagination from '../posts/Pagination';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function MyPage({ searchParams }) {
    const { data: session, status, update } = useSession();
    const [isEditMode, setIsEditMode] = useState(false);
    const { theme, setTheme } = useTheme();
    const [activeTab, setActiveTab] = useState('myPosts');
    const [data, setData] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 6;  // 페이지 당 게시글 수
    const groupSize = 5;
    const currentPage = searchParams.page || '1';
    const router = useRouter();
    const [userdata, setUserData] = useState([]);

    const [formErrors, setFormErrors] = useState({});

    const handleEditToggle = () => {
        setIsEditMode(!isEditMode); // 수정 모드 전환
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                setData([]);
                const response = await axios.get(`/api/userdata?category=${activeTab}&page=${currentPage}&pageSize=${pageSize}`);
                setData(response.data.posts);
                setTotalPages(Math.ceil(response.data.totalPosts / pageSize));  // 총 페이지 수 계산
                if(response.data.account){
                    setUserData(response.data.account);
                }
            } catch (error) {
                router.push('/');
                alert(error.response.data.error);
            }
        };
        fetchData();
    }, [activeTab, currentPage]);

    const Activehandel = (category) => {
        setActiveTab(category);
        router.push(`/mypage?category=${category}&page=1`);
    };

    const getFirstImageFromContent = (content) => {
        if (typeof window === 'undefined') return null;
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        const img = doc.querySelector('img');
        return img ? img.src : null;
    };

    const getTextFromContent = (content) => {
        if (typeof window === 'undefined') return '';
        const parser = new DOMParser();
        const doc = parser.parseFromString(content, 'text/html');
        return doc.body.textContent || '';
    };

    const Save = async (e) => {
        e.preventDefault();
        const form = new FormData(e.target);
        try{
            const response = await axios.post("/api/auth/update",
                { nickname: form.get('nickname'),
                    password: form.get('password'),
                    password2: form.get('password2'),
                 });
                 if(response.status === 200){
                    update({...session?.user, nickname: form.get('nickname')});
                    alert("회원정보가 변경되었습니다!");
                    router.push('/');
                 }
        } catch(error){
            if (error.response && error.response.data) {
                setFormErrors(error.response.data.errors || {});
            }
        }
    };

    return (
        <>
            <Header />
            <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-[var(--background-color)] text-[var(--text-primary)]' : 'bg-[var(--background-color)] text-[var(--text-primary)]'}`}>
                <main className="my-5 mx-auto max-w-4xl">
                    <div className="tabs flex justify-between text-sm font-medium text-center text-gray-500 border-b">
                        <button className={`tab flex-1 p-4 hover:text-blue-600 ${activeTab === 'myPosts' ? 'text-blue-600 border-blue-600' : ''}`} onClick={() => Activehandel('myPosts')}>
                            내 게시글
                        </button>
                        <button className={`tab flex-1 p-4 hover:text-blue-600 ${activeTab === 'myComments' ? 'text-blue-600 border-blue-600' : ''}`} onClick={() => Activehandel('myComments')}>
                            내가 쓴 댓글
                        </button>
                        <button className={`tab flex-1 p-4 hover:text-blue-600 ${activeTab === 'sharedPosts' ? 'text-blue-600 border-blue-600' : ''}`} onClick={() => Activehandel('sharedPosts')}>
                            나에게 공개된 게시글
                        </button>
                        <button className={`tab flex-1 p-4 hover:text-blue-600 ${activeTab === 'myInfo' ? 'text-blue-600 border-blue-600' : ''}`} onClick={() => Activehandel('myInfo')}>
                            내 정보
                        </button>
                    </div>

                    <section className="p-4">

                        {activeTab === "myInfo" ? ( !userdata || 
                            <div className={`max-w-lg mx-auto p-6 rounded-md shadow-lg ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] border border-[var(--card-border-dark)] text-white' : 'bg-[var(--card-bg)] text-black'}`}>
                            <h2 className="text-2xl font-bold mb-4">내 정보</h2>
                
                            {!isEditMode ? (
                                // 수정 모드가 아닐 때, 정보만 표시
                                <div>
                                    <p><strong>이름:</strong> {userdata.name}</p>
                                    <p><strong>닉네임:</strong> {userdata.nickname}</p>
                                    <p><strong>이메일:</strong> {userdata.email}</p>
                                    {/* 수정 모드로 전환 버튼 */}
                                    <button
                                        onClick={handleEditToggle}
                                        className={`w-full py-2 px-4 mt-4 rounded-md text-white ${theme === 'dark' ? 'bg-[var(--button-bg-dark)] hover:bg-[var(--button-hover-bg-dark)]' : 'bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)]'} transition-colors`}
                                    >
                                        수정하기
                                    </button>
                                </div>
                            ) : (
                                // 수정 모드일 때, 폼 표시
                                <form className="space-y-4" onSubmit={Save}>
                                    {/* 닉네임 */}
                                    <p className="text-red-800">{formErrors.update}</p>
                                    <p className="text-red-500">정보 변경은 일주일에 한 번 가능합니다.</p>
                                    <p className="text-red-500">입력하는 모든 내용이 업데이트 됩니다.</p>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="nickname">
                                            닉네임
                                        </label>
                                        <input
                                            type="text"
                                            id="nickname"
                                            name="nickname"
                                            className={`w-full p-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'}`}
                                            defaultValue={userdata.nickname}
                                        />
                                    </div>
                                    <p className="text-red-500">{formErrors.nickname}</p>
                                    <p className="text-red-500">{formErrors.email}</p>
                                    {/* 비밀번호 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="password">
                                            비밀번호
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            className={`w-full p-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'}`}
                                            placeholder="새 비밀번호 입력"
                                        />
                                    </div>
                                    <p className="text-red-500">{formErrors.password}</p>
                                    <div>
                                        <label className="block text-sm font-medium mb-1" htmlFor="password">
                                            비밀번호 확인
                                        </label>
                                        <input
                                            type="password"
                                            id="password"
                                            name="password2"
                                            className={`w-full p-2 border rounded-md ${theme === 'dark' ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-100 text-black border-gray-300'}`}
                                            placeholder="확인용 새 비밀번호 입력"
                                        />
                                    </div>
                                    <p className="text-red-500">{formErrors.password2}</p>
                                    {/* 회원 정보 수정 버튼 */}
                                    <div className="flex justify-between">
                                        <button
                                            type="submit"
                                            className={`py-2 px-4 rounded-md text-white ${theme === 'dark' ? 'bg-[var(--button-bg-dark)] hover:bg-[var(--button-hover-bg-dark)]' : 'bg-[var(--button-bg)] hover:bg-[var(--button-hover-bg)]'} transition-colors`}
                                        >
                                            저장하기
                                        </button>
                                        <button
                                            type="button"
                                            onClick={handleEditToggle}
                                            className="py-2 px-4 rounded-md bg-gray-500 hover:bg-gray-600 text-white"
                                        >
                                            취소
                                        </button>
                                    </div>
                                </form>
                            )}
                
                            {/* 회원 탈퇴 */}
                            <div className="mt-6 text-center">
                                <button
                                    type="button"
                                    className="text-red-500 hover:text-red-600 font-medium"
                                    onClick={() => {
                                        // 회원 탈퇴 로직 추가
                                        if (confirm("정말로 회원 탈퇴를 하시겠습니까?")) {
                                            // 탈퇴 처리 로직
                                        }
                                    }}
                                >
                                    회원 탈퇴
                                </button>
                            </div>
                        </div>
                        ) :

                            (
                                <>
                                    {data.length > 0 ? (
                                        activeTab === "myPosts" ? (
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                {data.map((post) => {
                                                    const firstImage = getFirstImageFromContent(post.content);
                                                    const postText = getTextFromContent(post.content);
                                                    return (
                                                        <Link
                                                            href={`/post/${post.id}`}
                                                            key={post.id}
                                                            className={`no-underline block rounded-md overflow-hidden hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] border border-[var(--card-border-dark)]' : 'bg-[var(--card-bg)] shadow-md'}`}
                                                        >
                                                            {firstImage && (
                                                                <div
                                                                    className="h-48 bg-cover bg-center"
                                                                    style={{ backgroundImage: `url(${firstImage})` }}
                                                                ></div>
                                                            )}
                                                            <div className={`p-4 transition-colors ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
                                                                <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                                                    {post.title}
                                                                </h3>
                                                                <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-author-color'}`}>
                                                                    {post.isPrivate && "[Private] "}
                                                                    {post.author?.nickname || "익명"} |{" "}
                                                                    {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                                                                        year: "numeric",
                                                                        month: "long",
                                                                        day: "numeric",
                                                                    })}
                                                                    <span className={`float-right ${theme === 'dark' ? 'text-gray-400' : 'text-views-color'}`}>
                                                                        VIEW {post.views || 0}
                                                                    </span>
                                                                </p>
                                                                <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-text-secondary'}`}>
                                                                    {postText.length > 100 ? `${postText.substring(0, 100)}...` : postText}
                                                                </p>
                                                                {post.tags && post.tags.length > 0 && (
                                                                    <div className="mt-3">
                                                                        {post.tags.map((tag) => (
                                                                            <span
                                                                                key={tag.id}
                                                                                className={`text-xs inline-block rounded-full px-2 py-1 mr-2 ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-tag-bg-color text-tag-text-color'}`}
                                                                            >
                                                                                {tag.name}
                                                                            </span>
                                                                        ))}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        ) : activeTab === "myComments" ? (
                                            data.map((item) => {
                                                if (!item?.post) return null; // item.post가 없으면 건너뜀
                                                const createdAt = new Date(item.createdAt).toLocaleDateString("ko-KR", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                    hour: "2-digit",
                                                    minute: "2-digit",
                                                });
                                                const updatedAt = item.updatedAt
                                                    ? new Date(item.updatedAt).toLocaleDateString("ko-KR", {
                                                        year: "numeric",
                                                        month: "long",
                                                        day: "numeric",
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })
                                                    : null;

                                                return (
                                                    <Link href={`/post/${item.post.id}`} key={item.id}>
                                                        <article

                                                            className={`no-underline block rounded-md overflow-hidden hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] border border-[var(--card-border-dark)]' : 'bg-[var(--card-bg)] shadow-md'}`}
                                                        >
                                                            <h3
                                                                className={`text-lg font-semibold ${theme === "dark" ? "text-white" : "text-black"
                                                                    }`}
                                                            >
                                                                게시글 - {item.post?.title}
                                                            </h3>
                                                            <div
                                                                className={`mt-2 mb-4 ${theme === "dark" ? "text-gray-300" : "text-gray-700"
                                                                    }`}
                                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                                            ></div>

                                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                                <p>
                                                                    작성일: <span className="font-medium">{createdAt}</span>
                                                                </p>
                                                                {updatedAt && (
                                                                    <p>
                                                                        수정일: <span className="font-medium">{updatedAt}</span>
                                                                    </p>
                                                                )}
                                                            </div>
                                                        </article>
                                                    </Link>
                                                );
                                            })
                                        ) :
                                            activeTab === "sharedPosts" ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    {data.map((post) => {
                                                        const firstImage = getFirstImageFromContent(post.content);
                                                        const postText = getTextFromContent(post.content);
                                                        return (
                                                            <Link
                                                                href={`/post/${post.id}`}
                                                                key={post.id}
                                                                className={`no-underline block rounded-md overflow-hidden hover:shadow-lg transition-shadow ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] border border-[var(--card-border-dark)]' : 'bg-[var(--card-bg)] shadow-md'}`}
                                                            >
                                                                {firstImage && (
                                                                    <div
                                                                        className="h-48 bg-cover bg-center"
                                                                        style={{ backgroundImage: `url(${firstImage})` }}
                                                                    ></div>
                                                                )}
                                                                <div className={`p-4 transition-colors ${theme === 'dark' ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-black'}`}>
                                                                    <h3 className={`text-xl font-semibold mb-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                                                        {post.title}
                                                                    </h3>
                                                                    <p className={`text-sm mb-3 ${theme === 'dark' ? 'text-gray-300' : 'text-author-color'}`}>
                                                                        {post.isPrivate && "[Private] "}
                                                                        {post.author?.nickname || "익명"} |{" "}
                                                                        {new Date(post.createdAt).toLocaleDateString("ko-KR", {
                                                                            year: "numeric",
                                                                            month: "long",
                                                                            day: "numeric",
                                                                        })}
                                                                        <span className={`float-right ${theme === 'dark' ? 'text-gray-400' : 'text-views-color'}`}>
                                                                            VIEW {post.views || 0}
                                                                        </span>
                                                                    </p>
                                                                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-text-secondary'}`}>
                                                                        {postText.length > 100 ? `${postText.substring(0, 100)}...` : postText}
                                                                    </p>
                                                                    {post.tags && post.tags.length > 0 && (
                                                                        <div className="mt-3">
                                                                            {post.tags.map((tag) => (
                                                                                <span
                                                                                    key={tag.id}
                                                                                    className={`text-xs inline-block rounded-full px-2 py-1 mr-2 ${theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-tag-bg-color text-tag-text-color'}`}
                                                                                >
                                                                                    {tag.name}
                                                                                </span>
                                                                            ))}
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </Link>
                                                        );
                                                    })}
                                                </div>
                                            ) :
                                                (
                                                    <p className={`text-center my-5 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>
                                                        선택된 탭에 대한 내용이 없습니다.
                                                    </p>
                                                )
                                    ) : (
                                        <p className={`text-center my-5 ${theme === 'dark' ? 'text-white' : 'text-black'}`}>내용이 없습니다.</p>
                                    )}
                                </>
                            )}
                    </section>
                    <section className="pagination-container">
                        {activeTab === "myInfo" || (<Pagination currentPage={currentPage} totalPages={totalPages} groupSize={groupSize} posts={data} URL={`/mypage?category=${activeTab}&page=`} />)}
                    </section>
                </main>
                <footer>
                    <p>&copy; 2024 개발 게시판. All rights reserved.</p>
                </footer>
            </div>
        </>
    );
}