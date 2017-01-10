var express = require('express')
var app = express()

var twilio = require('twilio')

var Postmates = require('postmates')
var postmates = new Postmates('cus_L6EryomNUdlkLV', 'dfca5181-e047-4e91-8233-d9229eb4b19c')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()

var PORT = 1337

var delivery = {
  manifest: "a cheese pizza",
  pickup_name: "Pitfire Pizza",
  pickup_address: "353 East 17th Street, Costa Mesa, CA 92627",
  pickup_phone_number: "6268266620",
  dropoff_name: "Ryan",
  dropoff_address: "1206 Las Arenas Way, Costa Mesa, CA 92627",
  dropoff_notes: "Front door on the back side"
}

app.use(jsonParser)

app.post('/sms', function(req, res) {
  var twilio = require('twilio')
  var twiml = new twilio.TwimlResponse()
  twiml.message('Thanks! We got your order!')
  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString())
})

app.post('/postmates', function(req, res) {
  console.log(req.body)
  res.writeHead(200)
})

app.listen(PORT, function () {
  console.log(`Express server listening on port ${PORT}`)
})

postmates.new(delivery, function(err, res) {
  var twiml = new twilio.TwimlResponse()
  twiml.message('Thanks! We got your order!')
})
