var mysql = require('mysql');
var moment = require('moment');
exports.VGA_UNSTABLE = "VGA_UNSTABLE";
exports.VGA_HANGED = "VGA_HANGED";

var config = require('../config.json');

var api = require('../api/response');
var pool = mysql.createPool({
    host: config.database_host,
    port: config.database_port,
    user: config.database_username,
    password: config.database_password,
    database: config.database_name,
    connectionLimit: 10,
    supportBigNumbers: true
});

exports.rigConfigAlias = function() {
    return "prd1";
};

exports.rigConfigSelect = function() {
    return " " + this.rigConfigAlias()+".email, "+this.rigConfigAlias()+".name, "
        +this.rigConfigAlias()+".coins_related, "+this.rigConfigAlias()+".pool, "
        +this.rigConfigAlias()+".wallet, " +this.rigConfigAlias()+".machine_id, "
        +this.rigConfigAlias()+".auto_start, " +this.rigConfigAlias()+".platform, "
        +this.rigConfigAlias()+".version ";
};

exports.rigConfigFrom = function() {
    var data =  " (SELECT pt.email, pt.name, pt.coins_related, pt.pool, " +
        "               pt.wallet, pt.machine_id, pt.auto_start, pt.platform, pt.version, " +
        "               pt.id as rig_config_id " +
        "           FROM RigConfig pt " +
        "           WHERE pt.deleted=0 ) " + this.rigConfigAlias();
    return data;
};



exports.runBatchAlias = function() {
    return "runba13";
};

exports.runBatchSelect = function() {
    return " " + this.runBatchAlias()+".id, "+this.runBatchAlias()+".name, "
        +this.runBatchAlias()+".platform, "+this.runBatchAlias()+".software, "
        +this.runBatchAlias()+".coins_related, " +this.runBatchAlias()+".description, "
        +this.runBatchAlias()+".bat_script, " +this.runBatchAlias()+".is_global ";
};

exports.runBatchFrom = function() {
    var data =  " (SELECT rb.id, rb.name, rb.platform, rb.software, rb.coins_related, " +
        "               rb.description, rb.bat_script, rb.is_global " +
        "           FROM trRunBatch rb " +
        "           WHERE rb.deleted=0 ) " + this.runBatchAlias();
    return data;
};

