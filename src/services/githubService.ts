/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  GithubUser,
  GithubRepoWithReadme,
  GithubEvent,
} from "../types/github.types";
import {
  githubAxios,
  handleGitHubError,
  encodeUsername,
} from "./githubApiClient";

export const githubService = {
  getUser: async (username: string): Promise<GithubUser> => {
    try {
      const encodedUsername = encodeUsername(username);
      const response = await githubAxios.get(`/users/${encodedUsername}`);
      return response.data;
    } catch (error) {
      handleGitHubError(error, `Fetching user: ${username}`);
    }
    throw new Error("Unreachable code");
  },
  getUserRepos: async (
    username: string,
    options = {
      includeReadme: true,
      page: 1,
      perPage: 10,
    }
  ): Promise<{
    repos: GithubRepoWithReadme[];
    totalCount: number;
    currentPage: number;
    perPage: number;
  }> => {
    try {
      const encodedUsername = encodeUsername(username);

      const response = await githubAxios.get(
        `/users/${encodedUsername}/repos`,
        {
          params: {
            sort: "updated",
            per_page: options.perPage,
            page: options.page,
          },
        }
      );

      const linkHeader = response.headers.link || "";
      let totalCount = 0;

      if (linkHeader) {
        const lastPageLink = linkHeader
          .split(",")
          .find((link: string) => link.includes('rel="last"'));
        if (lastPageLink) {
          const pageMatch = lastPageLink.match(/[&?]page=(\d+)/);
          if (pageMatch && pageMatch[1]) {
            const lastPage = parseInt(pageMatch[1], 10);
            totalCount = lastPage * options.perPage;
          }
        }
      }

      if (totalCount === 0) {
        totalCount = response.data.length;
      }

      let repos = response.data;

      if (options.includeReadme) {
        repos = await Promise.all(
          response.data.map(async (repo: GithubRepoWithReadme) => {
            try {
              const readmeResponse = await githubAxios.get(
                `/repos/${encodedUsername}/${repo.name}/readme`
              );
              repo.readme = atob(readmeResponse.data.content)
            } catch {
              repo.readme = "No README available for this repository";
            }
            return repo;
          }));
      }

      return {
        repos,
        totalCount,
        currentPage: options.page,
        perPage: options.perPage
      };
    } catch (error) {
      handleGitHubError(error, `Fetching repos for user: ${username}`);
      throw error;
    }
  }, getUserEvents: async (username: string): Promise<GithubEvent[]> => {
    try {
      const encodedUsername = encodeUsername(username);
      const response = await githubAxios.get(
        `/users/${encodedUsername}/events`,
        {
          params: {
            per_page: 100,
          },
        }
      );
      return response.data;
    } catch (error) {
      handleGitHubError(error, `Fetching events for user: ${username}`);
    }
    throw new Error("Unreachable code");
  },

  getRepoLanguages: async (
    username: string,
    repoName: string
  ): Promise<Record<string, number>> => {
    try {
      const encodedUsername = encodeUsername(username);
      const response = await githubAxios.get(
        `/repos/${encodedUsername}/${repoName}/languages`
      );
      return response.data;
    } catch (error) {
      handleGitHubError(
        error,
        `Fetching languages for repo: ${username}/${repoName}`
      );
    }
    throw new Error("Unreachable code");
  },

  getRepoCommitActivity: async (
    username: string,
    repoName: string
  ): Promise<any> => {
    try {
      const encodedUsername = encodeUsername(username);
      const response = await githubAxios.get(
        `/repos/${encodedUsername}/${repoName}/stats/commit_activity`
      );
      return response.data;
    } catch (error) {
      handleGitHubError(
        error,
        `Fetching commit activity for repo: ${username}/${repoName}`
      );
    }
    throw new Error("Unreachable code");
  },
};
