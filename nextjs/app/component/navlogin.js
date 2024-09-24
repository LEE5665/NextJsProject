'use client';

import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function Auth() {
  const router = useRouter();
  const { theme } = useTheme();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [todayTasks, setTodayTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [newTask, setNewTask] = useState({ name: "", date: "", description: [] });
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState("todo");
  const [showToDoList, setShowToDoList] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editedTask, setEditedTask] = useState({ id: null, name: "", date: "", description: [] });
  const [currentPage, setCurrentPage] = useState(1);
  const tasksPerPage = 5;
  const [latestTask, setLatestTask] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (page = 1) => {
    try {
      const response = await axios.get(`/api/todo/list?page=${page}&limit=${tasksPerPage}`);
      if (response.status === 200) {
        const { todos, todayTodos, totalTodos, latestTask } = response.data;

        setTotalPages(Math.ceil(totalTodos / tasksPerPage));

        const todayParsedData = todayTodos.map(task => ({
          ...task,
          description: task.description ? JSON.parse(task.description) : []
        }));

        const parsedData = todos.map(task => ({
          ...task,
          description: task.description ? JSON.parse(task.description) : []
        }));

        if (latestTask) {
          setLatestTask(latestTask);
        }

        setTodayTasks(todayParsedData);
        setTasks(parsedData);
      }
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
    }
  };

  const handleRemoveDescription = (indexToRemove, isEdit = false) => {
    if (isEdit) {
      setEditedTask(prev => ({
        ...prev,
        description: prev.description.filter((_, i) => i !== indexToRemove)
      }));
    } else {
      setNewTask(prev => ({
        ...prev,
        description: prev.description.filter((_, i) => i !== indexToRemove)
      }));
    }
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`mx-1 px-2 py-1 rounded ${currentPage === i ? 'bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800 transition-transform transition-shadow whitespace-nowrap flex-shrink-0' : 'bg-gray-300 text-gray-700'}`}
          onClick={() => {
            setCurrentPage(i);
            fetchData(i);
          }}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  const changePage = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      fetchData(page);
    }
  };

  const serverUpdateCheckbox = async (taskId, index, text, checked, isTodayTask = false) => {
    const targetList = isTodayTask ? todayTasks : tasks;
    const updatedTasks = targetList.map(task =>
      task.id === taskId
        ? {
          ...task,
          description: task.description.map((item, i) =>
            i === index ? { ...item, text, checked } : item
          ),
        }
        : task
    );

    if (isTodayTask) {
      setTodayTasks(updatedTasks);
    } else {
      setTasks(updatedTasks);
    }

    try {
      const response = await axios.put(`/api/todo/list`, {
        id: taskId,
        description: updatedTasks.find(task => task.id === taskId).description,
      });
      if (response.status === 200) {
        console.log("체크박스 업데이트 성공!");
      }
    } catch (error) {
      console.error("체크박스 업데이트 실패:", error);
    }
  };

  const toggleTab = (tabName) => {
    setActiveTab(tabName);
  };

  const addTask = async () => { // && newTask.description.length > 0
    if (newTask.name && newTask.date) {
      try {
        const response = await axios.post("/api/todo/create", newTask);
        if (response.status === 200) {
          console.log("할 일 추가 성공!");
          setNewTask({ name: "", date: "", description: [] });
          setShowForm(false);
          fetchData();
        }
      } catch (error) {
        if (error.response?.data?.error) {
          alert(error.response.data.error);
        }
        console.error("할 일 추가 실패:", error);
      }
    } else {
      alert("제목, 날짜를 입력 해 주세요.");
    }
  };

  const editTask = async (taskId, updatedTask) => {
    if (updatedTask.title && updatedTask.date) {
      try {
        const response = await axios.put("/api/todo/edit", {
          id: taskId,
          title: updatedTask.title,
          description: updatedTask.description,
          date: updatedTask.date,
        });
        if (response.status === 200) {
          console.log("할 일 수정 성공!");
          setShowEditForm(false);
          fetchData();
        }
      } catch (error) {
        console.error("할 일 수정 실패:", error);
      }
    } else {
      alert("제목, 날짜를 입력 해 주세요.");
    }
  };

  const addCheckbox = (isEdit = false) => {
    if (isEdit) {
      setEditedTask(prev => ({
        ...prev,
        description: [...prev.description, { text: "", checked: false }],
      }));
    } else {
      setNewTask(prev => ({
        ...prev,
        description: [...prev.description, { text: "", checked: false }],
      }));
    }
  };

  const updateCheckbox = (index, text, checked, isEdit = false) => {
    if (isEdit) {
      const updatedDescription = editedTask.description.map((item, i) =>
        i === index ? { ...item, text, checked } : item
      );
      setEditedTask(prev => ({ ...prev, description: updatedDescription }));
    } else {
      const updatedDescription = newTask.description.map((item, i) =>
        i === index ? { ...item, text, checked } : item
      );
      setNewTask(prev => ({ ...prev, description: updatedDescription }));
    }
  };

  const deleteTask = async (taskId, type) => {
    try {
      const response = await axios.delete("/api/todo/list", { data: { id: taskId } });
      if (response.status === 200) {
        console.log("할 일 삭제 성공!");
        if (type === "todo") {
          setTodayTasks(prev => prev.filter(task => task.id !== taskId));
        } else {
          setTasks(prev => prev.filter(task => task.id !== taskId));
        }
      }
    } catch (error) {
      console.error("할 일 삭제 실패:", error);
    }
  };

  if (status === "loading") {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (!session) {
    return (
      <div className="auth-buttons">
        <Link href="/login"><button>로그인</button></Link>
        <Link href="/signup"><button>회원가입</button></Link>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 상단 바 */}
      <div className="flex justify-between items-center mb-1">
        {/* To-Do List 버튼 */}
        <button
          className={`flex items-center px-1 py-1 rounded-lg text-base transition duration-300 hover:text-blue-500 mr-4`}
          onClick={() => setShowToDoList(!showToDoList)}
        >
          To-Do List
          <svg
            className={`ml-1 w-3 h-8 transition-transform duration-300 ${showToDoList ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        {/* 환영 메시지 버튼 */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className={`flex items-center px-1 py-1 rounded-lg text-base transition duration-300 hover:text-blue-500`}
        >
          {`${session.user.nickname}님 환영합니다!`}
          <svg
            className={`ml-1 w-3 h-8 transition-transform duration-300 ${menuOpen ? 'rotate-180' : ''}`}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className={`absolute right-0 mt-2 w-40 rounded-md shadow-lg z-50 transition-colors duration-300 ${theme === 'dark'
          ? 'bg-gray-800 border border-gray-700 text-white'
          : 'bg-white border border-gray-200 text-gray-700'
          }`}
        >
          <button
            onClick={() => router.push('/mypage')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
          >
            마이페이지
          </button>
          <button
            onClick={() => router.push('/note')}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-t-md"
          >
            쪽지 확인
          </button>
          <button
            onClick={() => signOut()}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-b-md"
          >
            로그아웃
          </button>
        </div>
      )}

      {/* To-Do List */}
      {showToDoList && (
  <div className="absolute right-4 top-16 bg-[var(--card-bg)] p-6 rounded-lg shadow-lg z-50 w-96 transition-colors duration-300">
    {/* 할 일 추가 버튼과 최근 추가 목록 버튼을 한 줄로 배치 */}
    <div className="flex justify-between items-center mb-4 space-x-4">
      <button
        className="flex-1 bg-[var(--button-bg)] text-[var(--button-text)] px-4 py-2 rounded hover:bg-[var(--button-hover-bg)] transition-transform transition-shadow"
        onClick={() => {
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          const formattedDate = tomorrow.toISOString().split("T")[0];
          setNewTask({ ...newTask, date: formattedDate });
          setShowForm(true);
        }}
      >
        + 할 일 추가
      </button>
      
      <button
        className="flex-1 bg-[var(--button-bg)] text-[var(--button-text)] px-4 py-2 rounded hover:bg-[var(--button-hover-bg)] transition-transform transition-shadow"
        onClick={() => {
          if (latestTask) {
            setNewTask({
              name: latestTask.title,
              date: latestTask.date ? new Date(latestTask.date).toISOString().split("T")[0] : "",
              description: latestTask.description ? JSON.parse(latestTask.description) : []
            });
          }
          setShowForm(true);
        }}
      >
        최근 추가한 항목
      </button>
    </div>

          {/* 할 일 추가 폼 */}
          {showForm && (
            <div className="mb-4 border border-[var(--card-border)] p-4 rounded-lg bg-[var(--card-bg)]">
              <input
                type="text"
                placeholder="이름"
                value={newTask.name}
                onChange={(e) => setNewTask({ ...newTask, name: e.target.value })}
                className="border p-2 mb-2 w-full rounded bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition"
              />
              <input
                type="date"
                value={newTask.date}
                onChange={(e) => setNewTask({ ...newTask, date: e.target.value })}
                className="border p-2 mb-2 w-full rounded bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition"
              />
              {newTask.description.map((item, index) => (
                <div key={index} className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    onChange={(e) => updateCheckbox(index, item.text, e.target.checked)}
                    className="mr-2"
                  />
                  <input
                    type="text"
                    value={item.text}
                    onChange={(e) => updateCheckbox(index, e.target.value, item.checked)}
                    className="border p-2 w-full rounded bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition"
                    placeholder="내용 입력"
                  />
                  <button
                    onClick={() => handleRemoveDescription(index)}
                    className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-transform transition-shadow whitespace-nowrap flex-shrink-0"
                  >
                    제거
                  </button>
                </div>
              ))}

              {/* 체크리스트 추가 버튼 */}
              {/* 체크리스트 추가 및 저장 취소 버튼 레이아웃 */}
              <div className="flex justify-between items-center mb-4">
                {/* 체크리스트 추가 버튼 */}
                <button
                  onClick={() => addCheckbox(false)}
                  className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800 transition-transform transition-shadow"
                >
                  + 체크리스트 추가
                </button>

                {/* 저장 및 취소 버튼 */}
                <div className="flex space-x-2">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-transform transition-shadow"
                    onClick={() => {
                      setShowForm(false);
                      setNewTask({ name: "", date: "", description: [] });
                    }}
                  >
                    취소
                  </button>
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-transform transition-shadow"
                    onClick={addTask}
                  >
                    저장
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 탭 버튼 - 변경된 부분 */}
          <div className="tabs flex justify-between text-sm font-medium text-center text-gray-500 border-b mb-4">
            <button
              className={`tab flex-1 p-4 hover:text-blue-600 ${activeTab === 'todo' ? 'text-blue-600':''}`} //${activeTab === 'todo' ? 'text-blue-600 border-blue-600 border-b-2' : ''}
              onClick={() => toggleTab('todo')}
            >
              오늘 할 일
            </button>
            <button
              className={`tab flex-1 p-4 hover:text-blue-600 ${activeTab === 'completed' ? 'text-blue-600':''}`} //${activeTab === 'completed' ? 'text-blue-600 border-blue-600 border-b-2' : ''}
              onClick={() => toggleTab('completed')}
            >
              미리 설정
            </button>
          </div>
          {/* 탭 버튼 - 변경된 부분 끝 */}

          {/* 오늘 할 일 목록 */}
          {activeTab === "todo" && (
            <ul>
              {todayTasks.length > 0 ? (
                todayTasks.map((task, index) => (
                  <li key={index} className="border-b border-[var(--card-border)] p-2 flex flex-col">
                    {showEditForm && editedTask.id === task.id ? (
                      // 수정 모드
                      <div className="mb-4">
                        <input
                          type="text"
                          value={editedTask.title}
                          onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                          className="border p-2 mb-2 w-full rounded bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition"
                        />
                        <input
                          type="date"
                          value={editedTask.date ? new Date(editedTask.date).toISOString().split("T")[0] : ""}
                          onChange={(e) => setEditedTask({ ...editedTask, date: e.target.value })}
                          className="border p-2 mb-2 w-full rounded bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition"
                        />
                        {editedTask.description.map((desc, i) => (
                          <div key={i} className="flex items-center mb-2">
                            <input
                              type="checkbox"
                              checked={desc.checked}
                              onChange={(e) => {
                                const updatedDescription = editedTask.description.map((d, j) =>
                                  i === j ? { ...d, checked: e.target.checked } : d
                                );
                                setEditedTask({ ...editedTask, description: updatedDescription });
                              }}
                              className="mr-2"
                            />
                            <input
                              type="text"
                              value={desc.text}
                              onChange={(e) => {
                                const updatedDescription = editedTask.description.map((d, j) =>
                                  i === j ? { ...d, text: e.target.value } : d
                                );
                                setEditedTask({ ...editedTask, description: updatedDescription });
                              }}
                              className="border p-2 w-full rounded bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition"
                              placeholder="내용 입력"
                            />
                            <button
                              onClick={() => handleRemoveDescription(i, true)}
                              className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-transform transition-shadow whitespace-nowrap flex-shrink-0"
                            >
                              제거
                            </button>
                          </div>
                        ))}

                        <div className="flex justify-between items-center mb-4">
                          {/* 체크리스트 추가 버튼 */}
                          <button
                            onClick={() => addCheckbox(true)}
                            className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800 transition-transform transition-shadow"
                          >
                            + 체크리스트 추가
                          </button>

                          {/* 저장 및 취소 버튼 */}
                          <div className="flex space-x-2">
                            <button
                              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-transform transition-shadow"
                              onClick={() => setShowEditForm(false)}
                            >
                              취소
                            </button>
                            <button
                              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-transform transition-shadow"
                              onClick={() => {
                                editTask(editedTask.id, editedTask);
                              }}
                            >
                              저장
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      // 기본 상태
                      <div className="flex justify-between items-center">
                        <div>
                          <strong>{task.title}</strong> - 오늘
                          <br />
                          {task.description && task.description.map((desc, i) => (
                            <div key={i} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={desc.checked}
                                onChange={(e) => serverUpdateCheckbox(task.id, i, desc.text, e.target.checked, true)}
                                className="mr-2"
                              />
                              <span className={`${desc.checked ? "line-through text-[var(--text-secondary)]" : ""}`}>
                                {desc.text}
                              </span>
                            </div>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <button
                            className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800 transition-transform transition-shadow whitespace-nowrap flex-shrink-0"
                            onClick={() => {
                              setEditedTask(task);
                              setShowEditForm(true);
                            }}
                          >
                            수정
                          </button>
                          <button
                            className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800 transition-transform transition-shadow whitespace-nowrap flex-shrink-0"
                            onClick={() => deleteTask(task.id, "todo")}
                          >
                            삭제
                          </button>
                        </div>
                      </div>
                    )}
                  </li>
                ))
              ) : (
                <li>오늘 할 일이 없습니다.</li>
              )}
            </ul>
          )}

          {/* 할 일 설정 목록 */}
          {activeTab === "completed" && (
            <div>
              <ul>
                {tasks.length > 0 ? (
                  tasks.map((task, index) => (
                    <li key={index} className="border-b border-[var(--card-border)] p-2 flex flex-col">
                      {showEditForm && editedTask.id === task.id ? (
                        // 수정 모드
                        <div className="mb-4">
                          <input
                            type="text"
                            value={editedTask.title}
                            onChange={(e) => setEditedTask({ ...editedTask, title: e.target.value })}
                            className="border p-2 mb-2 w-full rounded bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition"
                          />
                          <input
                            type="date"
                            value={editedTask.date ? new Date(editedTask.date).toISOString().split("T")[0] : ""}
                            onChange={(e) => setEditedTask({ ...editedTask, date: e.target.value })}
                            className="border p-2 mb-2 w-full rounded bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition"
                          />
                          {editedTask.description.map((desc, i) => (
                            <div key={i} className="flex items-center mb-2">
                              <input
                                type="checkbox"
                                checked={desc.checked}
                                onChange={(e) => {
                                  const updatedDescription = editedTask.description.map((d, j) =>
                                    i === j ? { ...d, checked: e.target.checked } : d
                                  );
                                  setEditedTask({ ...editedTask, description: updatedDescription });
                                }}
                                className="mr-2"
                              />
                              <input
                                type="text"
                                value={desc.text}
                                onChange={(e) => {
                                  const updatedDescription = editedTask.description.map((d, j) =>
                                    i === j ? { ...d, text: e.target.value } : d
                                  );
                                  setEditedTask({ ...editedTask, description: updatedDescription });
                                }}
                                className="border p-2 w-full rounded bg-[var(--card-bg)] text-[var(--text-primary)] focus:outline-none focus:border-[var(--primary-color)] transition"
                                placeholder="내용 입력"
                              />
                              <button
                                onClick={() => handleRemoveDescription(i, true)}
                                className="ml-2 bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition-transform transition-shadow whitespace-nowrap flex-shrink-0"
                              >
                                제거
                              </button>
                            </div>
                          ))}

                          <div className="flex justify-between items-center mb-4">
                            {/* 체크리스트 추가 버튼 */}
                            <button
                              onClick={() => addCheckbox(true)}
                              className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800 transition-transform transition-shadow"
                            >
                              + 체크리스트 추가
                            </button>

                            {/* 저장 및 취소 버튼 */}
                            <div className="flex space-x-2">
                              <button
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-transform transition-shadow"
                                onClick={() => setShowEditForm(false)}
                              >
                                취소
                              </button>
                              <button
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 transition-transform transition-shadow"
                                onClick={() => {
                                  editTask(editedTask.id, editedTask);
                                }}
                              >
                                저장
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // 기본 상태
                        <div className="flex justify-between items-center">
                          <div>
                            <strong>{task.title}</strong> - {new Date(task.date).toLocaleDateString("ko-KR")}
                            <br />
                            {task.description && task.description.map((desc, i) => (
                              <div key={i} className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={desc.checked}
                                  onChange={(e) => serverUpdateCheckbox(task.id, i, desc.text, e.target.checked)}
                                  className="mr-2"
                                />
                                <span className={`${desc.checked ? "line-through text-[var(--text-secondary)]" : ""}`}>
                                  {desc.text}
                                </span>
                              </div>
                            ))}
                          </div>
                          <div className="flex space-x-2">
                            <button
                              className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800 transition-transform transition-shadow whitespace-nowrap flex-shrink-0"
                              onClick={() => {
                                setEditedTask(task);
                                setShowEditForm(true);
                              }}
                            >
                              수정
                            </button>
                            <button
                              className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800 transition-transform transition-shadow whitespace-nowrap flex-shrink-0"
                              onClick={() => deleteTask(task.id, "completed")}
                            >
                              삭제
                            </button>
                          </div>
                        </div>
                      )}
                    </li>
                  ))
                ) : (
                  <li>설정한 할 일이 없습니다.</li>
                )}
              </ul>

              {/* 페이지네이션 */}
              <div className="flex justify-between mt-4">
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-900 transition-transform transition-shadow whitespace-nowrap flex-shrink-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={() => changePage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  이전
                </button>
                <div className="flex space-x-1">
                  {renderPageNumbers()}
                </div>
                <button
                  className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800 dark:bg-gray-800 dark:hover:bg-gray-900 transition-transform transition-shadow whitespace-nowrap flex-shrink-0 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={() => changePage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  다음
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};