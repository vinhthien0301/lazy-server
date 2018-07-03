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

                            db.checkIfEmailIsRoleAdmin(email,function (eM, is_admin) {
                                if(eM){
                                    res.redirect("login");
                                    return;
                                }
                                var bank_list = [{name: "Vietcombank",url:"images/vietcombank_logo.png"}
                                ,{name: "Sacombank",url:"images/sacombank_logo.jpg"}];
                                db.insertOrder(email,"NEW",2,"Vietcombank",function (e7, data) {
                                    if(e7){
                                        res.redirect("login");
                                        return;
                                    }
                                    var order_id = data.insertId;
                                    res.render('createOrderPage', {email: email,
                                        is_admin: is_admin,
                                        data: bank_list,
                                        order_id: order_id,
                                        name: "Vietcombank"
                                    });

                                })


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

router.post('/processing_order', function (req, res) {

    var obj = JSON.parse(req.body.data);
    var order_id = obj.order_id;
    db.updateOrderStatus(order_id,"PROCESSING",function (e, result) {
        if(e){
            res.json(api.getResponse(api.ERRO_NOT_FOUND,null,"lỗi mạng"));
            return;
        }
        if(result){
            res.json(api.getResponse(api.SUCC_DELETE));
        }
    })

});

router.post('/cancel_order', function (req, res) {

    var obj = JSON.parse(req.body.data);
    var order_id = obj.order_id;
    db.removeOrder(order_id,function (e, result) {
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
