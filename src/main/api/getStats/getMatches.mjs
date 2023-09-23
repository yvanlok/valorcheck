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
  const matches = await fetchMatches(puuid);
  const matchResults = await Promise.allSettled(
    matches.map(async (match) => {
      try {
        const matchData = await fetchMatch(match);
        const matchingPlayer = matchData.players.find((player) => player.subject === puuid);
        return matchingPlayer;
      } catch (error) {
        return null;
      }
    })
  );
  return matchResults;
}

export async function fetchAllMatchResults(puuid) {
  const players = JSON.parse(localStorage.getItem("players")) || {};
  const playerData = players[puuid] || {};

  const storedMatches = playerData.matches?.matchIDs || [];
  const matches = await fetchMatches(puuid);

  const newMatches = matches.filter((match) => !storedMatches.includes(match));

  playerData.matches = playerData.matches || {};
  playerData.matches.matchIDs = [...storedMatches, ...newMatches];

  playerData.matches.numberOfMatches = playerData.matches.matchIDs.length;
  playerData.matches.lastUpdated = new Date();

  const newMatchResults = await Promise.allSettled(
    newMatches.map(async (match) => {
      try {
        const matchData = await fetchMatch(match);
        const matchingPlayer = matchData.players.find((player) => player.subject === puuid);
        return matchingPlayer;
      } catch (error) {
        return undefined;
      }
    })
  );

  playerData.matches.matchResults = playerData.matches.matchResults || [];
  playerData.matches.matchResults.push(...newMatchResults);

  players[puuid] = playerData;
  localStorage.setItem("players", JSON.stringify(players));

  return playerData.matches.matchResults;
}
