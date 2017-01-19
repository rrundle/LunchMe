var form = document.querySelector('.account')

function viewSwitch(hide, view) {
  hide.style.visibility = 'hidden'
  view.style.visibility = 'visible'
}

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

  sendData(data)
    .then(result => console.log(result))

  var inputs = document.querySelector('.account')
  var user = document.querySelector('.user')
  viewSwitch(inputs, user)
}

function registerNumber(response) {
  var name  = document.getElementById('name-results')
  var data = {
    name: name.textContent,
    twilio: response,
  }
  sendNumber(data)
}

function sendData(data) {
  var options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }
  var result = fetch('/signup', options)
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

  var twilio = document.getElementById('phone-text')
  twilio.textContent = user[0].twilio

  var inputs = document.querySelector('.account')
  viewSwitch(inputs, customer)
}

function noMatch() {
  var error = document.createElement('span')
  var email = document.getElementById('email-button')
  email.appendChild(error)
  error.textContent = 'Sorry, no match. Set up your account over there 👈 .'
}

form.addEventListener('submit', submitForm)

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
    var result = fetch('/number')
    result
      .then(res => res.json())
      .then(data => registerNumber(data))
  }
})
