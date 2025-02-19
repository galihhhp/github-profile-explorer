import React from "react";
import styles from "./UserProfile.module.css";
import { GitHubUser } from "../../types/github.types";

interface UserProfileProps {
  user: GitHubUser;
}

export const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
  return (
    <div className={styles["profile-container"]}>
      <img
        src={user.avatar_url}
        alt={`${user.name}'s avatar`}
        className={styles.avatar}
      />
      <div className={styles["user-info"]}>
        <h2>{user.name || user.login}</h2>
        {user.bio && <p className={styles.bio}>{user.bio}</p>}
        <div className={styles.stats}>
          <span>Followers: {user.followers}</span>
          <span>Following: {user.following}</span>
          <span>Public Repos: {user.public_repos}</span>
        </div>
        <a
          href={user.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className={styles["visit-button"]}>
          Visit Profile
        </a>
      </div>
    </div>
  );
};
