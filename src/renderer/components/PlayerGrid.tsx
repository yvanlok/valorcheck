import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import { Box, Stack } from "@mui/material";
import getLockfileData from "../../main/api/getLockfileData.mjs";
import { fetchMatchID, fetchPreMatchID } from "../../main/api/getMatch/getMatchID.mjs";
import { fetchMatch, fetchPreMatch } from "../../main/api/getMatch/getMatchInfo.mjs";
import PlayerCard from "./PlayerCard";
import { fetchPuuid } from "../../main/api/basicHelpers.mjs";
import Team from "./Team";
import StatusMessage from "./StatusMessage";

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
  const [isDeathmatch, setIsDeathmatch] = useState(false);

  useEffect(() => {
    const checkForLockfile = async () => {
      const lockfile = await getLockfileData();
      const checkGame = await fetchPuuid();
      setIsClientRunning(lockfile !== undefined ? true : false);
      setIsGameRunning(checkGame !== undefined ? true : false);
    };
    const intervalId = setInterval(checkForLockfile, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    const checkForMatch = async () => {
      if (isGameRunning) {
        const match = await fetchMatchID();
        const preMatch = await fetchPreMatchID();
        setMatch(false);
        setPreMatch(false);
        if (match !== undefined) {
          setMatch(true);
        }
        if (preMatch !== undefined) {
          setPreMatch(true);
        }
      }
    };
    const intervalId = setInterval(checkForMatch, 2000);

    return () => {
      clearInterval(intervalId);
    };
  }, [isGameRunning]);

  useEffect(() => {
    const fetchPlayerData = async () => {
      let playerData: PlayerData[] = [];
      if (preMatch) {
        const data = await fetchPreMatch();
        playerData = (data as Record<string, any>).AllyTeam.Players.map((player: Record<string, any>) => ({
          subjectId: player.Subject,
          characterId: null,
          team: (data as Record<string, any>).AllyTeam.TeamID,
          accountLvl: player.PlayerIdentity.AccountLevel,
          playerCardId: player.PlayerIdentity.PlayerCardID,
          queueId: (data as Record<string, any>).QueueID,
          rank: player.CompetitiveTier,
        }));
      } else if (match) {
        const data = await fetchMatch();

        playerData = (data as Record<string, any>).Players.map((player: Record<string, any>) => ({
          subjectId: player.Subject,
          characterId: player.CharacterID,
          team: player.TeamID,
          accountLvl: player.PlayerIdentity.AccountLevel,
          playerCardId: player.PlayerIdentity.PlayerCardID,
          queueId: (data as Record<string, any>).MatchmakingData.QueueID,
          rank: player.SeasonalBadgeInfo.Rank,
        }));
      } else {
        return;
      }

      const isDeathmatch = playerData.some((player) => player.queueId === "deathmatch");

      setMatchData(playerData as PlayerData[]);
      setIsDeathmatch(isDeathmatch);
    };

    fetchPlayerData();
  }, [isGameRunning, preMatch, match]);

  return (
    <>
      {(preMatch || match) && (
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={1} disableEqualOverflow>
            <Grid xs>
              <Team
                playerData={matchData}
                teamColor="Blue"
                startPlayers={0}
                endPlayers={isDeathmatch ? 6 : 5}
                isDeathmatch={isDeathmatch}
                preGame={preMatch}
              />
            </Grid>
            <Grid xs>
              <Team
                playerData={matchData}
                teamColor={isDeathmatch ? "Blue" : "Red"}
                startPlayers={isDeathmatch ? 6 : 0}
                endPlayers={isDeathmatch ? 12 : 5}
                isDeathmatch={isDeathmatch}
                preGame={preMatch}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {isGameRunning && !preMatch && !match && (
        <Stack spacing={10} justifyContent="center" alignItems="center">
          <StatusMessage icon="check" color="green" message="Client running" />
          <StatusMessage icon="check" color="green" message="Valorant running" />
          <StatusMessage icon="close" color="red" message="Not in a game" />
          <div style={{ display: "flex", alignItems: "center" }}>
            <PlayerCard isPlayer={true} />
          </div>
        </Stack>
      )}

      {isClientRunning && !isGameRunning && (
        <Stack spacing={10} justifyContent="center" alignItems="center">
          <StatusMessage icon="check" color="green" message="Client running" />
          <StatusMessage icon="close" color="red" message="Valorant running" />
        </Stack>
      )}

      {!isClientRunning && !isGameRunning && (
        <Stack spacing={10} justifyContent="center" alignItems="center">
          <StatusMessage icon="close" color="red" message="Client running" />
          <StatusMessage icon="close" color="red" message="Valorant running" />
        </Stack>
      )}
    </>
  );
};

export default PlayerGrid;
