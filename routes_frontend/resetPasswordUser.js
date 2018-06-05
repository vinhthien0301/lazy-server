var express = require('express');
var router = express.Router();
var db = require('../databases/database');
const uuidV4 = require('uuid/v4');
var crypto = require('crypto');
var api = require('../api/response');
var nodemailer = require('nodemailer');
var moment = require('moment-timezone');


router.get('/', function(req, res, next) {
    var token = req.query.token;
    if (token) {
        db.countToken(token,function (e, result) {
            if(e){
                res.render("error");
                return;
            }

            if(result && result.length > 0 && result[0].count > 0){
                res.render('changeUserPasswordPage', {
                   appName: api.WEB_NAME,
                   token: token
                });
            } else {
                res.render("error");
            }
        });

    } else {
        res.render('resetPasswordUserPage',{appName: api.WEB_NAME});
    }



});


module.exports = router;
