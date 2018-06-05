var api = require('../api/response');
var db = require('../databases/database');


var express = require('express');
var router = express.Router();

// GET all software download links
router.post('/', function(req, res) {
    var rootDir = req.query.root_dir;
    var machineID = req.query.machine_id;
    var softwareDownloadLinkID = req.query.software_download_link_id;

    db.getRootDir(machineID, softwareDownloadLinkID, function(err, results) {
        if (err) {
            return;
        }

        if (results.length > 0) {
            db.updateRootDirDownloaded(machineID, softwareDownloadLinkID, rootDir, function(err, results) {
                if (err) {
                    return;
                }
                db.getAllRootDirsWithMachineID(machineID,function (errA, data) {
                    if(data)
                    res.json(api.getResponse(api.SUCC_SUBMIT_ROOT_DIR, data, "Submit root dir successfully"));
                });

            });
        } else {
            db.insertRootDirDownloaded(machineID, softwareDownloadLinkID, rootDir, function(err, results) {
                if (err) {
                    return;
                }
                db.getAllRootDirsWithMachineID(machineID,function (errA, data) {
                    if(data)
                        res.json(api.getResponse(api.SUCC_SUBMIT_ROOT_DIR, data, "Submit root dir successfully"));
                });

            });
        }



    });


});

module.exports = router;
