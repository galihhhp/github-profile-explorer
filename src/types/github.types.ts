/* eslint-disable @typescript-eslint/no-explicit-any */
export interface GithubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio?: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
}

export interface GithubRepo {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  stargazers_count: number;
  language?: string;
}

export interface GithubRepoWithReadme extends GithubRepo {
  readme?: string;
  forks_count?: number;
}

export interface GithubEvent {
  id: string;
  type: string;
  actor: {
    id: number;
    login: string;
    display_login?: string;
    avatar_url: string;
  };
  repo: {
    id: number;
    name: string;
    url: string;
  };
  payload: Record<string, any>;
  public: boolean;
  created_at: string;
}