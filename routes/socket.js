var express = require('express');
var router = express.Router();
var io = require('socket.io')('httpServer', {'path' : '/socket'});

io.$scope.$on('', function (event, ) {
    
});

module.exports = router;