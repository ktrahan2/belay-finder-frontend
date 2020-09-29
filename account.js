fetchCall(`${profileURL}`, "GET")
    .then(response => response.json())
    .then(user => {
        createUserProfile(user)
        getAcceptedUserPartnerships(user)
        renderBelayRequest(user)
        renderFavoriteRoutes(user)
    })

function createUserProfile(response) {
    const user = response.data
    createNavigationButton("Home", `${frontEndURL}?status="signed-in"`)
    createNavigationButton("Find Belay Partners", `${partnerURL}`)
    createNavigationButton("Update Account", `${updateAccountInfoURL}`)
    createNavigationButton("Update Profile", `${updateProfileInfoURL}`)
    createNavigationButton("Sign Out", `${frontEndURL}`)
    const title = document.createElement('h2')
    let userName = titleCase(user.attributes.name)
    title.textContent = `Welcome, ${userName}`
    createChangeStatusButton(user)
    $.main.prepend( title )
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

function getAcceptedUserPartnerships(user) {
    const userAsReceiver = user.data.attributes.partnerships_as_receiver
    const userAsRequestor = user.data.attributes.partnerships_as_requestor 
    let userPartnerships = userAsRequestor.concat(userAsReceiver)
    userPartnerships.map(partnership => {
        const partnershipStatus = partnership.partnership_status
        if (partnershipStatus == "accepted") {
            let userPartnership = partnership
            getBelayPartner(user, userPartnership)   
        }
    })
}

function getBelayPartner(user, userPartnership) {
    const userId = user.data.id
    const requestorId = userPartnership.requestor_id
    const receiverId = userPartnership.receiver_id
    let belayPartnersId = " "
    if (requestorId == userId) {
        belayPartnersId = userPartnership.receiver_id
    } else if (receiverId == userId) {
        belayPartnersId = userPartnership.requestor_id
    }
    renderBelayPartner(user, belayPartnersId)
}

function renderBelayPartner(user, belayPartnersId) {
    fetchCall(`${userURL}/${belayPartnersId}`, "GET")
        .then(resp => resp.json())
        .then(belayPartner => {
            let belayerCard = createBelayerCard(belayPartner)
            appendTo(belayerCard, '.belay-partners')
            createDeleteButton(user, belayerCard, belayPartnersId)
        })
}

function createDeleteButton(user, belayerCard, belayPartnersId) {
    const deleteButton = document.createElement('button')
    deleteButton.id = `${belayerCard.id}`
    deleteButton.classList.add('belayer-button', 'button')
    deleteButton.textContent = "Remove Partner"

    deleteButton.addEventListener('click', event => handleDeletePartnerButton(event, user, belayPartnersId))

    belayerCard.append(deleteButton)
}

function handleDeletePartnerButton(event, user, belayPartnersId) {
    event.preventDefault()
    const userId = user.data.id
    const belayerCard = document.querySelector(`#belayer-${belayPartnersId}`)
    belayerCard.style.display = 'none'
    const userAsReceiver = user.data.attributes.partnerships_as_receiver
    const userAsRequestor = user.data.attributes.partnerships_as_requestor 
    let userPartnerships = userAsRequestor.concat(userAsReceiver)
    userPartnerships.forEach(partnership => {
        if (userId == partnership.requestor_id && belayPartnersId == partnership.receiver_id || userId == partnership.receiver_id && belayPartnersId == partnership.requestor_id) {
            fetchCall(`${partnershipURL}/${partnership.id}`, "DELETE")
        }
    })
}

function renderBelayRequest(user) {
    const userAsReceiver = user.data.attributes.partnerships_as_receiver
    let fetches = userAsReceiver.map(request => fetchCall(`${userURL}/${request.requestor_id}`, "GET")) 
    return Promise.all(fetches)
        .then(responses => responses.map(response => {
            let promises = response.json()
            return promises
        })).then(promises => {
            promises.forEach(promise => {
                promise.then(requestor => {
                    const requestorRequest = requestor.data.attributes.partnerships_as_requestor
                    requestorRequest.forEach(request => {
                        if (request.receiver_id == user.data.id && request.partnership_status == "pending") {
                            let belayerCard = createBelayerCard(requestor)  
                            appendTo(belayerCard, '.pending-belay-request')
                            createAcceptRequestButton(user, requestor)
                        } 
                    })
                })
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

function createFavoriteRoutes(user, climbing_routes) {
    const favoriteRoute = climbing_routes.data
    const route = favoriteRoute.attributes
    const routeCardContainer = document.querySelector('.route-card-container')
    const routeCard = document.createElement('div')
    const title = document.createElement('h2')
    const style = document.createElement('p')
    const difficulty = document.createElement('p')
    const pitches = document.createElement('p')
    const location = document.createElement('p')
    const url = document.createElement('img')
            
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

function deleteFromFavorites(user, id) {
    const favoriteRoutes = user.data.attributes.favorite_routes
    favoriteRoutes.forEach(favoriteRoute => {
        if (favoriteRoute.climbing_route_id == id && favoriteRoute.user_id == user.data.id) {
            fetchCall(`${favoriteRouteURL}/${favoriteRoute.id}`, "DELETE")
        }
    })
}

function createBelayerCard(requestor) {
    let belayer = requestor.data

    const belayerCard = document.createElement('div')
    
    belayerCard.classList.add('belayer-card')
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

    belayerCard.append(belayStatusDiv, usernameDiv, nameDiv, emailDiv, aboutmeDiv, styleDiv, skillDiv, locationDiv)
    return belayerCard
}

function appendTo(card, id) {
    const section = document.querySelector(`${id}`)
    section.append(card)
}

function createAcceptRequestButton(user, requestor) {
    const belayer = requestor.data
    const pendingBelayRequest = document.querySelector('.pending-belay-request')
    const pendingBelayerCard = pendingBelayRequest.querySelector(`#belayer-${requestor.data.id}`)
    const acceptRequestButton = document.createElement('button')
    
    acceptRequestButton.id = `friend-${belayer.id}`
    acceptRequestButton.classList.add('accept-button', 'button')
    acceptRequestButton.textContent = "Accept Request"

    pendingBelayerCard.append(acceptRequestButton)
    
    acceptRequestButton.addEventListener('click', event => handleAcceptRequestbutton(event, user, belayer)) 
}

function handleAcceptRequestbutton(event, user, belayer) {
    event.preventDefault()
    const belayerId = belayer.id
    const belayerCard = document.querySelector(`#belayer-${belayer.id}`)
    const pendingBelayRequest = document.querySelector('.pending-belay-request')
    pendingBelayRequest.removeChild(belayerCard)
    appendTo(belayerCard, '.belay-partners')
    const button = document.querySelector(`#${event.target.id}`)
    belayerCard.removeChild(button)
    createDeleteButton(user, belayerCard, belayerId)
    
    const currentUser = user.data
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

