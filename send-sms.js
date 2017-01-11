// Twilio Credentials
var accountSid = 'AC8531d011f7354e888b1ff5814ede7216'
var authToken = '25d3020b826467462385f76a53dd9caa'

//require the Twilio module and create a REST client
var client = require('twilio')(accountSid, authToken)

client.messages.create({
    to: "+16268402294",
    from: "+16266583335",
    body: "Some message I want to send.",
}, function(err, message) {
    console.log(message.sid)
})
