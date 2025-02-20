import { create } from 'zustand';
import { githubService } from '../services/githubService';
import { GithubUser, GithubRepoWithReadme } from '../types/github.types';

interface UserState {
  user: GithubUser | null;
  repos: GithubRepoWithReadme[];
  loading: boolean;
  error: string | null;
  fetchUserData: (username: string | null) => Promise<void>;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  repos: [],
  loading: false,
  error: null,

  fetchUserData: async (username) => {
    if (!username) {
      set({
        user: null,
        repos: [],
        loading: false,
        error: null
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      const [userData, userReposWithReadmes] = await Promise.all([
        githubService.getUser(username),
        githubService.getUserRepos(username)
      ]);

      set({
        user: userData,
        repos: userReposWithReadmes,
        loading: false,
        error: userReposWithReadmes.length === 0
          ? `No repositories found for ${username}`
          : null
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : 'An unexpected error occurred',
        loading: false,
        user: null,
        repos: []
      });
    }
  },

  clearUser: () => set({
    user: null,
    repos: [],
    loading: false,
    error: null
  }),
}));