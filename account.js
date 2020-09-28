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
    renderFavoriteRoutes(user)
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

function renderFavoriteRoutes(user) {
    
}