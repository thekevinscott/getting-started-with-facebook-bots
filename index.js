var token = '<YOUR TOKEN HERE>';
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var request = require('request');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

app.get('/', function (req, res) {
  res.send('Hello world');
});

app.listen(5000, function () {
  console.log('Listening on port 5000');
});

// respond to facebook's verification
app.get('/webhook/', function (req, res) {
  if (req.query['hub.verify_token'] === token) {
    res.send(req.query['hub.challenge']);
  } else {
    res.send('Error, wrong validation token');
  }
});

// respond to post calls from facebook
app.post('/webhook/', function (req, res) {
  var messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    var event = req.body.entry[0].messaging[i];
    var sender = event.sender.id;
    if (event.message && event.message.text) {
      var location = event.message.text;
      var weatherEndpoint = 'https://query.yahooapis.com/v1/public/yql?q=select%20*%20from%20weather.forecast%20where%20woeid%20in%20(select%20woeid%20from%20geo.places(1)%20where%20text%3D%22' + location + '%22)&format=json&env=store%3A%2F%2Fdatatables.org%2Falltableswithkeys';
      request({
        url: weatherEndpoint
      }, function(error, response, body) {
        try {
          var body = JSON.parse(response.body);
          var condition = body.query.results.channel.item.condition;
          sendTextMessage(sender, "Today is " + condition.temp + " and " + condition.text + " in " + location);
        } catch(err) {
          sendTextMessage(sender, "There was an error.");
        }
      });
    }
  }
  res.sendStatus(200);
});

function sendTextMessage(sender, text) {
  var access_token ='<YOUR PAGE ACCESS TOKEN>';
  var messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:access_token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
  });
}
