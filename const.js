const baseURL = 'http://localhost:3000'
const userURL = `${baseURL}/users`
const profileURL = `${baseURL}/profile`
const partnershipURL = `${baseURL}/partnerships`
const climbingRouteURL = `${baseURL}/climbing_routes`
const favoriteRouteURL = `${baseURL}/favorite_routes`
const loginURL = `${baseURL}/login`
const partnershipsURL = `${baseURL}/partnerships`

const frontEndURL = 'http://localhost:7000'
const signInURL = `${frontEndURL}/login.html`
const updateProfileURL = `${frontEndURL}/update-profile.html`
const accountURL = `${frontEndURL}/account.html`
const signUpURL = `${frontEndURL}/signup.html`
const updateAccountInfoURL = `${frontEndURL}/update-account-information.html`
const updateProfileInfoURL = `${frontEndURL}/update-profile-information.html`
const partnerURL = `${frontEndURL}/partners.html`

const $ = {
    header: document.querySelector('header'),
    main: document.querySelector('main'),
    footer: document.querySelector('footer'),
    createUserForm: document.querySelector('#create-user-form'),
    createUserErrorSection: document.querySelector('#show-create-user-error'),
    signUpButton: document.querySelector('#sign-up-button'),
    signInButton: document.querySelector('#sign-in-button'),
    signInForm: document.querySelector('#sign-in-user-form'),
}

const climbingStyleArray = ["top rope", "sport", "trad"]

const difficultyArray = ["5.5", "5.6", "5.7", "5.8", "5.9", "5.10a", "5.10b", 
    "5.10c", "5.10d", "5.11a", "5.11b", "5.11c", "5.11d", "5.12a"
]

const availabilityArray = ["Available", "Unavailable"]

function createNavigationButton(name, url) {
    const button = document.createElement('button')

    button.classList.add('button')
    name = name.split(" ")
    button.id = `${name[0]}-${name[1]}-button`
    let completeName = name.join(" ")
    button.type = "button"
    button.innerText = `${completeName}`

    $.header.prepend(button)

    button.addEventListener('click', event => directToPage(event, url))
}

function directToPage(event, url) {
    event.preventDefault()
    window.location.replace(url)
}

function fetchCall(url, method, bodyData) {
    const headers = {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": `Bearer ${window.localStorage.token}`
    }
    const body = JSON.stringify(bodyData)
    return fetch(url, {method, headers, body})
}

function titleCase(string) {
    var sentence = string.toLowerCase().split(" ")
    for(var i = 0; i< sentence.length; i++){
        sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1)
    }
    return sentence.join(" ")
}

function removeErrors() {
    if ($.createUserErrorSection.children.length > 0) {
        const errorBox = document.querySelectorAll('.error-box')
        errorBox.forEach(errorbox => {
            errorbox.remove()
        })
    }
}

function findError(errors) {
    const errorMessages = Object.values(errors)
    return errorMessages
}

function createDropDownOptions(array, id) {
    const dropDown = document.querySelector(id)
    array.forEach(index => {
        const option = document.createElement('option')
        option.id = (`${index}`)
        option.textContent = index
        dropDown.append(option)
    })
}

