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
    createNavigationButton("Sign Out", `${frontEndURL}`)
    createNavigationButton("Update Account", `${updateAccountInfoURL}`)
    createNavigationButton("Find Belay Partners", `${partnerURL}`)
    createNavigationButton("Home", `${frontEndURL}?status="signed-in"`)
    const navigation = document.querySelector('.navigation')
    const signOutButton = document.querySelector('#Sign-Out-button')
    const updateAccount = document.querySelector('#Update-Account-button')
    const home = document.querySelector('#Home-undefined-button')
    const findBelay = document.querySelector('#Find-Belay-button')
    const navigationDiv = document.createElement('div')
    navigationDiv.append(home, updateAccount, findBelay)
    const header = document.querySelector('#profile-header')
    const signOutArea = document.createElement('div')
    header.classList.add('card-header')
    const title = document.createElement('h2')
    let userName = titleCase(user.attributes.name)
    title.textContent = `Welcome, ${userName}`
    signOutArea.append(signOutButton)
    navigation.append(navigationDiv, signOutArea)
    header.prepend(title)
    createChangeStatusButton(user)
    renderUserProfile(user)
}

function renderUserProfile(user) {
    const emailDiv = document.createElement('div')
    emailDiv.classList.add('profile-div')
    const emailLabel = document.createElement('p')
    emailLabel.textContent = "Email:"
    emailLabel.classList.add('label')
    const email = document.createElement('p')
    email.textContent = user.attributes.email
    email.classList.add('text')
    emailDiv.append(emailLabel, email)

    const aboutmeDiv = document.createElement('div')
    aboutmeDiv.classList.add('profile-div')
    aboutmeDiv.id = "aboutme-div"
    const aboutmeLabel = document.createElement('p')
    aboutmeLabel.textContent = "About Me:"
    aboutmeLabel.id = 'aboutme-label'
    const aboutme = document.createElement('p')
    aboutme.id = 'aboutme-text'
    aboutme.textContent = user.attributes.aboutme
    aboutmeDiv.append(aboutmeLabel, aboutme)
    
    const styleDiv = document.createElement('div')
    styleDiv.classList.add('profile-div')
    const styleLabel = document.createElement('p')
    styleLabel.classList.add('label')
    styleLabel.textContent = "Preferred Climbing Style:"
    const climbing_style = document.createElement('p')
    climbing_style.classList.add('text')
    climbing_style.textContent = user.attributes.climbing_style
    styleDiv.append(styleLabel, climbing_style)
    
    const skillDiv = document.createElement('div')
    skillDiv.classList.add('profile-div')
    const skillLabel = document.createElement('p')
    skillLabel.textContent = "Skill Level:"
    skillLabel.classList.add('label')
    const climbing_skill = document.createElement('p')
    climbing_skill.classList.add('text')
    climbing_skill.textContent = user.attributes.climbing_skill
    skillDiv.append(skillLabel, climbing_skill)

    const locationDiv = document.createElement('div')
    locationDiv.classList.add('profile-div')
    const locationLabel = document.createElement('p')
    locationLabel.textContent = "Location:"    
    locationLabel.classList.add('label')
    const location = document.createElement('p')
    location.classList.add('text')
    location.textContent = user.attributes.location
    locationDiv.append(locationLabel, location)

    const userInfo = document.querySelector('#profile-information')
    userInfo.classList.add('belayer-info')

    userInfo.append(aboutmeDiv, styleDiv, skillDiv, locationDiv)
    createNavigationButton("Update Profile", `${updateProfileInfoURL}`)
    const updateProfile = document.querySelector('#Update-Profile-button')
    const updateProfileSection = document.querySelector('#update-profile-section')
    updateProfileSection.append(updateProfile)
}
    
