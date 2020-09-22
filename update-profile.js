const queryParams = new URLSearchParams(window.location.search)
const user_id = queryParams.get("user_id")
//fix queryParams to show up in url, will fix with auth


$.updateUserForm.addEventListener('submit', getUserData)
    createClimbingSkillOptions()
    createClimbingStyleOptions()

    function getUserData(event) {
        event.preventDefault()
        const formData = new FormData(event.target)
        const username = formData.get('username')
        const email = formData.get('email')
        const password = formData.get('password_digest')
        let name = formData.get('name')
        name = name.toLowerCase()
        const aboutme = formData.get('aboutme')
        const climbingStyle = formData.get('climbing_style')
        const skillLevel = formData.get('climbing_skill')

        fetchCall( `${userURL}/${user_id}`, "PATCH", formData )
        .then(response => response.json())
        .then(console.log(userArray))
    }

    function validateUpdate(user) {
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
            console.log('hey')
            window.location.replace(`${frontEndURL}/account.html?user_id=${user_id}`)
        }
    }

function createClimbingSkillOptions() {
    difficultyArray.forEach(difficulty => {
        const dropDown = document.querySelector('#climbing-level-selections')
        const difficultyOption = document.createElement('option')
        difficultyOption.textContent = difficulty
        dropDown.append(difficultyOption)
    })
}

function createClimbingStyleOptions() {
    climbingStyleArray.forEach(style => {
        const dropDown = document.querySelector('#climbing-style-selections')
        const styleOption = document.createElement('option')
        styleOption.textContent = style
        dropDown.append(styleOption)
    })
}



// function createOptions(array, dropdown) {
//     const dropDown = dropdown
//     array.forEach(index => {
//         const option = document.createElement('option')
//         option.textcontent = index
//         dropDown.append(option)
//     })
// }