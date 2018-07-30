
exports.getServerAddressBase = function (req) {
    var url = req.protocol + '://' + req.get('host') + ":" + req.get('port') + "/";
    return url;
};