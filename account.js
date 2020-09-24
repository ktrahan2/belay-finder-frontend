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
    .then(response => createUserProfile(response))
  
function createUserProfile(response) {
    const user = response.data
    createNavigationButton("HOME", `${frontEndURL}?status="signed-in"`)
    createNavigationButton("Find Belay Partners", `${partnerURL}`)
    createNavigationButton("SIGN OUT", `${frontEndURL}`)
    const title = document.createElement('h2')
    let userName = titleCase(user.attributes.name)
    title.textContent = `Welcome, ${userName}`
    $.main.prepend(title)
    console.log(user)
}


