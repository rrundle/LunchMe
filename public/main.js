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
  sendData(data)
  .then(result => console.log(result))
}

//sending and receiving signup data to database

function sendData(data) {
  var inputs = document.querySelector('.account')
  var user = document.querySelector('.user')
  var options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
    body: JSON.stringify(data)
  }
  var result = fetch('/signup', options)
    .then(res => res.json())
    .then(viewSwitch(inputs, user))
  return result
}

//checking email against databse for existing user
var login = document.getElementById('email-input')

//submits form on click/enter

form.addEventListener('submit', submitForm)

//checks email in database on click

document.addEventListener('click', function(e) {
  console.log(e.target.id.indexOf('email-button'))
  if (e.target.id.indexOf('email-button') !== -1) {
    var result = fetch('/login')
    result
      .then(res => res.json())
      .then(res => console.log(res))
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
