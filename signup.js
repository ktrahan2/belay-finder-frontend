createNavigationButton("HOME", `${frontEndURL}`)

$.createUserForm.addEventListener('submit', getUserData)

function getUserData(event) {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const username = formData.get('username')
    const email = formData.get('email')
    const password = formData.get('password')
    let name = formData.get('name')
    name = name.toLowerCase()
    const user = {username, email, password, name}
    
    fetchCall( userURL, "POST", {user} )
    .then(response => response.json())
    .then(data => validateSignUp(data))
}

function validateSignUp(data) {
    if (data.user.errors) {
        removeErrors()
        let error = findError(user.errors)
        error.forEach(error => {
            const errorBox = document.createElement('p')
            errorBox.classList.add('error-box')
            errorBox.innerHTML = error
            errorBox.style.color = "red" 
            $.createUserErrorSection.append(errorBox)
        })      
    } else {
        window.location.replace(`${frontEndURL}/account.html?user_id=${data.user.id}`)
    }
}











