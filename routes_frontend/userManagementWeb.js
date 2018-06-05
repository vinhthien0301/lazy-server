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
    if(req.session.token && req.session.email) {
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
                        db.getAllAuthWebFrontEnd(function (e, data) {
                            if(e){
                                res.redirect("login");
                                return;
                            }
                            db.checkIfEmailIsRoleAdmin(email,function (eM, is_admin) {
                                if(eM){
                                    res.redirect("login");
                                    return;
                                }
                                res.render('userManagementWeb', {email: email, data: data,
                                    is_admin: is_admin
                                });
                            });

                        })
                    }else {
                        res.redirect("login");
                    }
                }else {
                    res.redirect("login");
                }
            }
        });
    }else {
        res.redirect("login");
    }
});

router.post('/delete', function (req, res) {

    var obj = JSON.parse(req.body.data);
    var token = obj.token;
    var email = obj.email;
    db.removeUpdateAuthWebFrontend(token,email,function (e, result) {
        if(e){
            res.json(api.getResponse(api.ERRO_NOT_FOUND,null,"lỗi mạng"));
            return;
        }
        if(result){
            res.json(api.getResponse(api.SUCC_DELETE));
        }
    })

});


module.exports = router;
