import React, { useState } from "react";
import styles from "./RepositoryList.module.css";
import theme from "../../styles/theme.module.css";
import { MarkdownRenderer } from "../common/MarkdownRenderer";
import { GithubRepoWithReadme } from "../../types/github.types";
import Pagination from "../common/Pagination";

interface RepositoryListProps {
  repositories: GithubRepoWithReadme[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalCount: number;
    totalPages: number;
  };
  onPageChange: (page: number) => void;
}

const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
  pagination,
  onPageChange,
}) => {
  const [activeRepoId, setActiveRepoId] = useState<number | null>(
    repositories.length > 0 ? repositories[0].id : null
  );

  const toggleRepo = (repoId: number) => {
    setActiveRepoId(activeRepoId === repoId ? null : repoId);
  };

  return (
    <div className={theme.container}>
      <div className={styles.repositoryHeader}>
        <h2 className={theme["gradient-heading"]}>Repositories</h2>
        <div className={styles.repositoryStats}>
          Showing {repositories.length} of {pagination.totalCount} repositories
        </div>
      </div>

      {repositories.map((repo) => (
        <div
          key={repo.id}
          className={`${styles["repository-card"]} 
            ${activeRepoId === repo.id ? styles.active : ""}`}>
          <div
            className={styles["repository-header"]}
            onClick={() => toggleRepo(repo.id)}>
            <h4>
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}>
                {repo.name}
              </a>
            </h4>
            <span className={styles["toggle-icon"]}>
              {activeRepoId === repo.id ? "−" : "+"}
            </span>
          </div>

          <div className={styles["repository-details"]}>
            {repo.description && <p>{repo.description}</p>}
            <div className={styles["repo-details"]}>
              {repo.language && <span>Language: {repo.language}</span>}
              <span>Stars: {repo.stargazers_count}</span>
              <span>Forks: {repo.forks_count}</span>
            </div>

            <div className={styles["readme-content"]}>
              <MarkdownRenderer
                content={repo.readme || "No README available"}
              />
            </div>
          </div>
        </div>
      ))}

      <Pagination
        currentPage={pagination.currentPage}
        totalPages={pagination.totalPages}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default RepositoryList;