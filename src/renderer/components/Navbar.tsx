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
import Link from "@mui/material/Link";

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
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            {/* Brand Name */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Link
                href="https://github.com/yvanlok/valorcheck"
                onClick={(e) =>
                  handleClick(e, "https://github.com/yvanlok/valorcheck")
                }
                underline="hover"
              >
                <Typography
                  variant="subtitle1"
                  component="div"
                  sx={{
                    fontFamily: "Roboto",
                    textAlign: "center",
                    fontWeight: "bold",
                    fontSize: 20,
                    flexGrow: 1,
                  }}
                >
                  ValorCheck
                </Typography>
              </Link>
            </Box>

            {/* Centered Box */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundImage: `url(${mapImage})`,
                backgroundSize: "contain",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                width: "30%", // set a fixed width for the box
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

            {/* Icons */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Tooltip title="Open settings">
                <IconButton sx={{ p: 0 }}>
                  <SettingsIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Refresh page">
                <IconButton sx={{ p: 0 }}>
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
