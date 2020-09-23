const queryParams = new URLSearchParams(window.location.search)
const user_id = queryParams.get("user_id")

fetch(`${userURL}/${user_id}`)
    .then(resp => resp.json())
    .then(user => createUpdateForm(user))
    createNavigationButton("ACCOUNT", `${accountURL}?user_id=${user_id}`)
    createNavigationButton("SIGN OUT", `${frontEndURL}`)

function createUpdateForm(user) {
    console.log(user)
    const updateUserForm = document.createElement('form')
    const username = document.createElement('input')
    const email = document.createElement('input')
    const password = document.createElement('input')
    const name = document.createElement('input')
    const submit = document.createElement('input')
        
    updateUserForm.classList.add('user-form')
    updateUserForm.id = "update-account-information-form"

    username.name = "username"
    username.value = user.username
    email.name = "email"
    email.value = user.email
    password.name = "password"
    password.type = "password"
    password.placeholder = "Password is required to update account information"
    name.name = "name"
    name.value = user.name
    submit.value = "Update Account Information"
    submit.type = "submit"

    updateUserForm.append(username, email, password, name, submit)
    $.main.append(updateUserForm)

    const $updateAccountInfoForm = document.querySelector('#update-account-information-form')
    $updateAccountInfoForm.addEventListener('submit', getUserData)
    
}
 
function getUserData(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    let name = formData.get('name')
    name = name.toLowerCase()
    user = { username, email, password, name }

    fetchCall( `${userURL}/${user_id}`, "PUT", {user} )
    .then(response => response.json())
    .then(user => directToPage(event, `${accountURL}?user_id=${user.id}`))    
}

  
