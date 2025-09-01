import { Grid, Typography, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useData } from "../hooks/useData";
import type { Statistics } from "../types";
import StatsGridCard from "./StatsGridCard";
import StatsSkeleton from "./StatsSkeleton";
import { useTheme } from "@mui/material/styles";
const default_stats = {
  current_total: 0,
  current_label_0: 0,
  current_label_1: 0,
  total_samples: 0,
  total_label_0: 0,
  total_label_1: 0,
};

const constructStats = (stats: Statistics | null, originalFileName: string) => {
  if (!stats) return default_stats;
  const currentStats = stats.per_file[
    "uploads/" + originalFileName + ".json"
  ] || {
    total_samples: 0,
    total_label_0: 0,
    total_label_1: 0,
  };
  const totalStats = {
    total_samples: stats.total_samples,
    total_label_0: stats.total_label_0,
    total_label_1: stats.total_label_1,
  };

  const currentStatsRenamed = {
    current_total: currentStats.total_samples,
    current_label_0: currentStats.total_label_0,
    current_label_1: currentStats.total_label_1,
  };

  return {
    ...currentStatsRenamed,
    ...totalStats,
  };
};

const StatsGrid = () => {
  const theme = useTheme();

  const colorMapping = {
    current_total: theme.customColors.sampleGray,
    current_label_0: theme.customColors.jumpRed,
    current_label_1: theme.customColors.nonJumpGreen,
    total_samples: theme.customColors.sampleGray,
    total_label_0: theme.customColors.jumpRed,
    total_label_1: theme.customColors.nonJumpGreen,
  };

  const titleMapping = {
    current_total: "Current Samples",
    current_label_0: "Current Non-Jumps",
    current_label_1: "Current Jumps",
    total_samples: "Total Samples",
    total_label_0: "Total Non-Jumps",
    total_label_1: "Total Jumps",
  };
  const { statistics, originalFileName, fetchStatistics, isStatisticsLoading } =
    useData();
  const stats = constructStats(statistics, originalFileName);

  return (
    <>
      <IconButton
        onClick={fetchStatistics}
        disableFocusRipple
        disableRipple
        disabled={isStatisticsLoading}
        sx={{ mb: 2 }}
      >
        <RefreshIcon />
        <Typography>Refresh Stats</Typography>
      </IconButton>

      <Grid container spacing={4} display="flex" justifyContent="center">
        {Object.entries(stats).map(([key, value]) => (
          <Grid size={4} minHeight={200} key={key}>
            {isStatisticsLoading ? (
              <StatsSkeleton />
            ) : (
              <StatsGridCard
                title={titleMapping[key as keyof typeof titleMapping]}
                color={colorMapping[key as keyof typeof colorMapping]}
                value={value}
              />
            )}
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default StatsGrid;
