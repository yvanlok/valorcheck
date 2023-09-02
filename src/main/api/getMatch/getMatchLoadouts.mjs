import { fetchShard, fetchRegion } from "../basicHelpers.mjs";
import { fetchMatchID } from "./getMatchID.mjs";
import fetchToken from "../riotAuth.mjs";
import fetch from "node-fetch";

export async function fetchLoadouts() {
  try {
    const { token, entitlement } = await fetchToken();

    const shard = await fetchShard();
    const region = await fetchRegion();
    const matchID = await fetchMatchID();

    const url = `https://glz-${region}-1.${shard}.a.pvp.net/core-game/v1/matches/${matchID}/loadouts`;

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
