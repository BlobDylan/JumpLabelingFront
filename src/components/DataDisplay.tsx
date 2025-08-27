import { Box, CircularProgress } from "@mui/material";
import GeoScene from "./GeoScene";
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
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isDataLoading ? <CircularProgress /> : <GeoScene data={data} />}
    </Box>
  );
};

export default DataDisplay;
