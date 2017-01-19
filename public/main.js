//Create login box above twilio number that has existing box
//for input that is creatd on click and fades in with animation
//login button should be removed (fade out) when submit button is clicked
//If login enter button is clicked, form is removed and user data is displayed

//view switching
var form = document.querySelector('.account')

function viewSwitch(hide, view) {
  hide.style.visibility = 'hidden'
  view.style.visibility = 'visible'
}

//creating object from signup form, setting contents page on viewSwitch

function submitForm(event) {
  event.preventDefault()
  var formData = new FormData(event.target)
  var data = {
    name: formData.get('name'),
    address: formData.get('address'),
    city: formData.get('city'),
    state: formData.get('state'),
    zip: formData.get('zip'),
    phone: formData.get('phone'),
    email: formData.get('email')
  }
  var name  = document.getElementById('name-results')
  name.textContent = formData.get('name')
  var address  = document.getElementById('address-results')
  address.textContent = formData.get('address')
  var city  = document.getElementById('city-results')
  city.textContent = formData.get('city') + ', ' + formData.get('state') + ', ' + formData.get('zip')
  var phone  = document.getElementById('phone-results')
  phone.textContent = formData.get('phone')
  var email  = document.getElementById('email-results')
  email.textContent = formData.get('email')

  var na = document.getElementById('phone-text')
  var generate = document.getElementById('generate')
  viewSwitch(na, generate)
  generate.textContent = 'Click to generate your number'

  var path = '/signup'
  sendData(data, path)
    .then(result => console.log(result))

  var inputs = document.querySelector('.account')
  var user = document.querySelector('.user')
  viewSwitch(inputs, user)
}

/*
function getId(data) {
  var formData = new FormData(event.target)
  var idValue = formData.get('email')
  var id = document.getElementById('email-results')
}
*/

//Saving emoji preferences

function saveEmoji(event) {
  event.preventDefault()
  var formData = new FormData(event.target)
  var id = document.getElementById('id')
  var userId = id.getAttribute('class')
  var data = {
    id: userId,
    peps_manifest: formData.get('pizza'),
    panda_manifest: formData.get('panda'),
    fila_manifest: formData.get('chicken'),
    innout_manifest: formData.get('burger'),
    chipotle_manifest: formData.get('burrito'),
    ten_manifest: formData.get('sushi'),
    tokio_manifest: formData.get('bento'),
    pho_manifest: formData.get('viet'),
    ikes_manifest: formData.get('heart'),
    cvs_manifest: formData.get('pill')
  }
  var path = '/preferences'
  sendData(data, path)
    .then(result => console.log(result))

/*
  var inputs = document.getElementsByTagName('input')
  for (var i = 0; i < inputs; i++) {
    console.log(inputs[i])
    inputs[i].setAttribute('disabled', 'disabled')
  }
*/
}


//display number on screen and push to database
function registerNumber(response) {
  var name  = document.getElementById('name-results')
  var data = {
    name: name.textContent,
    twilio: response,
  }
  sendNumber(data)
}

//sending and receiving signup data to database

function sendData(data, path) {
  var options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }
  var result = fetch(path, options)
    .then(res => res.json())
    .then(data => console.log(data))
  return result
}

function displayTwilio(number) {
  var phone = document.getElementById('phone-text')
  phone.textContent = number
  var generate = document.getElementById('generate')
  var twilio = document.getElementById('phone-text')
  twilio.setAttribute('class', 'text shape')
  viewSwitch(generate, twilio)
}

function sendNumber(data) {
  var options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }
  var result = fetch('/twilio', options)
    .then(res => res.json())
    .then(data => displayTwilio(data))
  return result
}

//checking email against return array for existing user
function emailMatches(array) {
  var input = document.getElementById('email-input')
  return array.filter(function(person) {
    return person.email === input.value
  })
}

function showUser(user) {
  var inputs = document.querySelector('.account')
  var customer = document.querySelector('.user')
  viewSwitch(inputs, customer)
  var id = document.getElementById('id')
  id.setAttribute('class', user[0].id)
  var name  = document.getElementById('name-results')
  name.textContent = user[0].name
  var address  = document.getElementById('address-results')
  address.textContent = user[0].address
  var city  = document.getElementById('city-results')
  city.textContent =  user[0].city + ', ' + user[0].state + ', ' + user[0].zip
  var phone  = document.getElementById('phone-results')
  phone.textContent = user[0].phone
  var account = document.getElementById('account-title')
  account.textContent = ''
  var success = document.getElementById('success')
  success.textContent = 'Welcome back! Happy lunching.'
  var twilio = document.getElementById('phone-text')
  twilio.textContent = user[0].twilio
}

function noMatch() {
  var error = document.createElement('span')
  var email = document.getElementById('email-button')
  email.appendChild(error)
  error.textContent = 'Sorry, no match. Set up your account over there 👈 .'
}

//EVENT LISTENERS
//submits form on click/enter

form.addEventListener('submit', submitForm)

//checks email in database on click

document.addEventListener('click', function(e) {
  if (e.target.id.indexOf('email-button') !== -1) {
    var result = fetch('/login')
    result
      .then(res => res.json())
      .then(data => emailMatches(data))
      .then(match => {
        if (match.length > 0) {
          showUser(match)
        }
        else {
          noMatch()
        }
      })
      .catch((error) => console.log(error))
  }
})

//login box appears when login is clicked

document.addEventListener('click', function(e) {
  if (e.target.id.indexOf('login-button') !== -1) {
    var loginButton = document.getElementById('login-button')
    var email = document.createElement('div')
    var login = document.createElement('input')
    var submit = document.createElement('span')

    loginButton.appendChild(email)
    loginButton.appendChild(login)
    loginButton.appendChild(submit)

    email.setAttribute('class', 'check-email animated fadeIn')
    email.textContent = 'Enter your email address: '

    login.setAttribute('class', 'check-email animated fadeIn')
    login.setAttribute('placeholder', 'sallydavis@email.com')
    login.setAttribute('id', 'email-input')

    submit.setAttribute('class', 'check-email animated fadeIn')
    submit.setAttribute('id', 'email-button')
    submit.textContent = 'Submit'
  }
})

document.addEventListener('click', function(e) {
  if (e.target.id.indexOf('generate') !== -1) {

    //get twilio number
    var result = fetch('/number')
    result
      .then(res => res.json())
      .then(data => registerNumber(data))
/*
    //get id of recently submitted user
    var id = fetch('./id')
    id
      .then(res => res.json())
      .then(data => console.log(data))
*/
  }
})

document.addEventListener('submit', saveEmoji)
