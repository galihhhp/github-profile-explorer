import React from "react";
import { SearchBar } from "./components/common/SearchBar";
import { UserProfile } from "./components/features/UserProfile";
import { RepositoryList } from "./components/features/RepositoryList";
import { Header } from "./components/layout/Header";
import { PageWrapper } from "./components/layout/PageWrapper";
import styles from "./App.module.css";
import { useSearchParams } from "./hooks/useSearchParams";
import { useUserStore } from "./stores/userStore";

const App: React.FC = () => {
  const { user, repos, loading, error, fetchUserData } = useUserStore();

  const { paramValue, updateSearchParams } = useSearchParams<string>(
    "q",
    fetchUserData
  );

  const handleSearch = (username: string) => {
    updateSearchParams(username);
  };

  const handleClear = () => {
    updateSearchParams(null);
  };

  return (
    <div className={styles["app-container"]}>
      <Header />
      <PageWrapper>
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClear}
          placeholder="Enter GitHub username"
          value={paramValue || ""}
        />

        {loading && <div>Loading...</div>}

        {error && <div style={{ color: "red" }}>{error}</div>}

        {user && (
          <div className={styles["content-container"]}>
            <UserProfile user={user} />
            <RepositoryList repositories={repos} />
          </div>
        )}
      </PageWrapper>
    </div>
  );
};

export default App;
