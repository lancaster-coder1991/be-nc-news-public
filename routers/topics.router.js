const topicsRouter = require("express").Router();
const { handle405s } = require("../errors");
const { getTopics } = require("../controllers/topics.controllers");

topicsRouter.route("/").get(getTopics).all(handle405s);

module.exports = topicsRouter;
