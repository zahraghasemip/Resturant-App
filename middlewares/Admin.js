const jwt = require("jsonwebtoken");
module.exports = function (req, res, next) {
  if (req.user.role !== "admin")
    return res.status(401).send("you are not admin");
  next();
};
