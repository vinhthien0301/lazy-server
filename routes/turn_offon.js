var api = require('../api/response');
var db = require('../databases/database');

var express = require('express');
var router = express.Router();

// POST turn on/off rig
router.post('/', function(req, res) {
    var token = req.body.token;
    var emailSubmitted = req.body.email;

    db.getEmail(token, function(err, results) {
        if (err) {
            res.json(api.getResponse(api.ERRO_NOT_FOUND, req.json, "Token not found")); // NOT SURE
            return;
        }

        if (results.length > 0) {
            var email = results[0].email;
            if (email == emailSubmitted) {
                req.miners
                var target_miners = req.json.miners[email];
                req.json.miners = target_miners;
                res.json(api.getResponse(api.SUCC_MINERS, req.json, "Get rigs"));
            } else {
                res.json(api.getResponse(api.ERRO_NOT_FOUND, req.json, "Email isn't matched"));
            }
        } else {
            res.json(api.getResponse(api.ERRO_NOT_FOUND, req.json, "Token not found"));
        }

    });

    //var email = "vinh.thien0301@gmail.com";
    //var target_miners = req.json.miners[email];
    //req.json.miners = target_miners;
    //res.json(req.json);
});

module.exports = router;
