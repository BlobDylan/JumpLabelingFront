import { Container, Box, CssBaseline, Drawer, IconButton } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import DataDisplay from "./components/DataDisplay";
import ActionToolbar from "./components/ActionToolbar";
import StatsGrid from "./components/StatsGrid";
import Files from "./components/Files";
import EnterPassword from "./components/EnterPassword";
import theme from "./Theme";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { useData } from "./hooks/useData";
import { DataProvider } from "./hooks/useData";
import { AuthProvider } from "./hooks/useAuth";
import { SnackbarProvider } from "notistack";
import { Typography, Stack } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { fetchDirectoryData } = useData();

  const handleDrawerOpen = () => {
    fetchDirectoryData();
    setDrawerOpen(true);
  };

  return (
    <>
      {isAuthenticated ? (
        <Container maxWidth="xl" sx={{ mt: 2, mb: 4 }}>
          <Stack
            direction={"row"}
            alignItems="center"
            justifyContent={"space-between"}
            sx={{ mt: 0, mb: 2 }}
          >
            <Typography variant="h4">Jump Labeling</Typography>
            <IconButton
              color="inherit"
              aria-label="menu"
              onClick={handleDrawerOpen}
              disableFocusRipple
              disableTouchRipple
            >
              <MenuOpenIcon />
            </IconButton>
          </Stack>
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
            sx={{ "& .MuiDrawer-paper": { width: "20dvw", minWidth: 300 } }}
          >
            <Files close={() => setDrawerOpen(false)} />
          </Drawer>
        </Container>
      ) : (
        <EnterPassword />
      )}
    </>
  );
}
function App() {
  return (
    <SnackbarProvider maxSnack={3}>
      <AuthProvider>
        <DataProvider>
          <CssBaseline />
          <ThemeProvider theme={theme}>
            <MainLayout />
          </ThemeProvider>
        </DataProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
