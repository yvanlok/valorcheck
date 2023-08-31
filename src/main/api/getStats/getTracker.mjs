import fetch from "node-fetch";
import { getNameTagFromPuuid } from "../basicHelpers.mjs";

export async function fetchTracker(puuid) {
  const nameTag = await getNameTagFromPuuid(puuid);

  const name = `${nameTag.name}#${nameTag.tag}`;
  const encodedName = encodeURIComponent(name);
  const encodedUrl = `https://tracker.gg/valorant/profile/riot/${encodedName}/overview`;
  const response = await fetch(encodedUrl, {
    method: "GET",
  });

  if (response.ok) {
    return encodedUrl;
  } else {
    return "";
  }
}
