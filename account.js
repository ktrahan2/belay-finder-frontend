const queryParams = new URLSearchParams(window.location.search)
const user_id = queryParams.get("user_id")

const updateAccountInfoButton = document.querySelector('#update-account-information-button')
const updateProfileInfoButton = document.querySelector('#update-profile-information-button')

updateAccountInfoButton.addEventListener('click', event => directToPage(event, `${updateAccountInfoURL}`))
updateProfileInfoButton.addEventListener('click', event => directToPage(event, `${updateProfileInfoURL}`))

fetch(`${baseURL}/profile`, {
    method: "GET",
    headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": `Bearer ${window.localStorage.token}`
    }
    })
    .then(response => response.json())
    .then(user => createUserProfile(user))
  
function createUserProfile(user) {
    createNavigationButton("HOME", `${frontEndURL}?status="signed-in"`)
    createNavigationButton("SIGN OUT", `${frontEndURL}`)
    const title = document.createElement('h2')
    let userName = titleCase(user.name)
    title.textContent = `Welcome, ${userName}`
    $.main.prepend(title)
    console.log(user)
}


