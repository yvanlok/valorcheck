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
  rank: string;
};

type Props = {
  playerData: Player[];
  preGame?: boolean;
};

const BlueTeam = (props: Props) => {
  const bluePlayers = props.playerData
    .filter((player) => player.team === "Blue")
    .slice(0, 12);

  return (
    <Grid md={6} disableEqualOverflow>
      <Stack spacing={2}>
        {bluePlayers.map((player) => (
          <React.Fragment>
            <Grid display="flex" justifyContent="center" alignItems="center">
              <PlayerCard
                agentID={player.characterId}
                playerID={player.subjectId}
                playerCardId={player.playerCardId}
                accountLvl={player.accountLvl}
                queue={player.queueId}
                preGame={props.preGame}
              />
            </Grid>
            <PrimaryDivider />
          </React.Fragment>
        ))}
      </Stack>
    </Grid>
  );
};

export default BlueTeam;
