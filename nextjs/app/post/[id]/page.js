'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import { useTheme } from 'next-themes';

export default function PostDetail({ params }) {
  const router = useRouter();
  const { data: session } = useSession();
  const { id } = params;
  const [post, setPost] = useState(null);
  const { theme, setTheme } = useTheme();
  const [isReplyFormVisible, setReplyFormVisible] = useState(null); // 열려 있는 댓글 ID 상태
  const [newComment, setNewComment] = useState('');
  const [newReply, setNewReply] = useState({});
  const [anonymousPassword, setAnonymousPassword] = useState('');
  const [newReplyPassword, setNewReplyPassword] = useState({});
  const [editingCommentId, setEditingCommentId] = useState(null); // 수정 중인 댓글 ID 상태
  const [editingContent, setEditingContent] = useState(''); // 수정 중인 댓글 내용
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editingReplyContent, setEditingReplyContent] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const timeData = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  }


  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const response = await fetch(`/api/posts/${id}`);
          const data = await response.json();
          setPost(data);
        } catch (error) {
          console.error('게시글을 가져오는 데 실패했습니다.', error);
        }
      };
      fetchPost();
    }
  }, [id]);

  //작성자 누를 시 메뉴 핸들러
  const handleAuthorClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

    // 댓글 수정 시작 함수
    const handleEditComment = (comment) => {
      setEditingCommentId(comment.id); // 수정할 댓글의 ID 설정
      setEditingContent(comment.content); // 수정할 댓글의 내용을 입력 필드에 채움
    };
    const handleEditReply = (reply) => {
      setEditingReplyId(reply.id); // 수정할 답글의 ID 설정
      setEditingReplyContent(reply.content); // 수정할 답글의 내용을 입력 필드에 채움
    };
    const handleCancelEditReply = () => {
      setEditingReplyId(null); // 수정 취소
    };


    // 댓글 수정 제출 함수
    const handleUpdateCommentOrReply = async (authorId, isReply = false, parentCommentId = null) => {
      let password = null;
      if (!session || (session && session.user.id !== authorId)) {
        password = prompt(isReply ? '답글의 비밀번호를 입력하세요' : '댓글의 비밀번호를 입력하세요');
        if (!password) {
          alert('비밀번호가 필요합니다.');
          return;
        }
      }
      const content = isReply ? editingReplyContent : editingContent;
      const editingId = isReply ? editingReplyId : editingCommentId;

      try {
        const response = await axios.post(`/api/comments/update`, {
          commentId: editingId,
          content,
          password,
        });

        if (response.status === 200) {
          setPost((prevPost) => ({
            ...prevPost,
            comments: prevPost.comments.map((comment) => {
              if (isReply) {
                // 답글 수정
                return comment.id === parentCommentId
                  ? {
                      ...comment,
                      replies: comment.replies.map((reply) =>
                        reply.id === editingId ? { ...reply, content, updatedAt: response.data} : reply
                      ),
                    }
                  : comment;
              } else {
                // 댓글 수정
                return comment.id === editingId ? { ...comment, content, updatedAt: response.data } : comment;
              }
            }),
          }));

          // 수정 모드 종료
          if (isReply) {
            setEditingReplyId(null);
            setEditingReplyContent('');
          } else {
            setEditingCommentId(null);
            setEditingContent('');
          }
        } else {
          alert('수정에 실패했습니다.');
        }
      } catch (error) {
        console.error('수정 중 오류 발생:', error);
        alert('수정에 실패했습니다.');
      }
    };

    const handleCancelEdit = () => {
      setEditingCommentId(null); // 수정 취소
    };

  const toggleReplyForm = (commentId) => {
    setReplyFormVisible(isReplyFormVisible === commentId ? null : commentId); // 폼을 열거나 닫음
  };

  // 댓글 삭제 함수
  const handleDeleteComment = async (comment, isReply = false, parentCommentId = null) => {
    let password = null;
    // 익명 작성자인 경우 비밀번호 입력
    if (!comment.author) {
      password = prompt('비밀번호를 입력하세요');
      if (!password) {
        return;
      }
    }
    const confirmed = confirm('정말로 댓글을 삭제하시겠습니까?');
    if (!confirmed) {
      return;
    }
    try {
      const response = await axios.post(`/api/comments/delete`, {
        password,
        authorId: comment.authorId,
        commentId: comment.id
      });
      if (response.status === 200) {
        alert('댓글이 삭제되었습니다.');
        if (isReply && parentCommentId) {
          // 답글 삭제 시 상위 댓글의 replies 배열에서 해당 답글 제거
          setPost((prevPost) => ({
            ...prevPost,
            comments: prevPost.comments.map((parentComment) =>
              parentComment.id === parentCommentId
                ? {
                    ...parentComment,
                    replies: parentComment.replies.filter(
                      (reply) => reply.id !== comment.id
                    ),
                  }
                : parentComment
            ),
          }));
        } else {
          // 일반 댓글 삭제 시 댓글 목록에서 해당 댓글 제거
          setPost((prevPost) => ({
            ...prevPost,
            comments: prevPost.comments.filter((c) => c.id !== comment.id),
          }));
        }
      } else {
        alert('댓글 삭제에 실패했습니다.');
      }
    } catch (error) {
      console.error('댓글 삭제 중 오류 발생:', error);
      alert('댓글 삭제에 실패했습니다.');
    }
  };

  // 댓글 제출 함수
  const submitComment = async () => {
    if (newComment.trim()) {
      console.log('새 댓글:', newComment);
      setNewComment(''); // 댓글 작성 후 초기화
      try {
        const response = await axios.post(`/api/comments/create`, {
          content: newComment,
          authorId: session?.user.id,
          password: anonymousPassword,
          postId: id,
        })
        if(response.status === 201){
          const createdComment = response.data;
          console.log(createdComment.newComment);
          setPost((prevPost) => ({
            ...prevPost,
            comments: [...(prevPost.comments || []), createdComment.newComment], // 새로운 댓글을 댓글 목록에 추가
          }));
          console.log(post);
        } else {
          console.log('댓글 등록 실패:', response.data);
        }
      } catch (error) {
        if(error.response.data.error){
          alert(error.response.data.error);
        }
        console.log('댓글을 등록하는 중 오류 발생:', error);
      }
    }
  };

  // 답글 제출 함수
  const submitReply = async (commentId) => {
    if (newReply[commentId]?.trim()) {
      console.log('새 답글:', newReply[commentId]);
      try {
        const response = await axios.post(`/api/comments/create`, {
          content: newReply[commentId],
          authorId: session?.user.id,
          password: newReplyPassword[commentId],
          postId: id,
          parentId: commentId,
        });

        if (response.status === 201) {
          const createdReply = response.data.newComment;
          setPost((prevPost) => ({
            ...prevPost,
            comments: prevPost.comments.map((comment) =>
              comment.id === commentId
                ? {
                    ...comment,
                    replies: [...(comment.replies || []), createdReply], // replies가 없을 경우 빈 배열로 초기화
                  }
                : comment
            ),
          }));
        } else {
          console.log('답글 등록 실패:', response.data);
        }
      } catch (error) {
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        }
        console.log('답글을 등록하는 중 오류 발생:', error);
      }

      setNewReply((prev) => ({ ...prev, [commentId]: '' })); // 답글 작성 후 초기화
    }
  };

  const handleDelete = async () => {
    let password = null;
    if (!post.author) {
      password = prompt("비밀번호를 입력하세요");
      if (!password) {
        return;
      }
    }
    if (isAuthor) {
      const confirmed = confirm("정말로 게시글을 삭제하시겠습니까?");
      if (!confirmed) {
        return;
      }
    }
    try {
      const response = await axios.post(`/api/posts/${id}/delete`, { password });
      if (response.data.success) {
        alert("게시글이 삭제되었습니다.");
        router.push('/posts');
      } else {
        alert("비밀번호가 틀렸습니다.");
      }
    } catch (error) {
      console.error('삭제 요청 중 오류 발생:', error);
      alert("삭제에 실패했습니다.");
    }
  };

  const handleEdit = async () => {
    if (!post.author) {
      const password = prompt("비밀번호를 입력하세요");
      if (!password) {
        return;
      }
      try {
        const response = await axios.post(`/api/posts/${id}/check-password`, { password });
        if (response.data.success) {
          const { token } = response.data;
          router.push(`/post/edit/${id}?token=${token}`);
        } else {
          alert("비밀번호가 틀렸습니다.");
        }
      } catch (error) {
        console.error('비밀번호 검증 중 오류 발생:', error);
        alert("비밀번호 검증에 실패했습니다.");
      }
    } else {
      router.push(`/post/edit/${id}`);
    }
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  if (!post) {
    return <p>로딩 중...</p>;
  }

  const isAuthor = session && post.author && session.user.id === post.author.id;

  return (
    <div className={`min-h-screen p-6 ${theme === 'dark' ? 'bg-[var(--background-color)] text-[var(--text-primary)]' : 'bg-[var(--background-color)] text-[var(--text-primary)]'}`}>
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
      <div onClick={() => {router.push("/")}} className="logo hover:text-blue-500 cursor-pointer text-xl font-bold transition-colors duration-300">개발 게시판</div>
        <button className="theme-toggle p-2 bg-[var(--toggle-bg)] text-white rounded-lg" onClick={toggleTheme}>
          {theme === 'dark' ? '라이트 모드' : '다크 모드'}
        </button>
      </header>
  
      {/* Navigation */}
      <nav className="mb-6">
        <div className="flex space-x-4 text-lg">
          <Link href="/" className="hover:underline">
            홈
          </Link>
          <Link href="/posts" className="hover:underline">
            모든 글
          </Link>
        </div>
      </nav>
  
      {/* Post Detail */}
      <section>
        <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
  
        <div className="text-sm text-[var(--views-color)] mb-4">
          <p>작성 시간: {new Date(post.createdAt).toLocaleString('ko-KR', timeData)}</p>
          {post.updatedAt && (
            <p>수정됨: {new Date(post.updatedAt).toLocaleString('ko-KR', timeData)}</p>
          )}
        </div>
  
        <div className={`post-detail p-4 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] border border-[var(--card-border-dark)]' : 'bg-[var(--card-bg)] shadow-md'}`}>
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: post.content }} />
        {/* 작성자 정보 */}
        <div className="relative">
          <p
            onClick={handleAuthorClick}
            className={`mt-4 text-lg font-bold cursor-pointer transition-colors duration-300 ${
    theme === 'dark'
      ? `text-gray-300 ${post.author?.nickname ? 'hover:text-blue-400' : ''}`
      : `text-gray-700 ${post.author?.nickname ? 'hover:text-blue-600' : ''}`
  }`}
          >
            작성자: {post.author?.nickname || '익명'}
          </p>
          {/* 작성자 메뉴 */}
          {isMenuOpen && post.author?.nickname && (
            <div className={`absolute mt-2 p-2 border rounded-lg shadow-lg transition-colors duration-300 ${theme === 'dark' ? 'bg-gray-800 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-700'}`}>
              <ul>
                <li
                  onClick={() => router.push(`/posts?user=${post.authorId}`)}
                  className="cursor-pointer p-2 hover:bg-blue-100 dark:hover:bg-blue-600"
                >
                  작성자 글 보기
                </li>
                {session?.user?.id && (
                <li
                onClick={() => router.push(`/posts?user=${post.authorId}`)}
                className="cursor-pointer p-2 hover:bg-blue-100 dark:hover:bg-blue-600"
              >
                쪽지 보내기
              </li>
                )}

              </ul>
            </div>
          )}
        </div>
          
          <p className="mt-2 text-sm text-[var(--views-color)]">조회수: {post.views}</p>
        </div>
        {/* 공개된 사용자 정보 표시 */}
      {post.isPrivate && post.viewers?.length > 0 && (
        <div className={`mt-4 p-4 rounded-lg shadow-lg ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] border border-[var(--card-border-dark)]' : 'bg-[var(--card-bg)] border-[var(--card-border)]'}`}>
          <h4 className="text-lg font-semibold mb-2">공개된 사용자:</h4>
          <ul className="list-disc ml-6 space-y-1">
            {post.viewers.map((viewer) => (
              <li key={viewer.id} className="text-sm">
                {viewer.nickname || '익명'}
              </li>
            ))}
          </ul>
        </div>
      )}
      </section>
  
      {/* 댓글 섹션 */}
      <section className="comments-section mt-6">
        <h3 className="text-xl font-bold mb-4">댓글</h3>
  
        {/* 댓글 리스트 */}
        <div className="comments-list space-y-4">
          {post.comments?.map((comment) => (
            <div
              key={comment.id}
              className={`comment p-4 rounded-lg ${theme === 'dark' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)]' : 'bg-[var(--card-bg)] border'}`}
            >
              <div className="comment-meta mb-2 text-sm text-[var(--author-color)]">
                <span className="font-semibold">{comment.author?.nickname || '익명'}</span>
                <span className="ml-2"> • {new Date(comment.createdAt).toLocaleString('ko-KR', timeData)}</span>
              </div>
  
              {/* 댓글 내용 */}
              {editingCommentId === comment.id ? (
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className={`w-full p-2 rounded-lg ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] text-[var(--text-primary)]' : 'bg-white text-black'} border`}
                  placeholder="댓글을 수정하세요"
                ></textarea>
              ) : (
                <p className="comment-content text-lg">{comment.content}</p>
              )}
  
              {/* 수정된 경우 수정 날짜 표시 */}
              {comment.updatedAt && (
                <p className="text-sm text-gray-500 mt-2">
                  (수정됨: {new Date(comment.updatedAt).toLocaleString('ko-KR', timeData)})
                </p>
              )}
  
              {/* 댓글 수정 및 삭제 버튼 */}
              <div className="flex justify-between items-center mt-2">
                <div className="text-sm text-blue-500 cursor-pointer hover:underline" onClick={() => toggleReplyForm(comment.id)}>
                  답글 달기
                </div>
  
                {(comment.authorId === null || comment.authorId === session?.user?.id) && (
                  <div className="flex space-x-4 text-sm text-blue-500 cursor-pointer">
                    {editingCommentId === comment.id ? (
                      <>
                        <span className="hover:underline" onClick={() => handleUpdateCommentOrReply(comment.authorId)}>저장</span>
                        <span className="hover:underline" onClick={handleCancelEdit}>취소</span>
                      </>
                    ) : (
                      <span className="hover:underline" onClick={() => handleEditComment(comment)}>수정</span>
                    )}
                    <span className="hover:underline" onClick={() => handleDeleteComment(comment)}>삭제</span>
                  </div>
                )}
              </div>
  
              {/* 답글 폼 */}
              {isReplyFormVisible === comment.id && (
                <div className="reply-form mt-2">
                  <textarea
                    value={newReply[comment.id] || ''}
                    onChange={(e) =>
                      setNewReply((prev) => ({
                        ...prev,
                        [comment.id]: e.target.value,
                      }))
                    }
                    className={`w-full p-2 rounded-lg ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] text-[var(--text-primary)]' : 'bg-white text-black'} border`}
                    placeholder="답글을 입력하세요"
                  ></textarea>
  
                  {!session && (
                    <input
                      type="password"
                      value={newReplyPassword[comment.id] || ''}
                      onChange={(e) =>
                        setNewReplyPassword((prev) => ({
                          ...prev,
                          [comment.id]: e.target.value,
                        }))
                      }
                      className={`mt-2 w-full p-2 rounded-lg ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] text-[var(--text-primary)]' : 'bg-white text-black'} border`}
                      placeholder="비밀번호를 입력하세요"
                    />
                  )}
  
                  <button
                    className="mt-2 px-4 py-2 bg-[var(--button-bg)] text-white rounded-lg hover:bg-[var(--button-hover-bg)] transition"
                    onClick={() => submitReply(comment.id)}
                  >
                    답글 작성
                  </button>
                </div>
              )}
  
              {/* 답글 리스트 */}
              {comment.replies?.length > 0 && (
                <div className="replies-list mt-4 space-y-4 ml-4">
                  {comment.replies.map((reply) => (
                    <div
                      key={reply.id}
                      className={`reply p-4 rounded-lg ${theme === 'dark' ? 'bg-[var(--card-bg)] text-[var(--text-primary)] border-[var(--card-border)]' : 'bg-[var(--card-bg)] border'}`}
                    >
                      <div className="reply-meta mb-2 text-sm text-[var(--author-color)]">
                        <span className="font-semibold">{reply.author?.nickname || '익명'}</span>
                        <span className="ml-2"> • {new Date(reply.createdAt).toLocaleString('ko-KR', timeData)}</span>
                      </div>
  
                      {editingReplyId === reply.id ? (
                        <textarea
                          value={editingReplyContent}
                          onChange={(e) => setEditingReplyContent(e.target.value)}
                          className={`w-full p-2 rounded-lg ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] text-[var(--text-primary)]' : 'bg-white text-black'} border`}
                          placeholder="답글을 수정하세요"
                        ></textarea>
                      ) : (
                        <p className="reply-content text-base">{reply.content}</p>
                      )}
  
                      {reply.updatedAt && (
                        <p className="text-sm text-gray-500 mt-2">
                          (수정됨: {new Date(reply.updatedAt).toLocaleString('ko-KR', timeData)})
                        </p>
                      )}
  
                      <div className="flex space-x-4 text-sm text-blue-500 cursor-pointer mt-2">
                        {editingReplyId === reply.id ? (
                          <>
                            <span className="hover:underline" onClick={() => handleUpdateCommentOrReply(reply.authorId, true, comment.id)}>저장</span>
                            <span className="hover:underline" onClick={handleCancelEditReply}>취소</span>
                          </>
                        ) : (
                          <span className="hover:underline" onClick={() => handleEditReply(reply)}>수정</span>
                        )}
                        <span className="hover:underline" onClick={() => handleDeleteComment(reply, true, comment.id)}>삭제</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
  
        {/* 새로운 댓글 작성 폼 */}
        <div className="new-comment mt-6">
          <h4 className="text-lg font-semibold mb-2">댓글 작성</h4>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className={`w-full p-4 rounded-lg ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] text-[var(--text-primary)]' : 'bg-white text-black'} border`}
            placeholder="댓글을 입력하세요"
          ></textarea>
  
          {!session && (
            <input
              type="password"
              value={anonymousPassword}
              onChange={(e) => setAnonymousPassword(e.target.value)}
              className={`mt-2 w-full p-2 rounded-lg ${theme === 'dark' ? 'bg-[var(--card-bg-dark)] text-[var(--text-primary)]' : 'bg-white text-black'} border`}
              placeholder="비밀번호를 입력하세요"
            />
          )}
  
          <button
            className="mt-4 px-4 py-2 bg-[var(--button-bg)] text-white rounded-lg hover:bg-[var(--button-hover-bg)] transition"
            onClick={submitComment}
          >
            댓글 작성
          </button>
        </div>
      </section>
  
      {/* Footer Buttons */}
      <footer className="mt-6">
        {(isAuthor || !post.author) && (
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover-bg)] transition" onClick={handleDelete}>
              삭제하기
            </button>
            <button className="px-4 py-2 bg-[var(--button-bg)] text-[var(--button-text)] rounded-lg hover:bg-[var(--button-hover-bg)] transition" onClick={handleEdit}>
              수정하기
            </button>
          </div>
        )}
      </footer>
    </div>
  );
}