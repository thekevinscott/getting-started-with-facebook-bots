var token = '<YOUR TOKEN HERE>';
var express = require('express');
var app = express();

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
  }
  res.send('Error, wrong validation token');
});

// respond to post calls from facebook
app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log('You sent the message', text);
      // Handle a text message from this sender
    }
  }
  res.sendStatus(200);
});
