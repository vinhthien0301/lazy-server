var express = require('express'), stylus = require('stylus')
    , nib = require('nib');

function compile(str, path) {
    return stylus(str)
        .set('filename', path)
        .use(nib())
}

var cors = require('cors');
var path = require('path');
var favicon = require('serve-favicon');
var express_logger = require('morgan');
var bodyParser = require('body-parser');
var i18n = require('i18n');
var delete_miner = require('./routes/delete_miner');
var get_rig_info = require('./routes/get_rig_info');
var rig_submit_config_info = require('./routes/rig_submit_config_info');
var pushToken = require('./routes/push_token');
var rig_download_link = require('./routes/rig_download_link');
var rig_run_batch = require('./routes/rig_run_batch');

var backend_index = require('./routes_backend/index');

var signup_page = require('./routes_frontend/signup');
var rig_edit_config = require('./routes_frontend/rigEditConfig');
var terms_of_use = require('./routes_frontend/termsOfUse');

var config = require('./config.json');


var response_api = require('./api/response');


var db = require('./databases/database');
var app = express();
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
i18n.configure({
    locales: ['vi'],
    directory: __dirname + '/locales'
});
// View engine setup
app.set('view engine', 'pug');
app.use(favicon(path.join(__dirname, '/dist/favicon.png')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'dist')));
var options = {
    host: config.database_host,
    port: config.database_port,
    user: config.database_username,
    password: config.database_password,
    database: config.database_name,
    checkExpirationInterval: 10000, // 10 seconds
    expiration: 300000, // 5 minutes
    schema: {
        tableName: 'trWebSessions',
        columnNames: {
            session_id: 'session_id',
            expires: 'expires',
            data: 'data'
        }
    }
};

var sessionStore = new MySQLStore(options);
app.use(session({
    secret: "eTd=fQ!&#g9@9G56XJa4P+rKd%!33b5h+DNA&!M_",
    store: sessionStore,
    resave: false,
    saveUninitialized: true
}));

// Enable All CORS Requests
app.use(cors());
app.use(stylus.middleware(
    {
        src: __dirname + '/dist'
        , compile: compile
    }
));

// Uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express_logger('dev'));
app.use(express.static(path.join(__dirname, 'dist')));
app.use(i18n.init);

// Make miner data accessible to the router
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    req.json = {
        "miners": miners.json,
        "updated": moment().format("YYYY-MM-DD HH:mm:ss")
    };
    req.miners = miners;
    req.turns = turns;

    next();
});
app.use(bodyParser.urlencoded({extended: true}));

app.use('/', require('./routes/index'));
app.use('/api/miners', require('./routes/miners'));
app.use('/api/restart_miner', require('./routes/restart_miner'));
app.use('/api/signup', require('./routes/signup'));
app.use('/api/rig_signup', require('./routes/rig_signup'));
app.use('/api/login', require('./routes/login'));
app.use('/api/resetPasswordUser', require('./routes/resetPasswordUser'));
app.use('/api/rig_login', require('./routes/rig_login'));
app.use('/api/logout', require('./routes/logout'));
app.use('/api/rig_logout', require('./routes/rig_logout'));
app.use('/api/push_token', pushToken);
app.use('/api/rig_download_link', rig_download_link);
app.use('/api/rig_run_batch', rig_run_batch);
app.use('/api/delete_miner', delete_miner);
app.use('/api/rig_submit_config_info', rig_submit_config_info);
app.use('/api/get_rig_info', get_rig_info);
app.use('/api/rig_get_all_download_links', require('./routes/rig_get_all_download_links'));
app.use('/api/rig_submit_root_dir_downloaded', require('./routes/rig_submit_root_dir_downloaded'));
app.use('/api/rig_get_config', require('./routes/rig_get_config'));
app.use('/api/rig_check_update', require('./routes/rig_check_update'));
app.use('/api/validate_rig_token_desktop', require('./routes/validate_rig_token_desktop'));


app.use('/backend/', backend_index);
app.use('/desktopUpdates', require('./routes_backend/desktop-updates'));