exports.getEmail = function(token, callback) {
    var sql = "SELECT au.email " +
                "FROM trAuthFrontEnd au " +
                "WHERE au.token=? and au.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [token], function(erra, results) {
            connection.release();
            if(erra) {
                console.log(erra); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.deleteRig = function(email, machine_id, callback) {
    var sql = "DELETE FROM trLoadRig WHERE email=? AND machine_id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email,machine_id], function(erra, results) {
            connection.release();
            if(erra) {
                console.log(erra); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.validateUser = function(email, callback) {

    var sql = "SELECT us.email, us.password " +
        "FROM trUser us " +
        "WHERE us.email=? " +
        "   AND us.deleted=0 ";

    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.validateUserWebFrontEnd = function(email, callback) {

    var sql = "SELECT us.email, us.password " +
        "FROM trAuthWebFrontEnd us " +
        "WHERE us.email=? and us.deleted=0";

    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getEmailWebFrontEndFromToken = function(token, callback) {

    var sql = "SELECT * " +
        "FROM trAuthWebFrontEnd us " +
        "WHERE us.token=? and us.deleted=0";

    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [token], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updateAuthRigSocketByToken = function(socket_id, token, callback) {
    var sql = "UPDATE trAuthRig " +
        "SET socket_id=? " +
        "WHERE token=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [socket_id, token], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};
exports.rigRemoveToken = function(token, callback) {
    var sql = "UPDATE trAuthRig " +
        "SET deleted=1, updated_at=? " +
        "WHERE token=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [now, token], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updateOrderStatus = function(id, status, callback) {
    var sql = "UPDATE trOrder " +
        "SET status=?, updated_at=? " +
        "WHERE id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [status, now, id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.removeOrder = function(id, callback) {
    var sql = "UPDATE trOrder " +
        "SET deleted=1, updated_at=? " +
        "WHERE id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [ now, id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.removeToken = function(token, callback) {
    var sql = "UPDATE trAuthFrontEnd " +
        "SET deleted=1, updated_at=? " +
        "WHERE token=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [now, token], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};




exports.updateRigName = function(email, oldName, newName, callback) {
    var sql = "UPDATE trLoadRig " +
        "SET name=?, updated_at=? " +
        "WHERE email=? AND name=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [newName,now,email,oldName], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.updateRigVersionByVersion = function(version, callback) {
    var sql = "UPDATE trLoadRig " +
        "SET lazy_desktop_latest=1 " +
        "WHERE deleted=0 AND lazy_desktop_version=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [version], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.synchronizedRigVersion = function(version, callback) {
    var sql = "UPDATE trLoadRig " +
        "SET lazy_desktop_latest=0 " +
        "WHERE deleted=0 AND lazy_desktop_version <> ?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [version], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.removePushToken = function(pushToken, callback) {
    var sql = "UPDATE trPushToken " +
        "SET deleted=1, updated_at=? " +
        "WHERE push_token=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [now, pushToken], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.rigTokenExisting = function(email, callback) {
    var sql = "SELECT au.token " +
        "FROM trAuthRig au " +
        "WHERE au.email=? and au.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.tokenExisting = function(email, callback) {
    var sql = "SELECT au.token " +
        "FROM trAuthFrontEnd au " +
        "WHERE au.email=? and au.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.tokenExistingWebFrontEnd = function(email, callback) {
    var sql = "SELECT au.token " +
        "FROM trAuthWebFrontEnd au " +
        "WHERE au.email=? and au.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.rigGenerateToken = function(token, email, machine_id, arch, cpus, freemem, loadavg, public_ip, platform, releaseOS, totalmem, type, uptime, user_info, callback) {
    var sql = "INSERT INTO trAuthRig(token, email, updated_at, created_at," +
        " machine_id, arch, cpus, freemem, loadavg, public_ip," +
        " platform, totalmem, type, uptime, user_info, release_os) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ? ); ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [token, email, now, now, machine_id, arch,
            cpus, freemem, loadavg, public_ip, platform,
            totalmem, type, uptime, user_info, releaseOS], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.insertRigEvent = function(event_code, message, idea, machine_id, card_order, email, machine_name, callback) {
    var sql = "INSERT INTO trRigEvent(event_code, message, idea_suggested, machine_id, card_order, updated_at, created_at, email, machine_name) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?); ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [event_code, message, idea, machine_id, card_order, now, now, email, machine_name], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.insertRigConfig = function(email,name,auto_start,coins_related,pool_machine,wallet,machine_id,platform, callback) {
    var sql = "INSERT INTO trRigConfig(email, name, coins_related, pool, wallet" +
        ", machine_id, auto_start, updated_at, created_at, platform) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [email, name, coins_related, pool_machine, wallet, machine_id, auto_start, now, now, platform], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updateRigConfig = function(email,name,auto_start,coins_related,pool_machine,wallet,machine_id, callback) {
    var sql = "UPDATE trRigConfig " +
        "SET email=?, name=?, coins_related=?, pool=?, wallet=?" +
        ", auto_start=?, updated_at=? " +
        "WHERE machine_id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [email, name,coins_related,pool_machine,wallet,auto_start,now,machine_id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.generateToken = function(token, email, appVersion, devicePlatform,
                                 deviceModel, deviceVersion, deviceUuid, ip, callback) {
    var sql = "INSERT INTO trAuthFrontEnd(token, email, app_version, device_platform, " +
        "                               device_model, device_version, device_uuid, updated_at, created_at, ip_address) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [token, email, appVersion, devicePlatform,
                                deviceModel, deviceVersion, deviceUuid, now, now, ip], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.generateTokenWebFrontEnd = function(token, email, app_code_name, app_name, app_version, platform, product, product_sub, user_agent, vendor, ip, callback) {
    var sql = "INSERT INTO trAuthWebFrontEnd(token, email, updated_at, created_at, app_code_name, app_name, app_version, platform, product, product_sub, user_agent, vendor, ip_address) " +
        "VALUES (?, ?, ?, ?,?, ?, ?, ?,?, ?, ?, ?,?); ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        console.log("now "+ now);
        connection.query(sql, [token, email, now, now, app_code_name, app_name, app_version, platform, product, product_sub, user_agent, vendor, ip], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};



exports.insertOrder = function(email, status, amount, payment_method, callback) {
    var sql = "INSERT INTO trOrder(email, status, amount, payment_method, updated_at, created_at) " +
        "VALUES (?, ?, ?, ?, ?, ?); ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        console.log("now "+ now);
        connection.query(sql, [email, status, amount, payment_method, now, now], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.getAllRootDirsWithMachineID = function(machineID, callback) {
    var sql = "SELECT pt.id, pt.root_dir, pt.machine_id, pt.download_link_id " +
        "FROM trRigSoftwareDownload pt " +
        "WHERE pt.machine_id=? and pt.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [machineID], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getAllEvent = function(email, callback) {
    var sql = "SELECT pt.id, pt.machine_name, pt.event_code, pt.message, pt.idea_suggested, pt.machine_id, pt.card_order " +
        "FROM trRigEvent pt " +
        "WHERE pt.email=? and pt.deleted=0 ORDER BY pt.created_at DESC";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getEventById = function(id, callback) {
    var sql = "SELECT pt.id, pt.machine_name, pt.event_code, pt.message, pt.idea_suggested, pt.machine_id, pt.card_order " +
        "FROM trRigEvent pt " +
        "WHERE pt.id=? and pt.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.getRigConfigWithMachine = function(machineID, email, platform, callback) {
    var sql = "SELECT "+this.rigConfigSelect()+" " +
        "FROM "+this.rigConfigFrom()+" " +
        "WHERE "+this.rigConfigAlias()+".machine_id = ? " +
        "   AND "+this.rigConfigAlias()+".email = ? " +
        "   AND "+this.rigConfigAlias()+".platform = ? ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [machineID,email,platform], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getRootDir = function(machineID, softwareDownloadLinkID, callback) {
    var sql = "SELECT pt.root_dir  " +
        "FROM trRigSoftwareDownload pt " +
        "WHERE pt.machine_id=? and pt.download_link_id=? and pt.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [machineID, softwareDownloadLinkID], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updateRootDirDownloaded = function(machineID, softwareDownloadLinkID, rootDir, callback) {
    var sql = "UPDATE trRigSoftwareDownload " +
        "SET root_dir=?, updated_at=? " +
        "WHERE machine_id=? AND download_link_id=? AND deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [rootDir, now, machineID, softwareDownloadLinkID], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.insertRootDirDownloaded = function(machineID, softwareDownloadLinkID, rootDir, callback) {
    var sql = "INSERT INTO trRigSoftwareDownload(machine_id, download_link_id, root_dir, updated_at, created_at) " +
        "VALUES (?, ?, ?, ?, ?); ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [machineID, softwareDownloadLinkID, rootDir, now, now], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.getToken = function(email, callback) {
    var sql = "SELECT au.token " +
        "FROM trAuthFrontEnd au " +
        "WHERE au.email=? and au.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.deleteUnusedMobileToken = function(email, pushToken, callback) {
    var sql = "UPDATE trAuthFrontEnd " +
        "SET deleted=1, updated_at=? " +
        "WHERE email=? AND push_token=? AND deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) {
            console.log(err);
            if (callback) {
                callback(true);
            }
            return;
        }
        // make the query
        var now = api.getNow();
        connection.query(sql, [now, email, pushToken], function(err, results) {
            connection.release();
            if (err) {
                console.log(err);
                if (callback) {
                    callback(true);
                }
                return;
            }
            if (callback) {
                callback(false, results);
            }
        });
    });
};

exports.getPushTokensWithEmail = function(email, callback) {
    var sql = "SELECT au.push_token " +
        "FROM trAuthFrontEnd au " +
        "WHERE au.email=? and au.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getPushTokens = function(email, callback) {
    var sql = "SELECT pt.push_token " +
        "FROM trPushToken pt " +
        "WHERE pt.email=? and pt.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getLoadRig = function(email, callback) {
    var sql = "SELECT * " +
        "FROM trLoadRig " +
        "WHERE email=? and deleted=0 ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(false); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(false); return; }
            callback(true, results);
        });
    });
};

exports.getLoadRigByMachineId = function(machine_id, callback) {
    var sql = "SELECT * " +
        "FROM trLoadRig " +
        "WHERE machine_id=? and deleted=0 ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(false); return; }
        // make the query
        connection.query(sql, [machine_id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(false); return; }
            callback(true, results);
        });
    });
};

exports.getAllLoadRig = function(callback) {
    var sql = "SELECT id,email,name,machine_id,lazy_desktop_version,lazy_desktop_latest,desired_version " +
        "FROM trLoadRig WHERE deleted=0 ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(false); return; }
        // make the query
        connection.query(sql, [], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(false); return; }
            callback(true, results);
        });
    });
};

