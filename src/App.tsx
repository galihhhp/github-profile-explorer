import React, { useEffect, useRef, useCallback, useState } from "react";
import { SearchBar } from "./components/common/SearchBar";
import { UserProfile } from "./components/features/UserProfile";
import RepositoryList from "./components/features/RepositoryList";
import styles from "./App.module.css";
import { useGithubProfile } from "./hooks/useGithubProfile";
import { useSearchParams } from "./hooks/useSearchParams";
import { ContributionDashboard } from "./components/features/ContributionDashboard";
import { Tabs } from "./components/common/Tabs";

const App: React.FC = () => {
  const { user, repos, loading, error, loadUserData } = useGithubProfile();
  const contentRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);
  const [activeTab, setActiveTab] = useState("repos");

  const { paramValue: username, updateSearchParams: updateUsername } =
    useSearchParams<string>("q");
  const { paramValue: pageStr, updateSearchParams: updatePage } =
    useSearchParams<string>("page");
  const { paramValue: perPageStr, updateSearchParams: updatePerPage } =
    useSearchParams<string>("perPage");

  const page = pageStr ? parseInt(pageStr, 10) : 1;
  const perPage = perPageStr ? parseInt(perPageStr, 4) : 4;

  const handleUserDataLoad = useCallback(() => {
    if (username) {
      loadUserData(username, { page, perPage });
    }
  }, [loadUserData, username, page, perPage]);

  useEffect(() => {
    handleUserDataLoad();
  }, [username, page, perPage, handleUserDataLoad]);

  const handleSearch = (searchUsername: string) => {
    if (!searchUsername) return;
    if (searchUsername.trim() === username) return;

    updateUsername(searchUsername);
    updatePage("1");
  };

  const handlePageChange = (newPage: number) => {
    updatePage(newPage.toString());
  };

  const handleTabChange = (tabId: string | number) => {
    setActiveTab(tabId as string);
  };

  const handleClear = () => {
    updateUsername(null);
    updatePage(null);
    updatePerPage(null);
  };
  useEffect(() => {
    if (user && !loading && contentRef.current) {
      const timer = setTimeout(() => {
        contentRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return () => clearTimeout(timer);
    }

    if (error && errorRef.current) {
      const timer = setTimeout(() => {
        errorRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [user, loading, error]);
  return (
    <div className={styles["app-container"]}>
      <div className={styles["hero-section"]}>
        <h1 className={styles["hero-title"]}>Github Profile Explorer</h1>
        <SearchBar
          onSearch={handleSearch}
          onClear={handleClear}
          placeholder="Enter GitHub username"
          value={username || ""}
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
            <Tabs defaultTabId="first" onChange={handleTabChange}>
              <Tabs.Tab id="repos" label="Repositories">
                <RepositoryList
                  repositories={repos}
                  pagination={{
                    currentPage: page,
                    perPage: perPage,
                    totalCount: user.public_repos,
                    totalPages: Math.ceil(user.public_repos / perPage),
                  }}
                  onPageChange={handlePageChange}
                />
              </Tabs.Tab>

              <Tabs.Tab id="contributions" label="Contributions">
                <ContributionDashboard username={user?.login} />
              </Tabs.Tab>
            </Tabs>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
