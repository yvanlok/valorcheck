import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Typography } from "@mui/material";
import getLockfileData from "../../main/api/getLockfileData.mjs";
import {
  fetchMatchID,
  fetchPreMatchID,
} from "../../main/api/getMatch/getMatchID.mjs";
import {
  fetchMatch,
  fetchPreMatch,
} from "../../main/api/getMatch/getMatchInfo.mjs";

import PlayerCard from "./PlayerCard";

import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import Stack from "@mui/material/Stack";
import { fetchPuuid, fetchRegion } from "../../main/api/basicHelpers.mjs";
import Team from "./Team";

type Props = {};

interface PlayerData {
  subjectId: string;
  characterId: string;
  team: string;
  accountLvl: number;
  playerCardId: string;
  queueId: string;
  rank: number;
}

const PlayerGrid: React.FC<Props> = (props: Props) => {
  const [isClientRunning, setIsClientRunning] = useState<boolean>(false);
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [match, setMatch] = useState<boolean>(false);
  const [preMatch, setPreMatch] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<PlayerData[]>([]);
  const [puuid, setPuuid] = useState();
  const [isDeathmatch, setIsDeathmatch] = useState(false);

  useEffect(() => {
    const checkForLockfile = async () => {
      const lockfile = await getLockfileData();
      const checkGame = await fetchPuuid();
      setIsClientRunning(lockfile !== undefined ? true : false);
      setIsGameRunning(checkGame !== undefined ? true : false);
    };
    const intervalId = setInterval(checkForLockfile, 500);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const checkForMatch = async () => {
      if (isGameRunning) {
        const match = await fetchMatchID();
        const preMatch = await fetchPreMatchID();
        if (match !== undefined) {
          setMatch(true);
          setPreMatch(false);
        }
        if (preMatch !== undefined) {
          setPreMatch(true);
          setMatch(false);
        }
      }
    };
    const intervalId = setInterval(checkForMatch, 3000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isGameRunning]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      setPuuid(await fetchPuuid());
      let playerData: PlayerData[] = [];
      if (preMatch) {
        const data = await fetchPreMatch();
        playerData = (data as Record<string, any>).AllyTeam.Players.map(
          (player: Record<string, any>) => ({
            subjectId: player.Subject,
            characterId: null,
            team: (data as Record<string, any>).AllyTeam.TeamID,
            accountLvl: player.PlayerIdentity.AccountLevel,
            playerCardId: player.PlayerIdentity.PlayerCardID,
            queueId: (data as Record<string, any>).QueueID,
            rank: player.CompetitiveTier,
          })
        );
      } else if (match) {
        const data = await fetchMatch();
        playerData = (data as Record<string, any>).Players.map(
          (player: Record<string, any>) => ({
            subjectId: player.Subject,
            characterId: player.CharacterID,
            team: player.TeamID,
            accountLvl: player.PlayerIdentity.AccountLevel,
            playerCardId: player.PlayerIdentity.PlayerCardID,
            queueId: (data as Record<string, any>).MatchmakingData.QueueID,
            rank: player.SeasonalBadgeInfo.Rank,
          })
        );
      } else {
        return;
      }

      // Check if the queue is Deathmatch
      const isDeathmatch = playerData.some(
        (player) => player.queueId === "deathmatch"
      );

      setMatchData(playerData as PlayerData[]);
      setIsDeathmatch(isDeathmatch);
    };

    if (isGameRunning && (preMatch || match)) {
      fetchPlayerData();
    }
  }, [isGameRunning, preMatch, match]);

  return (
    <>
      {preMatch || match ? (
        <Grid container spacing={0.5}>
          <Team
            playerData={matchData}
            teamColor="Blue"
            startPlayers={0}
            endPlayers={isDeathmatch ? 6 : 5}
            isDeathmatch={isDeathmatch}
            preGame={preMatch}
          />
          <Team
            playerData={matchData}
            teamColor={isDeathmatch ? "Blue" : "Red"}
            startPlayers={isDeathmatch ? 6 : 0}
            endPlayers={isDeathmatch ? 12 : 5}
            isDeathmatch={isDeathmatch}
            preGame={preMatch}
          />
        </Grid>
      ) : null}

      {isGameRunning && !preMatch && !match ? (
        <Stack spacing={10} justifyContent="center" alignItems="center">
          <div style={{ display: "flex", alignItems: "center" }}>
            <CheckIcon style={{ marginRight: "8px", color: "green" }} />
            <Typography
              sx={{
                fontFamily: "Roboto",
                textAlign: "center",
                fontSize: "20",
              }}
            >
              Valorant running
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <CheckIcon style={{ marginRight: "8px", color: "green" }} />
            <Typography
              sx={{
                fontFamily: "Roboto",
                textAlign: "center",
                fontSize: "20",
              }}
            >
              Client running
            </Typography>
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <CloseIcon style={{ marginRight: "8px", color: "red" }} />
            <Typography
              sx={{
                fontFamily: "Roboto",
                textAlign: "center",
                fontSize: "20",
              }}
            >
              Not in a game
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <PlayerCard isPlayer />
          </div>
        </Stack>
      ) : null}

      {!isClientRunning && !isGameRunning ? (
        <Stack spacing={10} justifyContent="center" alignItems="center">
          <div style={{ display: "flex", alignItems: "center" }}>
            <CloseIcon style={{ marginRight: "8px", color: "red" }} />
            <Typography
              sx={{
                fontFamily: "Roboto",
                textAlign: "center",
                fontSize: "20",
              }}
            >
              Client running
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <CloseIcon style={{ marginRight: "8px", color: "red" }} />
            <Typography
              sx={{
                fontFamily: "Roboto",
                textAlign: "center",
                fontSize: "20",
              }}
            >
              Game running
            </Typography>
          </div>
        </Stack>
      ) : null}
      {isClientRunning && !isGameRunning ? (
        <Stack spacing={10} justifyContent="center" alignItems="center">
          <div style={{ display: "flex", alignItems: "center" }}>
            <CheckIcon style={{ marginRight: "8px", color: "green" }} />
            <Typography
              sx={{
                fontFamily: "Roboto",
                textAlign: "center",
                fontSize: "20",
              }}
            >
              Client running
            </Typography>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <CloseIcon style={{ marginRight: "8px", color: "red" }} />
            <Typography
              sx={{
                fontFamily: "Roboto",
                textAlign: "center",
                fontSize: "20",
              }}
            >
              Game running
            </Typography>
          </div>
        </Stack>
      ) : null}
    </>
  );
};

export default PlayerGrid;
