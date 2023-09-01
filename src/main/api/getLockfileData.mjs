import fs from "fs/promises"; // Import the 'fs/promises' module for asynchronous file operations

export default async function getLockfileData() {
  const lockfilePath = `${process.env.LocalAppData}\\Riot Games\\Riot Client\\Config\\lockfile`;

  try {
    const lockfileContent = await fs.readFile(lockfilePath, "utf-8");
    const lockfileData = lockfileContent.split(":");

    // Destructure the lockfileData array directly
    const [, , lockfilePort, lockfilePassword] = lockfileData;

    return { lockfilePassword, lockfilePort };
  } catch (error) {
    return undefined;
  }
}
