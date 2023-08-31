import { Box, CssBaseline, ThemeProvider, Divider } from "@mui/material";
import React from "react";
import theme from "../theme";
import PlayerGrid from "./PlayerGrid";
import Navbar from "./Navbar";

export default function App(): JSX.Element {
  return (
    // Setup theme and css baseline for the Material-UI app
    // https://mui.com/customization/theming/
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main>
        {/* List of players */}
        <Navbar />
        {/* Customize the Divider */}
        <Divider
          variant="middle"
          sx={{
            marginBottom: 2,
            borderColor: theme.palette.primary.main, // Change color to match your design
          }}
        />
        <PlayerGrid />
      </main>
    </ThemeProvider>
  );
}
