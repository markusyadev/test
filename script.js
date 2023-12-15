function sendinfo(){
let info = {
  name : document.getElementById('name').value,
  surname: document.getElementById('surname').value,
  email : document.getElementById('email').value,
  password : document.getElementById('password').value,
  phonenumber : document.getElementById('phonenumber').value,
};


let res = fetch('/registration',{
  method:'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify(info)

})
}
let send_button = document.getElementById('send_button')

send_button.addEventListener('click',sendinfo)