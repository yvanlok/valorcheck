import fetch from "node-fetch";
export async function fetchMapImage(mapUrl) {
  const response = await fetch("https://valorant-api.com/v1/maps");
  const data = await response.json();

  const map = data.data.find((m) => m.mapUrl === mapUrl);

  return map.listViewIcon;
}

export async function fetchMapDisplayName(mapUrl) {
  const response = await fetch("https://valorant-api.com/v1/maps");
  const data = await response.json();

  const map = data.data.find((m) => m.mapUrl === mapUrl);

  return map.displayName;
}
