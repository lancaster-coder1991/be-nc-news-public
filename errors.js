exports.handle400s = (err, req, res, next) => {
  console.log("handle400s being called");
  if (
    (err.code === "42703" || err.code === "22P02") &&
    (err.routine === "errorMissingColumn" ||
      err.routine === "checkInsertTargets")
  ) {
    res.status(400).send({ msg: "Invalid query or body" });
  } else if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid parametric used" });
  } else if (err.status == 400 && err.msg) {
    res.status(400).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handleParam404s = (err, req, res, next) => {
  console.log("handleParam404s being called");
  if (err.status === 404) {
    res.status(err.status).send({ msg: err.msg });
  } else {
    next(err);
  }
};

exports.handle404s = (req, res, next) => {
  console.log("handle404s being called");
  res.status(404).send({ msg: "Path not found" });
};

exports.handle405s = (req, res, next) => {
  console.log("handle405s being called");
  res.status(405).send({ msg: "Invalid method" });
};

exports.handle500s = (err, req, res, next) => {
  console.log("Reached 500 with err:", err);
  res.status(500).send({ msg: "Server error" });
};
