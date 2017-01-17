//Create login box above twilio number that has existing box
//for input that is creatd on click and fades in with animation
//login button should be removed (fade out) when submit button is clicked
//If login enter button is clicked, form is removed and user data is displayed

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

form.addEventListener('submit', submitForm)
