import cron from "node-cron";

import { ETL } from "./ETL";
import { initializeDBTables } from "./initializeDB";

export const initializeProject = async () => {
  console.log("start innitializing");
  await initializeDBTables();
  await ETL();
};

export const initializeCronJob = () => {
  // Daily running
  cron.schedule("0 0 * * *", initializeProject);
};
