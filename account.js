fetchCall(`${baseURL}/profile`, "GET")
    .then(response => response.json())
    .then(user => {
        createUserProfile(user)
        renderBelayRequest(user)
        renderFavoriteRoutes(user)
    })
        
function renderBelayRequest(user) {
    const userRequestIds = user.data.attributes.partnerships_as_receiver
    const fetches = userRequestIds.map(request => fetchCall(`${userURL}/${request.requestor_id}`, "GET"))
    return Promise.all(fetches)
        .then(responses => responses.map(response => {
            let promises = response.json()
            return promises
            })).then(promises => {
                promises.forEach(promise => {
                    promise.then(requestor => createBelayPartnerRequestCard(requestor))
                })
            })
}    

function renderFavoriteRoutes(user) {
    console.log(user)
    const favoriteRoutes = user.data.attributes.favorite_routes
    const userFavoriteRouteId = favoriteRoutes.map(route => {
        return route.climbing_route_id
    })
    console.log(userFavoriteRouteId)
}
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
//possible refactor with index createRouteCard
function createFavoriteRoutes(user, climbingRoutes) {
    const favoriteRoutes = user.attributes.favorite_routes
    favoriteRoutes.forEach(favoriteRoute => {
        climbingRoutes.data.forEach(climbingRoute => {
            if (climbingRoute.id == favoriteRoute.climbing_route_id) {
                const route = climbingRoute.attributes
                const routeCardContainer = document.querySelector('.route-card-container')
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
                routeCardContainer.appendChild(routeCard)
        
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
        if (favoriteRoute.climbing_route_id == id && favoriteRoute.user_id == user.id) {
            fetchCall(`${favoriteRouteURL}/${favoriteRoute.id}`, "DELETE")
        }
    })
}

function createBelayPartnerRequestCard(requestor) {
    let belayer = requestor.data
   
    const pendingBelayRequest = document.querySelector('.pending-belay-request')
    const belayerCard = document.createElement('div')
    
    const usernameDiv = document.createElement('div')
    usernameDiv.classList.add("profile-div")
    const username = document.createElement('p')
    const usernameLabel = document.createElement("p")
    usernameLabel.textContent = "Username:"
    username.textContent = belayer.attributes.username
    usernameDiv.append(usernameLabel, username)

    const nameDiv = document.createElement('div')
    nameDiv.classList.add('profile-div')
    const nameLabel = document.createElement('p')
    nameLabel.textContent = "Name:"
    const name = document.createElement('p')
    name.textContent = titleCase(belayer.attributes.name)
    nameDiv.append(nameLabel, name)

    const emailDiv = document.createElement('div')
    emailDiv.classList.add('profile-div')
    const emailLabel = document.createElement('p')
    emailLabel.textContent = "Email:"
    const email = document.createElement('p')
    email.textContent = belayer.attributes.email
    emailDiv.append(emailLabel, email)

    const aboutmeDiv = document.createElement('div')
    aboutmeDiv.classList.add('profile-div')
    const aboutmeLabel = document.createElement('p')
    aboutmeLabel.textContent = "About Me:"
    const aboutme = document.createElement('p')
    aboutme.textContent = belayer.attributes.aboutme
    aboutmeDiv.append(aboutmeLabel, aboutme)
    
    const styleDiv = document.createElement('div')
    styleDiv.classList.add('profile-div')
    const styleLabel = document.createElement('p')
    styleLabel.textContent = "Preferred Climbing Style:"
    const climbing_style = document.createElement('p')
    climbing_style.textContent = belayer.attributes.climbing_style
    styleDiv.append(styleLabel, climbing_style)
    
    const skillDiv = document.createElement('div')
    skillDiv.classList.add('profile-div')
    const skillLabel = document.createElement('p')
    skillLabel.textContent = "Skill Level:"
    const climbing_skill = document.createElement('p')
    climbing_skill.textContent = belayer.attributes.climbing_skill
    skillDiv.append(skillLabel, climbing_skill)

    const locationDiv = document.createElement('div')
    locationDiv.classList.add('profile-div')
    const locationLabel = document.createElement('p')
    locationLabel.textContent = "Location:"    
    const location = document.createElement('p')
    location.textContent = belayer.attributes.location
    locationDiv.append(locationLabel, location)

    belayerCard.classList.add('belayer-card')
    belayerCard.id = belayer.attributes.id

    const belayStatusDiv = document.createElement('div')
    belayStatusDiv.classList.add('profile-div')
    const belayStatusLabel = document.createElement('p')
    belayStatusLabel.textContent = "Status:"
    const belayStatus = document.createElement('p')
    belayStatus.textContent = titleCase(belayer.attributes.belay_status)
    belayStatusDiv.append(belayStatusLabel, belayStatus)
     
    const addFriendButton = document.createElement('button')
    addFriendButton.id = `friend-${belayer.attributes.id}`
    addFriendButton.classList.add('friend-button')
    addFriendButton.textContent = "Send Belay Request"

    //create an accept button

    belayerCard.append(belayStatusDiv, usernameDiv, nameDiv, emailDiv, aboutmeDiv, styleDiv, skillDiv, locationDiv)
    pendingBelayRequest.append(belayerCard)
}

