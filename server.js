var express = require('express')
var twilio = require('twilio')

var app = express()

var PORT = 1337


app.post('/', function(req, res) {
  var twilio = require('twilio')
  var twiml = new twilio.TwimlResponse()
  twiml.message('The Robots are coming! Head for the hills!')
  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString())
})

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})
