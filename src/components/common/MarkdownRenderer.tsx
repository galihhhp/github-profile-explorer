import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styles from "./MarkdownRenderer.module.css";

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  content,
}) => {
  return (
    <div className={styles["markdown-content"]}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 className={styles["markdown-h1"]}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className={styles["markdown-h2"]}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className={styles["markdown-h3"]}>
              {children}
            </h3>
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
          pre: ({ children }) => (
            <pre className={styles["markdown-pre"]}>{children}</pre>
          ),
          ul: ({ children }) => (
            <ul className={styles["markdown-list"]}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className={styles["markdown-list"]}>{children}</ol>
          ),
        }}
        remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
    </div>
  );
};