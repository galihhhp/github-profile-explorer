import React from "react";
import styles from "./PageWrapper.module.css";

interface PageWrapperProps {
  children: React.ReactNode;
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  return (
    <div className={styles.pageContainer}>
      <main className={styles.pageContent}>{children}</main>
    </div>
  );
};
