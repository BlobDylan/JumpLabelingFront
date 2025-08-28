import { Skeleton } from "@mui/material";

const StatsSkeleton = () => {
  return (
    <Skeleton
      variant="rectangular"
      width="100%"
      height={90}
      sx={{ borderRadius: 1 }}
    />
  );
};

export default StatsSkeleton;
