import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Typography,
  CircularProgress,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  OutlinedInput,
} from "@mui/material";
import { useSnackbar } from "notistack";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const EnterPassword = () => {
  const { login, isLoadingAuth } = useAuth();
  const [password, setPassword] = useState("");
  const { enqueueSnackbar } = useSnackbar();
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    const success = await login(password);
    if (success) {
      enqueueSnackbar("Login successful", { variant: "success" });
    } else {
      enqueueSnackbar("Login failed", { variant: "error" });
    }
  };

  return (
    <Paper
      sx={{
        mt: 10,
        mx: "auto",
        width: 300,
        p: 3,
        textAlign: "center",
        boxShadow: 3,
      }}
    >
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleLogin();
        }}
      >
        <Typography variant="h6" sx={{ mb: 0 }}>
          Enter Password
        </Typography>
        <OutlinedInput
          id="outlined-adornment-password"
          type={showPassword ? "text" : "password"}
          onChange={(e) => setPassword(e.target.value)}
          endAdornment={
            <InputAdornment position="end">
              <IconButton
                aria-label={
                  showPassword ? "hide the password" : "display the password"
                }
                onClick={() => setShowPassword((show) => !show)}
                edge="end"
                disableRipple
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
        />
        {isLoadingAuth ? (
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
            type="submit"
            disabled
            fullWidth
          >
            <CircularProgress size={24} />
          </Button>
        ) : (
          <Button
            sx={{ mt: 2 }}
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
          >
            Login
          </Button>
        )}
      </form>
    </Paper>
  );
};

export default EnterPassword;
