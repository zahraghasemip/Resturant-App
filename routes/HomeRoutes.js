const express = require("express");
const router = express.Router();
router.get("/", (req, res) => {
  res.render("welcome", {
    title: "resturant",
    name: "new page",
    message: "welcome",
  });
});
module.exports = router;
