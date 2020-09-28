fetchCall(`${baseURL}/profile`, "GET")
    .then(response => response.json())
    .then(user => {
        createUserProfile(user)
        renderBelayRequest(user)
        renderFavoriteRoutes(user)
    })
        
function renderBelayRequest(user) {
    const userReceiverIds = user.data.attributes.partnerships_as_receiver
    const userRequestorIds =user.data.attributes.partnerships_as_requestor 
    let requestorFetches = userRequestorIds.map(request => fetchCall(`${userURL}/${request.receiver_id}`, "GET"))
    let receiverFetches = userReceiverIds.map(request => fetchCall(`${userURL}/${request.requestor_id}`, "GET"))
    let fetches = requestorFetches.concat(receiverFetches)
    return Promise.all(fetches)
        .then(responses => responses.map(response => {
            let promises = response.json()
            return promises
            })).then(promises => {
                    promises.forEach(promise => {
                    promise.then(requestor => createBelayRequestCard(user, requestor))
                })
            })
}
 

function renderFavoriteRoutes(user) {
    const favoriteRoutes = user.data.attributes.favorite_routes
    const fetches = favoriteRoutes.map(route => fetchCall(`${climbingRouteURL}/${route.climbing_route_id}`))
    return Promise.all(fetches)
        .then(responses => responses.map(response => {
            let promises = response.json()
            return promises
        })).then(promises => {
                promises.forEach(promise => {
                promise.then(climbing_routes => createFavoriteRoutes(user, climbing_routes))
            })
        })
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
    $.main.prepend(statusUpdateForm)
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
}

function createFavoriteRoutes(user, climbing_routes) {
    console.log(climbing_routes)
    const favoriteRoute = climbing_routes.data
    console.log(favoriteRoute)
    const route = favoriteRoute.attributes
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
    routeCard.id = `route-${favoriteRoute.id}`
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
    routeCardContainer.append(routeCard)
    deleteButton.addEventListener('click', event => handleDeleteFavorite(event, user, favoriteRoute.id))
}

function handleDeleteFavorite(event, user, id) {
    event.preventDefault()
    const routeCard = document.querySelector(`#route-${id}`)
    routeCard.style.display = 'none'
    deleteFromFavorites(user, id)
}

//can refactor with index delete favorite
function deleteFromFavorites(user, id) {
    const favoriteRoutes = user.data.attributes.favorite_routes
    favoriteRoutes.forEach(favoriteRoute => {
        if (favoriteRoute.climbing_route_id == id && favoriteRoute.user_id == user.data.id) {
            fetchCall(`${favoriteRouteURL}/${favoriteRoute.id}`, "DELETE")
        }
    })
}

function createBelayRequestCard(user, requestor) {
    let belayer = requestor.data
    const currentBelayPartners = document.querySelector('.belay-partners')
    const pendingBelayRequest = document.querySelector('.pending-belay-request')
    const belayerCard = document.createElement('div')
    
    belayerCard.classList.add('belayer-card')
    belayerCard.classList.add()
    belayerCard.id = `belayer-${belayer.id}`
    
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

    const belayStatusDiv = document.createElement('div')
    belayStatusDiv.classList.add('profile-div')
    const belayStatusLabel = document.createElement('p')
    belayStatusLabel.textContent = "Status:"
    const belayStatus = document.createElement('p')
    belayStatus.textContent = titleCase(belayer.attributes.belay_status)
    belayStatusDiv.append(belayStatusLabel, belayStatus)

    //can refactor so both times we compare the user instead of the requestor to cut down on code
    const requestorPendingRequests = requestor.data.attributes.partnerships_as_requestor
    requestorPendingRequests.forEach(request => {
        if (request.receiver_id == user.data.id && request.partnership_status == "pending") {
            const acceptRequestButton = document.createElement('button')
            acceptRequestButton.id = `friend-${belayer.id}`
            acceptRequestButton.classList.add('accept-button')
            acceptRequestButton.textContent = "Accept Request"
            belayerCard.append(belayStatusDiv, usernameDiv, nameDiv, emailDiv, aboutmeDiv, styleDiv, skillDiv, locationDiv, acceptRequestButton)
            pendingBelayRequest.append(belayerCard)
            const currentUser = user.data
            acceptRequestButton.addEventListener('click', event => handleAcceptRequestbutton(event, currentUser, belayer))
        } else {
            belayerCard.append(belayStatusDiv, usernameDiv, nameDiv, emailDiv, aboutmeDiv, styleDiv, skillDiv, locationDiv)
            currentBelayPartners.append(belayerCard)
        }
    })  
    const receieverPendingAcceptedRequests = user.data.attributes.partnerships_as_requestor
    
    receieverPendingAcceptedRequests.forEach(request => {
        if (request.requestor_id == user.data.id && request.partnership_status == "accepted") {
            belayerCard.append(belayStatusDiv, usernameDiv, nameDiv, emailDiv, aboutmeDiv, styleDiv, skillDiv, locationDiv)
            currentBelayPartners.append(belayerCard)
        } 
    })
}

function handleAcceptRequestbutton(event, currentUser, belayer) {
    event.preventDefault()
    const belayerCard = document.querySelector(`#belayer-${belayer.id}`)
    belayerCard.style.display = "none"
    const userRequests = currentUser.attributes.partnerships_as_receiver
    userRequests.forEach(request => {
        const requestor_id = belayer.id
        const receiver_id = currentUser.id
        const partnership_status = "accepted"
        const partnership = { requestor_id, receiver_id, partnership_status }
        if (belayer.id == request.requestor_id) {
            fetchCall(`${partnershipURL}/${request.id}`, "PATCH", { partnership })
        }
    })
}