import React, { useEffect, useRef } from "react";
import { SearchBar } from "./components/common/SearchBar";
import { UserProfile } from "./components/features/UserProfile";
import { RepositoryList } from "./components/features/RepositoryList";
import styles from "./App.module.css";
import { useSearchParams } from "./hooks/useSearchParams";
import { useUserStore } from "./stores/userStore";

const App: React.FC = () => {
  const { user, repos, loading, error, fetchUserData } = useUserStore();
  const contentRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const { paramValue, updateSearchParams } = useSearchParams<string>(
    "q",
    fetchUserData
  );

  const handleSearch = (username: string) => {
    if (!username) return;
    if (username.trim() === paramValue) return;

    updateSearchParams(username);
  };

  const handleClear = () => {
    updateSearchParams(null);
  };

  useEffect(() => {
    if (user && contentRef.current) {
      contentRef.current.scrollIntoView({ behavior: "smooth" });
    }
    if (error && errorRef.current) {
      errorRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [user, error]);

  return (
    <div className={styles["app-container"]}>
      <div className={styles["hero-section"]}>
        <h1 className={styles["hero-title"]}>Github Profile Explorer</h1>
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClear}
          placeholder="Enter GitHub username"
          value={paramValue || ""}
        />
        {loading && (
          <div className={styles["loading-text"]}>Preparing data...</div>
        )}
      </div>

      {error && (
        <div ref={errorRef} className={styles["error-section"]}>
          <div className={styles["error-content"]}>
            <h2>Oops! Something went wrong</h2>
            <p>{error}</p>
            <button
              onClick={handleClear}
              className={styles["error-retry-button"]}>
              Try Again
            </button>
          </div>
        </div>
      )}

      {user && !loading && (
        <div ref={contentRef} className={styles["content-section"]}>
          <div className={styles["content-wrapper"]}>
            <UserProfile user={user} />
            <RepositoryList repositories={repos} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
