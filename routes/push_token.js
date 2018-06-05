var api = require('../api/response');
var db = require('../databases/database');


var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {
    var pushToken = req.body.push_token;
    var token = req.body.token;
    var email = req.body.email;


    db.updatePushToken(pushToken, token, email, function(err, results) {
       if (err) {
           return;
       }
       res.json(api.getResponse(api.SUCC_UPDATE_PUSH_TOKEN, null, "Successful"));

    });

});

module.exports = router;
