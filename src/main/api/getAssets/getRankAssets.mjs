import fetch from "node-fetch";

async function getLatestUUID() {
  const response = await fetch("https://valorant-api.com/v1/competitivetiers");
  const responseData = await response.json();
  const versions = responseData.data;
  return versions[versions.length - 1].uuid;
}

export async function getRankName(tier) {
  const UUID = await getLatestUUID();
  const response = await fetch(
    `https://valorant-api.com/v1/competitivetiers/${UUID}`
  );

  const responseData = await response.json();
  const tiers = responseData.data.tiers;

  const tierInfo = tiers.find((tierInfo) => tierInfo.tier === tier);

  return tierInfo ? tierInfo.tierName : null;
}

export async function getRankImage(tier) {
  const UUID = await getLatestUUID();
  return `https://media.valorant-api.com/competitivetiers/${UUID}/${tier}/largeicon.png`;
}
