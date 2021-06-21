# Boilerplate HTML / JS

Boilerplate code for any new HTML / CSS heavy project.

Some code involves some [ThreeJS](https://threejs.org/) boilerplate, but it is not complete, so that aspect will be improved and pushed into a different repository.

Boilerplate for a cursor / circle effect with a magnetic animation is set up.

Removing it is as simple as removing one of the functions in the main init() HOF.

The project is set up that there currently is only one page, which is the 'loading--page', aka the page initially displayed to the user.

## General Info

The project will not have any of the different boilerplate functions, such as the ones that animate characters one by one when using [SplittingJS](https://splitting.js.org/). These functions are stored in another repository that is constantly expanded, corrected, and improved. 

On the other hand, this project will be extended in order to hold a HOF that will be taking care of the website routing and ensuring that the different pages are displayed correctly.

## Technologies

This project is created with 

* HTML / CSS
* Javascript
* Three.js
* Simplex-noise.js
* Mobile-Detect.js 
* Other ThreeJS libraries, such as OBJLoader.js, which allows us to load objets with the OBJ format into the website

Comment: Evidently, you should and can remove the unused scripts, such as the Three.JS script, if they are not used, in order to reduce network latency, page speeed, and achieve higher perfomance metrics on Google, etc. This goes without saying

## Setup

No set up is necessary. You might run into some CORS-policy related errors, in which case I'd recommend using this google extension called [Web Server for Chrome](https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en)

## Addendum

Would be good to add a hot reloading feature to the application in order to save precious seconds of development, which all add up and lead to wasted time through context switching.