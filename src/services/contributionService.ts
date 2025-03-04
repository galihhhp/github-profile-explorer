/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ContributionStats,
  LanguageDistribution,
  CommitFrequency,
} from "../types/contribution.types";
import { githubService } from "./githubService";
import { GithubEvent } from "../types/github.types";

export const contributionService = {
  getUserContributionStats: async (
    username: string
  ): Promise<ContributionStats> => {
    const repositories = await githubService.getUserRepos(username);

    const commitActivityPromises = repositories
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
      totalRepos: repositories.length,
      ownRepos: repositories.filter((repo: any) => !repo.fork).length,
      commitActivities,
    };
  },

  getLanguageDistribution: async (
    username: string
  ): Promise<LanguageDistribution> => {
    const repos = await githubService.getUserRepos(username);

    const languagePromises = repos
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

  getUserContributionStatsFromEvents: async (
    username: string
  ): Promise<ContributionStats> => {
    try {
      const events = await githubService.getUserEvents(username);

      console.log(`Total events fetched: ${events.length}`);

      const pushEvents = events.filter((event) => event.type === "PushEvent");
      const pullRequestEvents = events.filter(
        (event) => event.type === "PullRequestEvent"
      );
      const issueEvents = events.filter(
        (event) => event.type === "IssuesEvent"
      );

      console.log({
        totalEvents: events.length,
        pushCount: pushEvents.length,
        pullRequestCount: pullRequestEvents.length,
        issueCount: issueEvents.length,
      });

      return {
        totalEvents: events.length,
        pushCount: pushEvents.length,
        pullRequestCount: pullRequestEvents.length,
        issueCount: issueEvents.length,
        mostActiveRepo: contributionService.findMostActiveRepo(events),
      };
    } catch (error) {
      console.error("Detailed error in getUserContributionStatsFromEvents:", {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
      });
      throw error;
    }
  },

  findMostActiveRepo: (events: GithubEvent[]): string => {
    console.log("Finding most active repo from events:", events);

    if (!Array.isArray(events)) {
      console.error("Invalid events input: not an array", events);
      return "";
    }

    try {
      const repoActivityMap = events.reduce((acc, event) => {
        if (!event || !event.repo || !event.repo.name) {
          console.warn("Skipping invalid event:", event);
          return acc;
        }

        const repoName = event.repo.name;
        acc[repoName] = (acc[repoName] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log("Repo activity map:", repoActivityMap);

      if (Object.keys(repoActivityMap).length === 0) {
        console.warn("No repository activity found");
        return "";
      }

      const mostActiveRepo = Object.entries(repoActivityMap).reduce(
        (mostActive, [repo, count]) =>
          count > mostActive.count ? { repo, count } : mostActive,
        { repo: "", count: 0 }
      ).repo;

      console.log("Most active repository:", mostActiveRepo);
      return mostActiveRepo;
    } catch (error) {
      console.error("Error in findMostActiveRepo:", {
        errorName: error.name,
        errorMessage: error.message,
        errorStack: error.stack,
      });
      return "";
    }
  },
};
