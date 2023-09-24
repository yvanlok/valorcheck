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
import { fetchMapImage } from "../../main/api/getAssets/getMapAssets.mjs";
import { fetchMap, fetchMode } from "../../main/api/getMatch/getMatchInfo.mjs";
import { handleClick } from "../../main/helpers";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Unstable_Grid2";

function Navbar() {
  const [mapImage, setMapImage] = useState("");
  const [mapId, setMapId] = useState("");
  const [mode, setMode] = useState("");
  const [refreshCountdown, setRefreshCountdown] = useState(60);

  useEffect(() => {
    const interval = setInterval(async () => {
      setMapId(await fetchMap());
      setMode(await fetchMode());
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchMapAssets = async () => {
      if (mapId !== "") {
        setMapImage(await fetchMapImage(mapId));
      } else {
        setMapImage("");
      }
    };

    fetchMapAssets();
  }, [mapId]);

  const handleRefreshClick = () => {
    setRefreshCountdown(60);
  };

  useEffect(() => {
    const countdownInterval = setInterval(() => {
      setRefreshCountdown((prevCountdown) => prevCountdown - 1);

      if (refreshCountdown === 0) {
        window.location.reload();
      }
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [refreshCountdown]);

  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Container maxWidth={false}>
        <Toolbar disableGutters>
          <Box
            sx={{
              width: "100%",
            }}
          >
            <Grid container>
              <Grid xs={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-start",
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
              </Grid>
              <Grid xs={6}>
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
                      backgroundImage: `url(${mapImage})`,
                      backgroundSize: "contain",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                      width: "50%",
                      borderRadius: "5px",
                      alignSelf: "absolute",
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
                </Box>
              </Grid>
              <Grid xs={3}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Roboto",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 20,
                      marginRight: "20px",
                    }}
                  >
                    {`Refreshing in ${refreshCountdown}s`}
                  </Typography>
                  <Tooltip title="Open settings">
                    <IconButton sx={{ p: 0 }}>
                      <SettingsIcon />
                    </IconButton>
                  </Tooltip>
                  <IconButton sx={{ p: 0 }} onClick={handleRefreshClick}>
                    <RefreshIcon />
                  </IconButton>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default Navbar;
