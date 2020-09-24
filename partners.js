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
    const aboutme = document.createElement('p')
    const climbing_style = document.createElement('p')
    const climbing_skill = document.createElement('p')
    const location = document.createElement('p')
    const status = document.createElement('p')
    const addFriendForm = document.createElement('form')
    const addFriendButton = document.createElement('input')
    

    const usernameDiv = document.createElement('div')
    usernameDiv.classList.add("profile-div")
    const username = document.createElement('p')
    const usernameLabel = document.createElement("label")
    usernameLabel.textContent = "Username:"
    username.textContent = user.attributes.username
    usernameDiv.append(usernameLabel, username)

    const nameDiv = document.createElement('div')
    nameDiv.classList.add('profile-div')
    const nameLabel = document.createElement('label')
    nameLabel.textContent = "Name:"
    const name = document.createElement('p')
    name.textContent = user.attributes.name
    nameDiv.append(nameLabel, name)

    const emailDiv = document.createElement('div')
    emailDiv.classList.add('profile-div')
    const emailLabel = document.createElement('label')
    emailLabel.textContent = "Email:"
    const email = document.createElement('p')
    email.textContent = user.attributes.email
    emailDiv.append(emailLabel, email)

   

    userCard.classList.add('user-card')
    userCard.id = user.id
    aboutme.textContent = user.attributes.aboutme
    climbing_style.textContent = user.attributes.climbing_style
    climbing_skill.textContent = user.attributes.climbing_skill
    location.textContent = user.attributes.location
    status.textContent = user.attributes.status

    addFriendForm.classList.add("form")
    addFriendForm.id = ("add-friend-form")
    addFriendButton.type = "submit"
    addFriendButton.value = "Send Belay Request"



    addFriendForm.append(addFriendButton)
    userCard.append(status, usernameDiv, nameDiv, emailDiv, aboutme, climbing_style, climbing_skill, location, addFriendForm)
    container.append(userCard)
    
}