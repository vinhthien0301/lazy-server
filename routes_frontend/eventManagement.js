var express = require('express');
var router = express.Router();
var db = require('../databases/database');
const uuidV4 = require('uuid/v4');
var crypto = require('crypto');
var api = require('../api/response');
var session = require('express-session');
var utility = require('./utility');
var moment = require('moment');

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
                        // start code
                        db.getAllEvent(email,function (eM, list) {
                           if(eM){
                               res.redirect("login");
                               return;
                           }
                           if(list){


                               for(var index=0;index<list.length;index++){
                                   var date = moment(list[index].created_at).format('L');    // 04/04/2018
                                   var time = moment(list[index].created_at).format('hh:mm A');
                                   list[index].time = {date: date,time: time};
                               }
                               db.checkIfEmailIsRoleAdmin(email,function (eM, is_admin) {
                                   res.render('eventManagementPage', {email: email,
                                       data: list,
                                       is_admin : is_admin
                                   });
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


module.exports = router;
