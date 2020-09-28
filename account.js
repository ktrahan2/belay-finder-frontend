fetchCall(`${baseURL}/profile`, "GET")
    .then(response => response.json())
    .then(response => createUserProfile(response))

function createUserProfile(response) {
    const user = response.data
    createNavigationButton("HOME", `${frontEndURL}?status="signed-in"`)
    createNavigationButton("Find Belay Partners", `${partnerURL}`)
    createNavigationButton("Update Account", `${updateAccountInfoURL}`)
    createNavigationButton("Update Profile", `${updateProfileInfoURL}`)
    createNavigationButton("SIGN OUT", `${frontEndURL}`)
    const title = document.createElement('h2')
    let userName = titleCase(user.attributes.name)
    title.textContent = `Welcome, ${userName}`

    $.main.prepend(title )
    createChangeStatusButton(user)
    getClimbingRoutes(user)
}

function createChangeStatusButton(user) {
    const userInfo = user
    const statusUpdateForm = document.createElement('form')
    const dropDown = document.createElement('select')
    const submitButton = document.createElement('input')

    dropDown.id = ('belay-status')
    dropDown.name = ('belay_status')
    submitButton.type = "submit"
    submitButton.value = "Update Belayability"

    statusUpdateForm.append(dropDown, submitButton)
    $.main.append(statusUpdateForm)
    createDropDownOptions(availabilityArray, '#belay-status')
    for (let i = 0; i < dropDown.children.length; i++)
        if (dropDown[i].textContent == userInfo.attributes.belay_status ) {
           dropDown[i].selected = true
        }
    statusUpdateForm.addEventListener('submit', event => handleUserStatusUpdate(event, userInfo))
}

function handleUserStatusUpdate(event, userInfo) {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    let belay_status = formData.get('belay_status')
    
    const user = { belay_status }
    fetchCall(`${userURL}/${userInfo.id}`, "PATCH", { user } )
        .then(resp => resp.json())
        .then(console.log)
}

function getClimbingRoutes(user) {
    fetchCall(`${climbingRouteURL}`, "GET")
        .then(response => response.json())
        .then(climbingRoutes => createFavoriteRoutes(user, climbingRoutes))
}

function createFavoriteRoutes(user, climbingRoutes) {
    const favoriteRoutes = user.attributes.favorite_routes
    favoriteRoutes.forEach(favoriteRoute => {
        console.log(favoriteRoute)
        climbingRoutes.data.forEach(climbingRoute => {
            if (climbingRoute.id == favoriteRoute.climbing_route_id) {
                const route = climbingRoute.attributes
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
                routeCard.id = `route-${climbingRoute.id}`
                title.textContent = route.name
                style.textContent = `Style: ${route.style}`
                difficulty.textContent = `Difficulty ${route.difficulty}`
                pitches.textContent = `Pitches: ${route.pitches}`
                location.textContent = `Location: ${route.location}`
                url.src = route.url
                url.alt = "Route Image"
                url.classList.add('img')
                
                const deleteButton = document.createElement('button')
                deleteButton.textContent = "Delete Favorite"
                deleteButton.id = 'delete-button'
                
                routeCard.append(title, url, style, difficulty, pitches, location, deleteButton)
                container.appendChild(routeCard)
        
                deleteButton.addEventListener('click', event => handleDeleteFavorite(event, user, climbingRoute.id))
            }
        })
    })
}

function handleDeleteFavorite(event, user, id) {
    event.preventDefault()
    const routeCard = document.querySelector(`#route-${id}`)
    routeCard.style.display = 'none'
    deleteFromFavorites(user, id)
}
//can refactor with index delete favorite
function deleteFromFavorites(user, id) {
    const favoriteRoutes = user.attributes.favorite_routes
    favoriteRoutes.forEach(favoriteRoute => {
        console.log(favoriteRoute)
        if (favoriteRoute.climbing_route_id == id && favoriteRoute.user_id == user.id) {
            fetchCall(`${favoriteRouteURL}/${favoriteRoute.id}`, "DELETE")
        }
    })
}