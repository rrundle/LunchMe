var form = document.querySelector('.account')

form.addEventListener('submit', submitForm)

function submitForm(e) {
  e.preventDefault()
  var formData = new FormData(e.target)
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
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(data)
  }
  var result = fetch('/signup', options)
    .then(res => res.json())
  return result
}
