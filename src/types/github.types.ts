export interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  bio?: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
}

export interface GitHubRepo {
  id: number;
  name: string;
  full_name: string;
  description?: string;
  html_url: string;
  stargazers_count: number;
  language?: string;
}

export interface GitHubRepoWithReadme extends GitHubRepo {
  readme?: string;
}