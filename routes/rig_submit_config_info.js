var api = require('../api/response');
var db = require('../databases/database');
var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {

    var email = req.query.email;
    var name = req.query.name;
    var auto_start = req.query.auto_start;
    var coins_related = req.query.coins_related;
    var pool = req.query.pool;
    var wallet = req.query.wallet;
    var machine_id = req.query.machine_id;
    if (auto_start == true || auto_start == 'true') {
        auto_start = 1;
    } else {
        auto_start = 0;
    }

    db.getMinerConfigByMachineId(machine_id,function (failA, resultA) {
        if (failA) {
            console.log(failA);
            res.send('not_ok');
            return;
        }

        if (resultA) {
            if (resultA.length == 0){
                db.insertRigConfig(email,name,auto_start,coins_related,pool,wallet,machine_id,null, function (fail,result) {
                    if (fail) {
                        console.log(fail);
                        res.send('not_ok');
                        return;
                    }
                    if (result){
                        res.send('ok');
                    }

                });
            } else {
                db.updateRigConfig(email,name,auto_start,coins_related,pool,wallet,machine_id, function (fail,result) {
                    if (fail) {
                        console.log(fail);
                        res.send('not_ok');
                        return;
                    }
                    if (result){
                        res.send('ok');
                    }
                });
            }
        }

    });


});

module.exports = router;
