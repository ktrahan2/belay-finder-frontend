const queryParams = new URLSearchParams(window.location.search)
const user_id = queryParams.get("user_id")

const updateAccountInfoButton = document.querySelector('#update-account-information-button')
const updateProfileInfoButton = document.querySelector('#update-profile-information-button')

updateAccountInfoButton.addEventListener('click', event => directToPage(event, `${updateAccountInfoURL}?user_id=${user_id}`))
updateProfileInfoButton.addEventListener('click', event => directToPage(event, `${updateProfileInfoURL}?user_id=${user_id}`))

fetch(`${userURL}/${user_id}`)
    .then(response => response.json())
    .then(user => createUserProfile(user))
        
function createUserProfile(user) {
    createNavigationButton("HOME", `${frontEndURL}?user_id=${user_id}`)
    createNavigationButton("SIGN OUT", `${frontEndURL}`)
    const title = document.createElement('h2')
    console.log(user)
    let userName = titleCase(user.name)
    title.textContent = `Welcome, ${userName}`
    $.main.prepend(title)
}


