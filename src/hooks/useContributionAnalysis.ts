import { useState, useCallback } from 'react';
import { ContributionStats, LanguageDistribution, CommitFrequency } from '../types/contribution.types';
import { contributionService } from '../services/contributionService';

export const useContributionAnalysis = () => {
  const [stats, setStats] = useState<ContributionStats | null>(null);
  const [languages, setLanguages] = useState<LanguageDistribution | null>(null);
  const [commitFrequency, setCommitFrequency] = useState<CommitFrequency | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadContributionData = useCallback(async (username: string) => {
    if (!username.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const [statsData, languagesData, commitFrequencyData] = await Promise.all([
        contributionService.getUserContributionStats(username),
        contributionService.getLanguageDistribution(username),
        contributionService.getCommitFrequency(username)
      ]);

      setStats(statsData);
      setLanguages(languagesData);
      setCommitFrequency(commitFrequencyData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      setStats(null);
      setLanguages(null);
      setCommitFrequency(null);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    stats,
    languages,
    commitFrequency,
    loading,
    error,
    loadContributionData
  };
};
