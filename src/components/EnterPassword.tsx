import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  Typography,
  CircularProgress,
  Button,
  TextField,
  Paper,
} from "@mui/material";

const EnterPassword = () => {
  const { login, isLoadingAuth } = useAuth();
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    await login(password);
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
        <TextField
          sx={{ mt: 2 }}
          type="password"
          label="Password"
          variant="outlined"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
