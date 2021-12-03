var express = require("express");
var router = express.Router();

// get home
router.get("/", (req, res) => {
  res.send("Main page");
});

module.exports = router;