exports.removeLoadRig = function(email, name, callback) {
    var sql = "UPDATE trLoadRig " +
        "SET deleted=1 " +
        "WHERE email=? and name=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email, name], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.removeUpdateAuthWebFrontend = function(token, email, callback) {
    var sql = "UPDATE trAuthWebFrontEnd " +
        "SET deleted=1 " +
        "WHERE token=? " +
        "   AND email=? ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [token,email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.removeLoadRigByMachineId = function(email, machine_id, callback) {
    var sql = "UPDATE trLoadRig " +
        "SET deleted=1 " +
        "WHERE email=? and machine_id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email, machine_id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.updateLoadRigWorkState = function(email, name, state,callback) {
    var sql = "UPDATE trLoadRig " +
        "SET working_status=? " +
        "WHERE email=? and name=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [state, email, name], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updatePushToken = function(pushtoken, token, email, callback) {
    var sql = "UPDATE trAuthFrontEnd " +
        "SET push_token=?, updated_at=? " +
        "WHERE email=? and token=? and deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [pushtoken, now, email, token], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.addPushToken = function(pushtoken, email, callback) {
    var sql = "INSERT INTO trPushToken (push_token, email, updated_at, created_at) " +
        "VALUES (?, ?, ?, ?);";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [pushtoken, email, now, now], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.insertCardInfo = function(card_id, card_type, card_name, machine_id, callback) {
    var selectSql = "SELECT * FROM  trCardInfo WHERE card_id = ? AND machine_id = ?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [card_id, machine_id], function(erra, results) {
            if(erra) { console.log(erra); callback(true); return; }
            if(results && results.length > 0){
                var sqla = "UPDATE trCardInfo SET card_type=?,card_name=?,updated_at=? WHERE id=? ";
                // get a connection from the pool
                pool.getConnection(function(errb, connection) {
                    if(errb) { console.log(errb); callback(true); return; }
                    // make the query
                    var now = api.getNow();
                    var id = results[0].id;

                    connection.query(sqla, [ card_type, card_name, now, id], function(errc, resulta) {
                        connection.release();
                        if(errc) { console.log(errc); callback(true); return; }
                        callback(false, resulta);
                    });
                });
            }else if(results && results.length == 0){
                var sqlb = "INSERT INTO trCardInfo (card_id, card_type, card_name, updated_at, created_at, machine_id) " +
                    "VALUES (?, ?, ?, ?, ?, ?);";
                // get a connection from the pool
                pool.getConnection(function(errd, connection) {
                    if(errd) { console.log(errd); callback(true); return; }
                    // make the query
                    var now = api.getNow();
                    connection.query(sqlb, [card_id, card_type, card_name, now, now,machine_id], function(erre, resultb) {
                        connection.release();
                        if(erre) { console.log(erre); callback(true); return; }
                        callback(false, resultb);
                    });
                });
            }
        });
    });
};


