'use client';
import { useState, useMemo, useRef, useEffect } from "react";
import dynamic from "next/dynamic";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import { useTheme } from "next-themes";
import Link from "next/link";
import Header from "../posts/Header";

// 동적으로 ReactQuill 가져오기
const ReactQuill = dynamic(async () => {
  const { default: RQ } = await import("react-quill");
  return function comp({ forwardedRef, ...props }) {
    return <RQ ref={forwardedRef} {...props} />;
  };
}, { ssr: false });

export default function NoticeEditor({ postToEdit = null, token }) {
  const { data: session } = useSession();
  const { theme, setTheme } = useTheme();
  const [navActive, setNavActive] = useState(false); // 메뉴 상태
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('title');
  const [password, setPassword] = useState("");

  // 게시글 데이터 상태 관리
  const [content, setContent] = useState(postToEdit ? postToEdit.content : "");
  const [title, setTitle] = useState(postToEdit ? postToEdit.title : "");
  const [tags, setTags] = useState([]);
  const [newTag, setNewTag] = useState("");
  const [isPrivate, setIsPrivate] = useState(postToEdit ? postToEdit.isPrivate : false);
  const [viewers, setViewers] = useState([]);
  const [newViewer, setNewViewer] = useState("");
  const quillRef = useRef();

  // 기존 게시글 수정 시 태그와 사용자 설정
  useEffect(() => {
    if (postToEdit && postToEdit.tags) {
      setTags(postToEdit.tags.map(tag => tag.name));
    }
    if (postToEdit && postToEdit.viewers) {
      setViewers(postToEdit.viewers.map(viewer => viewer.nickname));
    }
    if (postToEdit && postToEdit.isPrivate) {
      setIsPrivate(postToEdit.isPrivate);
    }
  }, [postToEdit]);

  // 이미지 업로드 처리 함수
  const handleImageUpload = async () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files[0];
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64Image = reader.result;
        const quillEditor = quillRef.current.getEditor();
        const range = quillEditor.getSelection();
        quillEditor.insertEmbed(range.index, "image", base64Image);
        quillEditor.setSelection(range.index + 1);
      };

      reader.onerror = (error) => {
        console.error("이미지 변환 중 오류 발생:", error);
      };
    };
  };

  // Quill의 모듈과 포맷 설정
  const modules = useMemo(() => ({
    toolbar: {
      container: [
        [{ size: ["small", false, "large", "huge"] }],
        [{ align: [] }],
        ["bold", "italic", "underline", "strike"],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ color: [] }, { background: [] }],
        ["image"]
      ],
      handlers: {
        image: handleImageUpload
      }
    }
  }), []);

  // 게시글 저장 핸들러
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = content;
      const images = tempDiv.querySelectorAll("img");

      const imagePromises = Array.from(images).map(async (img) => {
        const base64 = img.src;
        if (base64.startsWith("data:image")) {
          const formData = new FormData();
          const blob = await fetch(base64).then((res) => res.blob());
          formData.append("file", blob, "image.png");

          const response = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" }
          });

          img.src = response.data.url;
        }
      });

      await Promise.all(imagePromises);
      const updatedContent = tempDiv.innerHTML;

      const response = await axios({
        method: postToEdit ? "PUT" : "POST",
        url: postToEdit ? `/api/posts/${postToEdit.id}/edit` : "/api/postcreate",
        data: {
          title,
          content: updatedContent,
          tags,
          isPrivate,
          viewers,
          userId: session?.user?.id || null,
          password: session ? null : password, // 비밀번호 추가
          token: postToEdit ? token : null
        }
      });

      if (response.status === 200 || response.status === 201) {
        alert(postToEdit ? "게시글이 수정되었습니다." : "게시글이 작성되었습니다.");
        router.push("/posts");
      }
    } catch (error) {
      console.log("게시글 처리 중 오류 발생:", error);
    }
  };

  // 태그 추가
  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag) && tags.length < 5) {
      setTags([...tags, newTag]);
      setNewTag("");
    } else if (tags.length >= 5) {
      alert("태그는 최대 5개까지 추가할 수 있습니다.");
    }
  };

  // 사용자 추가
  const handleAddViewer = async () => {
    if (session.user.nickname == newViewer) {
      alert("본인은 추가할 수 없습니다.");
      return;
    }
    if (newViewer && !viewers.includes(newViewer)) {
      try {
        const response = await axios.get(`/api/checkUser?nickname=${newViewer}`);
        if (response.status === 200) {
          setViewers([...viewers, newViewer]);
          setNewViewer("");
        }
      } catch (error) {
        alert("사용자를 찾을 수 없습니다.");
      }
    }
  };

  
  const handleRemoveViewer = (viewerToRemove) => {
    setViewers(viewers.filter(viewer => viewer !== viewerToRemove));
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };


  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 테마 변경 함수
  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // 모바일 네비게이션 토글
  const toggleNavMenu = () => {
    setNavActive(!navActive);
  };

  // const Header = () => (
  //   <>
  //     <header>
  //       <div className="logo">개발 게시판</div>
  //       <Auth />
  //     </header>

  //     <nav>
  //       <button
  //         className="menu-toggle"
  //         id="menuToggle"
  //         aria-label={navActive ? '메뉴 닫기' : '메뉴 열기'}
  //         onClick={toggleNavMenu}
  //       >
  //         ☰
  //       </button>
  //       <div className={`nav-menu ${navActive ? 'active' : ''}`} id="navMenu">
  //         <div className="nav-links">
  //           <Link href="/">홈</Link>
  //           <Link href="/posts">모든 글</Link>
  //           <Link href="/post">게시글 작성</Link>
  //         </div>
  //         <div className="search-bar">
  //           <div className="search-options">
  //             <label>
  //               <input
  //                 type="radio"
  //                 name="search-filter"
  //                 value="title"
  //                 checked={searchFilter === 'title'}
  //                 onChange={(e) => setSearchFilter(e.target.value)}
  //               />
  //               제목
  //             </label>
  //             <label>
  //               <input
  //                 type="radio"
  //                 name="search-filter"
  //                 value="author"
  //                 checked={searchFilter === 'author'}
  //                 onChange={(e) => setSearchFilter(e.target.value)}
  //               />
  //               이름
  //             </label>
  //           </div>
  //           <input
  //             type="text"
  //             placeholder="검색..."
  //             id="searchInput"
  //             aria-label="검색어 입력"
  //             value={searchQuery}
  //             onChange={(e) => setSearchQuery(e.target.value)}
  //             onKeyPress={handleKeyPress}
  //           />
  //           <button
  //             className="search-button"
  //             id="searchButton"
  //             aria-label="검색"
  //             onClick={handleSearch}
  //           >
  //             검색
  //           </button>
  //         </div>
  //         <button className="theme-toggle" id="themeToggle" onClick={toggleTheme} suppressHydrationWarning>
  //           {theme === 'dark' ? '라이트 모드' : '다크 모드'}
  //         </button>
  //       </div>
  //     </nav>
  //   </>
  // );

  const handleSearch = () => {
    if (searchQuery.trim() === '') {
      alert('검색어를 입력해주세요!');
      return;
    }
    alert(`"${searchFilter}" 기준으로 "${searchQuery}" 검색!`);
    // 실제 검색 로직 구현 필요
    // 예: router.push(`/search?filter=${searchFilter}&query=${searchQuery}`);
  };

  // const Auth = () => (
  //   <div className="auth-buttons">
  //     <button id="loginButton">
  //       로그인
  //     </button>
  //     <button id="signupButton">
  //       회원가입
  //     </button>
  //   </div>
  // );

  return (
    <div className="bg-background-color dark:bg-background-color-dark text-text-primary dark:text-text-primary-dark">
      {/* 헤더 및 네비게이션 */}
      <Header />
      <main className="p-8">
        <section>
          <h2 className="text-2xl font-bold border-b-2 pb-2 mb-6">
            {postToEdit ? "게시글 수정하기" : "새로운 글 작성하기"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* 제목 입력 */}
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
              required
              className="w-full p-3 border rounded-lg dark:bg-card-bg-dark dark:border-card-border-dark"
            />
            {/* 내용 입력 (ReactQuill) */}
            <ReactQuill
              forwardedRef={quillRef}
              theme="snow"
              value={content}
              onChange={setContent}
              modules={modules}
              placeholder="내용을 입력하세요"
              className="dark:bg-card-bg-dark dark:text-text-primary-dark mb-12"
              style={{ height: '30rem' }}
            />
            {/* 태그 입력 */}
            <div className="flex flex-col" style={{ marginTop: '3.5rem' }}>
              <div className="flex items-center">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="태그를 입력하세요"
                  className="p-2 border rounded-lg dark:bg-card-bg-dark dark:border-card-border-dark"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="ml-2 bg-[var(--button-bg)] text-[var(--button-text)] px-4 py-2 rounded-full transition-all hover:bg-[var(--button-hover-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] dark:bg-[var(--button-bg)] dark:text-[var(--button-text)] dark:hover:bg-[var(--button-hover-bg)] dark:focus:ring-[var(--secondary-color)]"
                >
                  태그 추가
                </button>
              </div>
              <div className="flex gap-2 mt-2">
                {tags.map((tag, index) => (
                  <button
                    key={index}
                    onClick={() => handleRemoveTag(tag)}
                    className="bg-[var(--tag-bg-color)] text-[var(--tag-text-color)] px-3 py-1 rounded-full text-sm inline-flex items-center transition-all hover:bg-[var(--secondary-color)] hover:text-white dark:bg-[var(--tag-bg-color)] dark:text-[var(--tag-text-color)] dark:hover:bg-[var(--toggle-hover-bg)] dark:hover:text-[var(--toggle-text)]"
                    style={{ cursor: 'pointer' }}
                  >
                    {tag}
                  </button>
                ))}

              </div>
            </div>
            {/* 비공개 설정 */}
            {session && (
              <div className="flex items-center gap-2">
                <label>비공개</label>
                <input
                  type="checkbox"
                  checked={isPrivate}
                  onChange={(e) => setIsPrivate(e.target.checked)}
                  className="h-4 w-4 border rounded dark:bg-card-bg-dark dark:border-card-border-dark"
                />
              </div>
            )}
            {/* 비공개일 경우 사용자 추가 */}
{/* 비공개일 경우 사용자 추가 */}
{session && isPrivate && (
  <div className="flex flex-col">
    <div className="flex items-center">
      <input
        type="text"
        value={newViewer}
        onChange={(e) => setNewViewer(e.target.value)}
        placeholder="사용자 닉네임"
        className="p-2 border rounded-lg dark:bg-card-bg-dark dark:border-card-border-dark"
      />
      <button
        type="button"
        onClick={handleAddViewer}
        className="ml-2 bg-[var(--button-bg)] text-[var(--button-text)] px-4 py-2 rounded-full transition-all hover:bg-[var(--button-hover-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] dark:bg-[var(--button-bg)] dark:text-[var(--button-text)] dark:hover:bg-[var(--button-hover-bg)] dark:focus:ring-[var(--secondary-color)]"
      >
        사용자 추가
      </button>
    </div>
    <div className="flex gap-2 mt-2">
      {viewers.map((viewer, index) => (
        <button
          key={index}
          onClick={() => handleRemoveViewer(viewer)}
          className="bg-[var(--tag-bg-color)] text-[var(--tag-text-color)] px-3 py-1 rounded-full text-sm inline-flex items-center transition-all hover:bg-[var(--secondary-color)] hover:text-white dark:bg-[var(--tag-bg-color)] dark:text-[var(--tag-text-color)] dark:hover:bg-[var(--toggle-hover-bg)] dark:hover:text-[var(--toggle-text)]"
          style={{ cursor: 'pointer' }}
        >
          {viewer}
        </button>
      ))}
    </div>
  </div>
)}

            {/* 비밀번호 입력 (로그인하지 않았고 새 게시물 작성 시) */}
            {!session && !postToEdit && (
              <div className="mt-6">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  비밀번호
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="비밀번호를 입력하세요"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  className="p-2 border rounded-lg dark:bg-card-bg-dark dark:border-card-border-dark"
                />
              </div>
            )}
            <button
              type="submit"
              className="mt-4 bg-[var(--button-bg)] text-[var(--button-text)] px-6 py-3 rounded-lg w-full transition-all hover:bg-[var(--button-hover-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--secondary-color)] dark:bg-[var(--button-bg)] dark:hover:bg-[var(--button-hover-bg)]"
            >
              {postToEdit ? "수정 완료" : "작성 완료"}
            </button>
          </form>
        </section>
      </main>
      <footer className="text-center py-4 bg-footer-bg text-footer-text dark:bg-footer-bg-dark dark:text-footer-text-dark">
        <p>&copy; 2024 개발 게시판. All rights reserved.</p>
      </footer>
    </div>

  );
}