function createChangeStatusButton(user) {
    const userInfo = user
    const statusUpdateForm = document.createElement('form')
    const dropDown = document.createElement('select')
    const submitButton = document.createElement('input')
    const header = document.querySelector('#profile-header')
    dropDown.id = ('belay-status')
    dropDown.name = ('belay_status')
    submitButton.type = "submit"
    submitButton.value = "Update Belayability"

    statusUpdateForm.append(dropDown, submitButton)
    header.append(statusUpdateForm)
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
    deleteButton.classList.add('delete-button', 'button')
    deleteButton.textContent = "Remove Partner"
    const buttonSection = document.createElement('section')
    buttonSection.classList.add('button-section')

    buttonSection.append(deleteButton)
    belayerCard.append(buttonSection)

    deleteButton.addEventListener('click', event => handleDeletePartnerButton(event, user, belayPartnersId))

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
    const title = document.createElement('h4')
    const style = document.createElement('p')
    const difficulty = document.createElement('p')
    const pitches = document.createElement('p')
    const location = document.createElement('p')
    const url = document.createElement('img')
    const header = document.createElement('div')
    const dataSection = document.createElement('section')

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
    dataSection.classList.add('data-section')
    dataSection.append(style, difficulty, pitches, location)
    header.classList.add('card-header')
    header.append(title)
                
    const deleteButton = document.createElement('button')
    deleteButton.textContent = "Delete Favorite"
    deleteButton.classList.add('delete-button')
    deleteButton.id = 'delete-button'
                
    routeCard.append(header, url, dataSection, deleteButton)
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
    
    const nameDiv = document.createElement('div')
    nameDiv.classList.add('profile-div')
    const name = document.createElement('p')
    name.style.fontSize = "20px"
    name.textContent = titleCase(belayer.attributes.name)
    nameDiv.append(name)

    const emailDiv = document.createElement('div')
    emailDiv.classList.add('profile-div')
    const emailLabel = document.createElement('p')
    emailLabel.textContent = "Email:"
    emailLabel.classList.add('label')
    const email = document.createElement('p')
    email.textContent = belayer.attributes.email
    email.classList.add('text')
    emailDiv.append(emailLabel, email)

    const aboutmeDiv = document.createElement('div')
    aboutmeDiv.classList.add('profile-div')
    aboutmeDiv.id = "aboutme-div"
    const aboutmeLabel = document.createElement('p')
    aboutmeLabel.textContent = "About Me:"
    aboutmeLabel.id = 'aboutme-label'
    const aboutme = document.createElement('p')
    aboutme.id = 'aboutme-text'
    aboutme.textContent = belayer.attributes.aboutme
    aboutmeDiv.append(aboutmeLabel, aboutme)
    
    const styleDiv = document.createElement('div')
    styleDiv.classList.add('profile-div')
    const styleLabel = document.createElement('p')
    styleLabel.classList.add('label')
    styleLabel.textContent = "Preferred Climbing Style:"
    const climbing_style = document.createElement('p')
    climbing_style.classList.add('text')
    climbing_style.textContent = belayer.attributes.climbing_style
    styleDiv.append(styleLabel, climbing_style)
    
    const skillDiv = document.createElement('div')
    skillDiv.classList.add('profile-div')
    const skillLabel = document.createElement('p')
    skillLabel.textContent = "Skill Level:"
    skillLabel.classList.add('label')
    const climbing_skill = document.createElement('p')
    climbing_skill.classList.add('text')
    climbing_skill.textContent = belayer.attributes.climbing_skill
    skillDiv.append(skillLabel, climbing_skill)

    const locationDiv = document.createElement('div')
    locationDiv.classList.add('profile-div')
    const locationLabel = document.createElement('p')
    locationLabel.textContent = "Location:"    
    locationLabel.classList.add('label')
    const location = document.createElement('p')
    location.classList.add('text')
    location.textContent = belayer.attributes.location
    locationDiv.append(locationLabel, location)

    const belayStatus = document.createElement('p')
    belayStatus.textContent = titleCase(belayer.attributes.belay_status)

    const header = document.createElement('div')
    header.classList.add('belay-card-header')
    header.append(name, belayStatus)

    const belayerInfo = document.createElement('div')
    belayerInfo.classList.add('belayer-info')
    belayerInfo.append(styleDiv, skillDiv, emailDiv, locationDiv)

    belayerCard.append( header, aboutmeDiv, belayerInfo)
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
    const buttonSection = document.createElement('section')
    buttonSection.classList.add('button-section')
    buttonSection.id = `button-section-${belayer.id}`

    acceptRequestButton.id = `friend-${belayer.id}`
    acceptRequestButton.classList.add('accept-button', 'button')
    acceptRequestButton.textContent = "Accept Request"

    const declineRequestButton = document.createElement('button')

    declineRequestButton.id = `decline-friend-${belayer.id}`
    declineRequestButton.classList.add('delete-button', 'button')
    declineRequestButton.textContent = "Decline Request"

    buttonSection.append(acceptRequestButton, declineRequestButton)
    pendingBelayerCard.append(buttonSection)
    
    acceptRequestButton.addEventListener('click', event => handleAcceptRequestbutton(event, user, belayer)) 
    declineRequestButton.addEventListener('click', event => handleDeclineRequestButton(event, user, belayer))

}

function handleDeclineRequestButton(event, user, belayer) {
    event.preventDefault()
    const userId = user.data.id
    const belayerId = belayer.id
    const belayerCard = document.querySelector(`#belayer-${belayerId}`)
    belayerCard.style.display = 'none'
    const userAsReceiverPartnerships = user.data.attributes.partnerships_as_receiver
    userAsReceiverPartnerships.forEach(partnership => {
        const receiverId = partnership.receiver_id
        const requestorId = partnership.requestor_id
        if ( userId == receiverId && belayerId == requestorId ) {
                let partnershipId = partnership.id
                fetchCall(`${partnershipURL}/${partnershipId}`, "DELETE")
        }   
    })
}

function handleAcceptRequestbutton(event, user, belayer) {
    event.preventDefault()
    const belayerId = belayer.id
    const belayerCard = document.querySelector(`#belayer-${belayer.id}`)
    console.log(belayerCard)
    const pendingBelayRequest = document.querySelector('.pending-belay-request')
    const button = document.querySelector(`#${event.target.id}`)
    const declineButton = document.querySelector(`#decline-friend-${belayer.id}`)
    const buttonSection = document.querySelector(`#button-section-${belayer.id}`)
    buttonSection.remove()
    pendingBelayRequest.removeChild(belayerCard)
    appendTo(belayerCard, '.belay-partners')
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

