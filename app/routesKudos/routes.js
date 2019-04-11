const api_key = require("../../config/sendGrid");

module.exports = function(app, dbKudos) {



  app.get("/api/kudos", function(req, res) {
    dbKudos
      .find({})
      .sort([["date", -1]])
      .toArray(function(err, kudos) {
        if (err) return console.log(err);
        res.send(kudos);
      });
  });

  app.post("/api/kudos/my", function(req, res) {
    dbKudos
      .find({to: req.body.name})
      .sort([["date", -1]])
      .toArray(function(err, kudos) {
        if (err) return console.log(err);
        res.send(kudos);
      });
  });  

  app.post("/api/kudos", function(req, res) {
    if (!req.body) return res.sendStatus(400);

    const kudosValue = req.body.value;
    const kudosFrom = req.body.from;
    const kudosTo = req.body.to;
    const kudosDate = new Date();
    const kudosMessage = req.body.message;
    const emailTo = req.body.emailTo;

    const user = {
      value: kudosValue,
      from: kudosFrom,
      to: kudosTo,
      date: kudosDate,
      message: kudosMessage,
      emailTo: emailTo,
    };

    dbKudos.insertOne(user, function(err, result) {
      if (err) return console.log(err);
      res.send(user);
    });

    const mailSender = false; //switch on true to send email
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(api_key.SENDGRID);
    const msg = {
      to: user.emailTo,
      from: 'test@kudos.com',
      subject: user.value,
      text: 'Text',
      html: user.message,
    };
  
    if (mailSender) {
      sgMail.send(msg);
    }
    
  });

  app.get("/", function(req, res) {
    res.send("Hello Oleg!");
  });
};
