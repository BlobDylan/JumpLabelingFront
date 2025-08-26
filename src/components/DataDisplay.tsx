import { Box } from "@mui/material";
import GeoScene from "./GeoScene";
import { useData } from "../hooks/useData";

const DataDisplay = () => {
  const { data } = useData();
  return (
    <Box
      sx={{
        height: "70dvh",
        backgroundColor: "darkgrey",
        border: "1px solid grey",
      }}
    >
      <GeoScene data={data} />
    </Box>
  );
};

export default DataDisplay;
