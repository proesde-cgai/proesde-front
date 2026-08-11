import { useState } from 'react';
const usePagination = (filteredMaterias, totalItems) => {
  const [currentPage, setCurrentPage] = useState(1);
  //const itemsPerPage = filteredMaterias.length || 10;
  const itemsPerPage = 10;
  
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  console.log("filteredMaterias ", filteredMaterias)
  //console.log("filteredMaterias slice ", filteredMaterias.slice(indexOfFirstItem, indexOfLastItem))
  //const currentItems = filteredMaterias.slice(indexOfFirstItem, indexOfLastItem);
 // console.log("currentItems ", currentItems)
  const currentItems = filteredMaterias
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
    currentItems,
    handleFirstPage,
    handleLastPage,
    handlePreviousPage,
    handleNextPage,
    setCurrentPage,
  };
};


export default usePagination;
