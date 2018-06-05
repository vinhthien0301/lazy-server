var express = require('express');
var router = express.Router();
var db = require('../databases/database');
const uuidV4 = require('uuid/v4');
var crypto = require('crypto');
var api = require('../api/response');
var nodemailer = require('nodemailer');
var moment = require('moment-timezone');




router.post('/update', function (req, res) {
    var token = req.body.token;
    var password = req.body.password;
    password = crypto.createHash('md5').update(password).digest("hex");

    db.countToken(token,function (e, result1) {
        if (e) {
            res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Lỗi mạng."));
            return;
        }
        if (result1) {
            if(result1.length > 0 && result1[0].count > 0){
                    db.updateUserPasswordByToken(token,password,function (e, result) {
                        if(e){
                            res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Lỗi mạng."));
                            return;
                        }
                        if(result){
                            db.removeUserToken(token,function (e1, data) {
                                if(e1){
                                    res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Lỗi mạng."));
                                }
                                if(data){
                                    res.json(api.getResponse(api.SUCC_UPDATE_PASSWORD, null, "ok"));
                                }
                            });
                        }
                    });
            } else {
                res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "Token đã không còn hiệu lực."));
            }
        }
    });
});

router.post('/send', function (req, res) {
    var obj = req.body;

    var email = obj.email;
    var token = uuidV4();

    db.setUserToken(email,token,function (fail, result) {
        if(fail){
            res.json(api.getResponse(api.ERRO_NOT_FOUND, null, "User này không tồn tại"));
            return;
        }
        if(result){
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'lazy.mining.info',
                    pass: 'T8HsSt9qAPzXM5F4'
                }
            });
            var email_name = email.split("@")[0];
            var time = moment().tz("Asia/Ho_Chi_Minh").add(5, 'minutes').format('DD/MM/YYYY HH:mm');
            link = 'http://www.lazymining.com/resetPasswordUser?token='+token;
            link_name = link;
            var html = '<tbody>'
                +'<tr>'
                +'<td align="left" height="60">'
                +'    <p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#333333;font-size:20px;font-weight:400;text-transform:uppercase">YÊU CẦU LẤY LẠI MẬT MÃ</p>'
                +'</td>'
                +'</tr>'
                +'<tr>'
                +'<td height="30">'
                +'<p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#555;font-size:13px">Chào <strong>'+email_name+'</strong>,</p>'
                +'</td>'
                +'</tr>'
                +'<tr>'
                +'<td height="30">'
                +'<p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#555;font-size:13px"><span>Bạn vừa thực hiện yêu cầu lấy lại mật mã. Để hoàn tất việc <span>lấy lại mật mã</span>, vui lòng nhấn vào đường dẫn dưới đây hoặc chép và dán vào trình duyệt:</p>'
                +'</td>'
                +'</tr>'
                +'<tr>'
                +'<td height="60">'
                +'<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px"><a href="'+link+'">'+link_name+'</a></p>'
                +'</td>'
                +'</tr>'
                +'<tr>'
                +'<td height="30">'
                +'<p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:#555;font-size:13px">Nếu không phải bạn thực hiện, vui lòng <strong>KHÔNG</strong> nhấn vào đường dẫn trên.</p>'
                +'</td>'
                +'</tr>'
                +'<tr>'
                +'<td height="30">'
                +'<p style="margin:0;font-family:Arial,Helvetica,sans-serif;color:red;font-size:13px">Email này có giá trị đến hết ngày '+time+' <span style="color:#555">(ngày/tháng/năm).</span></p>'
                +'</td>'
                +'</tr>'
                +'</tbody>';

            var mailOptions = {
                from: 'lazy.mining.info',
                to: email,
                subject: 'Lazy Mining | Lấy lại mật mã',
                html: html
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                    res.json(api.getResponse(api.ERRO_EMAIL_NOT_FOUND, null, "Không thể gửi mail"));

                } else {
                    console.log('Email sent: ' + info.response);
                    setTimeout(function() {
                        db.removeUserToken(token,function (e4,result) {
                            // nothing
                        });
                    }, 300000);
                    res.json(api.getResponse(api.SUCC_SEND_RESET_EMAIL, null, "ok"));

                }
            });
        }
    });


});
module.exports = router;