app.use('/login', require('./routes_frontend/login'));
app.use('/logout', require('./routes_frontend/logout'));
app.use('/utility', require('./routes_frontend/utility'));
app.use('/resetPasswordUser', require('./routes_frontend/resetPasswordUser'));
app.use('/signup', signup_page);
app.use('/rigEditConfig', rig_edit_config);
app.use('/rigConfig', require('./routes_frontend/rigConfig'));
app.use('/dashboard', require('./routes_frontend/dashboard'));
app.use('/profit', require('./routes_frontend/profit'));
app.use('/eventManagement', require('./routes_frontend/eventManagement'));
app.use('/eventManagementEdit', require('./routes_frontend/eventManagementEdit'));
app.use('/userManagementDesktop', require('./routes_frontend/userManagementDesktop'));
app.use('/userManagementWeb', require('./routes_frontend/userManagementWeb'));
app.use('/userManagementMobile', require('./routes_frontend/userManagementMobile'));
app.use('/orderManagement', require('./routes_frontend/orderManagement'));
app.use('/createOrder', require('./routes_frontend/createOrder'));
app.use('/termsOfUse', terms_of_use);

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handlers
// Development error handler will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// Production error handler, no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;


var moment = require('moment');
require("moment-duration-format");
var http = require('http').Server(app);
var io = require('socket.io')(http);

var ip = require('ip');
var push = require('./push/push');
var db = require('./databases/database');
var crypto = require('crypto');
var rig_state = require('./working_status');
var rig_show_mode = require('./show_mode');
var problem_code = require('./problem_code');


// --------------- BOOT ---------------



var log4js = require('log4js');
var logger = log4js.getLogger();
logger.setLevel(config.log_level ? config.log_level : 'INFO');

logger.warn('App: booting');

// --------------- /BOOT ---------------


var turns = [];
var miners = [];
miners.json = {};
var im = 0;
var it = 0;

