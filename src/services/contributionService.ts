/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ContributionStats,
  LanguageDistribution,
  CommitFrequency,
} from "../types/contribution.types";
import { githubService } from "./githubService";

export const contributionService = {
  getUserContributionStats: async (
    username: string
  ): Promise<ContributionStats> => {
    const repositories = await githubService.getUserRepos(username);

    const commitActivityPromises = repositories.repos
      .filter((repo: any) => !repo.fork)
      .map(async (repo: any) => {
        try {
          const activity = await githubService.getRepoCommitActivity(
            username,
            repo.name
          );
          return { repo: repo.name, activity };
        } catch (error) {
          return { repo: repo.name, activity: [], error };
        }
      });

    const commitActivities = await Promise.all(commitActivityPromises);
    return {
      totalRepos: repositories.repos.length,
      ownRepos: repositories.repos.filter((repo: any) => !repo.fork).length,
      commitActivities,
    };
  },

  getLanguageDistribution: async (
    username: string
  ): Promise<LanguageDistribution> => {
    const repositories = await githubService.getUserRepos(username);

    const languagePromises = repositories.repos
      .filter((repo: any) => !repo.fork)
      .map(async (repo: any) => {
        try {
          const languages = await githubService.getRepoLanguages(
            username,
            repo.name
          );
          return { repo: repo.name, languages };
        } catch (error) {
          return { repo: repo.name, languages: {}, error };
        }
      });

    const repoLanguages = await Promise.all(languagePromises);

    const aggregatedLanguages: Record<string, number> = {};
    repoLanguages.forEach(({ languages }) => {
      Object.entries(languages).forEach(([lang, bytes]) => {
        aggregatedLanguages[lang] =
          (aggregatedLanguages[lang] || 0) + (bytes as number);
      });
    });

    return {
      repoLanguages,
      aggregatedLanguages,
    };
  },

  getCommitFrequency: async (username: string): Promise<CommitFrequency> => {
    const events = await githubService.getUserEvents(username);

    const pushEvents = events.filter(
      (event: any) => event.type === "PushEvent"
    );

    const dayFrequency: Record<string, number> = {};
    pushEvents.forEach((event: any) => {
      const date = event.created_at.split("T")[0];
      const commitCount = event.payload.commits?.length || 0;
      dayFrequency[date] = (dayFrequency[date] || 0) + commitCount;
    });

    return {
      dayFrequency,
      totalCommits: Object.values(dayFrequency).reduce(
        (sum, count) => sum + count,
        0
      ),
      totalDays: Object.keys(dayFrequency).length,
    };
  },
};
