var express = require('express');
var router = express.Router();
var db = require('../databases/database');
const uuidV4 = require('uuid/v4');
var crypto = require('crypto');
var api = require('../api/response');
var utility = require('./utility');
var session = require('express-session');
var i18n = require('i18n');
var moment = require('moment');

// GET home page
router.get('/', function(req, res, next) {
    if(req.session.token && req.session.email) {
        res.redirect('dashboard');
    }else {
        res.render('loginPage');
    }

});


router.post('/validate', function (req, res) {
    if(req.session.token && req.session.email) {
        res.json(api.getResponse(api.TOKEN_EXIST, null, "Response from login"));
    }else {
        res.json(api.getResponse(api.ERRO_TOKEN_NOT_EXIST, null, "Response from login"));
    }
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
    function delete_token(token, email, callback) {
        if(token && email) {
            var previousToken = token;
            var previousEmail = email;
            db.removeUpdateAuthWebFrontend(previousToken,previousEmail,function () {
                callback();
            });
        }else {
            callback();
        }
    }
    function getClientIp(req) {
        return (req.headers["X-Forwarded-For"] ||
            req.headers["x-forwarded-for"] ||
            '').split(',')[0] ||
            req.client.remoteAddress;
    }
    var ip = getClientIp(req);
    var password = crypto.createHash('md5').update(obj.password).digest("hex");
    db.validateUser(email, function (err, results) {
        if (err) {
            return;
        }

        if (results.length > 0) {
            delete_token(req.session.token, req.session.email, function () {
                if (email == results[0].email && password == results[0].password) {
                    var token = uuidV4();
                    db.generateTokenWebFrontEnd(token, email, app_code_name, app_name, app_version, platform, product, product_sub, user_agent, vendor, ip, function (err, results) {
                        if (err) {
                            return;
                        }
                        var data = {
                            "token": token,
                            "email": email
                        };
                        console.log(444222);

                        req.session.email = email;
                        req.session.token = token;
                        console.log(req.session.email);
                        console.log(req.session.token);
                        res.json(api.getResponse(api.SUCC_LOGIN, data, "Response from login"));
                    });
                } else {
                    res.json(api.getResponse(api.ERRO_INVALID_AUTH, null, "Wrong username or password."));
                }
            });

        } else {
            res.json(api.getResponse(api.ERRO_INVALID_AUTH, null, "Wrong username or password."));
        }
    });




});
module.exports = router;
