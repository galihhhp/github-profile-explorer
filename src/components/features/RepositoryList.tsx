import React, { useState } from "react";
import styles from "./RepositoryList.module.css";
import { MarkdownRenderer } from "../common/MarkdownRenderer";
import { GithubRepoWithReadme } from "../../types/github.types";

interface RepositoryListProps {
  repositories: GithubRepoWithReadme[];
}

export const RepositoryList: React.FC<RepositoryListProps> = ({
  repositories,
}) => {
  const [activeRepoId, setActiveRepoId] = useState<number | null>(
    repositories.length > 0 ? repositories[0].id : null
  );

  const toggleRepo = (repoId: number) => {
    setActiveRepoId(activeRepoId === repoId ? null : repoId);
  };

  return (
    <div className={styles["repository-list"]}>
      {repositories.map((repo) => (
        <div
          key={repo.id}
          className={`
              ${styles["repository-card"]} 
              ${activeRepoId === repo.id ? styles["active"] : ""}
            `}>
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
            </div>

            <div className={styles["readme-content"]}>
              <MarkdownRenderer
                content={repo.readme || "No README available"}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
