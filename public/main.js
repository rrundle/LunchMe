var form = document.querySelector('.account')

form.addEventListener('submit', submitForm)

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
  sendData(data)
    .then(result => console.log(result))
}

function sendData(data) {
  var options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
    body: JSON.stringify(data)
  }
  var result = fetch('/signup', options)
    .then(res => res.json())
  return result
}
