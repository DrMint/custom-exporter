import { runSpeedTest, type SpeedTestResult } from "librespeed-js";

const SERVER_ID = 51;

export async function getSpeedTestResults(): Promise<SpeedTestResult> {
  return runSpeedTest({ serverId: SERVER_ID });
}
