import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useSearchStore } from "../store/useSearchStore";
import styles from "./styles/Search.module.css";

// Obtener la URL base desde las variables de entorno
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
// Concatenar el contexto y el servicio/recurso
const API_URL_SEARCH = `${API_BASE_URL}/api/v1/solicitud/lista`;

const Search = ({ onSearch, onGetSuggestions, placeholder = "Search...", aliasActividad }) => {
  
  const userInfo = useAuthStore((state) => state.userInfo);
  const { paginationRecords, hasSearched, setLoading, query, setQuery, clearFormData } = useSearchStore((state) => ({
    paginationRecords: state.paginationRecords,
    hasSearched: state.hasSearched,
    setLoading: state.setLoading,
    loading: state.loading,
    query: state.query,
    setQuery: state.setQuery,
    clearFormData: state.clearFormData
  }));

  const [suggestions, setSuggestions] = useState([]);

  const handleGetSuggestions = async (query) => {

    try {
      const response = await onGetSuggestions(query);
      setSuggestions(response);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    setQuery(e.target.value);
    handleGetSuggestions(e.target.value);
  };

  const performSearch = useCallback(async (searchQuery, pageNumber = 0) => {
    setLoading(true);

    if (searchQuery && searchQuery.toLowerCase() === userInfo.username?.toLowerCase()) {
      alert("No puedes evaluarte a ti mismo.");
      return;
    }
    const token = localStorage.getItem("accessToken");
    try {
      useSearchStore.getState().setLoading(true);
      useSearchStore.getState().setHasSearched(true);

      const requestBody = {
        "palabraClave": searchQuery && searchQuery.length > 0 ? searchQuery : null,
        "criterios": {
          "paginadoCondicion": "7",
          "pageNumber": pageNumber.toString()
        }
      };

      // Agregar filtro de status para inconformidad
      if (aliasActividad === "inconformidad" || aliasActividad === "inconformidades" || aliasActividad === "lista_inconformidades") {
        requestBody.status = 6;
      }

      const response = await axios.post(
        API_URL_SEARCH,
        requestBody,
        {
          headers: {
            Accept: "*/*",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.data) {
        console.log("response.data", response.data);
        useSearchStore.getState().setAcademicos(response.data.content);
        useSearchStore.getState().setPaginationRecords(response.data.paginationRecords || response.data);

      }
    } catch (error) {
      console.error("Error making POST request:", error);
      useSearchStore.getState().setLoading(false);
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo.username, aliasActividad]);

  const handleSearch = async (e) => {
    e.preventDefault();
    await performSearch(query);
    clearFormData();
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    onSearch(suggestion);
    setSuggestions([]);
  };

  return (
    <div className={styles.searchContainer}>
      <div className={styles.searchInputContainer}>
        <input
          type="number"
          value={query}
          onChange={handleChange}
          className={styles.searchInput}
          placeholder={placeholder}
        />
        <span onClick={handleSearch} className={styles.searchButton} style={{ cursor: "pointer" }}>
          <svg
            stroke="currentColor"
            fill="currentColor"
            strokeWidth="0"
            viewBox="0 0 512 512"
            // height="200px"
            width="20px"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M443.5 420.2L336.7 312.4c20.9-26.2 33.5-59.4 33.5-95.5 0-84.5-68.5-153-153.1-153S64 132.5 64 217s68.5 153 153.1 153c36.6 0 70.1-12.8 96.5-34.2l106.1 107.1c3.2 3.4 7.6 5.1 11.9 5.1 4.1 0 8.2-1.5 11.3-4.5 6.6-6.3 6.8-16.7.6-23.3zm-226.4-83.1c-32.1 0-62.3-12.5-85-35.2-22.7-22.7-35.2-52.9-35.2-84.9 0-32.1 12.5-62.3 35.2-84.9 22.7-22.7 52.9-35.2 85-35.2s62.3 12.5 85 35.2c22.7 22.7 35.2 52.9 35.2 84.9 0 32.1-12.5 62.3-35.2 84.9-22.7 22.7-52.9 35.2-85 35.2z"></path>
          </svg>
        </span>
      </div>
      {/* <button onClick={handleSearch} className={styles.searchButton}>
        Search
      </button> */}
      {suggestions?.length > 0 && (
        <ul className={styles.suggestionsList}>
          {suggestions?.map((suggestion, index) => (
            <li key={index} onClick={() => handleSuggestionClick(suggestion)} className={styles.suggestionItem}>
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Search;
