import { CssBaseline, ThemeProvider, Divider } from "@mui/material";
import React from "react";
import theme from "../theme";
import PlayerGrid from "./PlayerGrid";
import Navbar from "./Navbar";
import PrimaryDivider from "./PrimaryDivider";

export default function App(): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <main style={{ marginTop: "-0.5rem" }}>
        <Navbar />
        <Divider
          variant="middle"
          sx={{
            marginBottom: 1,
            marginTop: -1,
            borderColor: theme.palette.primary.main, // Change color to match your design
          }}
        />
        <PlayerGrid />
      </main>
    </ThemeProvider>
  );
}
