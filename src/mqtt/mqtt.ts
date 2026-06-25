import mqtt from "mqtt";
import type { PlugMessage, TempSensorMessage } from "./types";

const BROKER_URL = "mqtt://localhost:1883";
const TOPIC_PLUG = "zigbee2mqtt/melchior-plug";
const TOPIC_TEMP = "zigbee2mqtt/living-room-temp";
const TOPIC_OUTSIDE_TEMP = "zigbee2mqtt/outside-temp";

type MqttState = {
  melchiorPlug: PlugMessage | null;
  livingRoomTemp: TempSensorMessage | null;
  outsideTemp: TempSensorMessage | null;
};

const state: MqttState = {
  melchiorPlug: null,
  livingRoomTemp: null,
  outsideTemp: null,
};

const client = mqtt.connect(BROKER_URL);

client.on("connect", () => {
  client.subscribe(TOPIC_PLUG, (err) => {
    if (err) console.error(`MQTT subscribe ${TOPIC_PLUG}:`, err);
  });
  client.subscribe(TOPIC_TEMP, (err) => {
    if (err) console.error(`MQTT subscribe ${TOPIC_TEMP}:`, err);
  });
  client.subscribe(TOPIC_OUTSIDE_TEMP, (err) => {
    if (err) console.error(`MQTT subscribe ${TOPIC_OUTSIDE_TEMP}:`, err);
  });
});

client.on("message", (topic, payload) => {
  let data: unknown;
  try {
    data = JSON.parse(payload.toString());
  } catch {
    console.error("Parsing error, message is not JSON");
    return;
  }

  switch (topic) {
    case TOPIC_PLUG:
      state.melchiorPlug = data as PlugMessage;
      break;
    case TOPIC_TEMP:
      state.livingRoomTemp = data as TempSensorMessage;
      break;
    case TOPIC_OUTSIDE_TEMP:
      state.outsideTemp = data as TempSensorMessage;
      break;
  }
});

client.on("error", (err) => {
  console.error("MQTT error:", err);
});

export function getMqttState(): MqttState {
  return { ...state };
}
