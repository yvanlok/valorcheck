import React from "react";
import theme from "../theme";
import { CssBaseline, ThemeProvider, Divider } from "@mui/material";

type Props = {
  rotate?: boolean;
};

const PrimaryDivider = (props: Props) => {
  const { rotate = false } = props;
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Divider
        variant="middle"
        sx={{
          marginBottom: 1,
          marginTop: 1,
          borderColor: theme.palette.primary.main, // Change color to match your design
        }}
        orientation={rotate ? "vertical" : "horizontal"} // Fix the conditional orientation setting
      />
    </ThemeProvider>
  );
};

export default PrimaryDivider;
