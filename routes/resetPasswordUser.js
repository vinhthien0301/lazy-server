var express = require('express');
var router = express.Router();
var db = require('../databases/database');
const uuidV4 = require('uuid/v4');
var crypto = require('crypto');
var api = require('../api/response');
var nodemailer = require('nodemailer');
var moment = require('moment-timezone');
var UrlHelper = require('../helpers/UrlHelper');
var EmailHelper = require('../helpers/EmailHelper');





router.post('/update', function (req, res) {
    var token = req.body.token;
    var password = req.body.password;
    password = crypto.createHash('md5').update(password).digest("hex");

    db.countToken(token,function (e, result1) {
        if (e) {
            res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Lỗi mạng."));
            return;
        }
        if (result1) {
            if(result1.length > 0 && result1[0].count > 0){
                    db.updateUserPasswordByToken(token,password,function (e, result) {
                        if(e){
                            res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Lỗi mạng."));
                            return;
                        }
                        if(result){
                            db.removeUserToken(token,function (e1, data) {
                                if(e1){
                                    res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Lỗi mạng."));
                                }
                                if(data){
                                    res.json(api.getResponse(api.SUCC_UPDATE_PASSWORD, null, "ok"));
                                }
                            });
                        }
                    });
            } else {
                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Token đã không còn hiệu lực."));
            }
        }
    });
});

router.post('/send', function (req, res) {
    var obj = req.body;

    var email = obj.email;
    var token = uuidV4();

    db.setUserToken(email,token,function (fail, result) {
        if(fail){
            res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "User này không tồn tại"));
            return;
        }
        if(result){
            EmailHelper.sendResetPasswordEmail(req, token, function() {
                setTimeout(function() {
                    db.removeUserToken(token,function (e4,result) {
                        // nothing
                    });
                }, 300000);
                res.json(api.getResponse(api.SUCC_SEND_RESET_EMAIL, null, "ok"));
            });

        }
    });


});
module.exports = router;
