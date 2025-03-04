import React from "react";
import styles from "./UserProfile.module.css";
import theme from "../../styles/theme.module.css";
import { GithubUser } from "../../types/github.types";

interface UserProfileProps {
  user: GithubUser;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className={`${styles["profile-container"]} ${theme.container}`}>
      <div className={styles["profile-header"]}>
        <img
          src={user.avatar_url}
          alt={`${user.name}'s avatar`}
          className={styles.avatar}
        />
        <div className={styles["profile-info"]}>
          <h2 className={theme["gradient-heading"]}>
            {user.name || user.login}
          </h2>
          <p className={styles.username}>@{user.login}</p>
          {user.bio && <p className={styles.bio}>{user.bio}</p>}
        </div>
      </div>
      <div className={styles["stats-row"]}>
        <div className={styles.stat}>
          <span className={styles["stat-value"]}>{user.followers}</span>
          <span className={styles["stat-label"]}>Followers</span>
        </div>
        <div className={styles.stat}>
          <span className={styles["stat-value"]}>{user.following}</span>
          <span className={styles["stat-label"]}>Following</span>
        </div>
        <div className={styles.stat}>
          <span className={styles["stat-value"]}>{user.public_repos}</span>
          <span className={styles["stat-label"]}>Repositories</span>
        </div>
      </div>
      <a
        href={user.html_url}
        target="_blank"
        rel="noopener noreferrer"
        className={theme["glass-button"]}>
        Visit GitHub Profile
      </a>
    </div>
  );
};
