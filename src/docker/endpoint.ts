import { OpenMetrics } from "src/common/open-metrics";
import { DockerContainer } from "./docker";

export const dockerEndpoint = async (): Promise<Response> => {
  const containers = await DockerContainer.getDockerContainers();
  const openMetrics = new OpenMetrics("docker");

  openMetrics.addGauge(
    {
      name: "cpu_load",
      description: "The load on the CPU by the container.",
      unit: "ratio",
    },
    containers.map((container) => ({
      labels: { name: container.container.name },
      value: container.container.cpuPercent,
    })),
  );

  openMetrics.addGauge(
    {
      name: "memory_used",
      description: "The memory usage of the container.",
      unit: "bytes",
    },
    containers.map((container) => ({
      labels: { name: container.container.name },
      value: container.container.memUsageBytes,
    })),
  );

  openMetrics.addBoolean(
    {
      name: "status_running",
      description: "Whether the container is running.",
    },
    containers.map((container) => ({
      labels: { name: container.container.name },
      value: container.isRunning,
    })),
  );

  openMetrics.addBoolean(
    {
      name: "status_up",
      description: "Whether the container is up.",
    },
    containers.map((container) => ({
      labels: { name: container.container.name },
      value: container.isUp,
    })),
  );

  openMetrics.addInfo(
    {
      name: "creation_time",
      description: "The creation time of the container.",
    },
    containers.map((container) => ({
      name: container.container.name,
      creation_time: container.container.createdAt.toISOString(),
    })),
  );

  openMetrics.addInfo(
    {
      name: "image",
      description: "The name of the image for this container.",
    },
    containers.map((container) => ({
      name: container.container.name,
      image: container.container.image,
    })),
  );

  openMetrics.addInfo(
    {
      name: "status",
      description: "The status of the container.",
    },
    containers.map((container) => ({
      name: container.container.name,
      status: container.container.status,
    })),
  );

  openMetrics.addInfo(
    {
      name: "network",
      description: "The network of the container.",
    },
    containers.map((container) => ({
      name: container.container.name,
      network: container.container.network,
    })),
  );

  return openMetrics.toResponse();
};
