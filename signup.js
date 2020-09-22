$.createUserForm.addEventListener('submit', getUserData)

function getUserData(event) {
    event.preventDefault()
    
    const formData = new FormData(event.target)
    const username = formData.get('username')
    const email = formData.get('email')
    const password_digest = formData.get('password_digest')
    let name = formData.get('name')
    name = name.toLowerCase()
    const user = {username, email, password_digest, name}
    
    fetchCall( userURL, "POST", {user} )
    .then(response => response.json())
    .then(validateSignUp)
}

function validateSignUp(user) {
    if (user.errors) {
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
        window.location.replace(`${frontEndURL}/account.html?user_id=${user.id}`)
    }
}