io.on('connection', function (socket) {
    var m, t;
    app.set('socket', socket);
    app.set('io', io);
    socket.emit("get_config");

    socket.on('disconnect', function () {
        if (!m) return;

        // avoid send push notification in case, rig connect quickly before timeout causes disconnecting
        if (m.working_status != rig_state.STOPPED) {
            db.getPushTokensWithEmail(m.email, function (err, results) {
                if (err) {
                    return;
                }

                if (results) {
                    if (results.length > 0) {

                        var customData = {
                            problem_code: problem_code.RIG_MONITOR,
                            rig: m.name,
                            title: "Dàn đào [" + m.name + "] bị trục trặc",
                            content: "Do mất kết nối mạng hoặc máy vừa bị tắt"
                        };

                        for (var index = 0; index < results.length; index++) {
                            var pushToken = results[index].push_token;
                            push.sendFCMMessageWithToken(pushToken, customData, customData.title, customData.content)
                                .then(function (response) {
                                    //logger.info("App: (" + m.app_name + " v" + m.app_version + ") [" + m.email + "].[" + m.name + "] FCM sent successfully ");
                                })
                                .catch(function (err) {
                                    if (pushToken != null) {
                                        logger.warn("Deleting unused mobile push token...");
                                        db.deleteUnusedMobileToken(m.email, pushToken);
                                    }
                                });
                        }
                    }
                }

            });
        }

        db.updateLoadRigWorkState(m.email, m.name, rig_state.STOPPED, function (isSucc, result) {
            if (miners.json[m.email] != null) {
                if (miners.json[m.email][m.name] != null) {
                    miners.json[m.email][m.name].working_status = rig_state.STOPPED;
                }
            }
        });

        //TODO:
        // db.getSocketMobileInfo(m.email,function (error, data) {
        //     if(data && data.length > 0){
        //         for(var index = 0; index < data.length; index++){
        //             var socket_id = data[index].socket_id;
        //             socket.to(socket_id).emit('notification', customData.title,customData.content);
        //         }
        //     }
        // });

        miners.splice(miners.indexOf(m), 1);
        logger.info("App: [" + m.name + "] disconnected");

    });

    // receive app information.
    socket.on('app-info', function (token, json) {
        logger.info("App: a rig connected.");
        im++;
        logger.info("App: total rigs: " + (im));

        if (miners[json.email] == null) {
            miners[json.email] = {};
        }
        m = miners[json.email][json.name] = {};

        m.socket = socket;

        m.app_name = json.app_name; // not use now
        m.app_version = json.app_version;
        m.public_ip = json.public_ip;
        m.local_ip = json.local_ip;
        m.machine_id = json.machine_id;
        m.platform = json.platform;
        m.token = token;
        m.name = json.name;
        m.email = json.email;

        if (json.machine_id == null) {
            return;
        }


        function sendPushWithEmail(email, name, content) {
            db.getPushTokensWithEmail(email, function (err, results) {
                if (err) {
                    return;
                }

                if (results) {
                    if (results.length > 0) {
                        var customData = {
                            problem_code: problem_code.RIG_MONITOR,
                            rig: name,
                            title: "Dàn đào [" + name + "] vừa được kết nối",
                            content: content
                        };

                        for (var index = 0; index < results.length; index++) {
                            var pushToken = results[index].push_token;

                            push.sendFCMMessageWithToken(pushToken, customData, customData.title, customData.content)
                                .then(function (response) {
                                    //logger.info("App: (" + m.app_name + " v" + m.app_version + ") [" + m.email + "].[" + m.name + "] FCM sent successfully");
                                })
                                .catch(function (err) {
                                    if (pushToken != null) {
                                        logger.warn("Deleting unused mobile push token...");
                                        db.deleteUnusedMobileToken(email, pushToken);
                                    }
                                });
                        }
                    }
                }

            });
        }

        db.findDesktopInfo(json.machine_id, function (desktopInfoError, desktopInfoResults) {
            if (desktopInfoError) {
                return;
            }

            var warningMessage = "Lazy Desktop đang chạy! Hãy chọn phần mềm và bắt đầu đào ngay.";

            if (desktopInfoResults && desktopInfoResults.length > 0) {
                var desktopInfo = desktopInfoResults[0];
                if (desktopInfo.working_status == rig_state.STOPPED) { // Don't send push notification if Server restarts
                    sendPushWithEmail(json.email, json.name, "Bạn có thể giám sát giàn đào ngay bây giờ.");
                }

                db.updateDesktopInfo(
                    json.machine_id,
                    json.email,
                    json.name,
                    json.app_version,
                    json.public_ip ? json.public_ip : "",
                    json.local_ip,
                    rig_show_mode.MESSAGE_ONLY,
                    rig_state.WARNING,
                    warningMessage,
                    function () {
                        // nothing
                    });

            } else {
                sendPushWithEmail(json.email, json.name, "Bạn có thể giám sát giàn đào ngay bây giờ.");
                db.insertDesktopInfo(
                    json.machine_id,
                    json.email,
                    json.name,
                    json.app_version,
                    json.public_ip ? json.public_ip : "",
                    json.local_ip,
                    rig_show_mode.MESSAGE_ONLY,
                    rig_state.WARNING,
                    warningMessage,
                    function () {
                        /* nothing */
                    })
            }
        });


    });

    socket.on('test', function (text) {
        console.log("TEST " + text);
        socket.emit("test123", {a: 1, b: 2});

    });

    socket.on('update-auth-rig-socket', function (socket_id, token) {
        db.updateAuthRigSocketByToken(socket_id, token, function () {
        });
    });


    socket.on('app-sign-out', function (token, json) {
        var email = json.email;
        var name = json.name;
        db.removeLoadRig(email,
            name
            , function (results) {
                console.log("111111");
                console.log(results);
            });
    });


    socket.on('card-info', function (machine_id, json, token) {

        for (var index = 0; index < json.length; index++) {
            var card_name = json[index].card_name;
            var card_type = json[index].card_type;
            var card_id = json[index].card_id;

            db.insertCardInfo(card_id, card_type, card_name, machine_id, function (isSucc) {
            });
        }
    });

    socket.on('app-change-name', function (token, json) {
        var email = json.email;
        var oldName = json.name;
        var newName = json.newName;
        db.updateRigName(email, oldName, newName, function () {
        });
        logger.info("App: (" + m.app_name + " v" + m.app_version + ") [" + m.email + "].[" + m.name + "] name changed to '" + newName + "'");

    });

    // receive app information.
    socket.on('turn-info', function (token, json) {
        logger.info("App: a turn connected.");
        it = miners.length;
        t = miners[it] = {}; // don't use im any more.
        logger.info("App: total turns: " + (it + 1));

        t.socket = socket;

        t.app_name = json.app_name;
        t.app_version = json.app_version;
        t.token = token;
        t.email = json.email;
        t.turn_name = json.turn_name;
        t.rigs = json.rigs; // ["Rig01", "Rig02", "Rig03"]
        logger.info("App: (" + t.app_name + " v" + t.app_version + ") [" + t.turn_name + "] app information RECEIVED.");
        logger.trace(json);

        t.rigs.forEach(function (item, index, arr) {

        });

    });

    // save socket id
    socket.on('socket-miner-id', function (socket_id, email, name, machine_id, token) {

        db.insertSocketMinerInfo(socket_id, email, name, machine_id, token, function () {
        });
    });

    socket.on('socket-mobile-id', function (socket_id, email, device_id, cordova
        , model, platform, version, manufacturer, isVirtual, serial) {

        if (device_id == null || device_id == "null" || !device_id) {
            device_id = "";
        }
        if (cordova == null || cordova == "null" || !cordova) {
            cordova = "";
        }
        if (model == null || model == "null" || !model) {
            model = "";
        }
        if (platform == null || platform == "null" || !platform) {
            platform = "";
        }
        if (version == null || version == "null" || !version) {
            version = "";
        }
        if (manufacturer == null || manufacturer == "null" || !manufacturer) {
            manufacturer = "";
        }
        if (isVirtual == null || isVirtual == "null" || !isVirtual) {
            isVirtual = "";
        }
        if (serial == null || serial == "null" || !serial) {
            serial = "";
        }
        db.insertSocketMobilerInfo(socket_id, email, device_id, cordova
            , model, platform, version, manufacturer, isVirtual, serial, function () {

            });
    });
    // receive data from a miner.
    socket.on('miner', function (software, json, token) {


        function check_token(token, software, json, callback) {
            if (token) {
                db.authorizeRigMachineToken(token, function (e, count) {
                    if (e) {
                        return;
                    }
                    console.log("check");
                    console.log(count);
                    if (count[0].count == 0) {
                        socket.emit("not_found_token");
                        return;
                    } else {
                        callback(software, json);
                    }
                });

            } else {
                callback(software, json);

            }
        }


        check_token(token, software, json, function (software, json) {


            // check if error card
            if (json.main_coin_hr) {
                var main_coin_hr_array = json.main_coin_hr.split(";");
                for (var index = 0; index < main_coin_hr_array.length; index++) {
                    if (main_coin_hr_array[index] == 0 || main_coin_hr_array[index] == "0") {
                        if (json.machine_id) {
                            db.insertRigEvent(db.VGA_HANGED, "card không hoạt động", "reset máy", json.machine_id, index, json.email, json.name, function () {
                            });
                        }
                        continue;
                    }

                    var curr_coin_hr = main_coin_hr_array[index];
                    db.getLoadRigByMachineId(json.machine_id, function (fail, result) {
                        if (result) {
                            if (result[0]) {
                                if (result[0].main_coin_hr) {
                                    var previous_coin_hr = result[0].main_coin_hr;
                                    var previous_coin_hr_arr = previous_coin_hr.split(";");
                                    var previous_coin_hr_percent = previous_coin_hr_arr[index] * 20 / 100;
                                    var cal = previous_coin_hr_arr[index] - previous_coin_hr_percent;

                                    if (curr_coin_hr < cal) {
                                        if (json.machine_id) {
                                            db.insertRigEvent(db.VGA_UNSTABLE, "card không ổn định", "reset máy", json.machine_id, index, json.email, json.name, function () {
                                            });
                                        }
                                    }

                                }
                            }
                        }
                    });

                }
            }

            if (miners.json[m.email] == null) {
                miners.json[m.email] = {};
            }

            miners.json[m.email][m.name] = json;
            if (json.local_ip != null && json.local_ip != "") {
                json.local_ip = json.local_ip;
            } else {
                json.local_ip = "Không thể lấy được ip";
            }


            miners.json[m.email][m.name].working_status = rig_state.WORKING;
            if (json.warning != "") {
                json.working_status = rig_state.WARNING;
                json.warning_message = json.warning;

                function sendWarnPushWithEmail(email, name, content) {
                    var customData = {
                        problem_code: problem_code.RIG_MONITOR,
                        rig: name,
                        title: "Dàn đào [" + name + "] bị trục trặc",
                        content: content
                    };


                    db.getPushTokensWithEmail(email, function (err, results) {
                        if (err) {
                            return;
                        }

                        if (results) {
                            if (results.length > 0) {
                                for (var index = 0; index < results.length; index++) {
                                    var pushToken = results[index].push_token;
                                    push.sendFCMMessageWithToken(pushToken, customData, customData.title, customData.content)
                                        .then(function (response) {
                                            //logger.info("App: (" + m.app_name + " v" + m.app_version + ") [" + m.email + "].[" + m.name + "] FCM sent successfully to topic=" + topic + " (" + m.email + "). Responses: " + response);
                                        })
                                        .catch(function (err) {
                                            if (pushToken != null) {
                                                logger.warn("Deleting unused mobile push token...");
                                                db.deleteUnusedMobileToken(email, pushToken);
                                            }
                                        });
                                }
                            }
                        }

                    });

                    //TODO
                    // db.getSocketMobileInfo(m.email,function (error, data) {
                    //     if (data && data.length > 0){
                    //         for(var index = 0; index < data.length; index++){
                    //             var socket_id = data[index].socket_id;
                    //             socket.to(socket_id).emit('notification', customData.title,customData.content);
                    //         }
                    //     }
                    // });
                }

                db.findDesktopInfo(json.machine_id, function (desktopInfoError, desktopInfoResults) {
                    if (desktopInfoError) {
                        return;
                    }
                    if (desktopInfoResults && desktopInfoResults.length > 0) {
                        var desktopInfo = desktopInfoResults[0];

                        // only notify users once with a warn message
                        if (desktopInfo.working_status != rig_state.WARNING
                            || desktopInfo.warning_message != json.warning_message) {
                            sendWarnPushWithEmail(json.email, json.name, json.warning_message);
                        }
                    } else {
                        sendWarnPushWithEmail(json.email, json.name, json.warning_message);
                    }
                });


            }

            json.show_mode = rig_show_mode.MESSAGE_ONLY;
            if (json.mining_info_ready) {
                json.show_mode = rig_show_mode.MESSAGE_AND_RIG_INFORMATION;
            }

            delete json.warning;
            delete json.last_seen;

            var version = " ";
            if (json.version != null) {
                version = json.version;
            }
            var latestVersion = null;
            console.log(json.working_status);
            console.log(json.warning_message);
            db.getLazyDesktopVersion(function (isFail, data) {
                if (!isFail && data && data.length == 1) {
                    var tempVersion = data[0].value;

                    if (tempVersion == version) {
                        latestVersion = 1;
                    }
                }

                db.handleInfoLoadRig(json.machine_id, json.email, json.local_ip, json.main_coin
                    , json.main_coin_hr, json.main_speed_unit, json.mining_info_ready
                    , json.name, json.pools, json.show_mode, json.sub_coin, json.sub_coin_hr
                    , json.sub_speed_unit, json.temps, json.total_main_speed, json.total_sub_speed
                    , json.uptime, json.ver, miners.json[m.email][m.name].working_status
                    , json.warning_message, json.public_ip
                    , version, latestVersion, function (rig) {
                        // nothing
                    });
            });
        })

    });

    function hostname() {
        return c.hostname ? c.hostname : (m.host + ':' + m.port);
    }
});


http.listen(config.listen_port, function () {

    logger.info('App: listening on ' + ip.address() + ':' + config.listen_port);
});
