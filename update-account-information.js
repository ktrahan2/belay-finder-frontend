fetchCall(`${profileURL}`, "GET")
    .then(response => response.json())
    .then(response => showPage(response))
    
createNavigationButton("ACCOUNT", `${accountURL}`)

function showPage(response) {
    createDeleteAccountButton(response)
    createUpdateForm(response)
}
function createDeleteAccountButton(response) {
    const user = response.data
    const deleteAccountButton = document.createElement('button')
    deleteAccountButton.classList.add('delete-button')
    deleteAccountButton.textContent = "Delete Account"

    $.main.append(deleteAccountButton)

    deleteAccountButton.addEventListener('click', event => handleDeleteAccount(event, user))
}

function handleDeleteAccount(event, user) {
    event.preventDefault()
    if (confirm('Are you sure you want to DELETE your account?')) {
        fetchCall(`${userURL}/${user.id}`, "DELETE")
            .then(resp => resp.json())
            .then(directToPage(event, `${frontEndURL}`))
    } 
}

function createUpdateForm(response) {
    const userInfo = response.data
    const updateUserForm = document.createElement('form')
    const username = document.createElement('input')
    const email = document.createElement('input')
    const password = document.createElement('input')
    const name = document.createElement('input')
    const submit = document.createElement('input')
        
    updateUserForm.classList.add('user-form')
    updateUserForm.id = "update-account-information-form"

    username.name = "username"
    username.value = userInfo.attributes.username
    email.name = "email"
    email.value = userInfo.attributes.email
    password.name = "password"
    password.type = "password"
    password.placeholder = "Password is required to update account information"
    name.name = "name"
    name.value = userInfo.attributes.name
    submit.value = "Update Account Information"
    submit.type = "submit"
    submit.classList.add('button')

    updateUserForm.append(username, email, name, password, submit)
    $.main.append(updateUserForm)

    const $updateAccountInfoForm = document.querySelector('#update-account-information-form')
    $updateAccountInfoForm.addEventListener('submit', event => getUserData(event, userInfo))  
}

function getUserData(event, userInfo) {
    event.preventDefault()
    const formData = new FormData(event.target)
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    let name = formData.get('name')
    name = name.toLowerCase()
    let user = { username, email, password, name }

    fetchCall( `${userURL}/${userInfo.id}`, "PATCH", { user } )
    .then(response => response.json())
    .then(directToPage(event, `${accountURL}`))    
}
  
