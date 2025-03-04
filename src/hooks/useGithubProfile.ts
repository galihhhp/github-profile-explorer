import { useState, useCallback } from 'react';
import { GithubUser, GithubRepoWithReadme } from '../types/github.types';
import { githubService } from '../services/githubService';

interface PaginationOptions {
  page: number;
  perPage: number;
}

interface PaginationState {
  currentPage: number;
  perPage: number;
  totalCount: number;
  totalPages: number;
}

export const useGithubProfile = () => {
  const [user, setUser] = useState<GithubUser | null>(null);
  const [repos, setRepos] = useState<GithubRepoWithReadme[]>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    perPage: 10,
    totalCount: 0,
    totalPages: 0
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUserData = useCallback(async (
    username: string,
    options: PaginationOptions = { page: 1, perPage: 4 }
  ) => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const userData = await githubService.getUser(username);
      setUser(userData);

      const { repos: reposData, totalCount, currentPage, perPage } =
        await githubService.getUserRepos(username, {
          includeReadme: true,
          page: options.page,
          perPage: options.perPage
        });

      setRepos(reposData);
      setPagination({
        currentPage,
        perPage,
        totalCount,
        totalPages: Math.ceil(totalCount / perPage)
      });
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
    pagination,
    loading,
    error,
    loadUserData
  };
};