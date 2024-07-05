import express from "express";

import { graqhQLSever } from "../graphql";
import { initializeProjectController } from "../controllers";

const router = express();

graqhQLSever.applyMiddleware({ app: router, path: "/graphql" });
router.get("/initialize-project", initializeProjectController);

export default router;
