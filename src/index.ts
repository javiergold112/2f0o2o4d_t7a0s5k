import express, { Application } from "express";
import cors from "cors";
import dotenv from "dotenv";

import mainRouter from "./routes";
import { initializeCronJob, initializeProject } from "./jobs/cron_jobs";

dotenv.config();

const app: Application = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/", mainRouter);

// initializeCronJob();

// Async function to handle the initialization process
async function startServer() {
  try {
    // await initializeProject(); // Ensure initialization completes before starting the server
    const port: number = Number(process.env.PORT) || 3000; // Provide a default port if none is specified
    app.listen(port, () => {
      console.log(`Food Search App is listening on port ${port}!`);
    });
  } catch (error) {
    console.error("Failed to initialize the project:", error);
    process.exit(1); // Exit the process if initialization fails
  }
}

startServer(); // Call the function to start the server
