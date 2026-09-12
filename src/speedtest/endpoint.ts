import { OpenMetrics } from "src/common/open-metrics";
import { getSpeedTestResults } from "./speedtest";

export const speedtestEndpoint = async (): Promise<Response> => {
  const result = await getSpeedTestResults();
  const openMetrics = new OpenMetrics("speedtest");

  openMetrics.addGauge(
    {
      name: "ping",
      description: "Round-trip latency to the speed test server.",
      unit: "seconds",
    },
    [{ value: result.ping / 1000 }],
  );

  openMetrics.addGauge(
    {
      name: "jitter",
      description: "Latency jitter to the speed test server.",
      unit: "seconds",
    },
    [{ value: result.jitter / 1000 }],
  );

  openMetrics.addGauge(
    {
      name: "download",
      description: "Download throughput.",
      unit: "bits_per_second",
    },
    [{ value: result.download * 1_000_000 }],
  );

  openMetrics.addGauge(
    {
      name: "upload",
      description: "Upload throughput.",
      unit: "bits_per_second",
    },
    [{ value: result.upload * 1_000_000 }],
  );

  return openMetrics.toResponse();
};
