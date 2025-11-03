import { spawn } from "bun";

type TermHwmon = {
  /* CPU - AMD Ryzen */
  "k10temp-pci-00c3": {
    Adapter: string;
    Tctl: {
      temp1_input: number;
    };
  };
  /* nvme-Samsung_SSD_970_EVO_Plus_500GB_S4EVNF0M698680B nvme1n1 */
  "nvme-pci-0300": {
    Adapter: string;
    Composite: {
      temp1_input: number;
      temp1_max: number;
      temp1_crit: number;
    };
  };
  /* nvme-CT500P310SSD8_25164FAF1C4F nvme0n1 */
  "nvme-pci-0400": {
    Adapter: string;
    Composite: {
      temp1_input: number;
      temp1_max: number;
      temp1_crit: number;
    };
  };
};

export class Hwmon {
  private constructor(readonly hwmon: TermHwmon) {}

  get temperatures(): { name: string; device: string; value: number }[] {
    return [
      {
        name: "cpu",
        device: "Ryzen 5 5500",
        value: this.hwmon["k10temp-pci-00c3"].Tctl.temp1_input,
      },
      {
        name: "nvme0n1",
        device: "Samsung_SSD_970_EVO_Plus_500GB_S4EVNF0M698680B",
        value: this.hwmon["nvme-pci-0300"].Composite.temp1_input,
      },
      {
        name: "nvme1n1",
        device: "CT500P310SSD8_25164FAF1C4F",
        value: this.hwmon["nvme-pci-0400"].Composite.temp1_input,
      },
    ];
  }

  static async getHwmon(): Promise<Hwmon> {
    const shellOutput = await spawn({
      cmd: ["sensors", "-j"],
    }).stdout.text();
    const response: TermHwmon = JSON.parse(shellOutput);
    return new Hwmon(response);
  }
}
