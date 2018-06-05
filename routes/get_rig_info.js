var api = require('../api/response');
var db = require('../databases/database');
var crypto = require('crypto');
const uuidV4 = require('uuid/v4');


var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {

    var machine_id = req.body.machine_id;
    db.getMinerConfigByMachineId(machine_id,function (fail, result) {
       if(!fail && result){
           res.send({
               result: "ok",
               data: result
           });

       } else {
           res.send({
               result: "error"
           });
       }
    });

});

module.exports = router;
