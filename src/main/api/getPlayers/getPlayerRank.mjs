import fetch from "node-fetch";
import fetchToken from "../riotAuth.mjs";
import { fetchCurrentSeason, fetchShard } from "../basicHelpers.mjs";
import { fetchClientVersion } from "../basicHelpers.mjs";
import { fetchRegion } from "../basicHelpers.mjs";

export async function fetchPlayerMMR(puuid) {
  try {
    const { token, entitlement } = await fetchToken();
    const shard = await fetchShard();

    const url = `https://pd.${shard}.a.pvp.net/mmr/v1/players/${puuid}`;

    const clientPlatform =
      "ew0KCSJwbGF0Zm9ybVR5cGUiOiAiUEMiLA0KCSJwbGF0Zm9ybU9TIjogIldpbmRvd3MiLA0KCSJwbGF0Zm9ybU9TVmVyc2lvbiI6ICIxMC4wLjE5MDQyLjEuMjU2LjY0Yml0IiwNCgkicGxhdGZvcm1DaGlwc2V0IjogIlVua25vd24iDQp9";

    const headers = {
      "X-Riot-Entitlements-JWT": entitlement,
      "X-Riot-ClientPlatform": clientPlatform,
      "X-Riot-ClientVersion": await fetchClientVersion(),
      Authorization: `Bearer ${token}`,
    };
    const options = {
      method: "GET",
      headers,
    };

    const response = await fetch(url, options);
    const responseData = await response.json();
    return responseData.QueueSkills.competitive.SeasonalInfoBySeasonID;
  } catch (error) {
    console.error(error);
  }
}
export async function fetchCurrentRank(puuid) {
  const responseData = await fetchPlayerMMR(puuid);
  const currentSeason = await fetchCurrentSeason();
  const currentSeasonMMR = responseData[currentSeason];
  if (currentSeasonMMR) {
    return currentSeasonMMR.CompetitiveTier;
  } else {
    return 0;
  }
}

export async function fetchPeakRank(puuid) {
  try {
    const responseData = await fetchPlayerMMR(puuid);
    const seasons = Object.keys(responseData);

    let peakRank = 0;

    for (const season of seasons) {
      const seasonMMR = responseData[season];
      if (seasonMMR && seasonMMR.CompetitiveTier && seasonMMR.CompetitiveTier > peakRank) {
        peakRank = seasonMMR.CompetitiveTier;
      }
    }

    return peakRank;
  } catch {
    return 0;
  }
}

export async function fetchRankHenrik(puuid) {
  const players = JSON.parse(localStorage.getItem("players")) || {};
  const playerData = players[puuid] || {};
  const currentTimestamp = new Date();
  const key = "rank";

  if (playerData[key] && currentTimestamp - new Date(playerData[key].lastUpdated) < 10 * 60 * 1000) {
    return playerData[key].value;
  }
  const region = await fetchRegion();
  const response = await fetch(`https://api.henrikdev.xyz/valorant/v2/by-puuid/mmr/${region}/${puuid}`);
  const responseData = await response.json();

  const currentRank = responseData.data.current_data.currenttier;
  const peakRank = responseData.data.highest_rank.tier;
  const rankData = {
    currentRank: currentRank ? currentRank : 0,
    peakRank: peakRank ? peakRank : 0,
  };

  playerData[key] = { lastUpdated: currentTimestamp.toISOString(), value: rankData };
  players[puuid] = playerData;

  localStorage.setItem("players", JSON.stringify(players));

  return rankData;
}
