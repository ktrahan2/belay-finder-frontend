const queryParams = new URLSearchParams(window.location.search)
const user_id = queryParams.get("user_id")
const updateProfileButton = document.querySelector('#update-profile-button')

updateProfileButton.addEventListener('click', event => directToPage(event, `${updateProfileURL}?user_id=${user_id}`))

fetch(`${userURL}/${user_id}`)
    .then(response => response.json())
    .then(user => createUserProfile(user))
        
function createUserProfile(user) {
    const title = document.createElement('h2')
    console.log(user)
    let userName = titleCase(user.name)
    title.textContent = `Welcome, ${userName}`
    $.main.prepend(title)
}



// window.location.replace(`${frontEndURL}/profile.html?user_id=${user.id}`)

//I want to add a function to see your favorite_climbing_routes maybe just displays them
//function to see all friends/pending request
//update your profile aboutme, what gear you own
//have a link to all the climbing routes near boulder