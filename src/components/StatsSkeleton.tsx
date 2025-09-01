import { Skeleton } from "@mui/material";

const StatsSkeleton = () => {
  return (
    <Skeleton
      variant="rectangular"
      width="100%"
      sx={{ minHeight: 150, borderRadius: 1 }}
    />
  );
};

export default StatsSkeleton;
