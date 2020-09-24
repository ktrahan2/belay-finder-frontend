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
    const userData = response.data
    const updateUserForm = document.createElement('form')
    const username = document.createElement('input')
    const email = document.createElement('input')
    const password = document.createElement('input')
    const name = document.createElement('input')
    const submit = document.createElement('input')
        
    updateUserForm.classList.add('user-form')
    updateUserForm.id = "update-account-information-form"

    username.name = "username"
    username.value = userData.attributes.username
    email.name = "email"
    email.value = userData.attributes.email
    password.name = "password"
    password.type = "password"
    password.placeholder = "Password is required to update account information"
    name.name = "name"
    name.value = userData.attributes.name
    submit.value = "Update Account Information"
    submit.type = "submit"

    updateUserForm.append(username, email, password, name, submit)
    $.main.append(updateUserForm)

    const $updateAccountInfoForm = document.querySelector('#update-account-information-form')
    $updateAccountInfoForm.addEventListener('submit', event => getUserData(event, userData))
    
}

function getUserData(event, userData) {
event.preventDefault()
const formData = new FormData(event.target)
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    let name = formData.get('name')
    name = name.toLowerCase()
    let user = { username, email, password, name }

    fetchCall( `${userURL}/${userData.id}`, "PUT", {user} )
    .then(response => response.json())
    .then(directToPage(event, `${accountURL}`))    
}
  
