const { fetchUserById } = require("../models/users.models.js");

exports.getUserById = (req, res, next) => {
  let user = req.params.username;
  fetchUserById(user)
    .then((user) => {
      res.status(200).send({ user });
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
};
