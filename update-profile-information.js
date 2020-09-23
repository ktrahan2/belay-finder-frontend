const queryParams = new URLSearchParams(window.location.search)
const user_id = queryParams.get("user_id")

createNavigationButton("ACCOUNT", `${accountURL}?user_id=${user_id}`)
createNavigationButton("SIGN OUT", `${frontEndURL}`)
