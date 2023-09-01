import React from "react";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import PlayerCard from "./PlayerCard";
import Stack from "@mui/material/Stack";
import PrimaryDivider from "./PrimaryDivider";

type Player = {
  subjectId: string;
  characterId: string;
  team: string;
  accountLvl: number;
  playerCardId: string;
  queueId: string;
  rank: number;
};

type Props = {
  playerData: Player[];
  preGame?: boolean;
  teamColor: string;
  startPlayers: number;
  endPlayers: number;
  isDeathmatch?: boolean;
};

const Team = (props: Props) => {
  const teamPlayers = props.playerData
    .filter((player) => player.team === props.teamColor)
    .slice(props.startPlayers, props.endPlayers);
  return (
    <Grid md={6} disableEqualOverflow>
      <Stack spacing={1}>
        {teamPlayers.map((player) => (
          <React.Fragment key={player.subjectId}>
            <Grid display="flex" justifyContent="center" alignItems="center">
              <PlayerCard
                agentID={player.characterId}
                playerID={player.subjectId}
                playerCardId={player.playerCardId}
                accountLvl={player.accountLvl}
                queue={player.queueId}
                preGame={props.preGame}
                rank={player.rank}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Stack>
    </Grid>
  );
};

export default Team;
