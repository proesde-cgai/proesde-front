import { useState } from 'react';

const useProfesorPag = (totalProfesor) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(totalProfesor / 10);

  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  return {
    currentPage,
    itemsPerPage,
    totalPages,
    handleFirstPage,
    handleLastPage,
    handlePreviousPage,
    handleNextPage,
    setCurrentPage
  };
};

export default useProfesorPag;
