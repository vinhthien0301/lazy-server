var api = require('../api/response');
var db = require('../databases/database');
var app = require('../app');

var express = require('express');
var router = express.Router();

// GET miner data
router.post('/', function (req, res) {
    var machineID = req.body.machine_id;
    var email = req.body.email;


    var socket = req.app.get('socket');

    db.getSocketMinerInfo(email, machineID, function (isFail, data) {

        if (data && data.length > 0) {
            var socket_id = data[0].socket_id;
            if (socket && socket.nsp.adapter.nsp.sockets[socket_id]) {
                socket.nsp.adapter.nsp.sockets[socket_id].emit('restart-miner');
            }
            res.json(api.getResponse(api.SUCC_RESET_MINER, null, "success"));
        }
    })


});

module.exports = router;
