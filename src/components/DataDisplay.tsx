import { Box, CircularProgress } from "@mui/material";
import GeoScene from "./GeoScene";
import GeoSceneOverlay from "./GeoSceneOverlay";
import { useData } from "../hooks/useData";

const DataDisplay = () => {
  const { data, isDataLoading } = useData();
  return (
    <Box
      sx={{
        height: "70dvh",
        backgroundColor: "darkgrey",
        border: "1px solid grey",
        display: "flex",
        position: "relative",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <GeoSceneOverlay />
      {isDataLoading ? <CircularProgress /> : <GeoScene data={data} />}
    </Box>
  );
};

export default DataDisplay;
