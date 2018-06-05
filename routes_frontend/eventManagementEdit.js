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
                        var id = req.query.id;

                        db.getEventById(id,function (eM, list) {
                           if(eM){
                               res.redirect("login");
                               return;
                           }
                           if(list){
                               var date = moment(list[0].created_at).format('L');    // 04/04/2018
                               var time = moment(list[0].created_at).format('HH:mm A');
                               var full = date + " " + time;
                               list[0].time = full;
                               db.checkIfEmailIsRoleAdmin(email,function (eM, is_admin) {
                                   res.render('eventManagementEditPage', {email: email,
                                       data: list[0],
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
