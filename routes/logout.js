var api = require('../api/response');
var db = require('../databases/database');


var express = require('express');
var router = express.Router();

// GET miner data
router.post('/', function(req, res) {
    var token = req.body.token;
    db.removeToken(token, function(err, results) {
        if (err) {
            return;
        }
        // nothing
    });
    res.json(api.getResponse(api.SUCC_LOGOUT, null, "Logout successfully"));

});

module.exports = router;
