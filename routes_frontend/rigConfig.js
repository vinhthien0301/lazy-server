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
                        db.getEmailWebFrontEndFromToken(token, function (e, rigConfigObj) {
                            if (rigConfigObj && rigConfigObj.length > 0) {
                                db.getMinerConfigByEmail(email, function (e3, dt) {
                                    if (dt) {
                                        db.checkIfEmailIsRoleAdmin(email,function (eM, is_admin) {
                                            res.render('rigConfigPage', {email: email, data: dt,
                                                token: token,
                                                is_admin: is_admin
                                            });
                                        });

                                    }
                                });
                            }
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

router.post('/', function (req, res) {

    var obj = JSON.parse(req.body.data);
    var id = obj.id;
    var email = obj.email;
    var machine_id = obj.machine_id;
    db.removeRigConfigById(id,function (e, result) {
        if(e){
            res.json(api.getResponse(api.ERRO_NOT_FOUND,null,"lỗi mạng"));
            return;
        }
        if(result){
            db.removeLoadRigByMachineId(email,machine_id,function (err, rs) {
                if(err){
                    res.json(api.getResponse(api.ERRO_NOT_FOUND,null,"lỗi mạng"));
                    return;
                }
                if(rs){
                    res.json(api.getResponse(api.SUCC_EXEC));
                }

            });

        }
    })

});
module.exports = router;
