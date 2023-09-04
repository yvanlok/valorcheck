import fetch from "node-fetch";

export async function getCardImage(cardID) {
  return `https://media.valorant-api.com/playercards/${cardID}/wideart.png`;
}

export async function getCardDisplayName(cardID) {
  const response = await fetch(`hhttps://valorant-api.com/v1/playercards/${cardID}`, {
    method: "GET",
  });

  const responseData = await response.json();

  return responseData.data.displayName;
}
