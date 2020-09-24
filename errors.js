exports.handle400s = (err, req, res, next) => {
  console.log("handle400s being called");
  if (err.code === "42703" || err.code === "22P02") {
    res.status(400).send({ msg: "Bad request" });
  } else {
    next(err);
  }
};

exports.handleParam404s = (err, req, res, next) => {
  console.log("handleParam404s being called");
  if (err.msg === "User not found") {
    res.status(404).send({ msg: "User not found" });
  } else if (err.msg === "Article not found") {
    res.status(404).send({ msg: "Article not found" });
  } else {
    next(err);
  }
};

exports.handle404s = (req, res, next) => {
  console.log("handle404s being called");
  res.status(404).send({ msg: "Path not found" });
};

exports.handle500s = (err, req, res, next) => {
  console.log("handle500s being called");
  console.log("Reached 500 with err:", err);
  res.status(500).send({ msg: "Server error" });
};
