const test = require("./test-data/index");
const development = require("./development-data/index");

const ENV = process.env.NODE_ENV || "development";

const databases = {
  test,
  development,
  production: development,
};

module.exports = databases[ENV];
