var api = require('../api/response');
var db = require('../databases/database');
var crypto = require('crypto');
const uuidV4 = require('uuid/v4');


var express = require('express');
var router = express.Router();

router.post('/', function(req, res) {

    var email = req.query.email;
    var machine_id = req.query.machine_id;
    var public_ip = req.query.ip;
    var sysInfo = JSON.parse(decodeURIComponent(req.query.sysInfo));
    var password = crypto.createHash('md5').update(req.query.password).digest("hex");
    var arch =sysInfo.arch;
    var cpus =JSON.stringify(sysInfo.cpus);
    var freemem =sysInfo.freemem;
    var loadavg =JSON.stringify(sysInfo.loadavg);
    var platform =sysInfo.platform;
    var release =sysInfo.release;
    var totalmem =sysInfo.totalmem;
    var type =sysInfo.type;
    var uptime =sysInfo.uptime;
    var user_info =JSON.stringify(sysInfo.userInfo);

    db.validateUser(email, function(err, results) {
        if (err) {
            return;
        }

        if (results.length > 0) {
            if (email == results[0].email && password == results[0].password) {
                var token = uuidV4();

                db.rigGenerateToken(token, email, machine_id, arch, cpus, freemem, loadavg, public_ip, platform, release, totalmem, type, uptime, user_info, function (err, results) {
                    if (err) {
                        return;
                    }
                    var data = {
                        "token": token,
                        "email": email
                    };
                    res.json(api.getResponse(api.SUCC_LOGIN, data, "Response from login"));
                });
            } else {
                res.json(api.getResponse(api.ERRO_INVALID_AUTH, null, "Wrong username or password."));
            }

        } else {
            res.json(api.getResponse(api.ERRO_INVALID_AUTH, null, "Wrong username or password."));
        }
    });

});

module.exports = router;
