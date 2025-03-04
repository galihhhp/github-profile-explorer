import axios, { AxiosError, AxiosInstance } from "axios";

export const GITHUB_API_BASE = "https://api.github.com";

export const githubAxios: AxiosInstance = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    Accept: "application/vnd.github+json",
    Authorization: `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  },
});

export const handleGitHubError = (error: unknown, context: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 404:
          throw new Error(`Resource not found: ${context}`);
        case 403:
          throw new Error(
            "GitHub API rate limit exceeded. Please try again later."
          );
        case 401:
          throw new Error(
            "Authentication failed. Please check your credentials."
          );
        default:
          throw new Error(
            `GitHub API error: ${axiosError.response.status} - ${context}`
          );
      }
    } else if (axiosError.request) {
      throw new Error(
        "No response received from GitHub. Check your internet connection."
      );
    }
  }

  throw new Error(`Unexpected error: ${context}`);
};

export const encodeUsername = (username: string): string => {
  return encodeURIComponent(username.trim().toLowerCase());
};
