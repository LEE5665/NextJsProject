'use client';

import { useEffect, useState } from 'react';
import Header from '../posts/Header';
import axios from 'axios';

export default function Messages() {
  const [activeTab, setActiveTab] = useState('received');
  const [expandedMessageId, setExpandedMessageId] = useState(null);
  const [receivedPms, setReceivedPms] = useState([]); // 받은 쪽지
  const [sentPms, setSentPms] = useState([]); // 보낸 쪽지

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await axios.get('/api/post/pm');
        const { receivedPms, sentPms } = response.data; // 받은 쪽지와 보낸 쪽지를 분리
        setReceivedPms(receivedPms || []);
        setSentPms(sentPms || []);
      } catch (error) {
        console.error('쪽지를 가져오는 중 에러 발생:', error);
      }
    };
    fetchMessages();
  }, []);

  const timeData = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  };

  const handleDelete = async (id, role) => {
    try {
      const response = await axios.put('/api/post/pm', {
        id,
        role,
      });

      if (response.status === 200) {
        if (role === 'receiver') {
          setReceivedPms(receivedPms.filter(pm => pm.id !== id));
        } else if (role === 'sender') {
          setSentPms(sentPms.filter(pm => pm.id !== id));
        }
      }
    } catch (error) {
      console.error('쪽지 삭제 중 에러 발생:', error);
      alert("쪽지 삭제 중 문제가 발생했습니다.");
    }
  };

  const toggleExpand = (id) => {
    setExpandedMessageId(expandedMessageId === id ? null : id);
  };

  return (
    <>
      <Header note={true} />

      <main
        className={`min-h-screen p-6 bg-[var(--background-color)] text-[var(--text-primary)] transition-colors duration-300`}
      >
        <div className="max-w-4xl mx-auto">
          {/* 탭 메뉴 */}
          <div className="tabs flex justify-between text-sm font-medium text-center border-b border-[var(--card-border)]">
            <button
              className={`flex-1 p-4 hover:text-[var(--secondary-color)] ${
                activeTab === 'received'
                  ? 'text-[var(--secondary-color)] border-b-2 border-[var(--secondary-color)]'
                  : 'text-[var(--text-secondary)]'
              }`}
              onClick={() => {
                setActiveTab('received');
                setExpandedMessageId(null);
              }}
            >
              내게 온 쪽지
            </button>
            <button
              className={`flex-1 p-4 hover:text-[var(--secondary-color)] ${
                activeTab === 'sent'
                  ? 'text-[var(--secondary-color)] border-b-2 border-[var(--secondary-color)]'
                  : 'text-[var(--text-secondary)]'
              }`}
              onClick={() => {
                setActiveTab('sent');
                setExpandedMessageId(null);
              }}
            >
              내가 보낸 쪽지
            </button>
          </div>

          {/* 내용 영역 */}
          <section className="mt-4">
            {activeTab === 'received' ? (
              receivedPms.length > 0 ? (
                <div className="divide-y divide-[var(--card-border)]">
                  {receivedPms.map((pm) => (
                    <div key={pm.id}>
                      <div
                        className={`flex justify-between items-center cursor-pointer py-4 px-2 hover:bg-[var(--nav-link-hover-bg)] transition-colors duration-300`}
                        onClick={() => toggleExpand(pm.id)}
                      >
                        <span className="text-lg font-semibold text-[var(--text-primary)]">
                          {pm.title}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-[var(--author-color)]">
                          <span>보낸 사람: {pm.sender.nickname}</span>
                          <span> | {new Date(pm.createdAt).toLocaleString('ko-KR', timeData)}</span>
                          <button 
                            onClick={() => handleDelete(pm.id, 'receiver')} 
                            className="ml-4 text-red-600 hover:text-red-800"
                          >
                            X
                          </button>
                        </div>
                      </div>
                      {expandedMessageId === pm.id && (
                        <div className="px-4 pb-4 text-[var(--text-secondary)]">
                          {pm.content}
                        </div>
                      )}
                      <div className="border-b border-[var(--card-border)]"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center my-5 text-[var(--text-secondary)]">
                  받은 쪽지가 없습니다.
                </p>
              )
            ) : activeTab === 'sent' ? (
              sentPms.length > 0 ? (
                <div className="divide-y divide-[var(--card-border)]">
                  {sentPms.map((pm) => (
                    <div key={pm.id}>
                      <div
                        className={`flex justify-between items-center cursor-pointer py-4 px-2 hover:bg-[var(--nav-link-hover-bg)] transition-colors duration-300`}
                        onClick={() => toggleExpand(pm.id)}
                      >
                        <span className="text-lg font-semibold text-[var(--text-primary)]">
                          {pm.title}
                        </span>
                        <div className="flex items-center space-x-4 text-sm text-[var(--author-color)]">
                          <span>받는 사람: {pm.receiver.nickname}</span>
                          <span> | {new Date(pm.createdAt).toLocaleString('ko-KR', timeData)}</span>
                          <button 
                            onClick={() => handleDelete(pm.id, 'sender')} 
                            className="ml-4 text-red-600 hover:text-red-800"
                          >
                            X
                          </button>
                        </div>
                      </div>
                      {expandedMessageId === pm.id && (
                        <div className="px-4 pb-4 text-[var(--text-secondary)]">
                          {pm.content}
                        </div>
                      )}
                      <div className="border-b border-[var(--card-border)]"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center my-5 text-[var(--text-secondary)]">
                  보낸 쪽지가 없습니다.
                </p>
              )
            ) : (
              <p className="text-center my-5 text-[var(--text-secondary)]">
                선택된 탭에 대한 내용이 없습니다.
              </p>
            )}
          </section>
        </div>
      </main>

      <footer
        className={`bg-[var(--footer-bg)] text-[var(--footer-text)] text-center p-4 shadow transition-colors duration-300`}
      >
        <p>&copy; 2024 개발 게시판. All rights reserved.</p>
      </footer>
    </>
  );
}
