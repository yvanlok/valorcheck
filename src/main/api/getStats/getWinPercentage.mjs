import { fetchPlayerMMR } from "../getPlayers/getPlayerRank.mjs";
import { fetchCurrentSeason } from "../basicHelpers.mjs";

export async function fetchWinPercent(puuid) {
  const players = JSON.parse(localStorage.getItem("players")) || {};
  const playerData = players[puuid] || {};
  const currentTimestamp = new Date();

  if (playerData.winPercentage && currentTimestamp - new Date(playerData.winPercentage.lastUpdated) < 10 * 60 * 1000) {
    return playerData.winPercentage.value;
  }

  const responseData = await fetchPlayerMMR(puuid);
  const currentSeason = await fetchCurrentSeason();
  const currentSeasonMMR = responseData[currentSeason];

  if (currentSeasonMMR) {
    const numWins = currentSeasonMMR.NumberOfWinsWithPlacements;
    const numGames = currentSeasonMMR.NumberOfGames;
    const winPercentage = (numWins / numGames) * 100;

    playerData.winPercentage = { lastUpdated: currentTimestamp, value: winPercentage };
    players[puuid] = playerData;
    localStorage.setItem("players", JSON.stringify(players));
    return winPercentage;
  }

  return 0;
}
