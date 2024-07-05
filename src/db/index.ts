import { Pool } from "pg";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  connectionString: `${process.env.DB_URL}`,
  ssl: {
    rejectUnauthorized: true,
    ca: fs.readFileSync("src/db/ca.pem").toString(),
  },
});

export const dbQuery = (text: string, params?: any[]) =>
  pool.query(text, params);

//Export db handle functions
export { inistializeEntityTable } from "./initializeEntityTable";
export { updateEntityTable } from "./updateEntityTable";
export { initializeEntitySearchTable } from "./initializeSearchTermTable";
export { searchEntity } from "./searchEntity";
