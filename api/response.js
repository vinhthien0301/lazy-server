var test = "ERRO_NOT_FOUND";
var moment = require('moment');

exports.BASE_URL = "http://lazymining.com/";
exports.FRONT_END = this.BASE_URL+"frontend/";
exports.WEB_NAME = "Lazy Mining";

exports.SUCC_LOGOUT = "SUCC_LOGOUT";
exports.SUCC_COUNT_MACHINE = "SUCC_COUNT_MACHINE";
exports.TOKEN_EXIST = "TOKEN_EXIST";
exports.SUCC_EXEC = "SUCC_EXEC";
exports.SUCC_DELETE = "SUCC_DELETE";
exports.SUCC_SIGNUP = "SUCC_SIGNUP";
exports.SUCC_LOGIN = "SUCC_LOGIN";
exports.SUCC_MINERS = "SUCC_MINERS";
exports.SUCC_GET_RIG_CONFIG = "SUCC_GET_RIG_CONFIG";
exports.SUCC_SUBMIT_ROOT_DIR = "SUCC_SUBMIT_ROOT_DIR";
exports.SUCC_DELETE_MINER = "SUCC_DELETE_MINER";
exports.SUCC_UPDATE_PUSH_TOKEN = "SUCC_UPDATE_PUSH_TOKEN";
exports.SUCC_DOWNLOAD_LINK = "SUCC_DOWNLOAD_LINK";
exports.SUCC_RUN_BATCH = "SUCC_RUN_BATCH";
exports.SUCC_RESET_MINER = "SUCC_RESET_MINER";
exports.SUCC_SEND_RESET_EMAIL = "SUCC_SEND_RESET_EMAIL";
exports.SUCC_UPDATE_PASSWORD = "SUCC_UPDATE_PASSWORD";
exports.SUCC_LOG_OUT = "SUCC_LOG_OUT";
exports.SUCC_UPDATE_RIG_MACHINE = "SUCC_UPDATE_RIG_MACHINE";
exports.SUCC_UPDATE_FEED_URL_AND_VERSION = "SUCC_UPDATE_FEED_URL_AND_VERSION";


exports.ERRO_DELETE_MINER = "ERRO_DELETE_MINER";

exports.ERRO_TOKEN_NOT_EXIST = "ERRO_TOKEN_NOT_EXIST";
exports.ERRO_EMAIL_NOT_FOUND = "ERRO_EMAIL_NOT_FOUND";
exports.ERRO_NOT_FOUND = "ERRO_NOT_FOUND";
exports.ERRO_INVALID_AUTH = "ERRO_INVALID_AUTH";
exports.ERRO_ACCOUNT_EXISTING = "ERRO_ACCOUNT_EXISTING";
exports.ERRO_FILE_NOT_FOUND = "ERRO_FILE_NOT_FOUND";

exports.getNow = function () {
    var now = moment().format("YYYY-MM-DDTHH:mm:ss.SSSZ");
    return now;
};

exports.getResponse = function(response_code, data, description) {
    var response = {};
    response.response_code = response_code;
    response.data = data;
    response.description = description;
    response.test = "!";
    return response;
};