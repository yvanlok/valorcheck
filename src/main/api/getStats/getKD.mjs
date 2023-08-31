export async function fetchKD(matchData) {
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
  return kdRatio;
}
