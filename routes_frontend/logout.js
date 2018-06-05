var express = require('express');
var router = express.Router();
var db = require('../databases/database');
const uuidV4 = require('uuid/v4');
var crypto = require('crypto');
var api = require('../api/response');
var utility = require('./utility');
var session = require('express-session');

// GET home page
router.get('/', function(req, res, next) {
    utility.returnToErrorPage(res);
});


router.post('/', function (req, res) {
    if(req.session.token && req.session.email) {
        var token = req.session.token;
        var email = req.session.email;
        db.removeUpdateAuthWebFrontend(token,email,function (e, result) {
            if(e){
                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Response from login"));
            }
            if(result){
                req.session.token = null;
                req.session.email = null;
                res.json(api.getResponse(api.SUCC_LOG_OUT, null, "Response from login"));
            }
        });
    }else {
        res.json(api.getResponse(api.ERRO_TOKEN_NOT_EXIST, null, "Response from login"));
    }
});
module.exports = router;
