import React, { useState, useEffect } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (username: string) => void;
  onClear?: () => void;
  placeholder?: string;
  value?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  placeholder = "Enter GitHub username",
  value: initialValue = "",
}) => {
  const [username, setUsername] = useState(initialValue);

  useEffect(() => {
    setUsername(initialValue);
  }, [initialValue]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  const handleIconClick = () => {
    if (username.trim()) {
      onSearch(username.trim());
    }
  };

  const handleClear = () => {
    setUsername("");
    onClear?.();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={styles["search-container"]}
      role="search">
      <div className={styles["search-input-wrapper"]}>
        <input
          type="search"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder={placeholder}
          className={styles["search-input"]}
          aria-label="Search GitHub username"
          autoComplete="off"
        />
        {username && (
          <button
            type="button"
            className={styles["clear-button"]}
            onClick={handleClear}
            aria-label="Clear search">
            ✕
          </button>
        )}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          className={styles["search-icon"]}
          aria-hidden="true"
          onClick={handleIconClick}>
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
        </svg>
      </div>
    </form>
  );
};
