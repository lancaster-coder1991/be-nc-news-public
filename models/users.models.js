const knex = require("../connection");

exports.fetchUserById = (username) => {
  return knex
    .select("*")
    .from("users")
    .where({ username })
    .first()
    .then((user) => {
      if (!user) return Promise.reject({ status: 404, msg: "User not found" });
      return user;
    });
};
