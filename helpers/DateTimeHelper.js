
exports.getNow = function () {
    var now = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    return now;
};
