export async function getChromaImage(uuid) {
  return `https://media.valorant-api.com/weaponskinchromas/${uuid}/fullrender.png`;
}
export async function getSkinName(uuid) {
  const response = await fetch(`https://valorant-api.com/v1/weapons/skinlevels/${uuid}`, {
    method: "GET",
  });

  const responseData = await response.json();

  return responseData.data.displayName;
}
