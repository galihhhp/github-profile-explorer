export interface ContributionStats {
  totalRepos: number;
  ownRepos: number;
  commitActivities: Array<{
    repo: string;
    activity: Array<{
      total: number;
      week: number;
      days: number[];
    }>;
  }>;
}

export interface LanguageDistribution {
  repoLanguages: Array<{
    repo: string;
    languages: Record<string, number>;
  }>;
  aggregatedLanguages: Record<string, number>;
}

export interface CommitFrequency {
  dayFrequency: Record<string, number>;
  totalCommits: number;
  totalDays: number;
}

export interface ContributionAnalysis {
  stats: ContributionStats | null;
  languages: LanguageDistribution | null;
  commitFrequency: CommitFrequency | null;
}
