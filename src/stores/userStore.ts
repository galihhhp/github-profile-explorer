import { create } from 'zustand';
import { githubService } from '../services/githubService';
import { GitHubUser, GitHubRepoWithReadme } from '../types/github.types';

interface UserState {
  user: GitHubUser | null;
  repos: GitHubRepoWithReadme[];
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
        loading: false
      });
    } catch (err) {
      set({
        error: err instanceof Error
          ? err.message
          : 'Failed to fetch GitHub user data',
        loading: false
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