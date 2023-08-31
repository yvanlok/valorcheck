import React, { useEffect, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Tooltip from "@mui/material/Tooltip";
import SettingsIcon from "@mui/icons-material/Settings";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  fetchMapDisplayName,
  fetchMapImage,
} from "../../main/api/getAssets/getMapAssets.mjs";
import { fetchMap } from "../../main/api/getMatch/getMatchInfo.mjs";
import { handleClick } from "../../main/helpers";

function Navbar() {
  const [mapImage, setMapImage] = useState("");
  const [mapDisplayName, setMapDisplayName] = useState("");
  useEffect(() => {
    const interval = setInterval(async () => {
      const mapId = await fetchMap();

      setMapImage(await fetchMapImage(mapId));
      setMapDisplayName(await fetchMapDisplayName(mapId));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <a
              href="https://github.com/yvanlok/valorcheck"
              onClick={(e) =>
                handleClick(e, "https://github.com/yvanlok/valorcheck")
              }
            >
              <img src="https://svgshare.com/i/x9q.svg"></img>
            </a>
            <Typography
              variant="subtitle1"
              component="div"
              sx={{
                flexGrow: 1,
                fontFamily: "Roboto",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              ValorCheck
            </Typography>
          </Box>

          <Box
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography
              sx={{
                fontFamily: "Roboto",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: 20,
              }}
            >
              {mapDisplayName}
            </Typography>
          </Box>
          <Box>
            <Tooltip title="Open settings">
              <IconButton sx={{ p: 0 }}>
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Box>
            <Tooltip title="Refresh page">
              <IconButton sx={{ p: 0 }}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
