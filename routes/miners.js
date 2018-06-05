var api = require('../api/response');
var db = require('../databases/database');

var express = require('express');
var router = express.Router();

// GET miner data
router.post('/', function(req, res) {
    var token = req.body.token;
    var emailSubmitted = req.body.email;
    db.getEmail(token, function(err, results) {
        // if (err) {
        //     res.json(api.getResponse(api.ERRO_NOT_FOUND, req.json, "Token not found")); // NOT SURE
        //     return;
        // }

        db.getLoadRig(emailSubmitted,function (isSuccess, data) {
            if(isSuccess && data.length > 0){
                var obj = {miners: {}};
                for(var index = 0; index < data.length; index ++){
                    var email = data[index].email;
                    var main_coin = data[index].main_coin;
                    var main_coin_hr = data[index].main_coin_hr;
                    var main_speed_unit = data[index].main_speed_unit;
                    var mining_info_ready = data[index].mining_info_ready;
                    var name = data[index].name;
                    var pools = data[index].pools;
                    var show_mode = data[index].show_mode;
                    var sub_coin = data[index].sub_coin;
                    var sub_coin_hr = data[index].sub_coin_hr;
                    var sub_speed_unit = data[index].sub_speed_unit;
                    var temps = data[index].temps;
                    var total_main_speed = data[index].total_main_speed;
                    var total_sub_speed = data[index].total_sub_speed;
                    var uptime = data[index].uptime;
                    var ver = data[index].ver;
                    var working_status = data[index].working_status;
                    var local_ip = data[index].local_ip;
                    var warning_message = data[index].warning_message;
                    var public_ip = data[index].public_ip;
                    var machine_id = data[index].machine_id;
                    obj.miners[machine_id] = {
                        email: email,
                        local_ip: local_ip,
                        main_coin: main_coin,
                        main_coin_hr: main_coin_hr,
                        main_speed_unit: main_speed_unit,
                        mining_info_ready: mining_info_ready,
                        name: name,
                        pools: pools,
                        show_mode: show_mode,
                        sub_coin: sub_coin,
                        sub_coin_hr: sub_coin_hr,
                        sub_speed_unit: sub_speed_unit,
                        temps: temps,
                        total_main_speed: total_main_speed,
                        total_sub_speed: total_sub_speed,
                        uptime: uptime,
                        ver: ver,
                        working_status: working_status,
                        warning_message: warning_message,
                        public_ip: public_ip,
                        machine_id: machine_id
                    };
                }

                if (results.length > 0) {
                    var email = results[0].email;

                    if (email == emailSubmitted) {
                        var target_miners = req.json.miners[email];
                        req.json.miners = target_miners;
                        res.json(api.getResponse(api.SUCC_MINERS, obj, "Get rigs"));
                    } else {
                        res.json(api.getResponse(api.ERRO_EMAIL_NOT_FOUND, obj, "Email isn't matched"));
                    }
                } else {
                    res.json(api.getResponse(api.ERRO_NOT_FOUND, obj, "Token not found"));
                }
            }else if(isSuccess && data.length == 0) {
                var obj = {miners: {}};
                if (results.length > 0) {
                    var email = results[0].email;

                    if (email == emailSubmitted) {
                        var target_miners = req.json.miners[email];
                        req.json.miners = target_miners;
                        res.json(api.getResponse(api.SUCC_MINERS, obj, "Get rigs"));
                    } else {
                        res.json(api.getResponse(api.ERRO_EMAIL_NOT_FOUND, obj, "Email isn't matched"));
                    }
                } else {
                    res.json(api.getResponse(api.ERRO_NOT_FOUND, obj, "Token not found"));
                }
            }
        });




    });

    //var email = "vinh.thien0301@gmail.com";
    //var target_miners = req.json.miners[email];
    //req.json.miners = target_miners;
    //res.json(req.json);
});

module.exports = router;
