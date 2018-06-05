var express = require('express');
var router = express.Router();
var db = require('../databases/database');
var api = require('../api/response');
var utility = require('../routes_frontend/utility');

// GET home page
router.get('/', function(req, res, next) {
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
                        db.getAllLoadRig(function (succ, results) {
                            if(succ && results){
                                db.getLazyDesktopLatestInstall(function (isFailC, data) {
                                    if(!isFailC && data && data) {
                                        var version = data[0].value;
                                        var url = data[1].value;
                                        db.checkIfEmailIsRoleAdmin(email,function (eM, is_admin) {
                                            res.render('backend/desktopUpdatesPage', {
                                                data: results,
                                                url: url,
                                                version: version,
                                                appName: api.WEB_NAME,
                                                is_admin: is_admin,
                                                email: email
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

router.post('/update-all-machine', function (req, res) {
    if(req.session.token && req.session.email) {
        var email = req.session.email;
        var token = req.session.token;
        db.validateAuthFrontEndToken(token,function (e, result) {
            if(e){
                res.json(api.getResponse(api.ERRO_NOT_FOUND,null,"lỗi mạng."));
                return;
            }
            if(result){
                var socket = req.app.get('socket');
                var obj = JSON.parse(req.body.data);
                var machine_id = obj.machine_id;
                var url = obj.url;
                var version = obj.version;
                var triggerSocket = function(dataSockets,socket) {
                    for (var index = 0; index < dataSockets.length; index ++){
                        var socket_id = dataSockets[index].socket_id;
                        if (socket.nsp.sockets[socket_id]) {
                            socket.nsp.sockets[socket_id].emit('update_new_version', url);
                        }
                    }
                };
                db.updateAllRigVersion(url,version,function (e, result) {
                    if(e){
                        res.json(api.getResponse(api.ERRO_NOT_FOUND,null,"lỗi mạng"));
                        return;
                    }
                    if(result){
                        res.json(api.getResponse(api.SUCC_UPDATE_RIG_MACHINE,null,""));



                        db.getSocketMinerAll(function (fail, results) {
                            if (fail) {
                                return;
                            }
                            if (results) {
                                triggerSocket(results,socket);
                            }
                        })
                    }
                });
            }
        });
    }else {
        res.json(api.getResponse(api.ERRO_NOT_FOUND,null,"Session đã hết hạn."));
    }




});

router.post('/update-one-machine', function (req, res) {
    var socket = req.app.get('socket');
    var obj = JSON.parse(req.body.data);
    var machine_id = obj.machine_id;
    var url = obj.url;
    var version = obj.version;
    var triggerSocket = function(dataSockets,socket) {
        for (var index = 0; index < dataSockets.length; index ++){
            var socket_id = dataSockets[index].socket_id;
            if(socket){
                if (socket.nsp.sockets && socket.nsp.sockets[socket_id]) {
                    socket.nsp.sockets[socket_id].emit('update_new_version', url);
                }
            }
        }
    };
    db.updateRigVersionByMachineId(machine_id,url,version,function (e, result) {
       if(e){
           res.json(api.getResponse(api.ERRO_NOT_FOUND,null,"Không tồn tại machine id"));
           return;
       }
       if(result){
           res.json(api.getResponse(api.SUCC_UPDATE_RIG_MACHINE,null,"Không tồn tại machine id"));


        db.getSocketMinerInfoByMachineId(machine_id, function (fail, results) {
            if (fail) {
                return;
            }
            if (results) {
                triggerSocket(results,socket);
            }
        });
       }
    });


});


router.post('/update-url-version', function (req, res) {
    var url = req.body.url;
    var version = req.body.version;

    console.log("update-url-version");

    db.updateLazyDesktopLatestInstallUrl(url,function (error, response) {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Updated url");
    });
    db.updateLazyDesktopLatestInstallVersion(version,function (error, response) {
        if (error) {
            console.log(error);
            return;
        }
        console.log("Updated version");
    });

    db.updateRigVersionByVersion(version,function (e, data) {

    });

    db.synchronizedRigVersion(version,function (e, data) {

    });


    res.json(api.getResponse(api.SUCC_UPDATE_FEED_URL_AND_VERSION,null,""));

});

module.exports = router;
