var api = require('../api/response');
var db = require('../databases/database');


var express = require('express');
var router = express.Router();

// GET download link
router.post('/', function(req, res) {
    var platform = req.body.platform;
    var software = req.body.software;
    var version = req.body.version;
    var coins_related = req.body.coins_related;

    db.getCoinsCanBeMining(platform, function(err, results) {
        if (err) {
            return;
        }
        if (results.length > 0) {
            var data = {
                "platform": results[0].platform,
                "software": results[0].software,
                "version": results[0].version,
                "coins_related": results[0].coins_related,
                "filename": results[0].filename,
                "download_link": results[0].download_link
            };
            res.json(api.getResponse(api.SUCC_RUN_BATCH, data, "Get coins can be mining successfully"));
        } else {
            res.json(api.getResponse(api.ERRO_FILE_NOT_FOUND, null, "File not found"));
        }
    });


});

module.exports = router;
