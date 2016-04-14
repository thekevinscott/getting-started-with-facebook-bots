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
})
