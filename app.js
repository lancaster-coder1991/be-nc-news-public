const express = require("express");
const app = express();
const apiRouter = require("./routers/api.router");
const {
  handle500s,
  handle404s,
  handle400s,
  handle405s,
  handleParam404s,
} = require("./errors");
app.use(express.json());

app.use("/api", apiRouter);

app.use(handleParam404s);
app.use(handle400s);
app.use(handle405s);
app.all("/*", handle404s);
app.use(handle500s);

module.exports = app;
