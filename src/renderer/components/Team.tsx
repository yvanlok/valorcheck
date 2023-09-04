import React from "react";
import Grid from "@mui/material/Grid";
import PlayerCard from "./PlayerCard";
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
  const teamPlayers = props.playerData.filter((player) => player.team === props.teamColor).slice(props.startPlayers, props.endPlayers);

  return (
    <>
      {teamPlayers.map((player) => (
        <Grid item key={player.subjectId}>
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
      ))}
    </>
  );
};

export default Team;
