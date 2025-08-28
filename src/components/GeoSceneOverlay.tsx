// GeoSceneOverlay.tsx
import { Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const GeoSceneOverlay = () => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        position: "absolute",
        top: 16,
        left: 16,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        backgroundColor: "rgba(255,255,255,0.8)",
        boxShadow: 2,
        width: "10%",
        height: "10%",
        minWidth: 120,
        minHeight: 70,
      }}
    >
      {/* Non-jump */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            bgcolor: theme.customColors.nonJumpGreen,
            borderRadius: 0.5,
          }}
        />
        <Typography variant="body2" color="text.primary">
          Non-jump
        </Typography>
      </Box>

      {/* Jump */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <Box
          sx={{
            width: 16,
            height: 16,
            bgcolor: theme.customColors.jumpRed,
            borderRadius: 0.5,
          }}
        />
        <Typography variant="body2" color="text.primary">
          Jump
        </Typography>
      </Box>
    </Box>
  );
};

export default GeoSceneOverlay;
