var express = require('express');
var router = express.Router();
var db = require('../databases/database');
const uuidV4 = require('uuid/v4');
var crypto = require('crypto');
var api = require('../api/response');

// GET home page
router.get('/', function(req, res, next) {
    res.render('signupPage', {
        appName: api.WEB_NAME,
        data:""
    });
});

router.post('/', function (req, res) {
    var obj = req.body;
    var email = obj.email;
    var app_code_name = obj.app_code_name;
    var app_name = obj.app_name;
    var app_version = obj.app_version;
    var platform = obj.platform;
    var user_agent = obj.user_agent;
    var product = obj.product;
    var product_sub = obj.product_sub;
    var vendor = obj.vendor;
    var password = crypto.createHash('md5').update(obj.password).digest("hex");

    function getClientIp(req) {
        return (req.headers["X-Forwarded-For"] ||
            req.headers["x-forwarded-for"] ||
            '').split(',')[0] ||
            req.client.remoteAddress;
    }
    function delete_token(callback) {
        if(req.session.token && req.session.email) {
            var previousToken = req.session.token;
            var previousEmail = req.session.email;

            db.removeUpdateAuthWebFrontend(previousToken,previousEmail,function () {
                callback();
            });
        }else {
            callback();
        }
    }

    delete_token(function () {
        var ip = getClientIp(req);

        db.validateUser(email, function(err, results) {
            if (err) {
                return;
            }

            if (results.length > 0) {
                res.json(api.getResponse(api.ERRO_ACCOUNT_EXISTING, null, "Account existing"));
            } else {
                db.insertAccount(email,password,function (fail, result) {
                    if (fail) {
                        console.log(fail);
                        return;
                    }

                    var token = uuidV4();
                    db.generateTokenWebFrontEnd(token, email, app_code_name, app_name, app_version,
                        platform, product, product_sub, user_agent, vendor,
                        ip, function (err, results) {
                            if (err) {
                                return;
                            }

                            var data = {
                                "token": token,
                                "email": email
                            };
                            req.session.email= email;
                            req.session.token= token;
                            res.json(api.getResponse(api.SUCC_SIGNUP, data, "The response is same as login success for login directly"));
                        });
                });
            }
        });
    });

});
module.exports = router;
