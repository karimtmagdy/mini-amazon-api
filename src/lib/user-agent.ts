import type { Request } from "express";
import type { DeviceInfo } from "../contract/sessions.dto";
import { UAParser, type IResult, } from "ua-parser-js";
// type IBrowser, type IOS, type IDevice, type IEngine, type ICPU 

export const getClientIp = (req: Request) => {
  const forwarded = req.headers["x-forwarded-for"] as string;
  let ip = forwarded ? forwarded.split(",")[0] : req.socket.remoteAddress;
  if (ip === "::1" || ip === "::ffff:127.0.0.1") {
    ip = "127.0.0.1";
  }
  return ip || "unknown";
};

export const getUserAgent = (req: Request): DeviceInfo => {
  const parser = new UAParser(req.headers["user-agent"]);
  const result: IResult = parser.getResult();
  console.log(result);
  return {
    browser: result.browser.name || "unknown",
    os: result.os.name || "unknown",
    device: result.device.type || "unknown",
    engine: result.engine.name || "unknown",
    cpu: result.cpu.architecture || "unknown",
    ip: getClientIp(req),
    region: "unknown", // Placeholder for now
    city: "unknown", // Placeholder for now
    country: "unknown", // Placeholder for now
  };
};
