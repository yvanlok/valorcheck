// Importing necessary components and icons from the MUI library
import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";

import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";

// Defining a functional component called "Navbar"
function Navbar() {
  return (
    // Creating an AppBar (navigation bar) with a static position
    <AppBar position="static" color="transparent" elevation={0}>
      {/* Using a container to control the layout within the AppBar */}
      <Container maxWidth="xl">
        {/* Creating a Toolbar to hold the content of the AppBar */}

        <Toolbar disableGutters>
          <Typography variant="subtitle1" component="div">
            ValorCheck
          </Typography>
          {/* Creating a Box to hold the IconButton */}
          <Box sx={{ flexGrow: 0 }}>
            {/* Adding a Tooltip to provide additional information on hover */}
            <Tooltip title="Open settings">
              {/* Adding an IconButton with custom styling */}
              <IconButton sx={{ p: 0 }}>
                {/* Using the SettingsIcon as the icon */}
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box sx={{ flexGrow: 0 }}>
            {/* Adding a Tooltip to provide additional information on hover */}
            <Tooltip title="Open settings">
              {/* Adding an IconButton with custom styling */}
              <IconButton sx={{ p: 0 }}>
                {/* Using the SettingsIcon as the icon */}
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

// Exporting the Navbar component as the default export of this module
export default Navbar;
