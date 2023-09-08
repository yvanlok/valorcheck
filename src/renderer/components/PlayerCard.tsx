import React, { useState, useEffect } from "react";
import theme from "../theme";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2

import { Box, CssBaseline, ThemeProvider, Card, Typography, Tooltip } from "@mui/material";
import { getRankImage, getRankName } from "../../main/api/getAssets/getRankAssets.mjs";
import { getAccount } from "../../main/api/getPlayers/getPlayerData.mjs";
import { fetchPeakRank, fetchRankHenrik } from "../../main/api/getPlayers/getPlayerRank.mjs";
import { getAgentImage, getAgentDisplayName } from "../../main/api/getAssets/getCharacterAssets.mjs";
import { fetchTopPlayedAgent } from "../../main/api/getStats/getTopPlayedAgent.mjs";
import { fetchAllMatchResults } from "../../main/api/getStats/getMatches.mjs";
import { fetchKD } from "../../main/api/getStats/getKD.mjs";
import { fetchWinPercent } from "../../main/api/getStats/getWinPercentage.mjs";
import { fetchPuuid, getNameTagFromPuuid } from "../../main/api/basicHelpers.mjs";
import { getCardImage } from "../../main/api/getAssets/getPlayerCardAssets.mjs";
import { fetchTracker } from "../../main/api/getStats/getTracker.mjs";
import Link from "@mui/material/Link";
import { handleClick } from "../../main/helpers";

type AccountResponse = {
  data: {
    puuid: string;
    region: string;
    account_level: number;
    name: string;
    tag: string;
    card: {
      small: string;
      large: string;
      wide: string;
      id: string;
    };
    last_update: string;
    last_update_raw: number;
  };
};

type Props = {
  isPlayer?: boolean;
  preGame?: boolean;
  agentID?: string;
  playerID?: string;
  playerCardId?: string;
  queue?: string;
  accountLvl?: number;
  rank?: number;
};

