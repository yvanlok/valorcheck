export async function fetchTopPlayedAgent(matchResults, puuid) {
  const players = JSON.parse(localStorage.getItem("players")) || {};
  players[puuid] = players[puuid] || {};
  const playerData = players[puuid];

  const currentTimestamp = new Date();
  if (playerData.topPlayedAgent && currentTimestamp - new Date(playerData.topPlayedAgent.lastUpdated) < 30 * 60 * 1000) {
    return playerData.topPlayedAgent.value;
  }

  const countOccurrences = matchResults.reduce((acc, result) => {
    if (result.status === "fulfilled" && result.value !== null) {
      const characterId = result.value.characterId;
      acc[characterId] = (acc[characterId] || 0) + 1;
    }
    return acc;
  }, {});

  let mostCommonAgent = null;
  let mostCommonCount = 0;

  for (const characterId in countOccurrences) {
    if (countOccurrences[characterId] > mostCommonCount) {
      mostCommonAgent = characterId;
      mostCommonCount = countOccurrences[characterId];
    }
  }

  const mostCommonAgentData = {
    lastUpdated: currentTimestamp,
    value: mostCommonAgent,
  };

  playerData.topPlayedAgent = mostCommonAgentData;
  localStorage.setItem("players", JSON.stringify(players));
  return mostCommonAgentData;
}
