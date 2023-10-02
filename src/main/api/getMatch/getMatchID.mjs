import fetch from "node-fetch";
import fetchToken from "../riotAuth.mjs";
import { fetchShard } from "../basicHelpers.mjs";
import { fetchRegion } from "../basicHelpers.mjs";
import { fetchPuuid } from "../basicHelpers.mjs";

export async function fetchPreMatchID() {
  try {
    const { token, entitlement } = await fetchToken();

    const shard = await fetchShard();
    const region = await fetchRegion();
    const puuid = await fetchPuuid();

    const url = `https://glz-${region}-1.${shard}.a.pvp.net/pregame/v1/players/${puuid}`;

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

    return responseData.MatchID;
  } catch (error) {
    return undefined;
  }
}

export async function fetchMatchID() {
  try {
    const { token, entitlement } = await fetchToken();

    const shard = await fetchShard();
    const region = await fetchRegion();
    const puuid = await fetchPuuid();

    const url = `https://glz-${region}-1.${shard}.a.pvp.net/core-game/v1/players/${puuid}`;

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

    return responseData.MatchID;
  } catch (error) {
    return undefined;
  }
}
