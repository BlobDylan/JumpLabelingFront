import { Paper, Typography } from "@mui/material";

interface StatsGridCardProps {
  title: string;
  color: string;
  value: number;
}

const StatsGridCard: React.FC<StatsGridCardProps> = ({
  title,
  color,
  value,
}) => {
  return (
    <Paper
      sx={{
        p: 2,
        textAlign: "center",
        backgroundColor: color,
        boxShadow: 10,
        minHeight: 150,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Typography variant="h6">{title}</Typography>
      <Typography>{value}</Typography>
    </Paper>
  );
};

export default StatsGridCard;
