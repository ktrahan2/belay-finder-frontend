fetch(`${userURL}`)
    .then(resp => resp.json())
    .then(response => renderBelayers(response))
    createNavigationButton("HOME", `${frontEndURL}?status="signed-in"`)
    createNavigationButton("ACCOUNT", `${accountURL}`)
    createNavigationButton("SIGN OUT", `${frontEndURL}`)

function renderBelayers(response) {
    fetchCall(`${baseURL}/profile`, "GET")
            .then(resp => resp.json())
            .then(response2 => getUser(response, response2))
    function getUser(response, response2) {
    const userId = response2.data.id
    const userPartnershipRequests = response2.data.attributes.partnerships_as_requestor
    const receiverIds= userPartnershipRequests.map(partnerships => partnerships.receiver_id)
    console.log(receiverIds)
        response.data.forEach(belayer => {
            if (belayer.id != userId) {
                createUserCard(belayer)
            } 
        })

    }
}     


function createUserCard(account) {
    const container = document.querySelector('.container')
    const userCard = document.createElement('div')

    const usernameDiv = document.createElement('div')
    usernameDiv.classList.add("profile-div")
    const username = document.createElement('p')
    const usernameLabel = document.createElement("p")
    usernameLabel.textContent = "Username:"
    username.textContent = account.attributes.username
    usernameDiv.append(usernameLabel, username)

    const nameDiv = document.createElement('div')
    nameDiv.classList.add('profile-div')
    const nameLabel = document.createElement('p')
    nameLabel.textContent = "Name:"
    const name = document.createElement('p')
    name.textContent = titleCase(account.attributes.name)
    nameDiv.append(nameLabel, name)

    const emailDiv = document.createElement('div')
    emailDiv.classList.add('profile-div')
    const emailLabel = document.createElement('p')
    emailLabel.textContent = "Email:"
    const email = document.createElement('p')
    email.textContent = account.attributes.email
    emailDiv.append(emailLabel, email)

    const aboutmeDiv = document.createElement('div')
    aboutmeDiv.classList.add('profile-div')
    const aboutmeLabel = document.createElement('p')
    aboutmeLabel.textContent = "About Me:"
    const aboutme = document.createElement('p')
    aboutme.textContent = account.attributes.aboutme
    aboutmeDiv.append(aboutmeLabel, aboutme)
    
    const styleDiv = document.createElement('div')
    styleDiv.classList.add('profile-div')
    const styleLabel = document.createElement('p')
    styleLabel.textContent = "Preferred Climbing Style:"
    const climbing_style = document.createElement('p')
    climbing_style.textContent = account.attributes.climbing_style
    styleDiv.append(styleLabel, climbing_style)
    
    const skillDiv = document.createElement('div')
    skillDiv.classList.add('profile-div')
    const skillLabel = document.createElement('p')
    skillLabel.textContent = "Skill Level:"
    const climbing_skill = document.createElement('p')
    climbing_skill.textContent = account.attributes.climbing_skill
    skillDiv.append(skillLabel, climbing_skill)

    const locationDiv = document.createElement('div')
    locationDiv.classList.add('profile-div')
    const locationLabel = document.createElement('p')
    locationLabel.textContent = "Location:"    
    const location = document.createElement('p')
    location.textContent = account.attributes.location
    locationDiv.append(locationLabel, location)

    userCard.classList.add('user-card')
    userCard.id = account.id

    const belayStatusDiv = document.createElement('div')
    belayStatusDiv.classList.add('profile-div')
    const belayStatusLabel = document.createElement('p')
    belayStatusLabel.textContent = "Status:"
    const belayStatus = document.createElement('p')
    belayStatus.textContent = titleCase(account.attributes.belay_status)
    belayStatusDiv.append(belayStatusLabel, belayStatus)
    
    const addFriendForm = document.createElement('form')
    const addFriendButton = document.createElement('input')
    addFriendForm.classList.add("form")
    addFriendForm.id = ("add-friend-form") 
    addFriendButton.type = "submit"
    addFriendButton.value = "Send Belay Request"


    addFriendForm.append(addFriendButton)
    userCard.append(belayStatusDiv, usernameDiv, nameDiv, emailDiv, aboutmeDiv, styleDiv, skillDiv, locationDiv, addFriendForm)
    container.append(userCard)  
    
    addFriendForm.addEventListener('submit', event => handleAddFriendForm(event, account))
}

function handleAddFriendForm(event, account) {
    event.preventDefault()

    fetchCall(`${baseURL}/profile`, "GET")
    .then(resp => resp.json())
    .then(response => getUser(response))

    function getUser(response) {
        const requestor_id = response.data.id
        const receiver_id = account.id
        const partnership_status = "pending"    
        const partnership = { requestor_id, receiver_id, partnership_status }
        fetchCall(`${partnershipURL}`, "POST", { partnership })
    }
}

