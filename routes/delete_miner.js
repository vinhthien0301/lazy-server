var api = require('../api/response');
var db = require('../databases/database');

var express = require('express');
var router = express.Router();

// GET miner data
router.post('/', function(req, res) {
    var email = req.body.email;
    var machine_id = req.body.machine_id;
    db.deleteRig(email, machine_id, function(err, results) {
        if(err){
            res.json(api.getResponse(api.ERRO_DELETE_MINER, null, "Del rigs"));
            return
        }

        res.json(api.getResponse(api.SUCC_DELETE_MINER, null, "Del rigs"));
    });
});

module.exports = router;
