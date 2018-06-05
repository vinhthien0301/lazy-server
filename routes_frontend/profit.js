var express = require('express');
var router = express.Router();
var db = require('../databases/database');
var utility = require('./utility');

// GET home page
router.get('/', function (req, res, next) {
    if(req.session.token && req.session.email) {
        var email = req.session.email;
        var token = req.session.token;
        db.validateAuthFrontEndToken(token,function (e, result) {
            if(e){
                res.redirect("login");
                return;
            }
            if(result) {
                if (result.length > 0) {
                    if (result[0].count > 0) {
                        db.checkIfEmailIsRoleAdmin(email,function (eM, is_admin) {
                            res.render('profitPage', {
                                email: email,
                                token: token,
                                is_admin: is_admin
                            });
                        });

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

module.exports = router;
