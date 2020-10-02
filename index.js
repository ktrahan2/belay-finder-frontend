if (window.location.search == "") {
    createNavigationButton("Sign Up", `${signUpURL}`)
    createNavigationButton("Sign In", `${signInURL}`)
    const userLogin = document.createElement('div')
    const signin = document.querySelector('#Sign-In-button')
    const signup = document.querySelector('#Sign-Up-button')
    userLogin.append(signin, signup)
    userLogin.classList.add('user-login')
    $.header.prepend(userLogin)
    getClimbingRoutes()
}
else {
    getUser()
}

function getUser() {
    fetchCall(`${baseURL}/profile`, "GET")
        .then(response => response.json())
        .then(response => showUserLoggedIn(response))
}

function showUserLoggedIn(response) {
    const user = response.data
    createNavigationButton("Sign Out", `${frontEndURL}`)
    createNavigationButton("Find Belay Partners", `${partnerURL}`)
    createNavigationButton("Account", `${accountURL}`)
    const name = document.createElement('h4')
    const div1 = document.createElement('div')
    const div2 = document.createElement('div')
    const signout = document.querySelector('#Sign-Out-button')
    const findbelay = document.querySelector('#Find-Belay-button')
    const account = document.querySelector('#Account-undefined-button')
    const title = titleCase(user.attributes.name)
    name.textContent = `Logged in as ${title}`
    div1.classList.add('navigation')
    div2.classList.add('account-management')
    div1.append(  account, findbelay)
    div2.append( name, signout )
    $.header.prepend( div1 )
    $.header.append( div2 )
    
    getClimbingRoutes(user) 
}

function getClimbingRoutes(user) {
    fetch(`${climbingRouteURL}`)
        .then(resp => resp.json())
        .then(response => renderClimbingRoutes(response, user))
}

function renderClimbingRoutes(response, user) {
    response.data.forEach(route => {
        createRouteCard(route, user)
    })
    showUserLikes(user)
}

function createRouteCard(route, user) {
    
    const container = document.querySelector('.container')
    const routeCard = document.createElement('div')
    const title = document.createElement('h2')
    const style = document.createElement('p')
    const difficulty = document.createElement('p')
    const pitches = document.createElement('p')
    const location = document.createElement('p')
    const url = document.createElement('img')
    const dataSection = document.createElement('section')
    const header = document.createElement('div')
   
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
    dataSection.classList.add('data-section')
    dataSection.append(style, difficulty, pitches, location)
    header.classList.add('card-header')
    header.append(title)
    
    routeCard.append(header, url, dataSection)
    
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
            fetchCall(`${favoriteRouteURL}/${favoriteRoute.id}`, "DELETE")
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

//add filter feature for routes

