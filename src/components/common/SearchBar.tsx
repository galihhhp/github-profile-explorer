import React, { useState } from "react";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onSearch: (username: string) => void;
  onClear: () => void;
  placeholder?: string;
  value: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onClear,
  placeholder = "Search...",
  value,
}) => {
  const [inputValue, setInputValue] = useState(value);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      onSearch(inputValue.trim());
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue("");
    onClear();
  };

  return (
    <div className={styles["search-wrapper"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          className={styles["search-input"]}
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
        {inputValue && (
          <button className={styles["clear-button"]} onClick={handleClear}>
            ✕
          </button>
        )}
      </div>
      <p className={styles["search-hint"]}>Press "Enter" to search</p>
    </div>
  );
};
