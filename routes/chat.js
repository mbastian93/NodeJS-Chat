var express = require('express');
var router = express.Router();

router.get('/', function(req, res) {
  res.render('room', {title: "chatroom", connected : "Peter, ", members : ["Hans", "Max", "Petra"]});
});

module.exports = router;
