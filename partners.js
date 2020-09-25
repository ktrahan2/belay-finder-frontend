fetch(`${userURL}`)
    .then(resp => resp.json())
    .then(response => getUsers(response))
    createNavigationButton("HOME", `${frontEndURL}?status="signed-in"`)
    createNavigationButton("ACCOUNT", `${accountURL}`)
    createNavigationButton("SIGN OUT", `${frontEndURL}`)

function getUsers(response) {
   response.data.forEach(user => {
       createUserCard(user)
   })

}

function createUserCard(user) {
    const container = document.querySelector('.container')
    const userCard = document.createElement('div')
    const addFriendForm = document.createElement('form')
    const addFriendButton = document.createElement('input')

    const usernameDiv = document.createElement('div')
    usernameDiv.classList.add("profile-div")
    const username = document.createElement('p')
    const usernameLabel = document.createElement("p")
    usernameLabel.textContent = "Username:"
    username.textContent = user.attributes.username
    usernameDiv.append(usernameLabel, username)

    const nameDiv = document.createElement('div')
    nameDiv.classList.add('profile-div')
    const nameLabel = document.createElement('p')
    nameLabel.textContent = "Name:"
    const name = document.createElement('p')
    name.textContent = titleCase(user.attributes.name)
    nameDiv.append(nameLabel, name)

    const emailDiv = document.createElement('div')
    emailDiv.classList.add('profile-div')
    const emailLabel = document.createElement('p')
    emailLabel.textContent = "Email:"
    const email = document.createElement('p')
    email.textContent = user.attributes.email
    emailDiv.append(emailLabel, email)

    const aboutmeDiv = document.createElement('div')
    aboutmeDiv.classList.add('profile-div')
    const aboutmeLabel = document.createElement('p')
    aboutmeLabel.textContent = "About Me:"
    const aboutme = document.createElement('p')
    aboutme.textContent = user.attributes.aboutme
    aboutmeDiv.append(aboutmeLabel, aboutme)
    
    const styleDiv = document.createElement('div')
    styleDiv.classList.add('profile-div')
    const styleLabel = document.createElement('p')
    styleLabel.textContent = "Preferred Climbing Style:"
    const climbing_style = document.createElement('p')
    climbing_style.textContent = user.attributes.climbing_style
    styleDiv.append(styleLabel, climbing_style)
    
    const skillDiv = document.createElement('div')
    skillDiv.classList.add('profile-div')
    const skillLabel = document.createElement('p')
    skillLabel.textContent = "Skill Level:"
    const climbing_skill = document.createElement('p')
    climbing_skill.textContent = user.attributes.climbing_skill
    skillDiv.append(skillLabel, climbing_skill)

    const locationDiv = document.createElement('div')
    locationDiv.classList.add('profile-div')
    const locationLabel = document.createElement('p')
    locationLabel.textContent = "Location:"    
    const location = document.createElement('p')
    location.textContent = user.attributes.location
    locationDiv.append(locationLabel, location)

    userCard.classList.add('user-card')
    userCard.id = user.id

    const belayStatusDiv = document.createElement('div')
    belayStatusDiv.classList.add('profile-div')
    const belayStatusLabel = document.createElement('p')
    belayStatusLabel.textContent = "Status:"
    const belayStatus = document.createElement('p')
    belayStatus.textContent = user.attributes.belay_status

    addFriendForm.classList.add("form")
    addFriendForm.id = ("add-friend-form")
    addFriendButton.type = "submit"
    addFriendButton.value = "Send Belay Request"

    addFriendForm.append(addFriendButton)
    userCard.append(belayStatusLabel, belayStatus, usernameDiv, nameDiv, emailDiv, aboutmeDiv, styleDiv, skillDiv, locationDiv, addFriendForm)
    container.append(userCard)  
}