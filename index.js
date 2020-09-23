const queryParams = new URLSearchParams(window.location.search)
const user_id = queryParams.get("user_id")

if (window.location.search == "") {
    createNavigationButton("SIGN UP", `${signUpURL}`)
    createNavigationButton("SIGN IN", `${signInURL}`)
    getClimbingRoutes()
}
else {
    getUser()
    getClimbingRoutes()
}

function getUser() {
    fetch(`${baseURL}/profile`, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Content-type": "application/json",
            "Authorization": `Bearer ${window.localStorage.token}`
        }
        })
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

function getClimbingRoutes() {
    fetch(`${climbingRouteURL}`)
        .then(resp => resp.json())
        .then(response => renderClimbingRoute(response))
        
}

function renderClimbingRoute(response) {
    response.data.forEach(route => {
        createCard(route)
    })
}

function createCard(route) {
    const routeCard = document.createElement('div')
    const title = document.createElement('h2')
    const style = document.createElement('p')
    const difficulty = document.createElement('p')
    const pitches = document.createElement('p')
    const location = document.createElement('p')
    const url = document.createElement('img')

    title.textContent = route.attributes.name
    style.textContent = route.attributes.style
    difficulty.textContent = route.attributes.difficulty
    pitches.textContent = route.attributes.pitches
    location.textContent = route.attributes.location
    url.src = route.attributes.url
    url.alt = "Route Image"

    routeCard.append(title, style, difficulty, pitches, location, url)
    $.main.append(routeCard)
}
//show all routes, add search filter, fetch climbing routes
//get a button to show climbers near you if sign in


