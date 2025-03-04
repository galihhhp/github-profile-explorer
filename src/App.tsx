import React, { useEffect, useRef, useCallback } from "react";
import { SearchBar } from "./components/common/SearchBar";
import { UserProfile } from "./components/features/UserProfile";
import { RepositoryList } from "./components/features/RepositoryList";
import styles from "./App.module.css";
import { useGithubProfile } from "./hooks/useGithubProfile";
import { useSearchParams } from "./hooks/useSearchParams";
import { ContributionDashboard } from "./components/features/ContributionDashboard";

const App: React.FC = () => {
  const { user, repos, loading, error, loadUserData } = useGithubProfile();
  const contentRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  const handleUserDataLoad = useCallback(
    (username: string | null) => {
      if (username) {
        loadUserData(username);
      }
    },
    [loadUserData]
  );

  const { paramValue, updateSearchParams } = useSearchParams<string>(
    "q",
    handleUserDataLoad
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
            <ContributionDashboard username={user?.login} />
            <RepositoryList repositories={repos} />
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
