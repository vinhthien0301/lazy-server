var api = require('../api/response');
var db = require('../databases/database');


var express = require('express');
var router = express.Router();

// GET download link
router.post('/', function (req, res) {
    var platform = req.query.platform;
    var machine_id = req.query.machine_id;
    var email = req.query.email;
    var token = req.query.token;
    if(token){
        db.authorizeRigMachineToken(token, function (e1, count) {

            if (e1) {
                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Máy chủ bảo trì"));
                return;
            }

            if(count[0].count == 0){
                res.json(api.getResponse(api.ERRO_TOKEN_NOT_EXIST, null, ""));
                return;
            }

            if (email) {
                db.getRunBatchByPlatformAndEmail(platform, email, function (err, results) {
                    if (err) {
                        res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Máy chủ bảo trì"));
                        return;
                    }
                    if (results.length > 0) {
                        console.log(results);
                        var data = [];
                        results.forEach(function (item, index, arr) {
                            var itemReturn = {
                                "platform": item.platform,
                                "software": item.software,
                                "version": item.version,
                                "coins_related": item.coins_related,
                                "bat_script": item.bat_script,
                                "name": item.name
                            };
                            data.push(itemReturn);
                        });

                        db.getAllDownloadLink(function (e, downloadLinkArray) {
                            if (downloadLinkArray) {
                                db.getMinerConfigByMachineId(machine_id, function (e0, config) {
                                    if (config) {
                                        var obj = {
                                            data: data,
                                            downloadLink: downloadLinkArray,
                                            config: config
                                        };
                                        res.json(api.getResponse(api.SUCC_RUN_BATCH, obj, "Get run batch successfully"));
                                    }
                                });


                            }
                        });
                    } else {
                        res.json(api.getResponse(api.ERRO_FILE_NOT_FOUND, null, "File not found"));
                    }
                });

            } else { // will be deleted in future
                db.getRunBatch(platform, function (err, results) {
                    if (err) {
                        return;
                    }
                    if (results.length > 0) {
                        var data = [];
                        results.forEach(function (item, index, arr) {
                            var itemReturn = {
                                "platform": item.platform,
                                "software": item.software,
                                "version": item.version,
                                "coins_related": item.coins_related,
                                "bat_script": item.bat_script,
                                "name": item.name
                            };
                            data.push(itemReturn);
                        });

                        db.getAllDownloadLink(function (e, downloadLinkArray) {
                            if (downloadLinkArray) {
                                db.getMinerConfigByMachineId(machine_id, function (e0, config) {
                                    if (config) {
                                        var obj = {
                                            data: data,
                                            downloadLink: downloadLinkArray,
                                            config: config
                                        };
                                        res.json(api.getResponse(api.SUCC_RUN_BATCH, obj, "Get run batch successfully"));
                                    }
                                });


                            }
                        });
                    } else {
                        res.json(api.getResponse(api.ERRO_FILE_NOT_FOUND, null, "File not found"));
                    }
                });

            }
        })
    }else {
        if (email) {
            db.getRunBatchByPlatformAndEmail(platform, email, function (err, results) {
                if (err) {
                    res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Máy chủ bảo trì"));
                    return;
                }
                if (results.length > 0) {
                    console.log(results);
                    var data = [];
                    results.forEach(function (item, index, arr) {
                        var itemReturn = {
                            "platform": item.platform,
                            "software": item.software,
                            "version": item.version,
                            "coins_related": item.coins_related,
                            "bat_script": item.bat_script,
                            "name": item.name
                        };
                        data.push(itemReturn);
                    });

                    db.getAllDownloadLink(function (e, downloadLinkArray) {
                        if (downloadLinkArray) {
                            db.getMinerConfigByMachineId(machine_id, function (e0, config) {
                                if (config) {
                                    var obj = {
                                        data: data,
                                        downloadLink: downloadLinkArray,
                                        config: config
                                    };
                                    res.json(api.getResponse(api.SUCC_RUN_BATCH, obj, "Get run batch successfully"));
                                }
                            });


                        }
                    });
                } else {
                    res.json(api.getResponse(api.ERRO_FILE_NOT_FOUND, null, "File not found"));
                }
            });

        } else { // will be deleted in future
            db.getRunBatch(platform, function (err, results) {
                if (err) {
                    return;
                }
                if (results.length > 0) {
                    var data = [];
                    results.forEach(function (item, index, arr) {
                        var itemReturn = {
                            "platform": item.platform,
                            "software": item.software,
                            "version": item.version,
                            "coins_related": item.coins_related,
                            "bat_script": item.bat_script,
                            "name": item.name
                        };
                        data.push(itemReturn);
                    });

                    db.getAllDownloadLink(function (e, downloadLinkArray) {
                        if (downloadLinkArray) {
                            db.getMinerConfigByMachineId(machine_id, function (e0, config) {
                                if (config) {
                                    var obj = {
                                        data: data,
                                        downloadLink: downloadLinkArray,
                                        config: config
                                    };
                                    res.json(api.getResponse(api.SUCC_RUN_BATCH, obj, "Get run batch successfully"));
                                }
                            });


                        }
                    });
                } else {
                    res.json(api.getResponse(api.ERRO_FILE_NOT_FOUND, null, "File not found"));
                }
            });

        }
    }



});

module.exports = router;