exports.insertCardInfo = function(card_id, card_type, card_name, machine_id, callback) {
    var selectSql = "SELECT * FROM  trCardInfo WHERE card_id = ? AND machine_id = ?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [card_id, machine_id], function(erra, results) {
            connection.release();
            if(erra) { console.log(erra); callback(true); return; }
            if(results && results.length > 0){
                var sqla = "UPDATE trCardInfo SET card_type=?,card_name=?,updated_at=? WHERE id=? ";
                // get a connection from the pool
                pool.getConnection(function(errb, connectiona) {
                    if(errb) { console.log(errb); callback(true); return; }
                    // make the query
                    var now = api.getNow();
                    var id = results[0].id;

                    connectiona.query(sqla, [ card_type, card_name, now, id], function(errc, resulta) {
                        connectiona.release();
                        if(errc) { console.log(errc); callback(true); return; }
                        callback(false, resulta);
                    });
                });
            }else if(results && results.length == 0){
                var sqlb = "INSERT INTO trCardInfo (card_id, card_type, card_name, updated_at, created_at, machine_id) " +
                    "VALUES (?, ?, ?, ?, ?, ?);";
                // get a connection from the pool
                pool.getConnection(function(errd, connectiona) {
                    if(errd) { console.log(errd); callback(true); return; }
                    // make the query
                    var now = api.getNow();
                    connectiona.query(sqlb, [card_id, card_type, card_name, now, now,machine_id], function(erre, resultb) {
                        connectiona.release();
                        if(erre) { console.log(erre); callback(true); return; }
                        callback(false, resultb);
                    });
                });
            }
        });
    });
};







exports.insertSocketMinerInfo = function(socket_id, email, name,machine_id,token,  callback) {


    var selectSql = "SELECT * FROM  trAuthRig WHERE token = ?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [token], function(err0, results) {
            connection.release();
            if(err0) { console.log(err0); callback(true); return; }
            if(results && results.length > 0){
                var sql = "UPDATE trAuthRig SET socket_id=?,email=?,updated_at=? WHERE id=? ";
                // get a connection from the pool
                pool.getConnection(function(err2, connectiona) {
                    if(err2) { console.log(err2); callback(true); return; }
                    // make the query
                    var now = api.getNow();
                    var id = results[0].id;

                    connectiona.query(sql, [ socket_id, email, now, id], function(err4, result3) {
                        connectiona.release();
                        if(err4) { console.log(err4); callback(true); return; }
                        callback(false, result3);
                    });
                });
            }
        });
    });
};




exports.insertSocketMobilerInfo = function(socket_id, email, device_id,cordova
    ,model,platform,version,manufacturer,isVirtual,serial,  callback) {


    var selectSql = "SELECT * FROM  trSocketMobileInfo WHERE device_id = ?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [device_id], function(err0, results) {
            connection.release();
            if(err0) { console.log(err0); callback(true); return; }
            if(results && results.length > 0){
                var sql = "UPDATE trSocketMobileInfo SET socket_id=?,email=?,updated_at=?,cordova=?" +
                    ",model=?,platform=?,version=?,manufacturer=?,isVirtual=?,serial=? WHERE id=? ";
                // get a connection from the pool
                pool.getConnection(function(err2, connectiona) {
                    if(err2) { console.log(err2); callback(true); return; }
                    // make the query
                    var now = api.getNow();
                    var id = results[0].id;

                    connectiona.query(sql, [ socket_id, email, now,cordova
                        ,model,platform,version,manufacturer,isVirtual,serial, id], function(err4, result3) {
                        connectiona.release();
                        if(err4) { console.log(err4); callback(true); return; }
                        callback(false, result3);
                    });
                });
            }else if(results && results.length == 0){
                var sql = "INSERT INTO trSocketMobileInfo (socket_id, email, device_id, updated_at," +
                    " created_at,cordova" +
                    ",model,platform,version,manufacturer,isVirtual,serial) " +
                    "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?);";
                // get a connection from the pool
                pool.getConnection(function(err6, connectiona) {
                    if(err6) { console.log(err6); callback(true); return; }
                    // make the query
                    var now = api.getNow();
                    connectiona.query(sql, [socket_id, email, device_id, now, now,cordova
                        ,model,platform,version,manufacturer,isVirtual,serial], function(err1, result1) {
                        connectiona.release();
                        if(err1) { console.log(err1); callback(true); return; }
                        callback(false, result1);
                    });
                });
            }
        });
    });
};


exports.getSocketMinerInfo = function(email, machineID,  callback) {


    var selectSql = "SELECT * FROM  trAuthRig WHERE email = ? AND machine_id = ? AND deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [email, machineID], function(err0, results) {
            connection.release();
            if(err0) { console.log(err0); callback(true); return; }
            callback(false,results);
        });
    });
};


