$.signInForm.addEventListener('submit', handleSignInForm)

function handleSignInForm(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const username = formData.get('username')
    const password = formData.get('password')
    user = { username, password }
    
    fetchCall( loginURL, "POST", user )
        .then(response => response.json())
        .then(console.log)
}