const PlayerCard = (props: Props) => {
  const { isPlayer = false, preGame, agentID, playerID, playerCardId, accountLvl, rank, queue } = props;
  const [rankSrc, setRankSrc] = useState("");
  const [rankName, setRankName] = useState("");
  const [peakRankSrc, setPeakRankSrc] = useState("");
  const [peakRankName, setPeakRankName] = useState("");
  const [playerCard, setPlayerCard] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [accountLevel, setAccountLevel] = useState<number>();
  const [puuid, setPuuid] = useState(playerID);
  const [rankTier, setRankTier] = useState(rank);
  const [peakRankTier, setPeakRankTier] = useState<number>();
  const [agentSrc, setAgentSrc] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentUUID, setAgentUUID] = useState(agentID);
  const [matchData, setMatchData] = useState({});
  const [playerKD, setPlayerKD] = useState(0);
  const [playerWinPercentage, setPlayerWinPercentage] = useState(0);
  const [playerTracker, setPlayerTracker] = useState("");

  useEffect(() => {
    const defineMatchData = async () => {
      const response = await fetchAllMatchResults(puuid);
      setMatchData(response);
    };

    defineMatchData();
  }, [puuid]);

  useEffect(() => {
    const fetchStats = async () => {
      const KD = await fetchKD(matchData);
      const winPercent = await fetchWinPercent(puuid);
      setPlayerKD(Number.isNaN(KD) ? 0 : KD);
      setPlayerWinPercentage(winPercent);
      if (preGame || isPlayer) {
        await setAgentUUID(await fetchTopPlayedAgent(matchData));
      }
    };
    fetchStats();
  }, [puuid, matchData]);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      if (isPlayer) {
        setPuuid(await fetchPuuid());
        const response = await getAccount(puuid);
        const accountResponse = response as AccountResponse;
        setAccountLevel(accountResponse.data.account_level);
        setPlayerCard(accountResponse.data.card.wide);
        setPlayerName(`${accountResponse.data.name}#${accountResponse.data.tag}`);
      } else {
        const nameTag = await getNameTagFromPuuid(puuid);
        if (nameTag?.name && nameTag?.tag) {
          setPlayerName(`${nameTag.name}#${nameTag.tag}`);
        }
        setAccountLevel(accountLvl);
        setPlayerCard(await getCardImage(playerCardId));
      }
      if (rankTier === 0 || rank === undefined) {
        const response = await fetchRankHenrik(puuid);

        setRankTier(response.currentRank);
        setPeakRankTier(response.peakRank);
      } else {
        setPeakRankTier(await fetchPeakRank(puuid));
      }
      setPlayerTracker(await fetchTracker(puuid));
    };

    fetchAccountDetails();
  }, [puuid, isPlayer]);

  useEffect(() => {
    const fetchAgentAssets = async () => {
      setAgentSrc(await getAgentImage(agentUUID));
      setAgentName(await getAgentDisplayName(agentUUID));
    };
    const fetchRankAssets = async () => {
      setRankSrc(await getRankImage(rankTier));
      setRankName(await getRankName(rankTier));

      setPeakRankSrc(await getRankImage(peakRankTier));
      setPeakRankName(await getRankName(peakRankTier));
    };

    fetchRankAssets();
    fetchAgentAssets();
  }, [agentUUID, preGame, matchData, rankTier, peakRankTier]);

  return (
    <Grid>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Card sx={{ borderBottom: 2, borderColor: theme.palette.primary.main }} style={{ backgroundColor: "rgb(0,0,0)" }}>
          <Box
            sx={{
              width: "100%",
              height: queue === "deathmatch" ? "14.5vh" : "17.5vh",
              position: "relative",
            }}
          >
            <img
              src={playerCard}
              alt="Player Card"
              style={{
                width: "100%", // Make the image width 100%
                height: "100%", // Make the image height 100%
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                opacity: 0.6,
                zIndex: 1,
              }}
            />

            <Tooltip title="Player's Account Level" arrow>
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: "1",
                  width: "8%",
                  zIndex: 3,
                }}
                style={{
                  padding: "0.01rem 1rem",
                  borderTopRightRadius: "6px",
                }}
              >
                <Typography
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    fontFamily: "Roboto",
                    fontWeight: "bold",
                    fontSize: "22px",
                    color: "#9575CD",
                  }}
                >
                  {accountLevel}
                </Typography>
              </Box>
            </Tooltip>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
                height: "100%",
                padding: "0 1rem",
              }}
            >
              <Tooltip title={preGame || isPlayer ? `Top played: ${agentName}` : agentName}>
                <img
                  src={agentSrc}
                  alt="Agent"
                  style={{
                    width: "20%",
                    height: "auto",
                    marginLeft: "8px",
                    position: "relative",
                    zIndex: 2,
                  }}
                />
              </Tooltip>

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column", // Stack elements vertically
                  alignItems: "center", // Center elements horizontally
                }}
              >
                <Box
                  sx={{
                    backgroundColor: theme.palette.primary.main,
                    borderRadius: "5px",
                    padding: "0rem 0.5rem",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Roboto",
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "20",
                    }}
                    style={{ color: "#9575CD" }}
                  >
                    {playerTracker !== "" ? (
                      <Link color="inherit" href={playerTracker} onClick={(e) => handleClick(e, playerTracker)}>
                        {playerName}
                      </Link>
                    ) : (
                      playerName
                    )}
                  </Typography>
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    position: "absolute",
                    bottom: "5%",
                    width: "100%",
                  }}
                >
                  <Tooltip title="Player's KD" arrow placement="left">
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: "50%",
                        width: "35px",
                        height: "35px",
                        marginRight: "5px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Roboto",
                          fontWeight: "bold",
                          fontSize: "12",
                        }}
                        style={{ color: "#9575CD" }}
                      >
                        {playerKD.toFixed(2)}
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip title="Player's Win %" arrow placement="bottom">
                    <Box
                      sx={{
                        backgroundColor: theme.palette.primary.main,
                        borderRadius: "50%",
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          fontFamily: "Roboto",
                          fontWeight: "bold",
                          fontSize: "12",
                        }}
                        style={{ color: "#9575CD" }}
                      >
                        {playerWinPercentage.toFixed(1)}%
                      </Typography>
                    </Box>
                  </Tooltip>
                  <Tooltip title={`Player's Peak Rank: ${peakRankName}`} arrow placement="right">
                    <Box
                      sx={{
                        width: "35px",
                        height: "35px",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 2,
                        marginLeft: "5px", // Add margin to match the spacing
                      }}
                    >
                      <img
                        src={peakRankSrc}
                        alt="Peak Rank"
                        style={{
                          width: "100%", // Make the image stretch to fit the box width
                          height: "100%", // Make the image stretch to fit the box height
                          objectFit: "cover", // Stretch the image to cover the entire box
                        }}
                      />
                    </Box>
                  </Tooltip>
                </Box>
              </Box>

              <Tooltip title={rankName}>
                <img
                  src={rankSrc}
                  alt="Rank"
                  style={{
                    width: "16%", // Reduce the width to 80% of its original size
                    height: "auto", // Allow the height to adjust proportionally
                    marginLeft: "8px",
                    position: "relative",
                    zIndex: 2,
                  }}
                />
              </Tooltip>
            </Box>
          </Box>
        </Card>
      </ThemeProvider>
    </Grid>
  );
};

export default PlayerCard;
