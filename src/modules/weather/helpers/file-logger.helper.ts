import * as fs from "fs";

const fileLogger = (providerName: string, data?: string) => {
  if (!fs.existsSync("logs")) {
    fs.mkdirSync("logs", { recursive: true });
  }

  fs.appendFileSync("logs/weather.log", `${providerName} - ${data}\n`);
};

export { fileLogger };
