var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log('lel');
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    console.log(ip);
    var collection = db.collection("users");
    var user = {ip: ip};
    collection.insertOne(user, function(err, result){
        if(err){
            return console.log(err);
        }
        console.log('ok');
    });
        res.send('not added');
});

router.post ('/', function(req, res, next) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true, // true for 465, false for other ports 587
        auth: {
            user: "bespalov-vlad99@mail.ru",
            pass: "y3h3k98f"
        }
    });
    var mailOptions;
    // setup email data with unicode symbols
    console.log(req.body.phone);
    if(req.body.phone!== '' && req.body.phone!== undefined && req.body.phone!== null) {
        mailOptions = {
            from: 'bespalov-vlad99@mail.ru',
            to: 'bespalov-vlad99@mail.ru',
            subject: 'Ответ пользователя',
            text: 'Имя: ' + req.body.name + '\nТелефон: ' + req.body.phone + '\nПочта: ' + req.body.email + '\nТекст сообщения: ' + req.body.textArea
        }
    }
    else {
        mailOptions = {
            from: 'bespalov-vlad99@mail.ru',
            to: 'bespalov-vlad99@mail.ru',
            subject: 'Ответ пользователя',
            text: 'Имя: ' + req.body.name + '\nПочта: ' + req.body.email + '\nТекст сообщения: ' + req.body.textArea
        }
    }
    const mailOptionsToUser = {
        from: 'bespalov-vlad99@mail.ru',
        to: req.body.email,
        subject: 'Digital Design',
        text: req.body.name + ', спасибо за обращение! \nВ ближайшее время мы с вами свяжемся!'
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    });
    transporter.sendMail(mailOptionsToUser, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
});
    res.send('ok');
});

module.exports = router;
