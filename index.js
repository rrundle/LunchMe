var express = require('express')
var app = express()

var twilio = require('twilio')
var twiml = new twilio.TwimlResponse()
var accountSid = 'AC8531d011f7354e888b1ff5814ede7216'
var authToken = '25d3020b826467462385f76a53dd9caa'
var client = require('twilio')(accountSid, authToken)

var Postmates = require('postmates')
var postmates = new Postmates('cus_L6EryomNUdlkLV', 'dfca5181-e047-4e91-8233-d9229eb4b19c')

var bodyParser = require('body-parser')
var jsonParser = bodyParser.urlencoded()

var PORT = 2999

var delivery = {
  manifest: "a cheese pizza",
  pickup_name: "Pitfire Pizza",
  pickup_address: "353 East 17th Street, Costa Mesa, CA 92627",
  pickup_phone_number: "6268266620",
  dropoff_name: "Ryan",
  dropoff_address: "1206 Las Arenas Way, Costa Mesa, CA 92627",
  dropoff_phone_number: "6268402294",
  dropoff_notes: "Front door on the back side"
}

app.use(jsonParser)

app.post('/sms', function(req, res) {
  console.log(req.body.Body)
  postmates.new(delivery, function(err, confirm) {
    console.log(confirm.body)
  })
  twiml.message('Thanks! We got your order! We\'ll send you a status update shortly.')
  res.writeHead(200, {'Content-Type': 'text/xml'})
  res.end(twiml.toString())
})

app.post('/postmates', function(req, res) {

  client.messages.create({
      to: '+16268402294',
      from: '+16266583335',
      body: 'Status of order #' + req.body.id + ': ' + req.body.data.status,
  }, function(err, message) {
      console.log(message.sid)
  })
  
  console.log(req.body.data.status)
  res.sendStatus(200)
})

app.listen(PORT, function() {
  console.log(`Express server listening on port ${PORT}`)
})
