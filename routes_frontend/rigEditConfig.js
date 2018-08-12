var express = require('express');
var router = express.Router();
var db = require('../databases/database');
const uuidV4 = require('uuid/v4');
var crypto = require('crypto');
var api = require('../api/response');
var utility = require('./utility');

router.get('/', function (req, res, next) {
    if (!req.session.token || !req.session.email || !req.session.id) {
        res.redirect("login");
        return;
    }

    var email = req.session.email;
    var token = req.session.token;
    var id = req.query.id;

    db.validateAuthFrontEndToken(token,function (eA, rs) {
        if(eA){
            res.redirect("login");
            return;
        }

        if (!rs || rs.length == 0 || rs[0].count == 0 || rs[0].email != email) {
            res.redirect("login");
            return;
        }



        db.getMinerConfigByRowId(id, function (e, data) {

            if (data.length == 0) {
                res.json(api.getResponse(api.ERRO_FILE_NOT_FOUND, null, "Miner ID doesn't exists"));
                return;
            }

            db.getRunBatchByPlatformAndEmail(data[0].platform, email, function (err, results) {
                if (err) {
                    return;
                }

                if (results.length == 0) {
                    db.checkIfEmailIsRoleAdmin(email,function (eM, is_admin) {

                        db.getAllDownloadLink(function (e0, downloadLinkArray) {
                            if (!data || data.length == 0) {
                                res.json(api.getResponse(api.ERRO_FILE_NOT_FOUND, null, "Can't get downloadlink list"));
                                return;
                            }

                            res.render('rigEditConfigPage', {
                                appName: api.WEB_NAME,
                                data: data[0],
                                select: [],
                                batch: [],
                                downloadLink: downloadLinkArray,
                                batch_str: JSON.stringify({}),
                                email: email,
                                token: token,
                                is_admin: is_admin
                            });
                        });
                    });
                    return;
                }

                var arraySelect = [];
                var previousCoin = null;
                for (var index = 0; index < results.length; index++) {
                    var item = results[index];
                    var itemOne = {
                        "platform": item.platform,
                        "software": item.software,
                        "version": item.version,
                        "coins_related": item.coins_related,
                        "filename": item.filename,
                        "download_link": item.download_link
                    };
                    var temp = [];
                    temp.push(itemOne);
                    var itemTwo = {
                        "platform": item.platform,
                        "software": item.software,
                        "version": item.version,
                        "coins_related": item.coins_related,
                        "arrayData": temp
                    };
                    if (index == 0) {
                        itemTwo.id = item.id;
                        arraySelect.push(itemTwo);
                    } else {
                        var previousObj = arraySelect[arraySelect.length - 1];

                        if (previousObj.coins_related == item.coins_related) {
                            itemOne.id = item.id;
                            arraySelect[arraySelect.length - 1].arrayData.push(itemOne);
                        } else {
                            itemTwo.id = item.id;
                            arraySelect.push(itemTwo);
                        }
                    }
                }
                db.checkIfEmailIsRoleAdmin(email,function (eM, is_admin) {

                    db.getAllDownloadLink(function (e0, downloadLinkArray) {
                        if (data && data.length > 0) {
                            res.render('rigEditConfigPage', {
                                appName: api.WEB_NAME,
                                data: data[0],
                                select: arraySelect,
                                batch: results,
                                downloadLink: downloadLinkArray,
                                batch_str: JSON.stringify(results),
                                email: email,
                                token: token,
                                page_name: "config_page",
                                page_number_child_left_menu:0,
                                is_admin: is_admin
                            });
                        } else {
                            res.json(api.getResponse(api.ERRO_FILE_NOT_FOUND, null, "Can't get downloadlink list"));
                        }
                    });
                });

            });
        });

    });

});

router.post('/run', function (req, res) {
    console.log("SAVE RIG CONFIG!");

    var obj = JSON.parse(req.body.data);
    var id = obj.id;
    var email = obj.email;
    var name = obj.name;
    var coin_name = obj.coin_name;
    var pool = obj.pool;
    var wallet = obj.wallet;
    var machineId = obj.machineId;
    var platform = obj.platform;
    var auto_start = obj.auto_start;
    console.log(req.body.data);
    db.updateMinerCofigByRowId(id, email, name, coin_name, pool, wallet, platform, auto_start, function (e, result) {
        if (e) {
            console.log(e);
            return;

        }
        if (result) {
            db.getSocketMinerInfoByMachineId(machineId, function (e1, sockets) {
                if (e1) {
                    console.log(e1);
                    return;
                }

                if (sockets && sockets.length > 0) {
                    for (var index = 0; index < sockets.length; index++) {
                        var socket_id = sockets[index].socket_id;
                        var socket = req.app.get('socket');
                        if (socket.nsp.sockets && socket.nsp.sockets[socket_id]) {
                            socket.nsp.sockets[socket_id].emit('update_config_and_run', {
                                machineId: machineId,
                                name: name,
                                coins_related: coin_name,
                                pool: pool,
                                wallet: wallet,
                                platform: platform,
                                auto_start: auto_start
                            });
                        }
                    }

                    res.json(api.getResponse(api.SUCC_EXEC));
                } else {
                    res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "không tìm thấy machine id"));
                }
            });

        }
    });

});

router.post('/', function (req, res) {
    var action = req.body.action;
    console.log("action " + action);
    switch (action) {
        case "add":
            var obj = JSON.parse(req.body.data);

            var coin = obj.coin;
            var platform = obj.platform;
            var software = obj.software;
            var des = obj.des;
            var bat = obj.bat;
            var name = obj.name;
            var email = obj.email;
            var is_global = obj.is_global;

            db.insertRunBatch(platform, software, coin, des, bat, name,email,is_global, function (e, result) {
                if (result) {
                    res.json(api.getResponse("succ", result));
                }
            });
            break;
        case "update_coin_related":
            var obj = JSON.parse(req.body.data);
            var id = obj.id;
            var coin = obj.coin;
            var coin_id = obj.coin_id;
            db.updateMinerCofigCoin(id, coin_id, coin, function (e, result) {
                if (result) {
                    res.json(api.getResponse("succ"));
                }
            });
            break;
        case "get_downloadlink":
            db.getAllDownloadLink(function (e, results) {
                res.json(api.getResponse("succ", results));
            });
            break;
        case "update":
            var obj = JSON.parse(req.body.data);
            var coin = obj.coin;
            var id = obj.id;
            var platform = obj.platform;
            var software = obj.software;
            var des = obj.des;
            var bat = obj.bat;
            var name = obj.name;
            var is_global = obj.is_global;
            db.updateRunBatch(id, platform, software, coin, des, bat, name,is_global, function (e, result) {
                res.json(api.getResponse("succ"));
            });
            break;
        case "delete_coin":
            var obj = JSON.parse(req.body.data);
            console.log("obj " + JSON.stringify(obj));

            var id = obj.id;
            console.log("remove " + id);
            db.removeRunBatchById(id, function (e, result) {
                if (result) {
                    res.json(api.getResponse("succ"));
                }
            });
            break;
        case "check_coin_using":
            var obj = JSON.parse(req.body.data);
            var runbatch_id = obj.runbatch_id;
            db.countMinerConfigByBatchId(runbatch_id, function (fail, result) {
                if (fail) {
                    res.json(api.getResponse("NOT_FOUND_CHECK_COIN_USING"));
                    return;
                }
                if (result) {
                    res.json(api.getResponse("SUCC_CHECK_COIN_USING", result[0].count, ""));
                }
            });
            break;
    }


});
module.exports = router;
