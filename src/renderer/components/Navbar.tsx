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
import { fetchMapDisplayName, fetchMapImage } from "../../main/api/getAssets/getMapAssets.mjs";
import { fetchMap, fetchMode } from "../../main/api/getMatch/getMatchInfo.mjs";
import { handleClick } from "../../main/helpers";
import Link from "@mui/material/Link";

function Navbar() {
  const [mapImage, setMapImage] = useState("");
  const [mapId, setMapId] = useState("");
  const [mode, setMode] = useState("");
  const [mapDisplayName, setMapDisplayName] = useState("");

  useEffect(() => {
    const interval = setInterval(async () => {
      setMapId(await fetchMap());
      setMode(await fetchMode());
    }, 5000);

    // Cleanup the interval when the component unmounts
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMapAssets = async () => {
      if (mapId !== "") {
        setMapImage(await fetchMapImage(mapId));
        setMapDisplayName(await fetchMapDisplayName(mapId));
      } else {
        setMapImage("");
        setMapDisplayName("");
      }
    };

    fetchMapAssets();
  }, [mapId]);

  const [lastRefresh, setLastRefresh] = useState(() => {
    const localStorageValue = localStorage.getItem("lastRefresh");
    return parseInt(localStorageValue ?? "0", 10);
  });

  const handleRefreshClick = () => {
    // Get the current time
    const currentTime = Date.now();

    // Check if at least 1 minute has passed since the previous refresh
    if (currentTime - lastRefresh >= 30000) {
      // Set the last refresh time to the current time
      setLastRefresh(currentTime);
      localStorage.setItem("lastRefresh", currentTime.toString());

      // Refresh the page
      window.location.reload();
    } else {
      // Display an error message or notification
      alert("You tried to refresh too soon. This can cause problems with displaying statistics and ranks. Try again in 30 seconds.");
    }
  };

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
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <Link
                href="https://github.com/yvanlok/valorcheck"
                onClick={(e) => handleClick(e, "https://github.com/yvanlok/valorcheck")}
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
            <Box
              sx={{
                display: "flex",
                flexGrow: 0.5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "30%",
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
                  {mode ? mode.charAt(0).toUpperCase() + mode.slice(1) : ""}
                </Typography>
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundImage: `url(${mapImage})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat",
                  width: "35%",
                  borderRadius: "5", // add borderRadius
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
            </Box>

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
                <IconButton sx={{ p: 0 }} onClick={handleRefreshClick}>
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
