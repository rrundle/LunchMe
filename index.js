//GLOBAL VARIABLES
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

//Supported restaurants
var orders = [
  {
    emoticon: emoji.get('pizza'),
    tableName: 'peps_manifest',
    pickupName: 'Sgt. Pepperonis Pizza',
    order_address: '2300 SE Bristol St #F',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickupPhone: '949-852-9500'
  },
  {
    emoticon: emoji.get('panda_face'),
    tableName: 'panda_manifest',
    pickupName: 'Panda Express',
    order_address: '13266 Jamboree Rd',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92602',
    pickupPhone: '714-669-0752'
  },
  {
    emoticon: emoji.get('chicken'),
    tableName: 'fila_manifest',
    pickupName: 'Chick-Fil-A',
    order_address: '4127 Campus Dr',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92612',
    pickupPhone: '949-725-0230'
  },
  {
    emoticon: emoji.get('hamburger'),
    tableName: 'innout_manifest',
    pickupName: 'In-N-Out',
    order_address: '4115 Campus Dr',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92612',
    pickupPhone: '800-786-1000'
  },
  {
    emoticon: emoji.get('burrito'),
    tableName: 'chipotle_manifest',
    pickupName: 'Chipotle',
    order_address: '4225 Campus Dr Suite A 116',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92612',
    pickupPhone: '949-242-3737'
  },
  {
    emoticon: emoji.get('sushi'),
    tableName: 'ten_manifest',
    pickupName: 'Ten Asian Bistro',
    order_address: '4647 MacArthur Blvd',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickupPhone: '949-660-1010'
  },
  {
    emoticon: emoji.get('bento'),
    tableName: 'tokio_manifest',
    pickupName: 'Tokio Grill',
    order_address: '17915 MacArthur Blvd',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92614',
    pickupPhone: '949-724-1453'
  },
  {
    emoticon: emoji.get('flag-vn'),
    tableName: 'pho_manifest',
    pickupName: 'Pho Ba Co',
    order_address: '4250 Barranca Pkwy Suite K',
    order_city: 'Irvine',
    order_state: 'CA',
    order_zip: '92604',
    pickupPhone: '949-857-8808'
  },
  {
    emoticon: emoji.get('hearts'),
    tableName: 'ikes_manifest',
    pickupName: 'Ikes Love & Sandwiches',
    order_address: '4221 MacArthur Blvd',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickupPhone: '949-783-3390'
  },
  {
    emoticon: emoji.get('pill'),
    tableName: 'cvs_manifest',
    pickupName: 'CVS Pharmacy',
    order_address: '2521 Eastbluff Dr',
    order_city: 'Newport Beach',
    order_state: 'CA',
    order_zip: '92660',
    pickupPhone: '949-717-6642'
  }
]

//FUNCTIONS
function makeDelivery(manifest, pickup_name, pickup_address, pickup_phone_number, dropoff_name, dropoff_address, dropoff_phone_number) {
  return {
    manifest: manifest,
    pickup_name: pickup_name,
    pickup_address: pickup_address,
    pickup_phone_number: pickup_phone_number,
    dropoff_name: dropoff_name,
    dropoff_address: dropoff_address,
    dropoff_phone_number: dropoff_phone_number
  }
}

function cantProcess(response, twilio) {
  twilio.message('Sorry we could not process that order.')
  response.writeHead(200, {'Content-Type': 'text/xml'})
  response.end(twilio.toString())
}

function setOrder(array/*users array*/, obj/*text object*/, res/*for twilio response*/) {
  var textString = obj.Body
  var space = ' '
  var arrayOfText = textString.split(space)
  var matches = []
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].emoticon === arrayOfText[1]) {

      matches.push(orders[i])
      var pickup_name = orders[i].pickupName
      var pickup_address = orders[i].order_address + ', ' + orders[i].order_city + ', ' + orders[i].order_state + ', ' + orders[i].order_zip
      var pickup_phone_number = orders[i].pickupPhone

      //var manifest = orders[i].order
      var dropoff_name = array[0].name
      var dropoff_address = array[0].address + ', ' + array[0].city + ', ' + array[0].state + ', ' + array[0].zipcode
      var dropoff_phone_number = array[0].phone

      var item = array[0]
      var match = orders[i].tableName
      for (var property in item) {
        if (match === property) {
          var manifest = array[0][property]

          var delivery = makeDelivery(manifest, pickup_name, pickup_address, pickup_phone_number, dropoff_name, dropoff_address, dropoff_phone_number)
          postmates.new(delivery, function(err, confirm) {
            var twiml = new twilio.TwimlResponse()
            twiml.message('Thanks! We got your order! Your order number is ' + confirm.body.id + '. Your ' + manifest + ' from ' + pickup_name + ' is on its way!')
            res.writeHead(200, {'Content-Type': 'text/xml'})
            res.end(twiml.toString())
          })
        }
      }
    }

  }
  if (matches.length === 0) {
    var twiml = new twilio.TwimlResponse()
    cantProcess(res, twiml)
    return
  }
}

