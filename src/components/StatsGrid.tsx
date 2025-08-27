import { Grid, Paper, Typography, IconButton } from "@mui/material";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useData } from "../hooks/useData";
import type { Statistics } from "../types";

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

const colorMapping = {
  current_total: "Grey",
  current_label_0: "Green",
  current_label_1: "Red",
  total_samples: "Grey",
  total_label_0: "Green",
  total_label_1: "Red",
};

const StatsGrid = () => {
  const { statistics, originalFileName, fetchStatistics } = useData();
  const stats = constructStats(statistics, originalFileName);

  return (
    <>
      <IconButton onClick={fetchStatistics} disableFocusRipple disableRipple>
        <RefreshIcon />
        <Typography>Refresh Stats</Typography>
      </IconButton>

      <Grid container spacing={8} justifyContent="center">
        {Object.entries(stats).map(([key, value]) => (
          <Grid size={4} key={key}>
            <Paper
              sx={{
                p: 2,
                textAlign: "center",
                backgroundColor: colorMapping[key as keyof typeof colorMapping],
              }}
            >
              <Typography variant="h6">{key.replace(/_/g, " ")}</Typography>
              <Typography>{value}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default StatsGrid;
