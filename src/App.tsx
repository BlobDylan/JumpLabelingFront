import { Container, Box, CssBaseline, Drawer, IconButton } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import DataDisplay from "./components/DataDisplay";
import ActionToolbar from "./components/ActionToolbar";
import StatsGrid from "./components/StatsGrid";
import Files from "./components/Files";
import EnterPassword from "./components/EnterPassword";
import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import { DataProvider } from "./hooks/useData";
import { AuthProvider } from "./hooks/useAuth";
import { SnackbarProvider } from "notistack";

function MainLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isAuthenticated } = useAuth();

  return (
    <>
      {isAuthenticated ? (
        <Container maxWidth="xl" sx={{ mt: 10, mb: 4 }}>
          <IconButton
            sx={{ position: "absolute", top: 16, right: 16 }}
            color="inherit"
            aria-label="menu"
            onClick={() => setDrawerOpen(true)}
            disableFocusRipple
            disableTouchRipple
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
      ) : (
        <EnterPassword />
      )}
    </>
  );
}
function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <SnackbarProvider maxSnack={3}>
          <CssBaseline />
          <MainLayout />
        </SnackbarProvider>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
