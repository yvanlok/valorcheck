import fetch from "node-fetch";
import fetchToken from "../riotAuth.mjs";
import { fetchShard } from "../basicHelpers.mjs";
import { fetchRegion } from "../basicHelpers.mjs";
import { fetchMatchID, fetchPreMatchID } from "./getMatchID.mjs";
// Fetches the shard information
export async function fetchPreMatch() {
  try {
    const { token, entitlement } = await fetchToken();

    const shard = await fetchShard();
    const region = await fetchRegion();
    const matchID = await fetchPreMatchID();

    const url = `https://glz-${region}-1.${shard}.a.pvp.net/pregame/v1/matches/${matchID}`;

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
  } catch (error) {}
}

export async function fetchMatch() {
  try {
    const { token, entitlement } = await fetchToken();

    const shard = await fetchShard();
    const region = await fetchRegion();
    const matchID = await fetchMatchID();

    const url = `https://glz-${region}-1.${shard}.a.pvp.net/core-game/v1/matches/${matchID}`;

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
  } catch (error) {}
}

export async function fetchMap() {
  const match = await fetchMatchID();
  const preMatch = await fetchPreMatchID();
  let responseData;
  if (match !== undefined) {
    responseData = await fetchMatch();
  } else if (preMatch !== undefined) {
    responseData = await fetchPreMatch();
  }

  return responseData.MapID;
}

export async function fetchMode() {
  const match = await fetchMatchID();
  const preMatch = await fetchPreMatchID();
  let responseData;
  if (match !== undefined) {
    responseData = await fetchMatch();
  } else if (preMatch !== undefined) {
    responseData = await fetchPreMatch();
  }

  return responseData.MapID;
}
