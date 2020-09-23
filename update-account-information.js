fetch(`${baseURL}/profile`, {
    method: "GET",
    headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": `Bearer ${window.localStorage.token}`
    }
    })
    .then(response => response.json())
    .then(response => createUpdateForm(response))
    createNavigationButton("ACCOUNT", `${accountURL}`)

function createUpdateForm(response) {
    console.log(response)
    const updateUserForm = document.createElement('form')
    const username = document.createElement('input')
    const email = document.createElement('input')
    const password = document.createElement('input')
    const name = document.createElement('input')
    const submit = document.createElement('input')
        
    updateUserForm.classList.add('user-form')
    updateUserForm.id = "update-account-information-form"

    username.name = "username"
    username.value = response.username
    email.name = "email"
    email.value = response.email
    password.name = "password"
    password.type = "password"
    password.placeholder = "Password is required to update account information"
    name.name = "name"
    name.value = response.name
    submit.value = "Update Account Information"
    submit.type = "submit"

    updateUserForm.append(username, email, password, name, submit)
    $.main.append(updateUserForm)

    const $updateAccountInfoForm = document.querySelector('#update-account-information-form')
    $updateAccountInfoForm.addEventListener('submit', event => getUserData(event, response))
    
}

function getUserData(event, response) {
event.preventDefault()
console.log(response)
const formData = new FormData(event.target)
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    let name = formData.get('name')
    name = name.toLowerCase()
    let user = { username, email, password, name }

    fetchCall( `${userURL}/${response.id}`, "PUT", {user} )
    .then(response => response.json())
    .then(directToPage(event, `${accountURL}`))    
}
  
