const toCamel = (key) => {
  return key.replace(/[^a-zA-Z0-9]+(.)/g, (m, char) => char.toUpperCase());
};

const toSnake = (key) => {
  return key
    .split(/(?=[A-Z])/)
    .join("_")
    .toLowerCase();
};

const editObject = (array, objCase = "camel") => {
  const result = [];

  if (objCase == "snake") {
    for (let obj of array) {
      const data = {};
      for (let key in obj) {
        data[toCamel(key)] = obj[key];
      }
      result.push(data);
    }
  }

  if (objCase == "camel") {
    for (let obj of array) {
      const data = {};
      for (let key in obj) {
        data[toSnake(key)] = obj[key];
      }
      result.push(data);
    }
  }

  return result;
};

export { toCamel, toSnake, editObject };
