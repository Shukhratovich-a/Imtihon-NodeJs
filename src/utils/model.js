import fs from "fs";
import path from "path";

import { editObject } from "./editCase.js";

const read = (fileName) => {
  const data = fs.readFileSync(
    path.join(process.cwd(), "src", "database", fileName + ".json"),
    "utf-8"
  );
  return data ? editObject(JSON.parse(data), "snake") : [];
};

const write = (fileName, data) => {
  fs.writeFileSync(
    path.join(process.cwd(), "src", "database", fileName + ".json"),
    JSON.stringify(editObject(data, "camel"), null, 2)
  );
  return true;
};

export { read, write };
