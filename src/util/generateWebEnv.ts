import path from "path";
import fs from "fs";
import { PUBLIC_PATH } from "../constants.js";

const WEB_PREFIX = "WEB_";

const webEnvs = Object.keys(process.env).reduce((pre, key) => {
  if (key.startsWith(WEB_PREFIX) && process.env[key])
    pre[key] = process.env[key];
  return pre;
}, {} as Record<string, string>);

const content = `window.__WEB_CONFIG__=${JSON.stringify(webEnvs)}`;


if (!fs.existsSync(PUBLIC_PATH)) fs.mkdirSync(PUBLIC_PATH, { recursive: true });

export const ENV_PATH = path.join(PUBLIC_PATH, "env.js");

fs.writeFileSync(ENV_PATH, content);
