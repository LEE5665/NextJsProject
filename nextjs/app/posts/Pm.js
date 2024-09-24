'use client';
import axios from "axios";

export default function Pm({ togle }) {
    console.log("pm")

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        try {
            const response = await axios.post("api/post/pm", {
                name: formData.get('receiver'),
                title: formData.get('title'),
                content: formData.get('content'),
            });
            console.log(response.status);
            if (response.status === 200) {
                alert("쪽지를 보냈습니다!");
            }
        } catch (error) {
            if (error.response.data.error) {
                alert(error.response.data.error);
            }
            console.log("실패");
        }
    };

    return (
        <>
            {togle && (
                <div
                    className="absolute bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 max-w-md w-full"
                    style={{
                        position: 'absolute',
                        top: noteButtonRef.current?.getBoundingClientRect().bottom + window.scrollY + 'px',
                        left: noteButtonRef.current?.getBoundingClientRect().left + 'px',
                    }}
                >
                    {/* 닫기 버튼 (X) */}
                    <button
                          // 폼 닫기
                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
                    >
                        ✕
                    </button>

                    <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">쪽지 작성</h2>
                    <form onSubmit={handleSubmit}>
                        {/* 받는 사람 */}
                        <div className="mb-4">
                            <label htmlFor="receiver" className="block text-sm font-medium text-gray-700 dark:text-gray-300">받는 사람</label>
                            <input
                                type="text"
                                id="receiver"
                                name="receiver"
                                placeholder="받는 사람 입력"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                            />
                        </div>

                        {/* 제목 */}
                        <div className="mb-4">
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">제목</label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                placeholder="제목 입력"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                            />
                        </div>

                        {/* 내용 */}
                        <div className="mb-4">
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">내용</label>
                            <textarea
                                id="content"
                                name="content"
                                placeholder="내용 입력"
                                rows="4"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-gray-200"
                            ></textarea>
                        </div>

                        {/* 전송 버튼 */}
                        <div>
                            <button
                                type="submit"
                                className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-indigo-500 dark:hover:bg-indigo-600"
                            >
                                전송
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    )
}