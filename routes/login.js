var api = require('../api/response');
var db = require('../databases/database');
var crypto = require('crypto');
const uuidV4 = require('uuid/v4');


var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {

    var params = req.body;
    var email = params.email;
    var password = crypto.createHash('md5').update(params.password).digest("hex");
    var appVersion = params.app_version;
    var devicePlatform = params.device_platform;
    var deviceModel = params.device_model;
    var deviceVersion = params.device_version;
    var deviceUuid = params.device_uuid;
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
            if (email == results[0].email && password == results[0].password) {
                var token = uuidV4();
                db.generateToken(token, email, appVersion, devicePlatform,
                                deviceModel, deviceVersion, deviceUuid, ip, function (err, results) {
                    if (err) {
                        return;
                    }

                    var data = {
                        "token": token,
                        "email": email
                    };
                    res.json(api.getResponse(api.SUCC_LOGIN, data, "Response from login"));
                });

            } else {
                res.json(api.getResponse(api.ERRO_INVALID_AUTH, null, "Wrong username or password."));
            }

        } else {
            res.json(api.getResponse(api.ERRO_INVALID_AUTH, null, "Wrong username or password."));
        }
    });

});

module.exports = router;
