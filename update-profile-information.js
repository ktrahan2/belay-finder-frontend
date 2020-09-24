fetch(`${baseURL}/profile`, {
    method: "GET",
    headers: {
        "Accept": "application/json",
        "Content-type": "application/json",
        "Authorization": `Bearer ${window.localStorage.token}`
    }
    })
    .then(response => response.json())
    .then(response => createProfileUpdateForm(response))
createNavigationButton("ACCOUNT", `${accountURL}`)

function createProfileUpdateForm(response) {
    const userData = response.data
    const $updateProfileForm = document.createElement('form')
    const aboutMeLabel = document.createElement('label')
    const aboutme = document.createElement('input')
    const skillLabel = document.createElement('label')
    const climbing_skill = document.createElement('select')
    const styleLabel = document.createElement('label')
    const climbing_style = document.createElement('select')
    const password = document.createElement('input')

    const submit = document.createElement('input')

    $updateProfileForm.classList.add('user-form')
    $updateProfileForm.id = "update-profile-information-form"
    
    aboutMeLabel.for = "aboutme"
    aboutMeLabel.innerText = "About Me:"
    aboutme.id = "aboutme"
    aboutme.name = "aboutme"
    aboutme.value = userData.attributes.aboutme
    
    skillLabel.for = "climbing-skill"
    skillLabel.innerText = "Climbing-Skill:"
    climbing_skill.id = "climbing-skill"
    climbing_skill.name = "climbing_skill"
    styleLabel.for = "climbing-style"
    styleLabel.innerText = "Climbing Style:"
    climbing_style.id = "climbing-style"
    climbing_style.name = "climbing_style"

    password.name = "password"
    password.type = "password"
    password.placeholder = "Password is required to update profile information"

    submit.value = "Update Profile"
    submit.type = "submit"

    $updateProfileForm.append(aboutMeLabel, aboutme, styleLabel, climbing_style, skillLabel, climbing_skill, password, submit)
    $.main.append($updateProfileForm)
    
    createDropDownOptions(climbingStyleArray, '#climbing-style')
    createDropDownOptions(difficultyArray, '#climbing-skill')
    //might be able to refactor
    for (let i = 0; i < climbing_style.children.length; i++)
        if (climbing_style[i].textContent == userData.attributes.climbing_style ) {
           climbing_style[i].selected = true
        }
    for (let i = 0; i < climbing_skill.children.length; i++)
        if (climbing_skill[i].textContent == userData.attributes.climbing_skill) {
           climbing_skill[i].selected = true
        } 

    $updateProfileForm.addEventListener('submit', event => getUserData(event, userData))
}
//look at refactoring getUserData, its being used slightly differently in alot of places?
function getUserData(event, userData) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const aboutme = formData.get('aboutme')
    const climbing_style = formData.get('climbing_style')
    const climbing_skill = formData.get('climbing_skill')
    const password = formData.get('password')
    let user = { password, aboutme, climbing_style, climbing_skill }

    fetchCall( `${userURL}/${userData.id}`, "PATCH", { user })
        .then(resp => resp.json())
        .then(directToPage(event, `${accountURL}`))    
    }


