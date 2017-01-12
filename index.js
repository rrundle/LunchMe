var express = require('express')
var app = express()

var twilio = require('twilio')
var accountSid = 'AC8531d011f7354e888b1ff5814ede7216'
var authToken = '25d3020b826467462385f76a53dd9caa'
var client = require('twilio')(accountSid, authToken)

var Postmates = require('postmates')
var postmates = new Postmates('cus_L6EryomNUdlkLV', 'dfca5181-e047-4e91-8233-d9229eb4b19c')

var bodyParser = require('body-parser')
var urlParser = bodyParser.urlencoded()
var jsonParser = bodyParser.json()

var PORT = 2999

function makeDelivery(manifest, pickup_name) {
  return {
    manifest: manifest,
    pickup_name: pickup_name,
    pickup_address: "353 East 17th Street, Costa Mesa, CA 92627",
    pickup_phone_number: "6268266620",
    dropoff_name: "Ryan",
    dropoff_address: "1206 Las Arenas Way, Costa Mesa, CA 92627",
    dropoff_phone_number: "6268402294",
    dropoff_notes: "Front door on the back side"
  }
}

function cantProcess(response, twilio) {
  twilio.message('Sorry we could not process that order.')
  response.writeHead(200, {'Content-Type': 'text/xml'})
  response.end(twilio.toString())
}

app.use(urlParser)
app.use(jsonParser)

app.post('/sms', function(req, res) {
  var textString = req.body.Body
  var space = ' '
  var arrayOfText = textString.split(space)
  if (arrayOfText[1].toLowerCase() !== 'pizza' || arrayOfText[3].toLowerCase() !== 'pitfire') {
    var twiml = new twilio.TwimlResponse()
    cantProcess(res, twiml)
    return
  }
  if (arrayOfText[1].toLowerCase() === 'pizza' && arrayOfText[3].toLowerCase() === 'pitfire') {
    var manifest = 'large cheese pizza'
    var pickup_name = 'Pitfire Pizza'
    var delivery = makeDelivery(manifest, pickup_name)
    postmates.new(delivery, function(err, confirm) {
      var twiml = new twilio.TwimlResponse()
      twiml.message('Thanks! We got your order! Your order number is ' + confirm.body.id + '. Your ' + manifest + ' from ' + pickup_name + ' is on its way!')
      res.writeHead(200, {'Content-Type': 'text/xml'})
      res.end(twiml.toString())
    })
  }
})

app.post('/postmates', function(req, res) {
  client.messages.create({
      to: '+16268402294',
      from: '+16266583335',
      body: 'Status of order #' + req.body.id + ': Your ' + req.body.data.manifest.description + ' from ' + req.body.data.pickup.name + ' is in ' + req.body.data.status,
  }, function(err, message) {
      console.log(message.sid)
  })
  res.sendStatus(200)
})

app.listen(PORT, function() {
  console.log(`Express server listening on port ${PORT}`)
})
