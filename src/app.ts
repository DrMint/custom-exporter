import { zfsEndpoint } from "src/zfs/endpoint";
import { hddEndpoint } from "src/smart/endpoint";
import { ssdEndpoint } from "src/smart/endpoint";
import { zpoolEndpoint } from "src/zpool/endpoint";
import { hwmonEndpoint } from "src/hwmon/endpoint";
import { sysinfoEndpoint } from "src/sysinfo/endpoint";
import { blockStatEndpoint } from "src/blockStat/endpoint";

Bun.serve({
  port: 8000,
  fetch: (request) => {
    const pathname = new URL(request.url).pathname;
    switch (pathname) {
      case "/blockstat":
        return blockStatEndpoint();
      case "/sysinfo":
        return sysinfoEndpoint();
      case "/hwmon":
        return hwmonEndpoint();
      case "/zpool":
        return zpoolEndpoint();
      case "/zfs":
        return zfsEndpoint();
      case "/smart/hdd":
        return hddEndpoint();
      case "/smart/ssd":
        return ssdEndpoint();
      default:
        return new Response("Not found", { status: 404 });
    }
  },
  hostname: "0.0.0.0",
});
