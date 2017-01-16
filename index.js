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

var connex = require('knex')
var knex = connex({
  client: 'pg',
  connection: {
    user: 'ryanrundle',
    database: 'lunch-me'
  }
})

var PORT = 2999

var orders = [
  {
    emoticon: emoji.get('pizza'),
    order: 'Large cheese pizza',
    pickupName: 'Sgt. Pepperonis Pizza',
    order_address: '2300 SE Bristol St #F',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickupPhone: '949-852-9500'
  },
  {
    emoticon: emoji.get('panda_face'),
    order: '2 item combo, all chow mein, orange chicken, honey walnut shrimp',
    pickupName: 'Panda Express',
    order_address: '13266 Jamboree Rd',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92602',
    pickupPhone: '714-669-0752'
  },
  {
    emoticon: emoji.get('chicken'),
    order: 'Spicy chicken sandwich meal, coke',
    pickupName: 'Chick-Fil-A',
    order_address: '4127 Campus Dr',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92612',
    pickupPhone: '949-725-0230'
  },
  {
    emoticon: emoji.get('hamburger'),
    order: '#1 plain, large coke',
    pickupName: 'In-N-Out',
    order_address: '4115 Campus Dr',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92612',
    pickupPhone: '800-786-1000'
  },
  {
    emoticon: emoji.get('burrito'),
    order: 'Burrito, all rice, steak, medium salsa, lettuce, cheese, Large Coke',
    pickupName: 'Chipotle',
    order_address: '4225 Campus Dr Suite A 116',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92612',
    pickupPhone: '949-242-3737'
  },
  {
    emoticon: emoji.get('sushi'),
    order: 'Dragon roll, shrimp tempura roll - large',
    pickupName: 'Ten Asian Bistro',
    order_address: '4647 MacArthur Blvd',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickupPhone: '949-660-1010'
  },
  {
    emoticon: emoji.get('bento'),
    order: 'Teriyaki chicken bento, miso soup, bottled water',
    pickupName: 'Tokio Grill',
    order_address: '17915 MacArthur Blvd',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92614',
    pickupPhone: '949-724-1453'
  },
  {
    emoticon: emoji.get('flag-vn'),
    order: 'Charbroiled beef pho, spring rolls',
    pickupName: 'Pho Ba Co',
    order_address: '4250 Barranca Pkwy Suite K',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92604',
    pickupPhone: '949-857-8808'
  },
  {
    emoticon: emoji.get('hearts'),
    order: 'Little mermaid on dutch crunch, no lettuce or tomatoes',
    pickupName: 'Ikes Love & Sandwiches',
    order_address: '4221 MacArthur Blvd',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickupPhone: '949-783-3390'
  },
  {
    emoticon: emoji.get('pill'),
    order: 'Natures Made multivitamin, 6-pack coke, Tide liquid detergent, 4 snickers bars',
    pickupName: 'CVS Pharmacy',
    order_address: '2521 Eastbluff Dr',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickupPhone: '949-717-6642'
  }
]

function makeDelivery(manifest, pickup_name, pickup_address, pickup_phone_number) {
  return {
    manifest: manifest,
    pickup_name: pickup_name,
    pickup_address: pickup_address,
    pickup_phone_number: pickup_phone_number,
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
app.use(express.static('public'))

//send form data to database and send back success
app.post('/signup', function(req, res) {
  var query = knex('users').insert({
    name: req.body.name,
    address: req.body.address,
    city: req.body.city,
    state: req.body.state,
    zipcode: req.body.zip,
    phone: req.body.phone,
    username: req.body.email,
  })
  query
  .then((users) => res.json(users))
  .catch((error) => console.log('Sorry, could not insert that user', error))
})

//check incoming sms body, if matches to order Array send order
app.post('/sms', function(req, res) {
  var textString = req.body.Body
  var space = ' '
  var arrayOfText = textString.split(space)
  var matches = []
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].emoticon === arrayOfText[1]) {
      matches.push(orders[i])
      var manifest = orders[i].order
      var pickup_name = orders[i].pickupName
      var pickup_address = orders[i].order_address + ', ' + orders[i].order_city + ', ' + orders[i].order_state + ', ' + orders[i].order_zip
      var pickup_phone_number = orders[i].pickupPhone
      var delivery = makeDelivery(manifest, pickup_name, pickup_address, pickup_phone_number)
      postmates.new(delivery, function(err, confirm) {
        var twiml = new twilio.TwimlResponse()
        twiml.message('Thanks! We got your order! Your order number is ' + confirm.body.id + '. Your ' + manifest + ' from ' + pickup_name + ' is on its way!')
        res.writeHead(200, {'Content-Type': 'text/xml'})
        res.end(twiml.toString())
      })
    }
  }
  if (matches.length === 0) {
    var twiml = new twilio.TwimlResponse()
    cantProcess(res, twiml)
    return
  }
})

//webhook for order updates from Postmates
app.post('/postmates', function(req, res) {
  client.messages.create({
      to: '+16268402294',
      from: '+16266583335',
      body: 'Status of order #' + req.body.data.id + ': Your ' + req.body.data.manifest.description + ' from ' + req.body.data.pickup.name + ' is in ' + req.body.data.status + '. Expected delivery time is: ' + req.body.data.dropoff_eta + '.',
  }, function(err, message) {
      console.log(message.sid)
  })
  res.sendStatus(200)
})

//listener for server
app.listen(PORT, function() {
  console.log(`Express server listening on port ${PORT}`)
})
