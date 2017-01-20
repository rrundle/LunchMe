var form = document.querySelector('.account')
var legend = document.querySelector('.orders')

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

  var id = document.createElement('div')
  id.setAttribute('id', 'id')
  customer.appendChild(id)

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

function notify(elementOne, elementTwo) {
  elementTwo.appendChild(elementOne)

}

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

  var update = document.createElement('span')
  update.setAttribute('id', 'update')
  update.textContent = "Preferences saved!"
  var save = document.getElementById('save')
  notify(update, save)
}

function registerNumber(response) {
  var name  = document.getElementById('name-results')
  var data = {
    name: name.textContent,
    twilio: response,
  }
  sendNumber(data)
}

function sendData(data, path) {
  var options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }
  var result = fetch(path, options)
    .then(res => res.json())
    .then(data => addId(data))
  return result
}

function addId(id) {
  var idBadge = document.getElementById('id')
  idBadge.setAttribute('class', id)
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

  var id = document.createElement('div')
  id.setAttribute('id', 'id')
  id.setAttribute('class', user[0].id)
  customer.appendChild(id)

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

  var peps = document.getElementById('sgt-peps')
  peps.setAttribute('value', user[0].peps_manifest)

  var panda = document.getElementById('panda')
  panda.setAttribute('value', user[0].panda_manifest)

  var chicken = document.getElementById('chicken')
  chicken.setAttribute('value', user[0].fila_manifest)

  var burger = document.getElementById('burger')
  burger.setAttribute('value', user[0].innout_manifest)

  var burrito = document.getElementById('burrito')
  burrito.setAttribute('value', user[0].chipotle_manifest)

  var sushi = document.getElementById('sushi')
  sushi.setAttribute('value', user[0].ten_manifest)

  var bento = document.getElementById('bento')
  bento.setAttribute('value', user[0].tokio_manifest)

  var pho = document.getElementById('pho')
  pho.setAttribute('value', user[0].pho_manifest)

  var heart = document.getElementById('heart')
  heart.setAttribute('value', user[0].ikes_manifest)

  var pill = document.getElementById('pill')
  pill.setAttribute('value', user[0].cvs_manifest)

  var inputs = document.querySelector('.account')
  viewSwitch(inputs, customer)
}

function noMatch() {
  var error = document.createElement('span')
  var email = document.getElementById('email-button')
  email.appendChild(error)
  error.textContent = 'Sorry, no match. Set up your account over there 👈 .'
}

function sendEmail(data, path) {
  var options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }
  var result = fetch(path, options)
    .then(res => res.json())
  return result
}

function useValue() {
    var NameValue = emailValidationInput.value
    var data = {
      email: NameValue
    }
    var path = '/email'
    sendEmail(data, path)
      .then(result =>
        {
        if (result.length > 0) {
          console.log("found a match!")
        }
        else {
          console.log('something went wrong')
        }
      })
    console.log(NameValue)
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

var emailValidationInput = document.getElementById('email')
emailValidationInput.addEventListener('focus', function(e) {
  console.log(e.target.id.indexOf('email'))
  if (e.target.id.indexOf('email') !== -1) {
    emailValidationInput.onblur = useValue
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

legend.addEventListener('submit', saveEmoji)
