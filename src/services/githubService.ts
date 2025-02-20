import axios, { AxiosError } from 'axios';
import { GithubUser, GithubRepoWithReadme } from '../types/github.types';

const GITHUB_API_BASE = 'https://api.github.com';

const axiosInstance = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    "Authorization": `Bearer ${import.meta.env.VITE_GITHUB_TOKEN}`,
  }
});

const handleGitHubError = (error: unknown, context: string): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError;

    if (axiosError.response) {
      switch (axiosError.response.status) {
        case 404:
          throw new Error(`User not found: ${context}`);
        case 403:
          throw new Error('GitHub API rate limit exceeded. Please try again later.');
        case 401:
          throw new Error('Authentication failed. Please check your credentials.');
        default:
          throw new Error(`GitHub API error: ${axiosError.response.status} - ${context}`);
      }
    } else if (axiosError.request) {
      throw new Error('No response received from GitHub. Check your internet connection.');
    }
  }

  throw new Error(`Unexpected error: ${context}`);
};

export const githubService = {
  async getUser(username: string): Promise<GithubUser> {
    try {
      const response = await axiosInstance.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      handleGitHubError(error, `Fetching user: ${username}`);
    }
    throw new Error('Unreachable code');
  },

  async getUserRepos(username: string): Promise<GithubRepoWithReadme[]> {
    try {
      const response = await axiosInstance.get(`/users/${username}/repos`, {
        params: {
          sort: 'updated',
          per_page: 100
        }
      });

      const reposWithReadmes = await Promise.all(
        response.data.map(async (repo: GithubRepoWithReadme) => {
          try {
            const readmeResponse = await axiosInstance.get(`/repos/${username}/${repo.name}/readme`);
            repo.readme = atob(readmeResponse.data.content);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            repo.readme = '';
          }
          return repo;
        })
      );

      return reposWithReadmes;
    } catch (error) {
      handleGitHubError(error, `Fetching repos for user: ${username}`);
    }
    throw new Error('Unreachable code');
  }
};