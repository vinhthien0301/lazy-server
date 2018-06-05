var express = require('express');
var router = express.Router();
var db = require('../databases/database');
const uuidV4 = require('uuid/v4');
var crypto = require('crypto');

router.get('/', function (req, res, next) {
    res.render('termsOfUse',{appName: api.WEB_NAME});
});

module.exports = router;
