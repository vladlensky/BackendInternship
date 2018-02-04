var express = require('express');
var url = require('../db').url;
var router = express.Router();
var mongoClient = require("mongodb").MongoClient;

router.get('/count', function(req, res, next) {
    mongoClient.connect(url, function(err, db){
        if(err){
            res.send('error');
            return console.log(err);
        }
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var collection = db.db("test").collection("users");
        collection.find().count(function(err, result){
            res.send(result.toString());
        });
        db.close();
    });
});
router.get('/', function(req, res, next) {
    mongoClient.connect(url, function(err, db){
        if(err){
            return console.log(err);
        }
        const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        var collection = db.db("test").collection("users");
        var user = {ip: ip};
        collection.findOne(user, function(err, result) {
            if (err) throw err;
            if(result.ip === user.ip)
                return;
            collection.insertOne(user, function(err, result){
                if(err){
                    return console.log(err);
                }
                console.log('ok');
            });
        });
        // взаимодействие с базой данных
        db.close();
    });
    res.send('Ok');
});

router.post ('/', function(req, res, next) {
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
        host: 'smtp.mail.ru',
        port: 465,
        secure: true,
        auth: {
            user: "bespalov-vlad99@mail.ru",
            pass: "y3h3k98f"
        }
    });
    var mailOptions;
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
