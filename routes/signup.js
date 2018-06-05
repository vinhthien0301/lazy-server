var api = require('../api/response');
var db = require('../databases/database');
var crypto = require('crypto');
const uuidV4 = require('uuid/v4');


var express = require('express');
var router = express.Router();

// GET miner data
router.post('/', function(req, res) {
    var email = req.body.email;
    var password = crypto.createHash('md5').update(req.body.password).digest("hex");

    var appVersion = req.body.app_version;
    var devicePlatform = req.body.device_platform;
    var deviceModel = req.body.device_model;
    var deviceVersion = req.body.device_version;
    var deviceUuid = req.body.device_uuid;

    function getClientIp(req) {
        return (req.headers["X-Forwarded-For"] ||
            req.headers["x-forwarded-for"] ||
            '').split(',')[0] ||
            req.client.remoteAddress;
    }

    var ip = getClientIp(req);

    db.validateUser(email, function(err, results) {
        if (err) {
            return;
        }

        if (results.length > 0) {
            res.json(api.getResponse(api.ERRO_ACCOUNT_EXISTING, null, "Account existing"));
        } else {
            db.insertAccount(email, password, function (err, results) {
                if (err) {
                    console.log(err);
                    return;
                }

                var token = uuidV4();
                db.generateToken(token, email, appVersion, devicePlatform,
                    deviceModel, deviceVersion, deviceUuid, ip, function (err, results) {
                        var data = {
                            "token": token,
                            "email": email
                        };
                        res.json(api.getResponse(api.SUCC_SIGNUP, data, "The response is same as login success for login directly"));
                    });

            });
        }
    });


});

module.exports = router;
