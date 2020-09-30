createNavigationButton("HOME", `${frontEndURL}`)

$.signInForm.addEventListener('submit', handleSignInForm)

function handleSignInForm(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const username = formData.get('username')
    const password = formData.get('password')
    user = { username, password }
    
    fetchCall( loginURL, "POST", user )
        .then(response => response.json())
        .then(data => validateSignIn(event, data))
}

function validateSignIn(event, data) {
    let error = data.errors
    if (error) {
        removeErrors()
        const errorBox = document.createElement('p')
        errorBox.classList.add('error-box')
        errorBox.innerHTML = error
        errorBox.style.color = "white" 
        $.createUserErrorSection.append(errorBox)             
    } else {
        localStorage.setItem("token", data.token)
        directToPage(event, `${accountURL}`)
    }
}

