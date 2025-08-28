import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#1976d2" },
    secondary: { main: "#9c27b0" },
  },
  customColors: {
    sampleGray: "#BDBABB",
    jumpRed: "#C40233",
    nonJumpGreen: "#127852",
  },
});

declare module "@mui/material/styles" {
  interface Theme {
    customColors: {
      sampleGray: string;
      jumpRed: string;
      nonJumpGreen: string;
    };
  }
  interface ThemeOptions {
    customColors?: {
      sampleGray?: string;
      jumpRed?: string;
      nonJumpGreen?: string;
    };
  }
}

export default theme;