exports.authorizeRigMachineToken = function(token,  callback) {


    var selectSql = "SELECT COUNT(ar.*) as count, ar.email " +
        "FROM  trAuthRig ar " +
        "WHERE ar.token = ? " +
        "   AND ar.deleted=0 ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [token], function(err0, results) {
            connection.release();
            if(err0) { console.log(err0); callback(true); return; }
            callback(false,results);
        });
    });
};

exports.getSocketMinerInfoByMachineId = function(machine_id,  callback) {


    var selectSql = "SELECT * FROM  trAuthRig WHERE machine_id = ?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [machine_id], function(err0, results) {
            connection.release();
            if(err0) { console.log(err0); callback(true); return; }
            callback(false,results);
        });
    });
};

exports.getSocketMinerAll = function(callback) {


    var selectSql = "SELECT * FROM  trAuthRig ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [], function(err0, results) {
            connection.release();
            if(err0) { console.log(err0); callback(true); return; }
            callback(false,results);
        });
    });
};

exports.getAllAuthRig = function(callback) {


    var selectSql = "SELECT * FROM  trAuthRig WHERE deleted=0 ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [], function(err0, results) {
            connection.release();
            if(err0) { console.log(err0); callback(true); return; }
            callback(false,results);
        });
    });
};

exports.getAllAuthWebFrontEnd = function(callback) {


    var selectSql = "SELECT * FROM  trAuthWebFrontEnd WHERE deleted=0 ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [], function(err0, results) {
            connection.release();
            if(err0) { console.log(err0); callback(true); return; }
            callback(false,results);
        });
    });
};

exports.getAllOrder = function(callback) {


    var selectSql = "SELECT * FROM  trOrder WHERE deleted=0 ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [], function(err0, results) {
            connection.release();
            if(err0) { console.log(err0); callback(true); return; }
            callback(false,results);
        });
    });
};

exports.getAllAuthFrontEnd = function(callback) {


    var selectSql = "SELECT * FROM  trAuthFrontEnd WHERE deleted=0 ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [], function(err0, results) {
            connection.release();
            if(err0) { console.log(err0); callback(true); return; }
            callback(false,results);
        });
    });
};


exports.getSocketMobileInfo = function(email, callback) {


    var selectSql = "SELECT * FROM  trSocketMobileInfo WHERE email = ?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(selectSql, [email], function(err0, results) {
            connection.release();
            if(err0) { console.log(err0); callback(true); return; }
            callback(false,results);
        });
    });
};




