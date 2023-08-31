import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import RedTeam from "./RedTeam";
import BlueTeam from "./BlueTeam";
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
import { fetchPuuid } from "../../main/api/basicHelpers.mjs";

type Props = {};

interface PlayerData {
  subjectId: string;
  characterId: string;
  team: string;
  accountLvl: number;
  playerCardId: string;
  queueId: string;
  rank: string;
}

const PlayerGrid: React.FC<Props> = (props: Props) => {
  const [isGameRunning, setIsGameRunning] = useState<boolean>(false);
  const [match, setMatch] = useState<boolean>(false);
  const [preMatch, setPreMatch] = useState<boolean>(false);
  const [matchData, setMatchData] = useState<PlayerData[]>([]);
  const [puuid, setPuuid] = useState();

  useEffect(() => {
    const checkForLockfile = async () => {
      const response = await getLockfileData();
      if (response) {
        setIsGameRunning(true);
      } else {
        setIsGameRunning(false);
      }
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
        } else if (preMatch !== undefined) {
          setPreMatch(true);
          setMatch(false);
        }
      }
    };
    const intervalId = setInterval(checkForMatch, 1000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isGameRunning]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      setPuuid(await fetchPuuid());
      let playerData: PlayerData[] | undefined;
      if (preMatch) {
        const data = await fetchPreMatch();
        playerData = (data as Record<string, any>).AllyTeam.Players.map(
          (player: Record<string, any>) => ({
            subjectId: player.Subject,
            characterId: null,
            team: player.TeamID,
            accountLvl: player.PlayerIdentity.AccountLevel,
            playerCardId: player.PlayerIdentity.PlayerCardID,
            queueId: (data as Record<string, any>).QueueID,
            rank: player.SeasonalBadgeInfo.Rank,
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
        console.log(playerData);
      } else {
        return;
      }

      setMatchData(playerData as PlayerData[]);
    };

    if (isGameRunning && (preMatch || match)) {
      fetchPlayerData();
    }
  }, [isGameRunning, preMatch, match]);

  return (
    <>
      {match ? (
        <Grid container spacing={0.5}>
          <BlueTeam playerData={matchData} />
          <RedTeam playerData={matchData} />
        </Grid>
      ) : null}

      {preMatch ? (
        <Grid container spacing={0.5}>
          <BlueTeam playerData={matchData} preGame={preMatch} />
        </Grid>
      ) : null}
      {isGameRunning && !preMatch && !match ? (
        <Stack spacing={10} justifyContent="center" alignItems="center">
          <div style={{ display: "flex", alignItems: "center" }}>
            <CheckIcon style={{ marginRight: "8px", color: "green" }} />
            Valorant running
          </div>

          <div style={{ display: "flex", alignItems: "center" }}>
            <CloseIcon style={{ marginRight: "8px", color: "red" }} />
            Not in a game
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <PlayerCard isPlayer />
          </div>
        </Stack>
      ) : null}

      {!isGameRunning ? (
        <Stack spacing={10} justifyContent="center" alignItems="center">
          <div style={{ display: "flex", alignItems: "center" }}>
            <CloseIcon style={{ marginRight: "8px", color: "red" }} />
            Valorant running
          </div>
        </Stack>
      ) : null}
    </>
  );
};

export default PlayerGrid;
