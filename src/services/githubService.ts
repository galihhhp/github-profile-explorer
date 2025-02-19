import axios from 'axios';
import { GitHubUser, GitHubRepoWithReadme } from '../types/github.types';

const GITHUB_API_BASE = 'https://api.github.com';

const axiosInstance = axios.create({
  baseURL: GITHUB_API_BASE,
  headers: {
    'Accept': 'application/vnd.github.v3+json'
  }
});

export const githubService = {
  async getUser(username: string): Promise<GitHubUser> {
    try {
      const response = await axiosInstance.get(`/users/${username}`);
      return response.data;
    } catch (error) {
      console.error(`Failed to fetch user: ${username}`, error);
      throw new Error(`Failed to fetch user: ${username}`);
    }
  },

  async getUserRepos(username: string): Promise<GitHubRepoWithReadme[]> {
    try {
      const response = await axiosInstance.get(`/users/${username}/repos`, {
        params: {
          sort: 'updated',
          per_page: 100
        }
      });

      const reposWithReadmes = await Promise.all(
        response.data.map(async (repo: GitHubRepoWithReadme) => {
          try {
            const readmeResponse = await axiosInstance.get(`/repos/${username}/${repo.name}/readme`);
            repo.readme = atob(readmeResponse.data.content);
          } catch {
            repo.readme = '';
          }
          return repo;
        })
      );

      return reposWithReadmes;
    } catch (error) {
      console.error(`Failed to fetch repos for user: ${username}`, error);
      throw new Error(`Failed to fetch repos for user: ${username}`);
    }
  }
};