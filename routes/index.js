global.router = require("express").Router();
var router = global.router;

var router = require("./users");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.status(200).send("nguyen song ngan api");
});

module.exports = router;
