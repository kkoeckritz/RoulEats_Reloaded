var express = require("express");

var router = express.Router();

router.get("/hello", function(req, res) {
    res.json("hello");
});

module.exports = router;