var express = require('express');
var router = express.Router();
var db = require('../databases/database');
var api = require('../api/response');
var session = require('express-session');

exports.reDirectToLogin = function(res) {
    res.redirect("login");
};

exports.reDirectToLogin1 = function(res) {
    res.redirect("../login");
};

exports.renderLogin = function(res) {
    res.render('loginPage');
};

exports.renderLogin1 = function(res) {
    res.render('../loginPage');
};

exports.returnToErrorPage = function(res) {
    res.redirect("error");
};

router.post('/count_machine', function (req, res) {
    if(req.session.token && req.session.email) {

        db.countMinerMachine(req.session.email, function (e3, dt) {
            if(e3){
                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Response from login"));
                return;
            }
            if (dt) {
                res.json(api.getResponse(api.SUCC_COUNT_MACHINE, dt[0].count, "Response from login"));
            }
        });
    }else {
        res.json(api.getResponse(api.ERRO_TOKEN_NOT_EXIST, null, "Response from login"));
    }
});

module.exports = router;
