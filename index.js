const queryParams = new URLSearchParams(window.location.search)

if (window.location.search == "") {
    createNavigationButton("SIGN UP", `${signUpURL}`)
    createNavigationButton("SIGN IN", `${signInURL}`)
    getClimbingRoutes()
}
else {
    getUser()
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
        .then(response => showUserLoggedIn(response))
}

function showUserLoggedIn(response) {
    const user = response.data
    createNavigationButton("ACCOUNT", `${accountURL}`)
    createNavigationButton("SIGN OUT", `${frontEndURL}`)
    createNavigationButton("Find Belay Partners", `${partnerURL}`)
    const name = document.createElement('h4')
    const title = titleCase(user.attributes.name)
    name.textContent = `Logged in as ${title}`
    $.header.append(name)
    
    getClimbingRoutes(user) 
}

function getClimbingRoutes(user) {
    fetch(`${climbingRouteURL}`)
        .then(resp => resp.json())
        .then(response => renderClimbingRoutes(response, user))
}

function renderClimbingRoutes(response, user) {
    response.data.forEach(route => {
        createCard(route, user)
    })
    showUserLikes(user)
}

function createCard(route, user) {
    
    const container = document.querySelector('.container')
    const routeCard = document.createElement('div')
    const title = document.createElement('h2')
    const style = document.createElement('p')
    const difficulty = document.createElement('p')
    const pitches = document.createElement('p')
    const location = document.createElement('p')
    const url = document.createElement('img')
    const id = document.createElement('input')
   
    routeCard.classList.add('route-card')
    routeCard.id = route.id
    title.textContent = route.attributes.name
    style.textContent = `Style: ${route.attributes.style}`
    difficulty.textContent = `Difficulty ${route.attributes.difficulty}`
    pitches.textContent = `Pitches: ${route.attributes.pitches}`
    location.textContent = `Location: ${route.attributes.location}`
    url.src = route.attributes.url
    url.alt = "Route Image"
    url.classList.add('img')
    


    routeCard.append(title, url, style, difficulty, pitches, location)
    
    if (window.location.search == "?status=%22signed-in%22") {
        const $likeButton = document.createElement('button')
        $likeButton.classList.add('like-button')
        $likeButton.textContent = '🖤'
        $likeButton.id = `like-${route.id}`
        routeCard.append($likeButton)
        $likeButton.addEventListener('click', event => handleLikeButtonClick(event, route, user))
    }
    
    container.appendChild(routeCard)
}
         

function handleLikeButtonClick(event, route, user) {
        event.preventDefault()
        const $likeButton = document.querySelectorAll('.like-button')
        $likeButton.forEach(button => {
            if (event.target == button && button.textContent == "🖤") {
                button.textContent = "❤️"
                addToFavoriteRoutes(route, user)
            }
            else if (event.target == button) {
                button.textContent = '🖤'
                deleteFromFavorites(route, user)
            }
        })
    }

function addToFavoriteRoutes(route, user) {
        const user_id = user.id
        const climbing_route_id = route.id
        const favorite_route = { user_id, climbing_route_id, }
    
        fetchCall(`${favoriteRouteURL}`, "POST", { favorite_route })
}

function deleteFromFavorites(route, user) {
    const favoriteRoutes = user.attributes.favorite_routes
    favoriteRoutes.forEach(favoriteRoute => {
        if (favoriteRoute.climbing_route_id == route.id && favoriteRoute.user_id == user.id) {
            fetch(`${favoriteRouteURL}/${favoriteRoute.id}`, {
                method: "DELETE",
                headers: {
                    "Accept": "application/json",
                    "Content-type": "application/json",
                    "Authorization": `Bearer ${window.localStorage.token}`
                }
            })    
        }   
    })
}

function showUserLikes(user) {
    const routeCards = document.querySelectorAll('.route-card')
    let favoriteRoutes = user.attributes.favorite_routes
    
    routeCards.forEach(routeCard => {
        const $likeButton = document.querySelector(`#like-${routeCard.id}`)
        favoriteRoutes.forEach(favoriteRoute => {
            if (routeCard.id == favoriteRoute.climbing_route_id) {
                $likeButton.textContent = "❤️"
            } else {
            }
        })
       
    })
}

//get a button to show climbers near you if sign in

//add filter feature for routes 

