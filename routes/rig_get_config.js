var api = require('../api/response');
var db = require('../databases/database');


var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {
    var machineID = req.query.machine_id;
    var email = req.query.email;
    var platform = req.query.platform;
    var token = req.query.token;
    if(token){
        db.authorizeRigMachineToken(token, function (e, count) {
            if (e) {
                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "lỗi mạng"));
                return;
            }

            if((count[0].count == 0)){
                res.json(api.getResponse(api.ERRO_TOKEN_NOT_EXIST, null, "token không tồn tại"));
                return;
            }

            db.getRigConfigWithMachine(machineID, email, platform, function (err, results) {
                if (err) {
                    res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "lỗi mạng"));
                    return;
                }

                if (results.length > 0) {
                    res.json(api.getResponse(api.SUCC_GET_RIG_CONFIG, results, "Get rig config successfully"));
                    return;
                }
                if (results.length == 0) {
                    db.insertRigConfig(email, "miner", 0, "", "", "", machineID, platform, function (e, result) {
                        if (e) {
                            res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "lỗi mạng"));
                            return;
                        }
                        if (result) {
                            db.getRigConfigWithMachine(machineID, email, platform, function (e1, data) {
                                if (e1) {
                                    res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "lỗi mạng"));
                                    return;
                                }
                                if (data) {
                                    res.json(api.getResponse(api.SUCC_GET_RIG_CONFIG, data, "Get rig config successfully"));

                                }
                            })
                        }
                    });
                }
            });
        });

    }else {
        db.getRigConfigWithMachine(machineID, email, platform, function (err, results) {
            if (err) {
                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "lỗi mạng"));
                return;
            }

            if (results.length > 0) {
                res.json(api.getResponse(api.SUCC_GET_RIG_CONFIG, results, "Get rig config successfully"));
                return;
            }
            if (results.length == 0) {
                db.insertRigConfig(email, "miner", 0, "", "", "", machineID, platform, function (e, result) {
                    if (e) {
                        res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "lỗi mạng"));
                        return;
                    }
                    if (result) {
                        db.getRigConfigWithMachine(machineID, email, platform, function (e1, data) {
                            if (e1) {
                                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "lỗi mạng"));
                                return;
                            }
                            if (data) {
                                res.json(api.getResponse(api.SUCC_GET_RIG_CONFIG, data, "Get rig config successfully"));

                            }
                        })
                    }
                });
            }
        });
    }


});

module.exports = router;
