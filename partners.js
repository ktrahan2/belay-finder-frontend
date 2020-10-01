fetchCall(`${baseURL}/profile`, "GET")
    .then(resp => resp.json())
    .then(user => {
        getAllBelayersAvailable(user)
        createNavigationButton("Home", `${frontEndURL}?status="signed-in"`)
        createNavigationButton('Account', `${accountURL}`)
    })

function getAllBelayersAvailable(user) {
    fetchCall(`${userURL}`, "GET")
        .then(resp => resp.json())
        .then(response => {
            const userId = user.data.id
            let belayers = response.data
            belayers.forEach(belayer => {
                if (belayer.id != userId) {
                   getNonFriends(user, belayer)
                }
            })
        })
}

function getNonFriends(user, belayer) {
    const userInfo = user.data
    const belayerId = belayer.id
    const userAsRequestor = userInfo.attributes.partnerships_as_requestor
    const userAsReceiver = userInfo.attributes.partnerships_as_receiver
    const userPartnerships = userAsRequestor.concat(userAsReceiver)
    let allIds = []
    userPartnerships.forEach(partnership => {
        if (belayerId == partnership.receiver_id && userInfo.id == partnership.requestor_id && partnership.partnership_status == "pending") {
            createUserCard(belayer, user)
            const friendButton = document.querySelector(`#friend-${belayerId}`)
            friendButton.textContent = "Cancel Pending Request"
        }
        allIds.push(partnership.receiver_id)
        allIds.push(partnership.requestor_id)
        return allIds
    })
    let found = false 
    for (let i = 0; i < allIds.length; i++) {
        if (allIds[i] == belayerId) {
            found = true
        }
    } 
    if (found == false) {
        createUserCard(belayer, user)
    }
}

function createUserCard(belayer, user) {
    const container = document.querySelector('.container')
    const belayerCard = document.createElement('div')

    belayerCard.classList.add('belayer-card')
    belayerCard.id = `belayer-${belayer.id}`

    const nameDiv = document.createElement('div')
    nameDiv.classList.add('profile-div')
    const name = document.createElement('p')
    name.style.fontSize = "20px"
    name.textContent = belayer.attributes.name
    nameDiv.append(name)

    const belayStatus = document.createElement('p')
    belayStatus.textContent = titleCase(belayer.attributes.belay_status)

    const header = document.createElement('div')
    header.classList.add('belay-card-header')
    header.append(name, belayStatus) 

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
    
    const belayerInfo = document.createElement('div')
    belayerInfo.classList.add('belayer-info')
    belayerInfo.append(styleDiv, skillDiv, emailDiv, locationDiv)

    const buttonSection = document.createElement('section')
    buttonSection.classList.add('button-section')
    buttonSection.id = `button-section-${belayer.id}`

    const addFriendButton = document.createElement('button')
    addFriendButton.id = `friend-${belayer.id}`
    addFriendButton.classList.add('friend-button')
    addFriendButton.textContent = "Send Belay Request"
    
    buttonSection.append(addFriendButton)
    belayerCard.append(header, belayerInfo, buttonSection)
    container.append(belayerCard)  
    
    addFriendButton.addEventListener('click', event => handleAddFriendButton(event, belayer, user))
}

function handleAddFriendButton(event, belayer, user) {
    const friendButtons = document.querySelectorAll('.friend-button')
    friendButtons.forEach(friendButton => {
        if (event.target == friendButton && friendButton.textContent == 'Send Belay Request') {
            friendButton.textContent = "Cancel Pending Request"
            sendBelayRequest(belayer, user)
        } else if (event.target == friendButton) {        
            friendButton.textContent = "Send Belay Request"
            cancelBelayRequest(belayer, user)
        }
    })
}

function sendBelayRequest(belayer, user) {
   const requestor_id = user.data.id
    const receiver_id = belayer.id
    const partnership_status = "pending"    
    const partnership = { requestor_id, receiver_id, partnership_status }
    fetchCall(`${partnershipURL}`, "POST", { partnership })
}

function cancelBelayRequest(belayer, user) {
    user = user.data
    const partnerships = user.attributes.partnerships_as_requestor
    partnerships.forEach(partnership => {
        if (partnership.requestor_id == user.id && partnership.receiver_id == belayer.id) {
            fetchCall(`${partnershipURL}/${partnership.id}`, "DELETE")
        } 
    })
}



