const express = require("express");

const router = express.Router();
router.get("/", (res, req) => {
  res.render("welcome", {
    title: "Welcome",
    name: "new page",
    message: "nice message",
  });
});
module.exports = router;
