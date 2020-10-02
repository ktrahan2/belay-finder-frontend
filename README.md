# Belay Land

An app for finding climbing routes and connecting with other climbers. 

# Table Of Contents 
- [Description](https://github.com/ktrahan2/belay-finder-frontend#description)
- [How It Works](https://github.com/ktrahan2/belay-finder-frontend#how-it-works)
- [Example Code](https://github.com/ktrahan2/belay-finder-frontend#example-code)
- [Technology Used](https://github.com/ktrahan2/belay-finder-frontend#technology-used)
- [Setting up for the Application](https://github.com/ktrahan2/belay-finder-frontend#setting-up-for-the-application)
- [Main Features](https://github.com/ktrahan2/belay-finder-frontend#main-features)
- [Features in Progress](https://github.com/ktrahan2/belay-finder-frontend#features-in-progress)
- [Contact Information](https://github.com/ktrahan2/belay-finder-frontend#contact-information)
- [Link to Backend Repo](https://github.com/ktrahan2/belay-finder-frontend#link-to-backend-repo)

## Description

Belay Land is an application that allows users to search through climbing routes near them and save them as favorites. Users are also able to request partnerships with other users in order to form connections to go climbing! 

## How It Works

[Belay Land](https://youtu.be/mLFRHayBuT4)

## Example Code 
```
    function fetchCall(url, method, bodyData) {
        const headers = {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": `Bearer ${window.localStorage.token}`
        }
        const body = JSON.stringify(bodyData)
        return fetch(url, {method, headers, body})
    }
```
```
    function createDropDownOptions(array, id) {
        const dropDown = document.querySelector(id)
        array.forEach(index => {
            const option = document.createElement('option')
            option.id = (`${index}`)
            option.textContent = index
            dropDown.append(option)
    })
    }
```
```
    function createChangeStatusButton(user) {
        const userInfo = user
        const statusUpdateForm = document.createElement('form')
        const dropDown = document.createElement('select')
        const submitButton = document.createElement('input')
        const header = document.querySelector('#profile-header')
        dropDown.id = ('belay-status')
        dropDown.name = ('belay_status')
        submitButton.type = "submit"
        submitButton.value = "Update Belayability"

        statusUpdateForm.append(dropDown, submitButton)
        header.append(statusUpdateForm)
        createDropDownOptions(availabilityArray, '#belay-status')
        for (let i = 0; i < dropDown.children.length; i++)
            if (dropDown[i].textContent == userInfo.attributes.belay_status ) {
                dropDown[i].selected = true
            }
        statusUpdateForm.addEventListener('submit', event => handleUserStatusUpdate(event, userInfo))
    }
```

## Technology Used

- Javascript
- HTML
- CSS


## Setting up for the application

To start the server run

``` 
    lite-server 
```

## Main Features

- User can register/sign in
- User can find climbing routes and add them to their favorites
- User can friend other users in order to form climbing partnerships

## Features in Progress

- Adding a search feature to users and climbing routes
- Adding in a gps locator to find routes in your area

## Contact Information

[Kyle Trahan](https://www.linkedin.com/in/kyle-trahan-8384678b/)

## Link to Backend Repo

https://github.com/ktrahan2/belay-finder-backend