exports.insertAccount = function(email, password, callback) {
    var sql = "INSERT INTO trUser (email, password, updated_at, created_at) " +
            "VALUES (?, ?, ?, ?);";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [email, password, now, now], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.findDesktopInfo = function(machine_id, callback) {
    var sql = "SELECT rb.working_status, rb.warning_message " +
        "FROM trLoadRig rb " +
        "WHERE rb.machine_id=? and rb.deleted=0;";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [machine_id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.insertDesktopInfo = function(machine_id, email, name, lazy_desktop_version, public_ip, local_ip, show_mode, working_status, warningMessage, callback) {
    var sql = "INSERT INTO trLoadRig (machine_id, email, name, lazy_desktop_version, public_ip, local_ip, updated_at, created_at, show_mode, working_status, warning_message) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [machine_id, email, name, lazy_desktop_version, public_ip, local_ip, now, now, show_mode, working_status, warningMessage], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updateDesktopInfo = function(machine_id, email, name, lazy_desktop_version, public_ip, local_ip, showMode, workingStatus, warningMessage, callback) {

    var sql = "UPDATE trLoadRig " +
        "SET email=?,name=?,lazy_desktop_version=?,public_ip=?,local_ip=?,updated_at=?,show_mode=?,working_status=?,warning_message=? " +
        "WHERE machine_id=? AND deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [email, name, lazy_desktop_version, public_ip, local_ip, now, showMode, workingStatus, warningMessage, machine_id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.handleInfoLoadRig = function(machine_id, email, local_ip, main_coin, main_coin_hr,
                                      main_speed_unit, mining_info_ready, name,
                                      pools, show_mode, sub_coin, sub_coin_hr,
                                      sub_speed_unit, temps, total_main_speed,
                                      total_sub_speed, uptime, ver, working_status, warning_message, public_ip, lazy_desktop_version, lazy_desktop_latest,callback) {

    if(email == null ) email = '';
    if(local_ip == null ) local_ip = '';
    if(main_coin == null ) main_coin = '';
    if(main_coin_hr == null ) main_coin_hr = '';
    if(main_speed_unit == null ) main_speed_unit = '';
    if(mining_info_ready == null ) mining_info_ready = '';
    if(name == null ) name = '';
    if(pools == null ) pools = '';
    if(show_mode == null ) show_mode = '';
    if(sub_coin == null ) sub_coin = '';
    if(sub_coin_hr == null ) sub_coin_hr = '';
    if(sub_speed_unit == null ) sub_speed_unit = '';
    if(temps == null ) temps = '';
    if(total_main_speed == null ) total_main_speed = '';
    if(total_sub_speed == null ) total_sub_speed = '';
    if(uptime == null ) uptime = '';
    if(ver == null ) ver = '';
    if(working_status == null ) working_status = '';
    if(warning_message == null ) warning_message = '';
    if(machine_id == null ) machine_id = '';
    if(public_ip == null ) public_ip = '';
    if(lazy_desktop_version == null ) lazy_desktop_version = '';
    if(lazy_desktop_latest == null ) lazy_desktop_latest = 0;


    var sql = "SELECT id " +
        "FROM trLoadRig " +
        "WHERE machine_id=?";
    pool.getConnection(function (err, connection) {
        if (err) {
            console.log(err);
            callback(true);
            return;
        }
        // make the query
        connection.query(sql, [machine_id], function (err, results) {
            connection.release();

            if (err) {
                console.log(err);
                callback(true);
                return;
            }
            if (results) {
                if (results.length == 0) {
                    module.exports.insertLoadRig(machine_id, email, local_ip, main_coin, main_coin_hr,
                        main_speed_unit, mining_info_ready, name,
                        pools, show_mode, sub_coin, sub_coin_hr,
                        sub_speed_unit, temps, total_main_speed,
                        total_sub_speed, uptime, ver, working_status, warning_message, public_ip, lazy_desktop_version, lazy_desktop_latest);
                } else if (results.length > 0) {
                    var id = results[0].id;

                    module.exports.updateLoadRig(id,machine_id, email, local_ip, main_coin, main_coin_hr,
                        main_speed_unit, mining_info_ready, name,
                        pools, show_mode, sub_coin, sub_coin_hr,
                        sub_speed_unit, temps, total_main_speed,
                        total_sub_speed, uptime, ver, working_status, warning_message, public_ip, lazy_desktop_version, lazy_desktop_latest);

                }
            }
        });
    });

};





exports.insertLoadRig = function(machine_id, email, local_ip, main_coin, main_coin_hr,
                                     main_speed_unit, mining_info_ready, name,
                                     pools, show_mode, sub_coin, sub_coin_hr,
                                     sub_speed_unit, temps, total_main_speed,
                                     total_sub_speed, uptime, ver, working_status, warning_message, public_ip, lazy_desktop_version, lazy_desktop_latest,callback) {


    pool.getConnection(function(err2, connectiona) {
        if(err2) {
            console.log(err2);
            return;
        }
        // make the query
        var now = api.getNow();

        var insertSql = "INSERT INTO trLoadRig (email, local_ip, main_coin, main_coin_hr," +
            "main_speed_unit, mining_info_ready, name, pools, show_mode," +
            "sub_coin, sub_coin_hr, sub_speed_unit, temps, total_main_speed," +
            "total_sub_speed, uptime, ver, working_status, created_at, warning_message, machine_id, public_ip, lazy_desktop_version) " +
            "VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
        connectiona.query(insertSql, [email, local_ip, main_coin, main_coin_hr,
            main_speed_unit, mining_info_ready, name,
            pools, show_mode, sub_coin, sub_coin_hr,
            sub_speed_unit, temps, total_main_speed,
            total_sub_speed, uptime, ver, working_status, now, warning_message, machine_id, public_ip,lazy_desktop_version], function (err1, result) {
            connectiona.release();
            if (err1) {
                console.log(err1);
                return;
            }
            if (result) {
                // callback(result);
            }
        });
    });


};

exports.updateLoadRig = function(row_id,machine_id, email, local_ip, main_coin, main_coin_hr,
                                 main_speed_unit, mining_info_ready, name,
                                 pools, show_mode, sub_coin, sub_coin_hr,
                                 sub_speed_unit, temps, total_main_speed,
                                 total_sub_speed, uptime, ver, working_status, warning_message, public_ip, lazy_desktop_version, lazy_desktop_latest) {


    pool.getConnection(function(err2, connectiona) {
        if(err2) {
            console.log(err2);
            // callback(true);
            return;
        }
        // make the query
        var id = row_id;

        var now = api.getNow();

        var updateSql = "UPDATE trLoadRig " +
            "SET email=?, local_ip=?, main_coin=?, main_coin_hr=?" +
            ", main_speed_unit=?, mining_info_ready=?, name=?, pools=?" +
            ", show_mode=?, sub_coin=?, sub_coin_hr=?, sub_speed_unit=?" +
            ", temps=?, total_main_speed=?, total_sub_speed=?, uptime=?" +
            ", ver=?, deleted=0, working_status=?, warning_message=?" +
            ", machine_id=?, public_ip=?, lazy_desktop_version=?" +
            ", lazy_desktop_latest=?, updated_at=? " +
            "WHERE id=?";
        connectiona.query(updateSql, [email, local_ip, main_coin, main_coin_hr,
            main_speed_unit, mining_info_ready, name,
            pools, show_mode, sub_coin, sub_coin_hr,
            sub_speed_unit, temps, total_main_speed,
            total_sub_speed, uptime, ver, working_status,
            warning_message, machine_id, public_ip, lazy_desktop_version,
            lazy_desktop_latest, now, id], function (err1, result) {
            connectiona.release();
            if (err1) {
                console.log(err1);
                return;
            }
            if (result) {
                // callback(result);
            }
        });
    });


};




exports.getLatestDownloadLink = function(software, latest, callback) {
    var sql = "SELECT dl.software, dl.version, dl.download_link, dl.filename, dl.name " +
        "FROM trDownloadLink dl " +
        "WHERE dl.software=? and dl.latest=? and dl.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [software, latest], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getDownloadLink = function(software, version, callback) {
    var sql = "SELECT dl.software, dl.version, dl.download_link, dl.filename, dl.name " +
        "FROM trDownloadLink dl " +
        "WHERE dl.software=? and dl.version=? and dl.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [software, version], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getSoftwareDownloadLink = function(software, version, name, callback) {
    var sql = "SELECT dl.software, dl.version, dl.download_link, dl.filename, dl.name " +
        "FROM trDownloadLink dl " +
        "WHERE dl.software=? and dl.version=? and dl.name=? and dl.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [software, version, name], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getAllSoftwareDownloadLink = function(platform, callback) {
    var sql = "SELECT dl.id, dl.software, dl.version, dl.download_link, " +
        "dl.filename, dl.name, dl.command_format, dl.process_name, dl.platform, " +
        "dl.config_download_link, dl.config_filename " +
        "FROM trDownloadLink dl " +
        "WHERE dl.platform=? and dl.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [platform], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getAllDownloadLink = function( callback) {
    var sql = "SELECT * " +
        "FROM trDownloadLink dl " +
        "WHERE dl.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};



exports.getRunBatch = function(platform, callback) {
    var sql = "SELECT rb.id,rb.name,rb.platform, rb.software, rb.coins_related, rb.description, rb.bat_script " +
        "FROM trRunBatch rb " +
        "WHERE rb.platform=? and rb.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [platform], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};



exports.insertRunBatch = function(platform, software, coin, des, bat,name,email,is_global, callback) {
    var sql = "INSERT INTO trRunBatch(platform, software, coins_related, description, updated_at, created_at, bat_script, name, is_global, email) " +
        "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?); ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [platform, software, coin, des, now, now, bat, name, is_global, email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updateRunBatch = function(id,platform,software,coins_related,description,bat_script,name,is_global, callback) {
    var sql = "UPDATE trRunBatch " +
        "SET platform=?,software=?,coins_related=?,description=?,bat_script=?,name=?,is_global=? " +
        "WHERE id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [platform,software,coins_related,description,bat_script,name,is_global,id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.removeRunBatchById = function(id,callback) {
    var sql = "UPDATE trRunBatch " +
        "SET deleted=1 " +
        "WHERE id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.setUserToken = function(email,token,callback) {
    var sql = "UPDATE trUser " +
        "SET reset_password_token=? " +
        "WHERE email=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [token,email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.removeUserToken = function(token,callback) {
    var sql = "UPDATE trUser " +
        "SET reset_password_token=? " +
        "WHERE reset_password_token=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [" ",token], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updateUserPasswordByToken = function(token,password,callback) {
    var sql = "UPDATE trUser " +
        "SET password=? " +
        "WHERE reset_password_token=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [password,token], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.countToken = function(token,callback) {
    var sql = "Select COUNT(*) as count FROM trUser " +
        "WHERE reset_password_token=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [token], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.countMinerMachine = function(email,callback) {
    var sql = "Select COUNT(*) as count FROM trRigConfig " +
        "WHERE email=? AND deleted=0 ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.validateAuthFrontEndToken = function(token,callback) {
    var sql = "Select COUNT(aw.*) as count, aw.email " +
        "FROM trAuthWebFrontEnd aw " +
        "WHERE aw.token=? " +
        "   AND aw.deleted=0 ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [token], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getRunBatchByPlatform = function(platform, callback) {
    var sql = "SELECT rb.id,rb.name,rb.platform, rb.software, rb.coins_related, rb.description, rb.bat_script " +
        "FROM trRunBatch rb " +
        "WHERE rb.platform=? and rb.deleted=0 ORDER BY rb.coins_related";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [platform], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getRunBatchByPlatformAndEmail = function(platform,email, callback) {
    var sql = "SELECT "+this.runBatchSelect()+" " +
        "FROM "+this.runBatchFrom()+" " +
        "WHERE "+this.runBatchAlias()+".platform=? " +
        "   and ("+this.runBatchAlias()+".email=? " +
        "       OR "+this.runBatchAlias()+".is_global=1) " +
        "ORDER BY "+this.runBatchAlias()+".coins_related ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [platform,email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getAdminRole = function( callback) {
    var sql = "SELECT rl.id,rl.role_name " +
        "FROM trRole rl " +
        "WHERE rl.id=1";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [platform,email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getCoinWallet = function(email, coin_code, callback) {
    var sql = "SELECT cw.email, cw.coin_code, cw.wallet " +
        "FROM trCoinWallet cw " +
        "WHERE cw.email=? and cw.coin_code=? and cw.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email, coin_code], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getCoinPool = function(email, coin_code, callback) {
    var sql = "SELECT cp.email, cp.coin_code, cp.pool " +
        "FROM trCoinPool cp " +
        "WHERE cp.email=? and cp.coin_code=? and cp.deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email, coin_code], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getLazyDesktopVersion = function(callback) {
    var sql = "SELECT * " +
        "FROM trConfig " +
        "WHERE name='lazy_desktop_version_latest'";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getLazyDesktopLatestInstallURL = function(callback) {
    var sql = "SELECT * " +
        "FROM trConfig " +
        "WHERE name='lazy_desktop_feed_url';";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getMinerConfigByMachineId = function(machine_id,callback) {
    var sql = "SELECT * " +
        "FROM trRigConfig " +
        "WHERE machine_id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [machine_id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getMinerConfigByCoinRelated = function(coin,callback) {
    var sql = "SELECT * " +
        "FROM trRigConfig " +
        "WHERE coins_related=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [coin], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.countMinerConfigByIdAndBatchId = function(user_id,batch_id,callback) {
    var sql = "SELECT COUNT(*) as count " +
        "FROM trRigConfig " +
        "WHERE id=? AND runbatch_id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [user_id,batch_id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.countMinerConfigByBatchId = function(batch_id,callback) {
    var sql = "SELECT COUNT(*) as count " +
        "FROM trRigConfig " +
        "WHERE runbatch_id=? AND deleted=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [batch_id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};



exports.getMinerConfigByRowId = function(row_id,callback) {
    var sql = "SELECT "+this.rigConfigSelect()+" " +
        "FROM "+this.rigConfigFrom()+" " +
        "WHERE "+this.rigConfigAlias()+".rig_config_id = ? ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [row_id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.checkIfEmailIsRoleAdmin = function(email,callback) {
    var sql = "SELECT user_role " +
        "FROM trUser " +
        "WHERE email=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true,false); return; }
            if(results.length>0){
                if(results[0].user_role == 1){
                    callback(false, true);
                }else {
                    callback(false, false);
                }
            }else {
                callback(false, false);
            }

        });
    });
};

exports.updateMinerCofigCoin = function(id,coin_id,coin, callback) {
    var sql = "UPDATE trRigConfig " +
        "SET coins_related=?,runbatch_id=? " +
        "WHERE id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [coin,coin_id,id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};




exports.updateRigVersionByMachineId = function(machine_id,url,version, callback) {
    var sql = "UPDATE trLoadRig " +
        "SET desired_version=?,desired_feed_url=? " +
        "WHERE machine_id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [version,url,machine_id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updateRigVersionByEmail = function(email,url,version, callback) {
    var sql = "UPDATE trLoadRig " +
        "SET desired_version=?,desired_feed_url=? " +
        "WHERE email=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [version,url,email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.updateAllRigVersion = function(url,version, callback) {
    var sql = "UPDATE trLoadRig " +
        "SET desired_version=?,desired_feed_url=? " ;
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [version,url], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.removeRigConfigById = function(id, callback) {
    var sql = "UPDATE trRigConfig " +
        "SET deleted=1 " +
        "WHERE id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updateMinerCofigByRowId = function(id,email,name,coin_name,pool_hole,wallet,platform,auto_start, callback) {
    var sql = "UPDATE trRigConfig " +
        "SET email=?,name=?,coins_related=?,pool=?,wallet=?,auto_start=?,updated_at=?,platform=? " +
        "WHERE id=?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();

        connection.query(sql, [email,name,coin_name,pool_hole,wallet,auto_start,now,platform,id], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


exports.getMinerConfigByEmail = function(email,callback) {
    var sql = "SELECT rc.*, lr.working_status, lr.local_ip, lr.total_main_speed, lr.main_speed_unit, lr.uptime, " +
        "           lr.updated_at as load_rig_updated_at " +
        "FROM trRigConfig rc " +
        "   LEFT JOIN trLoadRig lr " +
        "       ON rc.email = lr.email " +
        "           AND rc.machine_id = lr.machine_id " +
        "           AND lr.deleted=0 " +
        "WHERE rc.email=? " +
        "   AND rc.deleted=0 ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getMinerConfigByEmailAndLimitAndOffset = function(email,limit,offset,callback) {
    var sql = "SELECT * " +
        "FROM trRigConfig " +
        "WHERE email=? LIMIT ? OFFSET ?";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [email,limit,offset], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updateLazyDesktopLatestInstallUrl = function(url, callback) {
    var sql = "UPDATE trConfig " +
        "SET value=? " +
        "WHERE name='lazy_desktop_feed_url'";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [url], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.updateLazyDesktopLatestInstallVersion = function(version, callback) {
    var sql = "UPDATE trConfig " +
        "SET value=? " +
        "WHERE name='lazy_desktop_version_latest'";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        var now = api.getNow();
        connection.query(sql, [version], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getLazyDesktopLatestInstall = function(callback) {
    var sql = "SELECT * " +
        "FROM trConfig ";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};

exports.getUnlatestLazyDesktop = function(callback) {
    var sql = "SELECT * " +
        "FROM trLoadRig " +
        "WHERE lazy_desktop_latest=0";
    // get a connection from the pool
    pool.getConnection(function(err, connection) {
        if(err) { console.log(err); callback(true); return; }
        // make the query
        connection.query(sql, [], function(err, results) {
            connection.release();
            if(err) { console.log(err); callback(true); return; }
            callback(false, results);
        });
    });
};


