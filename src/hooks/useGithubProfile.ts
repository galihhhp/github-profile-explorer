import { useState, useCallback } from 'react';
import { GithubUser, GithubRepoWithReadme } from '../types/github.types';
import { githubService } from '../services/githubService';

export const useGithubProfile = () => {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepoWithReadme[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async (username: string) => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const userData = await githubService.getUser(username);
      setUser(userData);

      const reposData = await githubService.getUserRepos(username);
      setRepos(reposData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setUser(null);
      setRepos([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    repos,
    loading,
    error,
    loadUserData
  };
};
