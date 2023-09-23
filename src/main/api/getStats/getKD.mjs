export async function fetchKD(matchData, puuid) {
  const players = JSON.parse(localStorage.getItem("players")) || {};
  const playerData = players[puuid] || {};
  const currentTimestamp = new Date();

  if (playerData.kdRatio && currentTimestamp - new Date(playerData.kdRatio.lastUpdated) < 30 * 60 * 1000) {
    return playerData.kdRatio.value;
  }

  let totalKills = 0;
  let totalDeaths = 0;

  matchData.forEach((result) => {
    if (result.status === "fulfilled" && result.value !== null) {
      const { kills, deaths } = result.value.stats;
      totalKills += kills;
      totalDeaths += deaths;
    }
  });

  const kdRatio = totalKills / totalDeaths;

  playerData.kdRatio = { lastUpdated: currentTimestamp, value: kdRatio };
  players[puuid] = playerData;

  localStorage.setItem("players", JSON.stringify(players));

  return kdRatio;
}
