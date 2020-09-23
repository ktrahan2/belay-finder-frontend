const queryParams = new URLSearchParams(window.location.search)
const user_id = queryParams.get("user_id")

if (window.location.search == "") {
    createNavigationButton("SIGN UP", `${signUpURL}`)
    createNavigationButton("SIGN IN", `${signInURL}`)
}
else {
    fetch(`${userURL}/${user_id}`)
        .then(response => response.json())
        .then(user => showUserLoggedIn(user))
}

function showUserLoggedIn(user) {
    createNavigationButton("ACCOUNT", `${accountURL}?user_id=${user_id}`)
    createNavigationButton("SIGN OUT", `${frontEndURL}`)
    
    const name = document.createElement('h4')
    const title = titleCase(user.name)
    name.textContent = `Logged in as ${title}`

    $.header.append(name)
}

//show all routes, add search filter, fetch climbing routes
//get a button to show climbers near you if sign in


