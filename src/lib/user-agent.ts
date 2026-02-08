import type { Request } from "express";
import type { DeviceInfo } from "../contract/sessions.dto";
import { UAParser, type IResult } from "ua-parser-js";

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
  return {
    browser: {
      name: result.browser.name || "unknown",
      version: result.browser.version || "unknown",
    },
    os: {
      name: result.os.name || "unknown",
      version: result.os.version || "unknown",
    },
    engine: result.engine.name || "unknown",
    cpu: result.cpu.architecture || "unknown",
    ip: getClientIp(req),
    region: (req.headers["x-vercel-ip-country-region"] as string) || "unknown",
    city: (req.headers["x-vercel-ip-city"] as string) || "unknown",
    country: (req.headers["x-vercel-ip-country"] as string) || "unknown",
  };
};
