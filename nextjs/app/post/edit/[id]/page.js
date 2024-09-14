'use client'

import { useRouter } from 'next/navigation.js';
import { useEffect, useState } from 'react';
import NoticeEditor from '../../../post/page.js'; // NoticeEditor 컴포넌트 불러오기
import axios from 'axios';

export default function EditPostPage( {params, searchParams} ) {
  const router = useRouter();
  const { id } = params;
  const [postToEdit, setPostToEdit] = useState(null);

  useEffect(() => {
    if (id) {
      // 게시글 ID로 기존 게시글 데이터 가져오기
      axios.get(`/api/posts/${id}`)
        .then((response) => {
          setPostToEdit(response.data);
        })
        .catch((error) => {
          console.error("게시글 데이터를 가져오는 중 오류 발생:", error);
        });
    }
  }, [id]);

  // 데이터가 로드되기 전 로딩 중 상태 표시
  if (!postToEdit) return <div>로딩 중...</div>;

  return (
    <div>
      <NoticeEditor postToEdit={postToEdit} token={searchParams.token} /> {/* 수정 모드로 Editor에 데이터 전달 */}
    </div>
  );
}
