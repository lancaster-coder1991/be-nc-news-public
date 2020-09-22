const { fetchTopics } = require("../models/models");

exports.getTopics = (req, res, next) => {
  fetchTopics().then((topics) => {
    console.log({ topics });
    res.status(200).send({ topics });
  });
};
