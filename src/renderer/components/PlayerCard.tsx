import React, { useState, useEffect } from "react";
import theme from "../theme";
import {
  Box,
  CssBaseline,
  ThemeProvider,
  Card,
  Typography,
  Tooltip,
} from "@mui/material";

import {
  getRankImage,
  getRankName,
} from "../../main/api/getAssets/getRankAssets.mjs";

import { getAccount } from "../../main/api/getPlayers/getPlayerData.mjs";
import {
  fetchCurrentRank,
  fetchPeakRank,
  fetchRankHenrik,
} from "../../main/api/getPlayers/getPlayerRank.mjs";
import {
  getAgentImage,
  getAgentDisplayName,
} from "../../main/api/getAssets/getCharacterAssets.mjs";
import { fetchTopPlayedAgent } from "../../main/api/getStats/getTopPlayedAgent.mjs";
import { fetchAllMatchResults } from "../../main/api/getStats/getMatches.mjs";
import { fetchKD } from "../../main/api/getStats/getKD.mjs";
import { fetchWinPercent } from "../../main/api/getStats/getWinPercentage.mjs";
import {
  fetchPuuid,
  getNameTagFromPuuid,
} from "../../main/api/basicHelpers.mjs";
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
  const {
    isPlayer = false,
    preGame,
    agentID,
    playerID,
    playerCardId,
    queue,
    accountLvl,
    rank,
  } = props;
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
    const fetchAccountDetails = async () => {
      if (isPlayer) {
        const response = await getAccount(puuid);
        const accountResponse = response as AccountResponse;
        setAccountLevel(accountResponse.data.account_level);
        setPlayerCard(accountResponse.data.card.wide);
        setPlayerName(
          `${accountResponse.data.name}#${accountResponse.data.tag}`
        );
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
  }, [puuid]);
  useEffect(() => {
    const fetchRankAssets = async () => {
      setRankSrc(await getRankImage(rankTier));
      setRankName(await getRankName(rankTier));

      setPeakRankSrc(await getRankImage(peakRankTier));
      setPeakRankName(await getRankName(peakRankTier));
    };

    fetchRankAssets();
  }, [rankTier, peakRankTier]);

  useEffect(() => {
    const fetchAgentAssets = async () => {
      if (preGame || isPlayer) {
        await setAgentUUID(await fetchTopPlayedAgent(matchData));
      }
      setAgentSrc(await getAgentImage(agentUUID));
      setAgentName(await getAgentDisplayName(agentUUID));
    };

    fetchAgentAssets();
  }, [agentUUID, preGame, matchData]);

  useEffect(() => {
    const fetchStats = async () => {
      const KD = await fetchKD(matchData);
      setPlayerKD(Number.isNaN(KD) ? 0 : KD);
      setPlayerWinPercentage(await fetchWinPercent(puuid));
    };
    fetchStats();
  }, [matchData, puuid]);

  useEffect(() => {
    const player = async () => {
      if (isPlayer) {
        setPuuid(await fetchPuuid());
      }
    };
    player();
  }, [isPlayer]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Card sx={{ borderBottom: 2, borderColor: theme.palette.primary.main }}>
        <Box
          sx={{
            width: queue === "deathmatch" ? "50vw" : "50vw",
            height:
              queue === "deathmatch" ? "14vh" : isPlayer ? "18vh" : "16.5vh",
            backgroundImage: `url(${playerCard})`,
            backgroundSize: "100% 100%", // set backgroundSize to stretch the image to fill the Box
            backgroundPosition: "center",
            position: "relative",
          }}
        >
          <Tooltip title="Player's Account Level" arrow>
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                left: 0,
                backgroundColor: theme.palette.primary.main,
                borderRadius: "1",
                width: "5%",
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
                  fontSize:
                    accountLevel && accountLevel.toString().length > 2
                      ? "16px"
                      : "20px",
                  color: "#9575CD",
                }}
                style={{ color: "#9575CD" }}
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
            <Tooltip
              title={
                preGame || isPlayer ? `Top played: ${agentName}` : agentName
              }
            >
              <Box
                sx={{
                  backgroundImage: `url(${agentSrc})`,
                  backgroundSize: "80%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat", // Prevent repeating the image
                  width: "20%",
                  height: "100%",
                }}
              ></Box>
            </Tooltip>
            <Box
              sx={{
                width: "auto",
              }}
            >
              <Box
                sx={{
                  backgroundColor: theme.palette.primary.main,
                  borderRadius: "5px",
                  padding: "0rem 0.5rem",
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
                    <Link
                      color="inherit"
                      href={playerTracker}
                      onClick={(e) => handleClick(e, playerTracker)}
                    >
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
                  left: 0,
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
                <Tooltip
                  title={`Player's Peak Rank: ${peakRankName}`}
                  arrow
                  placement="right"
                >
                  <Box
                    sx={{
                      backgroundImage: `url(${peakRankSrc})`,
                      minHeight: "35px", // Set a minimum height for the box

                      minWidth: "35px",
                      height: "120%",
                      display: "flex",
                      marginLeft: "5px",
                      backgroundSize: "100%",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat", // Prevent repeating the image
                    }}
                  ></Box>
                </Tooltip>
              </Box>
            </Box>
            <Tooltip title={rankName}>
              <Box
                sx={{
                  backgroundImage: `url(${rankSrc})`,
                  backgroundSize: "80%",
                  backgroundPosition: "center",
                  backgroundRepeat: "no-repeat", // Prevent repeating the image
                  width: "20%",
                  height: "100%",
                }}
              ></Box>
            </Tooltip>
          </Box>
        </Box>
      </Card>
    </ThemeProvider>
  );
};

export default PlayerCard;
