var express = require('express')
var app = express()

var twilio = require('twilio')
var accountSid = 'AC8531d011f7354e888b1ff5814ede7216'
var authToken = '25d3020b826467462385f76a53dd9caa'
var client = require('twilio')(accountSid, authToken)

var Postmates = require('postmates')
var postmates = new Postmates('cus_L6EryomNUdlkLV', 'dfca5181-e047-4e91-8233-d9229eb4b19c')

var emoji = require('node-emoji')

var bodyParser = require('body-parser')
var urlParser = bodyParser.urlencoded()
var jsonParser = bodyParser.json()

var PORT = 2999

var orders = [
  {
    emoticon: 'pizza',
    manifest: 'Large cheese pizza',
    pickup_name: 'Sgt. Pepperonis Pizza',
    order_address: '2300 SE Bristol St #F',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickup_phone_number: '949-852-9500'
  },
  {
    emoticon: 'panda_face',
    manifest: '2 item combo, all chow mein, orange chicken, honey walnut shrimp',
    pickup_name: 'Panda Express',
    order_address: '13266 Jamboree Rd',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92602',
    pickup_phone_number: '714-669-0752'
  },
  {
    emoticon: 'chicken',
    manifest: 'Spicy chicken sandwich meal, coke',
    pickup_name: 'Chick-Fil-A',
    order_address: '4127 Campus Dr',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92612',
    pickup_phone_number: '949-725-0230'
  },
  {
    emoticon: 'hamburger',
    manifest: '#1 plain, large coke',
    pickup_name: 'In-N-Out',
    order_address: '4115 Campus Dr',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92612',
    pickup_phone_number: '800-786-1000'
  },
  {
    emoticon: 'burrito',
    manifest: 'Burrito, all rice, steak, medium salsa, lettuce, cheese, Large Coke',
    pickup_name: 'Chipotle',
    order_address: '4225 Campus Dr Suite A 116',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92612',
    pickup_phone_number: '949-242-3737'
  },
  {
    emoticon: 'sushi',
    manifest: 'Dragon roll, shrimp tempura roll - large',
    pickup_name: 'Ten Asian Bistro',
    order_address: '4647 MacArthur Blvd',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickup_phone_number: '949-660-1010'
  },
  {
    emoticon: 'bento',
    manifest: 'Teriyaki chicken bento, miso soup, bottled water',
    pickup_name: 'Tokio Grill',
    order_address: '17915 MacArthur Blvd',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92614',
    pickup_phone_number: '949-724-1453'
  },
  {
    emoticon: 'flag-vn',
    manifest: 'Charbroiled beef pho, spring rolls',
    pickup_name: 'Pho Ba Co',
    order_address: '4250 Barranca Pkwy Suite K',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92604',
    pickup_phone_number: '949-857-8808'
  },
  {
    emoticon: 'hearts',
    manifest: 'Little mermaid on dutch crunch, no lettuce or tomatoes',
    pickup_name: 'Ikes Love & Sandwiches',
    order_address: '4221 MacArthur Blvd',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickup_phone_number: '949-783-3390'
  },
  {
    emoticon: 'pill',
    manifest: 'Natures Made multivitamin, 6-pack coke, Tide liquid detergent, 4 snickers bars',
    pickup_name: 'CVS Pharmacy',
    order_address: '2521 Eastbluff Dr',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickup_phone_number: '949-717-6642'
  }
]

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
  var pizza = emoji.get('pizza')
  var textString = req.body.Body
  var space = ' '
  var arrayOfText = textString.split(space)
  if ((arrayOfText[1].toLowerCase() === 'pizza' || arrayOfText[1] === pizza) && arrayOfText[3].toLowerCase() === 'pitfire') {
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
  else {
    var twiml = new twilio.TwimlResponse()
    cantProcess(res, twiml)
    return
  }
})

app.post('/postmates', function(req, res) {
  client.messages.create({
      to: '+16268402294',
      from: '+16266583335',
      body: 'Status of order #' + req.body.id + ': Your ' + req.body.data.manifest.description + ' from ' + req.body.data.pickup.name + ' is in ' + req.body.data.status + '. Expected delivery time is: ' + req.body.data.dropoff_eta + '.',
  }, function(err, message) {
      console.log(message.sid)
  })
  res.sendStatus(200)
})

app.listen(PORT, function() {
  console.log(`Express server listening on port ${PORT}`)
})
