import "dotenv/config";

import { Server } from "http";
import app from "./app";
import { errorlogger, logger } from "../shared/logger";

let server: Server;

async function main() {
  try {
    const PORT = Number(process.env.PORT) || 5000;

    server = app.listen(PORT, () => {
      console.log(`App is listening on port ${PORT}`);
      logger.info(`App is listening on port ${PORT}`);
    });
  } catch (err) {
    console.error(err);
    errorlogger.error(err);
  }
}

main();

process.on("unhandledRejection", (err) => {
  console.error("Unhandled rejection detected. Shutting down...", err);
  errorlogger.error(err);

  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught exception detected. Shutting down...", err);
  errorlogger.error(err);
  process.exit(1);
});
