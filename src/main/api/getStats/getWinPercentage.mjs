import { fetchPlayerMMR } from "../getPlayers/getPlayerRank.mjs";
import { fetchCurrentSeason } from "../basicHelpers.mjs";

export async function fetchWinPercent(puuid) {
  const responseData = await fetchPlayerMMR(puuid);
  const currentSeason = await fetchCurrentSeason();
  // Find the MMR data for the current season
  const currentSeasonMMR = responseData[currentSeason];
  if (currentSeasonMMR) {
    const numWins = currentSeasonMMR.NumberOfWinsWithPlacements;
    const numGames = currentSeasonMMR.NumberOfGames;
    const winPercent = (numWins / numGames) * 100;
    return winPercent;
  } else {
    return 0;
  }
}