//ROUTES AND MIDDLEWARE
app.use(urlParser)
app.use(jsonParser)
app.use(express.static('public'))

app.post('/signup', function(req, res) {
  var query = knex('users')
    .insert({
      name: req.body.name,
      address: req.body.address,
      city: req.body.city,
      state: req.body.state,
      zipcode: req.body.zip,
      phone: req.body.phone,
      email: req.body.email,
    })
    .returning('id')
  query
    .then(id => res.json(id))
    .catch((error) => res.send('Sorry, could not insert that user', error))
})

app.post('/email', function(req, res) {
  console.log(req.body.email)
  var query = knex('users')
    .where({
      email: req.body.email,
    })
    .select()
    .returning()
  query
    .then(user => res.json(user))
    .catch((error) => res.send('Sorry, could not get emails', error))
})

app.post('/preferences', function(req, res) {
  var query = knex('users')
    .where({
      id: req.body.id
    })
    .update({
      peps_manifest: req.body.peps_manifest,
      panda_manifest: req.body.panda_manifest,
      fila_manifest: req.body.fila_manifest,
      innout_manifest: req.body.innout_manifest,
      chipotle_manifest: req.body.chipotle_manifest,
      ten_manifest: req.body.ten_manifest,
      tokio_manifest: req.body.tokio_manifest,
      pho_manifest: req.body.pho_manifest,
      ikes_manifest: req.body.ikes_manifest,
      cvs_manifest: req.body.cvs_manifest
    })
  query
    .then(emoji => res.json(emoji))
    .catch(error => res.send('Sorry could not update your preferences', error))
})

app.post('/twilio', function(req, res) {
  var query = knex('users')
    .where({
      name: req.body.name
    })
    .update({
      twilio: req.body.twilio
    })
    .returning('twilio')
  query
    .then((number) => res.json(number))
    .catch((error) => res.send('Sorry, we couldn\'t get a phone number for you', error))
})

app.get('/user', function(req, res) {
  var query = knex
    .select()
    .from('users')
  query
    .then((users) => res.json(users))
})

app.get('/login', function (req, res) {
  var query = knex
    .select()
    .from('users')
  query
    .then((emails) => {res.json(emails)})
})

app.post('/sms', function(req, res) {
  var query = knex
    .where({
      'twilio': req.body.To
    })
    .select()
    .from('users')
  query
    .then(data => setOrder(data, req.body, res))
    .catch(err => res.send(err))
})

app.post('/postmates', function(req, res) {
  client.messages.create({
      to: '+1' + req.body.data.dropoff.phone_number.replace(/\D/g,''),
      from: '+16266583335',
      body: 'Status of order #' + req.body.data.id + ': Your ' + req.body.data.manifest.description + ' from ' + req.body.data.pickup.name + ' is in ' + req.body.data.status + '. Expected delivery time is: ' + req.body.data.dropoff_eta + '.',
  }, function(err, message) {
      console.log(message.sid)
  })
  res.sendStatus(200)
})

app.get('/number', function(req, res) {
  client.availablePhoneNumbers('US').local.list({
    areaCode: '626'
  }, function(err, data) {
    var number = data.availablePhoneNumbers[0]
    res.json(number.phone_number)

    client.incomingPhoneNumbers.create({
      phoneNumber: number.phone_number
    }, function(err, purchasedNumber) {
      console.log(purchasedNumber.sid)
    })
  })
})

app.listen(PORT, function() {
  console.log(`Express server listening on port ${PORT}`)
})
