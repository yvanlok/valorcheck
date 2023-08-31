export async function fetchTopPlayedAgent(matchResults) {
  // Count the occurrences of each element using reduce
  const countOccurrences = matchResults.reduce((acc, result) => {
    if (result.status === "fulfilled" && result.value !== null) {
      const characterId = result.value.characterId;
      acc[characterId] = (acc[characterId] || 0) + 1;
    }
    return acc;
  }, {});

  // Find the most common occurrence
  const mostCommon = Object.keys(countOccurrences).reduce((a, b) =>
    countOccurrences[a] > countOccurrences[b] ? a : b
  );

  return mostCommon;
}
