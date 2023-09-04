import fetch from "node-fetch";
import fetchToken from "../riotAuth.mjs";
import { fetchShard } from "../basicHelpers.mjs";

export async function fetchMatches(puuid) {
  try {
    const { token, entitlement } = await fetchToken();
    const shard = await fetchShard();

    const url = `https://pd.${shard}.a.pvp.net/match-history/v1/history/${puuid}?startIndex=0&endIndex=5&queue=competitive`;

    const headers = {
      "X-Riot-Entitlements-JWT": entitlement,
      Authorization: `Bearer ${token}`,
    };
    const options = {
      method: "GET",
      headers,
    };

    const response = await fetch(url, options);
    const responseData = await response.json();
    const matchIds = responseData.History.map((match) => match.MatchID);
    return matchIds;
  } catch (error) {
    return undefined;
  }
}

export async function fetchMatch(matchID) {
  try {
    const { token, entitlement } = await fetchToken();
    const shard = await fetchShard();

    const url = `https://pd.${shard}.a.pvp.net/match-details/v1/matches/${matchID}`;

    const headers = {
      "X-Riot-Entitlements-JWT": entitlement,
      Authorization: `Bearer ${token}`,
    };
    const options = {
      method: "GET",
      headers,
    };

    const response = await fetch(url, options);
    const responseData = await response.json();
    return responseData;
  } catch (error) {
    return undefined;
  }
}

export async function fetchMatchData(puuid) {
  // Use Promise.allSettled to execute all promises in parallel

  const matches = await fetchMatches(puuid);
  const matchResults = await Promise.allSettled(
    matches.map(async (match) => {
      try {
        const matchData = await fetchMatch(match);
        const matchingPlayer = matchData.players.find((player) => player.subject === puuid);
        return matchingPlayer;
      } catch (error) {
        return null; // Handle errors gracefully
      }
    })
  );
  return matchResults;
}

export async function fetchAllMatchResults(puuid) {
  const matches = await fetchMatches(puuid);

  const matchResults = await Promise.allSettled(
    matches.map(async (match) => {
      try {
        const matchData = await fetchMatch(match);
        const matchingPlayer = matchData.players.find((player) => player.subject === puuid);
        return matchingPlayer;
      } catch (error) {
        return null; // Handle errors gracefully
      }
    })
  );
  return matchResults;
}
