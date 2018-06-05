var api = require('../api/response');
var db = require('../databases/database');


var express = require('express');
var router = express.Router();

// GET download link
router.post('/', function(req, res) {
    var software = req.query.software;
    var version = req.query.version;
    var latest = req.query.latest;
    var name = req.query.name;

    if (latest) {
        db.getLatestDownloadLink(software, latest, function(err, results) {
            if (err) {
                return;
            }
            if (results.length > 0) {
                var data = {
                    "software": results[0].software,
                    "version": results[0].version,
                    "filename": results[0].filename,
                    "download_link": results[0].download_link,
                    "name": results[0].name
                };
                res.json(api.getResponse(api.SUCC_DOWNLOAD_LINK, data, "Get download link successfully"));
            } else {
                res.json(api.getResponse(api.ERRO_FILE_NOT_FOUND, null, "File not found"));
            }
        });
    } else if(software && version && !name){
        db.getDownloadLink(software, version, function(err, results) {
            if (err) {
                return;
            }
            if (results.length > 0) {
                var data = {
                    "software": results[0].software,
                    "version": results[0].version,
                    "filename": results[0].filename,
                    "download_link": results[0].download_link,
                    "name": results[0].name
                };
                res.json(api.getResponse(api.SUCC_DOWNLOAD_LINK, data, "Logout successfully"));
            } else {
                res.json(api.getResponse(api.ERRO_FILE_NOT_FOUND, null, "File not found"));
            }
        });
    }else if(software && version && name){
        db.getSoftwareDownloadLink(software, version, name, function(err, results) {
            if (err) {
                return;
            }
            if (results.length > 0) {
                var data = {
                    "software": results[0].software,
                    "version": results[0].version,
                    "filename": results[0].filename,
                    "download_link": results[0].download_link,
                    "name": results[0].name
                };
                res.json(api.getResponse(api.SUCC_DOWNLOAD_LINK, data, "Logout successfully"));
            } else {
                res.json(api.getResponse(api.ERRO_FILE_NOT_FOUND, null, "File not found"));
            }
        });
    }


});

module.exports = router;
