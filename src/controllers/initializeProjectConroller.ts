import { Request, Response } from "express";

import { initializeProject } from "../jobs/cron_jobs";

export const initializeProjectController = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    initializeProject();
    res.status(200).send("Project initialization is triggered successfully.");
  } catch (error) {
    console.error("Failed to initialize project:", error);
    res.status(500).send("Failed to initialize project.");
  }
};
