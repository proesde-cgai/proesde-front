// Custom hook: useCicloChange.js
import { useState } from 'react';

const useCicloChange = (setCurrentPage) => {
  const [selectedCiclo, setSelectedCiclo] = useState("");

  const handleCicloChange = (e) => {
    setSelectedCiclo(e.target.value);
    setCurrentPage(1);
  };

  return { selectedCiclo, handleCicloChange };
};

export default useCicloChange;
