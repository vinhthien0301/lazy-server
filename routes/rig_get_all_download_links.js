var api = require('../api/response');
var db = require('../databases/database');


var express = require('express');
var router = express.Router();

// GET all software download links
router.post('/', function (req, res) {
    var platform = req.query.platform;
    var machineID = req.query.machine_id;
    var email = req.query.email;
    var token = req.query.token;
    if(token){
        db.authorizeRigMachineToken(token, function (e, count) {
            if(e){
                res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                return;
            }

            if(count[0].count == 0){
                res.json(api.getResponse(api.ERRO_TOKEN_NOT_EXIST, data, ""));
                return;
            }

            if (email) {
                db.getAllSoftwareDownloadLink(platform, function (err, results) {
                    if (err) {
                        res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                        return;
                    }

                    var data = {
                        downloadLinks: results
                    };
                    db.getAllRootDirsWithMachineID(machineID, function (error, secondResults) {
                        if (error) {
                            res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                            return;
                        }

                        data.rootDirs = secondResults;

                        db.getRunBatchByPlatformAndEmail(platform, email, function (err1, thirdResults) {
                            if (err1) {
                                res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                                return;
                            }

                            var batches = [];
                            thirdResults.forEach(function (item, index, arr) {
                                var itemReturn = {
                                    "platform": item.platform,
                                    "software": item.software,
                                    "version": item.version,
                                    "coins_related": item.coins_related,
                                    "bat_script": item.bat_script,
                                    "name": item.name
                                };
                                batches.push(itemReturn);
                            });

                            data.runBatches = batches;

                            res.json(api.getResponse(api.SUCC_DOWNLOAD_LINK, data, "Logout successfully"));
                        });


                    });


                });
            } else {
                db.getAllSoftwareDownloadLink(platform, function (err, results) {
                    if (err) {
                        res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                        return;
                    }

                    var data = {
                        downloadLinks: results
                    };
                    db.getAllRootDirsWithMachineID(machineID, function (error, secondResults) {
                        if (error) {
                            res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                            return;
                        }

                        data.rootDirs = secondResults;

                        db.getRunBatch(platform, function (err1, thirdResults) {
                            if (err1) {
                                res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                                return;
                            }

                            var batches = [];
                            thirdResults.forEach(function (item, index, arr) {
                                var itemReturn = {
                                    "platform": item.platform,
                                    "software": item.software,
                                    "version": item.version,
                                    "coins_related": item.coins_related,
                                    "bat_script": item.bat_script,
                                    "name": item.name
                                };
                                batches.push(itemReturn);
                            });

                            data.runBatches = batches;

                            res.json(api.getResponse(api.SUCC_DOWNLOAD_LINK, data, "Logout successfully"));
                        });


                    });


                });
            }

        })
    }else {
        if (email) {
            db.getAllSoftwareDownloadLink(platform, function (err, results) {
                if (err) {
                    res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                    return;
                }

                var data = {
                    downloadLinks: results
                };
                db.getAllRootDirsWithMachineID(machineID, function (error, secondResults) {
                    if (error) {
                        res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                        return;
                    }

                    data.rootDirs = secondResults;

                    db.getRunBatchByPlatformAndEmail(platform, email, function (err1, thirdResults) {
                        if (err1) {
                            res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                            return;
                        }

                        var batches = [];
                        thirdResults.forEach(function (item, index, arr) {
                            var itemReturn = {
                                "platform": item.platform,
                                "software": item.software,
                                "version": item.version,
                                "coins_related": item.coins_related,
                                "bat_script": item.bat_script,
                                "name": item.name
                            };
                            batches.push(itemReturn);
                        });

                        data.runBatches = batches;

                        res.json(api.getResponse(api.SUCC_DOWNLOAD_LINK, data, "Logout successfully"));
                    });


                });


            });
        } else {
            db.getAllSoftwareDownloadLink(platform, function (err, results) {
                if (err) {
                    res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                    return;
                }

                var data = {
                    downloadLinks: results
                };
                db.getAllRootDirsWithMachineID(machineID, function (error, secondResults) {
                    if (error) {
                        res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                        return;
                    }

                    data.rootDirs = secondResults;

                    db.getRunBatch(platform, function (err1, thirdResults) {
                        if (err1) {
                            res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Máy chủ bảo trì"));
                            return;
                        }

                        var batches = [];
                        thirdResults.forEach(function (item, index, arr) {
                            var itemReturn = {
                                "platform": item.platform,
                                "software": item.software,
                                "version": item.version,
                                "coins_related": item.coins_related,
                                "bat_script": item.bat_script,
                                "name": item.name
                            };
                            batches.push(itemReturn);
                        });

                        data.runBatches = batches;

                        res.json(api.getResponse(api.SUCC_DOWNLOAD_LINK, data, "Logout successfully"));
                    });


                });


            });
        }

    }



});

module.exports = router;
