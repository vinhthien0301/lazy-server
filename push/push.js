
var FCM = require('fcm-push');

var serverKey = 'AIzaSyCrP7xa9_JOojmizKrvi1KZnjHjSTr4CqM';
var fcm = new FCM(serverKey);



exports.sendFCMMessage = function(topic, customData, title, bodyMessage) {
    var message = {
        to: '/topics/'+topic, // required fill with device token or topics
        data: customData,
        notification: {
            title: title,
            body: bodyMessage,
            sound: "default",
            click_action: "FCM_PLUGIN_ACTIVITY", //Must be present for Android
            icon: "fcm_push_icon" //White icon Android resource
        },
        priority: 'high' //If not set, notification won't be delivered on completely closed iOS app
    };

    return fcm.send(message, function(){});
};

//promise style
exports.sendFCMMessageWithToken = function(pushToken, customData, title, bodyMessage) {
    var message = {
        to: pushToken, // required fill with device token or topics
        data: customData,
        notification: {
            title: title,
            body: bodyMessage,
            sound: "default",
            click_action: "FCM_PLUGIN_ACTIVITY", //Must be present for Android
            icon: "fcm_push_icon" //White icon Android resource
        },
        priority: 'high' //If not set, notification won't be delivered on completely closed iOS app
    };
    return fcm.send(message, function (err, response) {
        if (err) {
            console.log(err);
            return;
        }
    });

};