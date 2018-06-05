var api = require('../api/response');
var db = require('../databases/database');
var crypto = require('crypto');
const uuidV4 = require('uuid/v4');


var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {

    var params = req.query;
    console.log(params);
    var token = params.token;
    db.authorizeRigMachineToken(token,function (e, count) {
        if(e){
            res.json(api.getResponse(api.ERRO_NOT_FOUND, data, "Lỗi mạng"));
            return;
        }
        console.log("DEM");
        console.log("token  "+token);
        console.log(count);
        if(count[0].count==0){
            res.json(api.getResponse(api.ERRO_TOKEN_NOT_EXIST, false, "Token không tồn tại"));
        }else {
            res.json(api.getResponse(api.SUCC_EXEC, true, ""));
        }
    })

});

module.exports = router;
