import React, { useCallback, useState } from 'react'
import api from '../../../../hooks/api';

const useFetchSizeListProfesores = () => {
    const [sizeListProfesores, setSizeListProfesores] = useState();
    const [isSizeListLoading, setIsSizeListLoading] = useState(true);

    const getSizeList = useCallback( async () => {
        try {
            const response = await api.get('/api/v1/jefe_depto/size-list-profesores');
            console.log(response.data);
            setSizeListProfesores(response.data);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }, [])
  return {
    sizeListProfesores,
    isSizeListLoading,
    getSizeList,
  }
}

export default useFetchSizeListProfesores
