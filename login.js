$.signInForm.addEventListener('submit', handleSignInForm)

function handleSignInForm(event) {
    event.preventDefault()

    const formData = new FormData(event.target)
    const username = formData.get('username')
    const password_digest = formData.get('password_digest')
    user = {username, password_digest}
    
    fetchCall( loginURL, "POST", {user} )
        .then(response => response.json())
        .then(console.log)
}