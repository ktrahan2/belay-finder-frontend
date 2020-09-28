fetch(`${userURL}`)
    .then(resp => resp.json())
    .then(response => renderBelayers(response))
    createNavigationButton("HOME", `${frontEndURL}?status="signed-in"`)
    createNavigationButton("ACCOUNT", `${accountURL}`)
    createNavigationButton("SIGN OUT", `${frontEndURL}`)

function renderBelayers(response) {
    fetchCall(`${baseURL}/profile`, "GET")
            .then(resp => resp.json())
            .then(currentUser => createBelayers(response, currentUser))
    function createBelayers(response, currentUser) {
        const userId = currentUser.data.id
        response.data.forEach(belayer => {
            if (belayer.id != userId) {
                createUserCard(belayer, currentUser)
            } 
        })
        showUserPendingRequest(currentUser)
    }
}     

function createUserCard(belayer, currentUser) {
    const container = document.querySelector('.container')
    const userCard = document.createElement('div')

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

    userCard.classList.add('user-card')
    userCard.id = belayer.id

    const belayStatusDiv = document.createElement('div')
    belayStatusDiv.classList.add('profile-div')
    const belayStatusLabel = document.createElement('p')
    belayStatusLabel.textContent = "Status:"
    const belayStatus = document.createElement('p')
    belayStatus.textContent = titleCase(belayer.attributes.belay_status)
    belayStatusDiv.append(belayStatusLabel, belayStatus)
     
    const addFriendButton = document.createElement('button')
    addFriendButton.id = `friend-${belayer.id}`
    addFriendButton.classList.add('friend-button')
    addFriendButton.textContent = "Send Belay Request"
    
    userCard.append(belayStatusDiv, usernameDiv, nameDiv, emailDiv, aboutmeDiv, styleDiv, skillDiv, locationDiv, addFriendButton)
    container.append(userCard)  
    
    addFriendButton.addEventListener('click', event => handleAddFriendButton(event, belayer, currentUser))
}

function handleAddFriendButton(event, belayer, currentUser) {
    const friendButtons = document.querySelectorAll('.friend-button')
    friendButtons.forEach(friendButton => {
        if (event.target == friendButton && friendButton.textContent == 'Send Belay Request') {
            friendButton.textContent = "Cancel Pending Request"
            sendBelayRequest(belayer, currentUser)
        } else if (event.target == friendButton) {        
            friendButton.textContent = "Send Belay Request"
            cancelBelayRequest(belayer, currentUser)
        }
    })
}

function sendBelayRequest(belayer, currentUser) {
   const requestor_id = currentUser.data.id
    const receiver_id = belayer.id
    const partnership_status = "pending"    
    const partnership = { requestor_id, receiver_id, partnership_status }
    fetchCall(`${partnershipURL}`, "POST", { partnership })
}

function cancelBelayRequest(belayer, currentUser) {
    const user = currentUser.data
    const partnerships = user.attributes.partnerships_as_requestor
    partnerships.forEach(partnership => {
        if (partnership.requestor_id == user.id && partnership.receiver_id == belayer.id) {
            fetchCall(`${partnershipURL}/${partnership.id}`, "DELETE")
        } 
    })
}

function showUserPendingRequest(currentUser) {
    const userPartnershipRequests = currentUser.data.attributes.partnerships_as_requestor
    const userCards = document.querySelectorAll('.user-card')
    userCards.forEach(userCard => {
        const button = document.querySelector(`#friend-${userCard.id}`)
        userPartnershipRequests.forEach(partnership => {
            if (userCard.id == partnership.receiver_id) {
                button.textContent = "Cancel Pending Request"
            } else { 
            }
        })
    })
}

