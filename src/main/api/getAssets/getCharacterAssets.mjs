import fetch from "node-fetch";

export async function getAgentImage(agentID) {
  const response = await fetch(
    `https://valorant-api.com/v1/agents/${agentID}?isPlayableCharacter=true`,
    {
      method: "GET",
    }
  );

  const responseData = await response.json();

  return responseData.data.displayIcon;
}

export async function getAgentDisplayName(agentID) {
  const response = await fetch(
    `https://valorant-api.com/v1/agents/${agentID}?isPlayableCharacter=true`,
    {
      method: "GET",
    }
  );

  const responseData = await response.json();

  return responseData.data.displayName;
}
