import fs from "fs";
import path from "path";
import express from "express";
import cors from "cors";
import { PORT, HOST } from "./config.js";

import userRouter from "./routers/user.js";
import categoriesRouter from "./routers/categories.js";

const app = express();
app.use(express.json());

app.use(cors());

app.use(userRouter);
app.use(categoriesRouter);

app.use((error, req, res, next) => {
  if (error.status != 500) {
    return res.status(error.status).json({
      status: error.status,
      message: error.message,
    });
  }

  fs.appendFileSync(
    path.join(process.cwd(), "src", "log.txt"),
    `${req.url}___${error.name}___${new Date(Date.now())}___${error.status}___${error.message}\n`
  );

  res.status(error.status).json({
    status: error.status,
    message: "InternalServerError",
  });

  process.exit();
});

app.listen(PORT, () => console.log(HOST));
