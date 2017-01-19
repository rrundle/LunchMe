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

  var accountInfo = document.getElementById('account-info')

  var customer = document.createElement('div')
  customer.setAttribute('class', 'user')

  var success = document.createElement('div')
  success.textContent = 'Success! You are now ready to start using LunchMe! See below for how to place an order.'
  success.setAttribute('id', 'success')
  customer.appendChild(success)

  var name  = document.createElement('div')
  name.textContent = formData.get('name')
  name.setAttribute('id', 'name-results')
  customer.appendChild(name)

  var address  = document.createElement('div')
  address.textContent = formData.get('address')
  address.setAttribute('id', 'address-results')
  customer.appendChild(address)

  var city  = document.createElement('div')
  city.textContent =  formData.get('city') + ', ' + formData.get('state') + ', ' + formData.get('zip')
  city.setAttribute('id', 'city-results')
  customer.appendChild(city)

  var phone  = document.createElement('div')
  phone.textContent = formData.get('phone')
  phone.setAttribute('id', 'phone-results')
  customer.appendChild(phone)

  var email = document.createElement('div')
  email.textContent = formData.get('email')
  email.setAttribute('id', 'email-results')
  customer.appendChild(email)

  var account = document.getElementById('account-title')
  account.textContent = ''

  accountInfo.appendChild(customer)

  /*
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
  */
  sendData(data)
  .then(result => console.log(result))
}

//sending and receiving signup data to database

function sendData(data) {
  var inputs = document.querySelector('.account')
  var user = document.querySelector('.user')
  var options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }
  var result = fetch('/signup', options)
    .then(res => res.json())
    .then(viewSwitch(inputs, user))
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
  var accountInfo = document.getElementById('account-info')

  var customer = document.createElement('div')
  customer.setAttribute('class', 'user')

  var success = document.createElement('div')
  success.textContent = 'Welcome back! Happy lunching!'
  success.setAttribute('id', 'success')
  customer.appendChild(success)

  var name  = document.createElement('div')
  name.textContent = user[0].name
  name.setAttribute('id', 'name-results')
  customer.appendChild(name)

  var address  = document.createElement('div')
  address.textContent = user[0].address
  address.setAttribute('id', 'address-results')
  customer.appendChild(address)

  var city  = document.createElement('div')
  city.textContent =  user[0].city + ', ' + user[0].state + ', ' + user[0].zip
  city.setAttribute('id', 'city-results')
  customer.appendChild(city)

  var phone  = document.createElement('div')
  phone.textContent = user[0].phone
  phone.setAttribute('id', 'phone-results')
  customer.appendChild(phone)

  var account = document.getElementById('account-title')
  account.textContent = ''

  accountInfo.appendChild(customer)

  var inputs = document.querySelector('.account')
  viewSwitch(inputs, customer)
}

function noMatch() {
  var error = document.createElement('span')
  var email = document.getElementById('email-button')
  email.appendChild(error)
  error.textContent = 'Sorry, no match. Set up your account over there 👈 .'
}

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
