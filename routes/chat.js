var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
  var room = req.body.roomname;
  res.render("room", { title: room, user : "John", roomname : room, members : ["Joe", "Steve", "Pete"] });
});


module.exports = router;
