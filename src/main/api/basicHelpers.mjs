import https from "https";
import fetch from "node-fetch";
import getLockfileData from "./getLockfileData.mjs";
import fetchToken from "./riotAuth.mjs";
import fs from "fs/promises";

// Fetches the shard information
export async function fetchShard() {
  try {
    const lockfileData = await getLockfileData();
    if (!lockfileData) {
      console.log("Lockfile not found");
      return;
    }
    const { lockfilePassword, lockfilePort } = lockfileData;
    const url = `https://127.0.0.1:${lockfilePort}/product-session/v1/external-sessions`;

    const encodedPassword = Buffer.from(`riot:${lockfilePassword}`).toString(
      "base64"
    );
    const headers = { Authorization: `Basic ${encodedPassword}` };
    const options = {
      method: "GET",
      headers,
      agent: new https.Agent({ rejectUnauthorized: false }),
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    let shard = null;

    for (const key in responseData) {
      const launchConfigurationArgs =
        responseData[key]?.launchConfiguration?.arguments || [];
      const shardArg = launchConfigurationArgs.find((arg) =>
        arg.startsWith("-ares-deployment=")
      );

      if (shardArg) {
        shard = shardArg.split("=")[1];
        break;
      }
    }

    return shard;
  } catch (error) {
    console.error(error);
  }
}

// Fetches the name and tag information
export async function fetchNameTag() {
  try {
    const lockfileData = await getLockfileData();
    if (!lockfileData) {
      console.log("Lockfile not found");
      return;
    }
    const { lockfilePassword, lockfilePort } = lockfileData;
    const url = `https://127.0.0.1:${lockfilePort}/player-account/aliases/v1/active`;

    const encodedPassword = Buffer.from(`riot:${lockfilePassword}`).toString(
      "base64"
    );
    const headers = { Authorization: `Basic ${encodedPassword}` };
    const options = {
      method: "GET",
      headers,
      agent: new https.Agent({ rejectUnauthorized: false }),
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    const name = responseData.game_name;
    const tag = responseData.tag_line;

    return { name, tag };
  } catch (error) {
    console.error(error);
  }
}

// Fetches the region information
export async function fetchRegion() {
  const logsPath = `${process.env.LocalAppData}\\VALORANT\\Saved\\Logs\\ShooterGame.log`;

  try {
    const logsContent = await fs.readFile(logsPath, "utf-8");

    const regionRegex = /\/regions\/(\w+)/;
    const match = logsContent.match(regionRegex);
    const region = match ? match[1] : "";

    return region;
  } catch (error) {
    throw new Error("Error reading logs for region: " + error.message);
  }
}

// Fetches the puuid information
export async function fetchPuuid() {
  try {
    const lockfileData = await getLockfileData();
    if (!lockfileData) {
      console.log("Lockfile not found");
      return;
    }
    const { lockfilePassword, lockfilePort } = lockfileData;
    const url = `https://127.0.0.1:${lockfilePort}/rso-auth/v1/authorization/userinfo`;

    const encodedPassword = Buffer.from(`riot:${lockfilePassword}`).toString(
      "base64"
    );
    const headers = { Authorization: `Basic ${encodedPassword}` };
    const options = {
      method: "GET",
      headers,
      agent: new https.Agent({ rejectUnauthorized: false }),
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    const userInfo = JSON.parse(responseData.userInfo);
    const puuid = userInfo.sub;

    return puuid;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchClientVersion() {
  const response = await fetch("https://valorant-api.com/v1/version");
  const responseData = await response.json();
  return responseData.data.riotClientVersion;
}

export async function fetchCurrentSeason() {
  const response = await fetch("https://valorant-api.com/v1/seasons");
  const responseData = await response.json();

  const currentTime = Date.now() - 24 * 60 * 60 * 1000; // subtract 24 hours in milliseconds

  // Find the active season based on the current time
  const activeSeason = responseData.data.find((season) => {
    const startTime = new Date(season.startTime).getTime();
    const endTime = new Date(season.endTime).getTime();
    return currentTime >= startTime && currentTime < endTime;
  });

  if (activeSeason) {
    const activeSeasonId = activeSeason.uuid;
    return activeSeasonId;
  } else {
    // Return a default value or handle the case when no active season is found
    return null;
  }
}

export async function getNameTagFromPuuid(puuid) {
  try {
    const { token, entitlement } = await fetchToken();

    const shard = await fetchShard();

    const body = JSON.stringify([puuid]);
    const url = `https://pd.${shard}.a.pvp.net/name-service/v2/players`;

    const headers = {
      "X-Riot-Entitlements-JWT": entitlement,
      Authorization: `Bearer ${token}`,
    };
    const options = {
      method: "PUT",
      headers,
      body,
    };

    const response = await fetch(url, options);
    const responseData = await response.json();

    const name = responseData[0].GameName;
    const tag = responseData[0].TagLine;

    return { name, tag };
  } catch (error) {
    console.error(error);
  }
}
