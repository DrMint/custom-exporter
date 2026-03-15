import { OpenMetrics } from "src/common/open-metrics";
import { getMqttState } from "src/mqtt/mqtt";

export const mqttEndpoint = async (): Promise<Response> => {
  const { melchiorPlug, livingRoomTemp } = getMqttState();
  const openMetrics = new OpenMetrics("mqtt");

  if (melchiorPlug) {
    openMetrics.addGauge(
      {
        name: "power",
        description: "Power consumption.",
        unit: "watt",
      },
      [{ labels: { device: "melchior-plug" }, value: melchiorPlug.power }],
    );
    openMetrics.addGauge(
      {
        name: "voltage",
        description: "Voltage.",
        unit: "volt",
      },
      [{ labels: { device: "melchior-plug" }, value: melchiorPlug.voltage }],
    );
  }

  if (livingRoomTemp) {
    openMetrics.addGauge(
      {
        name: "battery",
        description: "Battery level.",
        unit: "percent",
      },
      [
        {
          labels: { device: "living-room-temp" },
          value: livingRoomTemp.battery,
        },
      ],
    );
    openMetrics.addGauge(
      {
        name: "humidity",
        description: "Relative humidity.",
        unit: "percent",
      },
      [
        {
          labels: { device: "living-room-temp" },
          value: livingRoomTemp.humidity,
        },
      ],
    );
    openMetrics.addGauge(
      {
        name: "temperature",
        description: "Temperature.",
        unit: "celsius",
      },
      [
        {
          labels: { device: "living-room-temp" },
          value: livingRoomTemp.temperature,
        },
      ],
    );
  }

  return openMetrics.toResponse();
};
