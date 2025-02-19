import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./MarkdownRenderer.module.css";

const MarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
  return (
    <ReactMarkdown
      components={{
        h1: ({ children }) => (
          <h1 className={styles["markdown-h1"]}>{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className={styles["markdown-h2"]}>{children}</h2>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={styles["markdown-link"]}>
            {children}
          </a>
        ),
        code: ({ children, className }) => (
          <code className={`${styles["markdown-code"]} ${className || ""}`}>
            {children}
          </code>
        ),
      }}
      remarkPlugins={[remarkGfm]}>
      {content}
    </ReactMarkdown>
  );
};

export { MarkdownRenderer };
