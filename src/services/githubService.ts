/* eslint-disable @typescript-eslint/no-explicit-any */
import { GithubUser, GithubRepoWithReadme, GithubEvent } from '../types/github.types';
import { githubAxios, handleGitHubError, encodeUsername } from './githubApiClient';

export const githubService = {
  getUser: async (username: string): Promise<GithubUser> => {
    try {
      const encodedUsername = encodeUsername(username);
      const response = await githubAxios.get(`/users/${encodedUsername}`);
      return response.data;
    } catch (error) {
      handleGitHubError(error, `Fetching user: ${username}`);
    }
    throw new Error('Unreachable code');
  },

  getUserRepos: async (username: string): Promise<GithubRepoWithReadme[]> => {
    try {
      const response = await githubAxios.get(`/users/${username}/repos`, {
        params: {
          sort: 'updated',
          per_page: 100
        }
      });

      const reposWithReadmes = await Promise.all(
        response.data.map(async (repo: GithubRepoWithReadme) => {
          try {
            const readmeResponse = await githubAxios.get(`/repos/${username}/${repo.name}/readme`);
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
    throw new Error('Unreachable code');
  }, getUserEvents: async (username: string): Promise<GithubEvent[]> => {
    try {
      const encodedUsername = encodeUsername(username);
      const response = await githubAxios.get(`/users/${encodedUsername}/events`, {
        params: {
          per_page: 100
        }
      });
      return response.data;
    } catch (error) {
      handleGitHubError(error, `Fetching events for user: ${username}`);
    }
    throw new Error('Unreachable code');
  },

  getRepoLanguages: async (username: string, repoName: string): Promise<Record<string, number>> => {
    try {
      const encodedUsername = encodeUsername(username);
      const response = await githubAxios.get(`/repos/${encodedUsername}/${repoName}/languages`);
      return response.data;
    } catch (error) {
      handleGitHubError(error, `Fetching languages for repo: ${username}/${repoName}`);
    }
    throw new Error('Unreachable code');
  },

  getRepoCommitActivity: async (username: string, repoName: string): Promise<any> => {
    try {
      const encodedUsername = encodeUsername(username);
      const response = await githubAxios.get(`/repos/${encodedUsername}/${repoName}/stats/commit_activity`);
      return response.data;
    } catch (error) {
      handleGitHubError(error, `Fetching commit activity for repo: ${username}/${repoName}`);
    }
    throw new Error('Unreachable code');
  }
};
