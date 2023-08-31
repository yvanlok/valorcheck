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
import { fetchCurrentRank } from "../../main/api/getPlayers/getPlayerRank.mjs";
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
  } = props;
  const [rankSrc, setRankSrc] = useState("");
  const [rankName, setRankName] = useState("");
  const [playerCard, setPlayerCard] = useState("");
  const [playerName, setPlayerName] = useState("");
  const [accountLevel, setAccountLevel] = useState<number>();
  const [puuid, setPuuid] = useState(playerID);
  const [rankTier, setRankTier] = useState();
  const [agentSrc, setAgentSrc] = useState("");
  const [agentName, setAgentName] = useState("");
  const [agentUUID, setAgentUUID] = useState(agentID);
  const [matchData, setMatchData] = useState({});
  const [playerKD, setPlayerKD] = useState(0);
  const [playerWinPercentage, setPlayerWinPercentage] = useState(0);
  useEffect(() => {
    const defineMatchData = async () => {
      const response = await fetchAllMatchResults(puuid);
      setMatchData(response);
    };

    defineMatchData();
  }, [puuid]);

  useEffect(() => {
    const fetchAccountDetails = async () => {
      // Set the initial value of `rank` to `undefined`
      let rank: number | undefined = undefined;

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
      setRankTier(await fetchCurrentRank(puuid));
    };

    fetchAccountDetails();
  }, [puuid]);
  useEffect(() => {
    const fetchRankAssets = async () => {
      setRankSrc(await getRankImage(rankTier));
      setRankName(await getRankName(rankTier));
    };

    fetchRankAssets();
  }, [rankTier]);

  useEffect(() => {
    const fetchAgentAssets = async () => {
      if (preGame) {
        await setAgentUUID(await fetchTopPlayedAgent(matchData));
      }
      setAgentSrc(await getAgentImage(agentUUID));
      setAgentName(await getAgentDisplayName(agentUUID));
    };

    fetchAgentAssets();
  }, [agentUUID, preGame, matchData]);

  useEffect(() => {
    const fetchStats = async () => {
      setPlayerKD(await fetchKD(matchData));
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
      <Card variant="outlined">
        <Box
          sx={{
            width: "50vw",
            height: "13vh",
            backgroundImage: `url(${playerCard})`,
            backgroundSize: "cover",
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
                borderRadius: "0 100% 0 0",
                width: "5%",
                height: "-5%",
              }}
            >
              <Typography
                sx={{
                  marginBottom: -0.5,
                  marginLeft: 0.1,
                  fontFamily: "Roboto",
                  fontWeight: "bold",
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
            <Tooltip title={preGame ? `Top played: ${agentName}` : agentName}>
              <Box
                sx={{
                  backgroundImage: `url(${agentSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "20%",
                  height: "80%",
                }}
              ></Box>
            </Tooltip>
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontFamily: "Roboto",
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "20",
                }}
                style={{ color: "#9575CD" }}
              >
                {playerName}
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  position: "absolute",
                  bottom: "10%",
                  left: 0,
                  width: "100%",
                }}
              >
                <Tooltip title="Player's KD" arrow placement="left">
                  <Box
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
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
                <Tooltip title="Player's Win %" arrow placement="right">
                  <Box
                    sx={{
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
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
              </Box>
            </Box>
            <Tooltip title={rankName}>
              <Box
                sx={{
                  backgroundImage: `url(${rankSrc})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "20%",
                  height: "80%",
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
