import fetch from "node-fetch";

export async function getAccount(puuid) {
  const response = await fetch(`https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${puuid}`);
  const responseData = await response.json();

  return responseData;
}
