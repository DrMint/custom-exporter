import { spawn } from "bun";

enum ContainerState {
  Created = "created",
  Running = "running",
  Restarting = "restarting",
  Paused = "paused",
  Exited = "exited",
  Dead = "dead",
  Removing = "removing",
}

type TermDockerPs = {
  Command: string;
  CreatedAt: string;
  ID: string;
  Image: string;
  Labels: string;
  LocalVolumes: string;
  Mounts: string;
  Names: string;
  Networks: string;
  Platform: string | null;
  Ports: string;
  RunningFor: string;
  Size: number;
  State: ContainerState;
  Status: string;
};

type TermDockerStats = {
  BlockIO: string;
  CPUPerc: string;
  Container: string;
  ID: string;
  MemPerc: string;
  MemUsage: string;
  Name: string;
  NetIO: string;
  PIDs: string;
};

type Container = {
  id: string;
  name: string;
  network: string;
  image: string;
  command: string;
  createdAt: Date;
  state: string;
  cpuPercent: number;
  memUsageBytes: number;
  status: string;
};

export class DockerContainer {
  private constructor(
    readonly ps: TermDockerPs,
    readonly stats: TermDockerStats
  ) {}

  get container(): Container {
    return {
      id: this.ps.ID,
      name: this.ps.Names,
      network: this.ps.Networks,
      image: this.ps.Image,
      command: this.ps.Command,
      createdAt: this.convertWeirdDateToDate(this.ps.CreatedAt),
      state: this.ps.State,
      cpuPercent: this.convertCpuPercentToNumber(this.stats.CPUPerc),
      memUsageBytes: this.convertMemUsageToBytes(this.stats.MemUsage),
      status: this.ps.Status,
    };
  }

  get isUp(): boolean {
    return (
      this.container.state === ContainerState.Running ||
      this.container.state === ContainerState.Restarting ||
      this.container.state === ContainerState.Removing
    );
  }

  get isRunning(): boolean {
    return this.container.state === ContainerState.Running;
  }

  /**
   * @param memUsage The memory usage to convert. e.g: 17.5MiB / 31.14GiB -> 17500000
   */
  private convertMemUsageToBytes(memUsage: string): number {
    const [usage, total] = memUsage.split(" / ");

    if (usage === undefined || total === undefined) {
      throw new Error(`Invalid memory usage: ${memUsage}`);
    }

    const unit = usage.slice(-3);

    switch (unit) {
      case "KiB":
        return Math.floor(Number(usage.replace("KiB", "")) * 1024);
      case "MiB":
        return Math.floor(Number(usage.replace("MiB", "")) * 1024 * 1024);
      case "GiB":
        return Math.floor(Number(usage.replace("GiB", "")) * 1024 * 1024 * 1024);
      default:
        throw new Error(`Invalid memory usage: ${memUsage}`);
    }
  }

  /**
   * @param cpuPercent The CPU percentage to convert. e.g: 12.56% -> 0.1256
   */
  private convertCpuPercentToNumber(cpuPercent: string): number {
    return Number(cpuPercent.replace("%", "")) / 100;
  }

  /**
   * @param date The date to convert. e.g: 2025-11-02 16:19:51 +0100 CET
   */
  private convertWeirdDateToDate(date: string): Date {
    const [datePart, timePart, timezonePart] = date.split(" ");
    return new Date(`${datePart} ${timePart} ${timezonePart}`);
  }

  static async getDockerContainers(): Promise<DockerContainer[]> {
    const [psOutput, statsOutput] = await Promise.all([
      spawn({
        cmd: [
          "docker",
          "ps",
          "--all",
          "--no-trunc",
          "--size",
          "--format",
          "json",
        ],
      }).stdout.text(),
      spawn({
        cmd: [
          "docker",
          "stats",
          "--all",
          "--no-stream",
          "--no-trunc",
          "--format",
          "json",
        ],
      }).stdout.text(),
    ]);

    const psContainers: TermDockerPs[] = psOutput
      .split("\n")
      .filter((line) => line !== "")
      .map((line) => JSON.parse(line));
    const statsContainers: TermDockerStats[] = statsOutput
      .split("\n")
      .filter((line) => line !== "")
      .map((line) => JSON.parse(line));

    return psContainers.flatMap((ps) => {
      const stats = statsContainers.find((stats) => stats.Container === ps.ID);
      if (!stats) return [];
      return new DockerContainer(ps, stats);
    });
  }
}
