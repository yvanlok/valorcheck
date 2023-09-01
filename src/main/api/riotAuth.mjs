import https from "https";
import fetch from "node-fetch";
import getLockfileData from "./getLockfileData.mjs";

export default async function fetchToken() {
  try {
    const lockfileData = await getLockfileData();
    if (!lockfileData) return null;

    const { lockfilePassword, lockfilePort } = lockfileData;
    const url = `https://127.0.0.1:${lockfilePort}/entitlements/v1/token`;
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
    const { accessToken: token, token: entitlement } = await response.json();

    return { token, entitlement };
  } catch (error) {
    return null;
  }
}
