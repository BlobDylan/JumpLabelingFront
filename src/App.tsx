import { Container, Box, CssBaseline, Drawer, IconButton } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import DataDisplay from "./components/DataDisplay";
import ActionToolbar from "./components/ActionToolbar";
import StatsGrid from "./components/StatsGrid";
import Files from "./components/Files";
import { useState } from "react";
import { DataProvider } from "./hooks/useData";
import { SnackbarProvider } from "notistack";

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <DataProvider>
      <SnackbarProvider maxSnack={3}>
        <CssBaseline />
        <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
          <IconButton
            sx={{ position: "absolute", top: 16, right: 16 }}
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuOpenIcon />
          </IconButton>
          <Box width="100%">
            <DataDisplay />
            <ActionToolbar />
          </Box>
          <Box width="100%">
            <StatsGrid />
          </Box>
          <Drawer
            anchor="right"
            open={drawerOpen}
            onClose={() => setDrawerOpen(false)}
            sx={{ width: "30dvw" }}
          >
            <Files />
          </Drawer>
        </Container>
      </SnackbarProvider>
    </DataProvider>
  );
}

export default App;
