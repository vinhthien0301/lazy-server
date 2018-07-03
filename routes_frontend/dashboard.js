var express = require('express');
var router = express.Router();
var db = require('../databases/database');
const uuidV4 = require('uuid/v4');
var crypto = require('crypto');
var api = require('../api/response');
var session = require('express-session');
var utility = require('./utility');

// GET home page
router.get('/', function (req, res, next) {
    if(!req.session.token || !req.session.email) {
        res.redirect('login');
        return;
    }
    var email = req.session.email;
    var token = req.session.token;
    db.validateAuthFrontEndToken(token,function (e, result) {
        if(e){
            utility.reDirectToLogin(res);
            return;
        }
        if(result) {
            if (result.length > 0) {
                if (result[0].count > 0) {
                    db.checkIfEmailIsRoleAdmin(email,function (eM, is_admin) {
                        res.render('dashboardPage', {
                            email: email,
                            token: token,
                            is_admin: is_admin
                        });
                    });

                    // db.getEmailWebFrontEndFromToken(token, function (e, rigConfigObj) {
                    //     if (rigConfigObj && rigConfigObj.length > 0) {
                    //         db.getMinerConfigByEmail(email, function (e3, dt) {
                    //             if (dt) {
                    //                 console.log(JSON.stringify(dt));
                    //                 res.render('rigConfigPage', {email: email, data: dt, token: token});
                    //             }
                    //         });
                    //     }
                    // });
                }else {
                    utility.reDirectToLogin(res);
                }
            }else {
                utility.reDirectToLogin(res);
            }
        }
    });
});

module.exports = router;
