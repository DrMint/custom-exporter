/* e.g of plug message 
{
  "current": 0.37,
  "energy": 0.21,
  "energy_month": 0.25,
  "energy_today": 0.25,
  "energy_yesterday": 0,
  "inching_control_set": {
    "inching_control": "DISABLE",
    "inching_mode": "OFF"
  },
  "linkquality": 255,
  "outlet_control_protect": false,
  "overload_protection": {
    "enable_max_voltage": "ENABLE",
    "enable_min_current": "DISABLE",
    "enable_min_power": "DISABLE",
    "enable_min_voltage": "DISABLE",
    "max_current": 922550.528,
    "max_power": 0,
    "max_voltage": -45088.768,
    "min_current": 0,
    "min_power": 0,
    "min_voltage": 0.049
  },
  "power": 70.8,
  "power_on_behavior": "on",
  "state": "ON",
  "update": {
    "installed_version": 4098,
    "latest_release_notes": null,
    "latest_source": null,
    "latest_version": 4098,
    "state": "idle"
  },
  "voltage": 235.37
}
*/
export type PlugMessage = {
  current: number;
  energy: number;
  energy_month: number;
  energy_today: number;
  energy_yesterday: number;
  inching_control_set: {
    inching_control: string;
    inching_mode: string;
  };
  linkquality: number;
  outlet_control_protect: boolean;
  overload_protection: {
    enable_max_voltage: string;
    enable_min_current: string;
    enable_min_power: string;
    enable_min_voltage: string;
    max_current: number;
    max_power: number;
    max_voltage: number;
  };
  power: number;
  power_on_behavior: string;
  state: string;
  update: {
    installed_version: number;
    latest_release_notes: string | null;
    latest_source: string | null;
    latest_version: number;
    state: string;
  };
  voltage: number;
};

/* e.g of temp sensor message 
{
  "battery": 100,
  "comfort_humidity_max": 60,
  "comfort_humidity_min": 40,
  "comfort_temperature_max": 27,
  "comfort_temperature_min": 19,
  "humidity": 37.2,
  "humidity_calibration": 0,
  "linkquality": 132,
  "temperature": 22.9,
  "temperature_calibration": 0,
  "temperature_units": "celsius",
  "update": {
    "installed_version": 8960,
    "latest_release_notes": null,
    "latest_source": "https://raw.githubusercontent.com/Koenkk/zigbee-OTA/master/images/Sonoff/snzb-02d_v2.3.0.ota",
    "latest_version": 8960,
    "state": "idle"
  }
}
*/
export type TempSensorMessage = {
  battery: number;
  comfort_humidity_max: number;
  comfort_humidity_min: number;
  comfort_temperature_max: number;
  comfort_temperature_min: number;
  humidity: number;
  humidity_calibration: number;
  linkquality: number;
  temperature: number;
  temperature_calibration: number;
  temperature_units: string;
  update: {
    installed_version: number;
    latest_release_notes: string | null;
    latest_source: string | null;
    latest_version: number;
    state: string;
  };
};
