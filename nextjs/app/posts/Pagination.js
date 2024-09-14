'use client';

import { useRouter } from 'next/navigation';

export default function Pagination({ currentPage, totalPages, groupSize }) {
  const router = useRouter();

  const handlePageChange = (newPage) => {
    router.push(`/posts/?page=${newPage}`);
  };

  const handlePreviousGroup = () => {
    if (currentPage > groupSize) {
      const newPage = (Math.ceil(currentPage / groupSize) - 1) * groupSize;
      handlePageChange(newPage);
    }
  };

  const handleNextGroup = () => {
    if (currentPage < totalPages) {
      const newPage = Math.min(Math.ceil(currentPage / groupSize) * groupSize + 1, totalPages);
      handlePageChange(newPage);
    }
  };

  const getPageNumbersForCurrentGroup = () => {
    const currentPageGroup = Math.ceil(currentPage / groupSize);
    const start = (currentPageGroup - 1) * groupSize + 1;
    const end = Math.min(currentPageGroup * groupSize, totalPages);
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  };

  return (
    <div className="pagination">
      <button onClick={handlePreviousGroup} disabled={currentPage <= groupSize}>
        이전
      </button>
      {getPageNumbersForCurrentGroup().map((page) => (
        <button key={page} onClick={() => handlePageChange(page)} disabled={page === currentPage}>
          {page}
        </button>
      ))}
      <button onClick={handleNextGroup} disabled={currentPage >= totalPages}>
        다음
      </button>
    </div>
  );
}
