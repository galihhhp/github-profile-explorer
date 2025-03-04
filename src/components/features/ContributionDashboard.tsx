import React, { useEffect } from "react";
import { useContributionAnalysis } from "../../hooks/useContributionAnalysis";
import theme from "../../styles/theme.module.css";
import styles from "./ContributionDashboard.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#8b5cf6",
  "#ec4899",
  "#3b82f6",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#6366f1",
];

interface ContributionDashboardProps {
  username: string;
}

export const ContributionDashboard: React.FC<ContributionDashboardProps> = ({
  username,
}) => {
  const {
    stats,
    languages,
    commitFrequency,
    loading,
    error,
    loadContributionData,
  } = useContributionAnalysis();

  useEffect(() => {
    if (username) {
      loadContributionData(username);
    }
  }, [username, loadContributionData]);

  if (loading) {
    return (
      <div className={`${styles["loading-container"]} ${theme.container}`}>
        <div>Loading contribution data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${styles["error-container"]} ${theme.container}`}>
        <div>Error: {error}</div>
      </div>
    );
  }

  const languageData = languages?.aggregatedLanguages
    ? Object.entries(languages.aggregatedLanguages)
        .map(([name, bytes]) => ({ name, bytes }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 8)
    : [];

  const totalBytes = languageData.reduce((sum, item) => sum + item.bytes, 0);
  const languagePieData = languageData.map((item) => ({
    name: item.name,
    value: item.bytes,
    percentage: Math.round((item.bytes / totalBytes) * 100),
  }));

  const commitData = commitFrequency?.dayFrequency
    ? Object.entries(commitFrequency.dayFrequency)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(-30)
    : [];

  const weeklyActivityData = stats?.commitActivities
    ? stats.commitActivities
        .flatMap((repoActivity) => {
          if (!repoActivity || !Array.isArray(repoActivity.activity)) {
            return [];
          }

          return repoActivity.activity
            .filter((week) => week && week.total > 0)
            .map((week) => ({
              week: new Date(week.week * 1000).toISOString().split("T")[0],
              commits: week.total,
              repo: repoActivity.repo,
            }));
        })
        .slice(-20)
    : [];

  return (
    <div className={`${styles.dashboard} ${theme.container}`}>
      <div className={styles["dashboard-header"]}>
        <h2 className={theme["gradient-heading"]}>
          Contribution Analysis for {username}
        </h2>
      </div>

      <div className={styles["stats-summary"]}>
        <div className={styles["stat-card"]}>
          <h3 className={theme["section-heading"]}>Repositories</h3>
          <p className={styles["stat-number"]}>{stats?.totalRepos || 0}</p>
        </div>
        <div className={styles["stat-card"]}>
          <h3 className={theme["section-heading"]}>Total Commits</h3>
          <p className={styles["stat-number"]}>
            {commitFrequency?.totalCommits || 0}
          </p>
        </div>
        <div className={styles["stat-card"]}>
          <h3 className={theme["section-heading"]}>Active Days</h3>
          <p className={styles["stat-number"]}>
            {commitFrequency?.totalDays || 0}
          </p>
        </div>
      </div>

      <div
        className={`${styles["chart-section"]} ${styles["pie-chart-section"]}`}>
        <h3>Language Distribution</h3>
        {languagePieData.length > 0 ? (
          <div className={styles["pie-chart-container"]}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={languagePieData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}>
                  {languagePieData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) =>
                    `${Math.round(value / 1024)} KB`
                  }
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p>No language data available</p>
        )}
      </div>

      <div
        className={`${styles["chart-section"]} ${styles["commit-activity-section"]}`}>
        <h3>Commit Activity (Last 30 Days)</h3>
        {commitData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={commitData}>
              <defs>
                <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS[0]} stopOpacity={0.8} />
                  <stop offset="95%" stopColor={COLORS[0]} stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
              />
              <YAxis />
              <Tooltip formatter={(value) => [`${value} commits`]} />
              <Area
                type="monotone"
                dataKey="count"
                stroke={COLORS[0]}
                fill="url(#colorCommits)"
                fillOpacity={0.6}
                name="Commits"
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p>No commit data available</p>
        )}
      </div>

      <div className={`${styles["chart-section"]} ${styles["weekly-section"]}`}>
        <h3>Weekly Contributions by Repository</h3>
        {weeklyActivityData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={weeklyActivityData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip
                formatter={(value, name, props) => [
                  `${value} commits`,
                  props.payload.repo,
                ]}
              />
              <Legend />
              <Bar dataKey="commits" fill={COLORS[0]} name="Commits" />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>No weekly activity data available</p>
        )}
      </div>
    </div>
  );
};
