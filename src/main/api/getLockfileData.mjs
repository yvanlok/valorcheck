import fs from "fs/promises";

export default async function getLockfileData() {
  const lockfilePath = `${process.env.LocalAppData}\\Riot Games\\Riot Client\\Config\\lockfile`;

  try {
    const lockfileContent = await fs.readFile(lockfilePath, "utf-8");
    const lockfileData = lockfileContent.split(":");

    const [, , lockfilePort, lockfilePassword] = lockfileData;

    return { lockfilePassword, lockfilePort };
  } catch (error) {
    return undefined;
  }
}
