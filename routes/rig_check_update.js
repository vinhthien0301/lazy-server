var api = require('../api/response');
var db = require('../databases/database');
var crypto = require('crypto');
const uuidV4 = require('uuid/v4');


var express = require('express');
var router = express.Router();

router.post('/', function (req, res) {

    var params = req.query;
    var version = params.version;
    var machine_id = params.machine_id;
    var token = params.token;
    var compareVersion = function (firstVersion, secondVersion) {
        // 1: bigger
        // 0: equal
        // -1: smaller

        var firstVersionParts = firstVersion.split(".");
        var secondVersionParts = secondVersion.split(".");
        var minLength = firstVersionParts.length;

        if (secondVersionParts.length < minLength) {
            minLength = secondVersionParts.length;
        }
        for (var index = 0; index < minLength; index++) {
            if (firstVersionParts[index] < secondVersionParts[index]) {
                return -1;
            } else if (firstVersionParts[index] > secondVersionParts[index]) {
                return 1;
            }
        }

        if (firstVersionParts.length > secondVersionParts.length) {
            return 1;
        } else if (firstVersionParts.length < secondVersionParts.length) {
            return -1;
        }

        return 0;
    };

    if(token){
        db.authorizeRigMachineToken(token, function (e, count) {
            if(e){
                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Máy chủ bảo trì."));
                return;
            }

            if(count[0].count == 0){
                res.json(api.getResponse(api.ERRO_TOKEN_NOT_EXIST, null, "Máy chủ bảo trì."));
                return;
            }
            db.getLoadRigByMachineId(machine_id, function (e, data) {
                if (!e) {
                    res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Không tìm thấy mã máy."));
                    return;
                }
                if (data == null || data.length == 0) {
                    res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Không tìm thấy mã máy."));
                    return;
                }

                if (data[0].desired_version != null) {
                    res.json(api.getResponse(api.SUCC_UPDATE_RIG_MACHINE, {needUpdate: false}, "Không tìm thấy phiên bản mong muốn."));
                    return;
                }

                if (compareVersion(data[0].desired_version, version) < 1) {
                    res.json(api.getResponse(api.SUCC_UPDATE_RIG_MACHINE, {needUpdate: false}, "Phiên bản mong muốn nhỏ hơn hoặc bằng phiên bản hiện tại"));
                    return;
                }

                res.json(api.getResponse(api.SUCC_UPDATE_RIG_MACHINE, {
                    needUpdate: true,
                    url: data[0].desired_feed_url
                }, ""));




            });
        });
    }else {
        db.getLoadRigByMachineId(machine_id, function (e, data) {
            if (!e) {
                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Máy chủ bảo trì."));
                return;
            }
            if (!e) {
                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Không tìm thấy mã máy."));
                return;
            }
            if (data == null || data.length == 0) {
                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Không tìm thấy mã máy."));
                return;
            }

            if (data[0].desired_version != null) {
                res.json(api.getResponse(api.SUCC_UPDATE_RIG_MACHINE, {needUpdate: false}, "Không tìm thấy phiên bản mong muốn."));
                return;
            }

            if (compareVersion(data[0].desired_version, version) < 1) {
                res.json(api.getResponse(api.SUCC_UPDATE_RIG_MACHINE, {needUpdate: false}, "Phiên bản mong muốn nhỏ hơn hoặc bằng phiên bản hiện tại"));
                return;
            }

            res.json(api.getResponse(api.SUCC_UPDATE_RIG_MACHINE, {
                needUpdate: true,
                url: data[0].desired_feed_url
            }, ""));
        });
    }


});

module.exports = router;
