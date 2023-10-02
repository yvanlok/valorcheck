import fetch from "node-fetch";

export async function getAccount(puuid) {
  const players = JSON.parse(localStorage.getItem("players")) || {};
  const playerData = players[puuid] || {};
  const currentTimestamp = new Date();
  const key = "accountData";

  if (playerData[key] && currentTimestamp - new Date(playerData[key].lastUpdated) < 10 * 60 * 1000) {
    return playerData[key].value;
  }

  const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${puuid}`);
  const responseData = await response.json();

  playerData[key] = { lastUpdated: currentTimestamp, value: responseData };
  players[puuid] = playerData;

  localStorage.setItem("players", JSON.stringify(players));

  return responseData;
}
