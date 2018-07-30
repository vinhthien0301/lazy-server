
exports.no_reply_email_address = "lazy.mining.info";
exports.no_reply_email_password = "T8HsSt9qAPzXM5F4";


exports.sendResetPasswordEmail = function (req, token, successCallback, errorCallback) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: this.no_reply_email_address,
            pass: this.no_reply_email_password
        }
    });
    var email_name = email.split("@")[0];
    var time = moment().tz("Asia/Ho_Chi_Minh").add(5, 'minutes').format('DD/MM/YYYY HH:mm');
    link = UrlHelper.getServerAddressBase(req) + '/resetPasswordUser?token='+token;

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
        +'<p style="margin:0;font-family:Arial,Helvetica,sans-serif;font-size:13px"><a href="'+link+'">'+link+'</a></p>'
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
            if (successCallback) {
                successCallback();
            }

        }
    });
};
