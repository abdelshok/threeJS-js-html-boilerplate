
/** GLOBAL ENVIRONMENT VARIABLES **/ 

// IMPORTANT: Sets whether we're going to be in a local development environment or on a deployed server 
// Depending on which one we're in, the relative path to the different files will differ

let environment = 'prod';
let enableLogging = environment === 'dev' ? true : false;

let time = Date.now() * 0.0005;

/** Cursor & Mouse Related Variables */

let realMouseX, realMouseY;
let deltaY;

let previousClientX, previousClientY, currentClientX, currentClientY;

/* Loading Page & Navigational Status Related Variables */

let initialPageLoadingBarFullyLoaded = false;
let pageShown = 'homePage';

let PAGE_FIRST_LOADED = false;
let MUSIC_PLAYING = false;
let musicPlaying = true; // That's the one actually used

let ANIMATION_STARTED = false;
let MENU_BASED_ANIMATION_STARTED = false;

// Loading Page Based Variables

let loadingPageAnimationFinished = false;
let loadingGraphicalSceneFinished = false;

let speedInMilliseconds = getSpeedOfTransitionAnimation();
let RELATIVE_URL = environment === 'dev' ? '/assets/' : '/public/assets/';
let isSafari = window.safari !== undefined;
let imageFormat = isSafari === true ? 'notWebp' : 'webp';

if (enableLogging === true) {
    console.log(`Safari detected : ${isSafari}, therefore imageFormat will be ${imageFormat}`);
}

let enableProgressiveLoading = true;
let firstBatchOfModelsLoaded = false;
let LOADING_PAGE_REMOVED = false;
let pageTransitionSpeed = speedInMilliseconds === 2000 ? 'slow' : 'fast'; // Constants that controls the delay at which meshes' visibility gets changed
let PAGE_TRANSITION_SHORT_DELAY = 200;
let PAGE_TRANSITION_LONG_DELAY = pageTransitionSpeed === 'fast' ? 700 : 1700; 
let MESH_VISIBILITY_DELAY = pageTransitionSpeed === 'fast' ? 500 : 1100;
let CHANGE_TRANSITION_TEXT_BEFORE_SPEED = pageTransitionSpeed === 'fast' ? 200 : 450;
let CHANGE_TRANSITION_TEXT_AFTER_SPEED = pageTransitionSpeed === 'fast' ? 950 : 1600;

/* Mobile & Tablet related environment variables */

// Initialized in @initializeMobileDetector func. & used in order to prevent loading the beetle model if the device detected is a mobile device
let isMobile; 

let detector;
let isUserDesktop;

// Set in order to allow testing for mobile & tablet devices without necessarily having to refactor the code. When set to true, Samarra & Co. will allow users on mobile
// devices or tablets to enter the website & will set all the respective necessary messages. When set to false, that will be prevented and a message asking the user to use a different device
// is displayed upon the screen
let ignoreUserDevice = false;

/* Beginning of Three JS variables */

let scene,
    camera,
    beetleObject, 
    particles, 
    particlesMesh,
    particleGeometry,  
    pivotPoint, 
    pivotPoint2, 
    light1;


// Plane Geometries - We're declaring them as global variables so that they can be accessible across different functions - may constitute a memory leak in the JS heap 
// Will look into that later #optimization
let blackRockPlaneMesh;
let blueMarbleBeetleObject;

// The object displayed on the page will be assigned (by reference obviously) to this variable --> this will ensure that we can 
// always turn off the visibility and turn it back on on the right page
let currentObject;

let numParticles; // Number of particles that will be set in the Mesh of particles animating the ThreeJS project
let mouseX, mouseY;
let arrayOfCursorPositions = [];
let isBeetleWireframe = false;
let stats;

let clock = new THREE.Clock(); // Used in the shader that moves the different particles around

/** End of Three JS Variables **/

/* Web Audio API-related Variables */

let source;
let isSongFinished = false;
let musicStartedPlaying = false;
let frequencyData, averageFrequency;
let domainData, averageDomain; // Relates to the waveform of the current audio
let audioContext;

// Language Related

let otherLanguageHovered;

/* Window & Mouse Variables */

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let dynamicWindowWidth = window.innerWidth;
let dynamicWindowHeight = window.innerHeight;

/* Voice Control related constants */

let ACTIVATE_VOICE_SHOWN = false;

/* Music URL */

const URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/No+Church+In+The+Wild.mp3'
const SIMONE_URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/Nina+Simone+-+Sinnerman+(320++kbps).mp3';
const KANYE_URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/Flashing+Lights.mp3';
const ERIK_URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/Erik+Satie+-+Gymnop%C3%A9die+No.1.mp3'
const RYU_URL = "https://music-samarra-group.s3.us-east-2.amazonaws.com/Ryuichi+Sakamoto-+'Merry+Christmas+Mr+Lawrence'.mp3";
const LUDO_URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/Ludovico+Einaudi+-+Una+Mattina+(Extended+Remix).mp3';
const BELDI_URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/ISSAM+-+Trap+Beldi+(Prod+Adam+K).mp3';
const RUNAWAY_URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/Kanye+West+-+Runaway+(Video+Version)+ft.+Pusha+T.mp3';
const TEST_URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/trapBeldiShort.mp3';
const ENFANCE_URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/VIDEOCLUB+-+Enfance+80+(Clip+Officiel).mp3';
const FAMOUS_URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/Octavian-Famous.mp3';
const SAKAMOTO_OPUS_URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/SakamotoOpus.mp3';

const songLinksArray = [ FAMOUS_URL, SAKAMOTO_OPUS_URL, BELDI_URL, ERIK_URL, KANYE_URL, SIMONE_URL ];
const lightIntensities = ['highIntensity', 'lowIntensity', 'highIntensity', 'lowIntensity', 'highIntensity', 'highIntensity'];
const songNamesArray = ['OctavianFamous', 'SakomotoOpus', 'IssamTrapBeldi', 'ErikSatieGymnopedies', 'KanyeWestFlashingLights', 'NinaSimoneSinnerman']


let randomNumber = getRandomArbitrary(0, 6);
// let randomNumber = 5;

let chosenSongLink = songLinksArray[randomNumber];
let songType = lightIntensities[randomNumber];
let chosenSongName = songNamesArray[randomNumber];

if (enableLogging === true) {

    console.log('Random Number', randomNumber);
    console.log('Chosen song: ', chosenSongLink);
    console.log('Song type selected: ', songType);

};


// --------------------------------------------------------------------------------

/*
 * Scripts that will split the characters of the DOM elements
 * Currently unused 
 */

// const splitItems = Splitting();
// console.log('Split Items are', splitItems);


// --------------------------------------------------------------------------------

/*
 * Helper Functions
 * Used throughout the application
 */


// Function that creates a random number between the min and max that are passed in
// Used in @createParticleSystme function
function rand (min,max) {
    return min + Math.random()*(max-min);
}; 

// Function which calculates the average number of an array 
function average (array) {
    let average = 0;
    let count = 0;

    for (let i=0; i<array.length; i++) {
        count++;
        let currentNum = array[i];
        average += currentNum;
    }

    average = average/count;
    return average;
}

// Function retrieves the CSS-defined variable --transition--speed which represents the speed of the transition triggered
// in order to navigate between the different pages of the website.
// Not pure
function getSpeedOfTransitionAnimation ()  {

    let speed = getComputedStyle(document.documentElement).getPropertyValue('--transition--speed');
    let speedInMilliseconds = parseFloat(speed.split('s')[0].trim()) * 1000;

    if (enableLogging === true) {
        // console.log(`Speed detected in the CSS :root is ${speed}`);
        console.log('Speed detected in the CSS :root is', speedInMilliseconds);
    }

    return speedInMilliseconds

}

function getRandomArbitrary (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}


/**** META Functions  *******/

// These are functions that track the general meta properties of the device, device speed, user agent, location, etc. 
// Essentially, the different nuanced properties that allow us to decide how to display the elements of our websites,
// in which order, or even at all.

/*
 * Mobile Detect Script that will split the characters of the DOM elements
 */


function initializeMobileDetector () {
    detector = new MobileDetect(window.navigator.userAgent)

    isMobile = detector.mobile();
    let isTablet = detector.tablet();
    let phone = detector.tablet();
    let userAgent = detector.userAgent();

    if (enableLogging === true) {
        console.log(`Mobile & OS Detector initialized ${detector}`);
        console.log(`Mobile Device: ${isMobile}`);
        console.log(`User Agent is ${userAgent}`);
    }


    if (isMobile !== null || isTablet !== null || phone !== null) {

        isUserDesktop = false;

    } else {
        
        isUserDesktop = true;
    }
}



// --------------------------------------------------------------------------------

/*
 * ThreeJS Set up Functions 
 *
 */

// Boilerplate code to set a scene, camera, renderer for the ThreeJS project
scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );

// Camera afar positions used in order to actually look at the Beetle object and the different Mesh's rotations relative to it
const setCameraTestPosition = () => {
    camera.position.z = 150;
    camera.position.x = 150;
    camera.position.y = 180;
}

// Camera real position in order to actually look at the Beetle object the way it should be in the final iteration of the website
const setCameraFinalPosition = () => {
    camera.position.z = 0;
    camera.position.x = 0;
    camera.position.y = 200;
}

// Renderer & OrbitControls (which help us move around the scene are set)
let renderer = new THREE.WebGLRenderer({
    powerPreference: 'high-performance',
    antialias: false,
    stencil: false,
});

// Never fucking comment out the OrbitControls. You keep forgetting, but they're necessary to get the right angles of the scene.
let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

/*
 * Here we set the Camera into the final position. The Test position is used to check on the particle and light movements from afar
 */

// setCameraTestPosition();
// setCameraFinalPosition();

// Append Renderer to the scene
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );


/*
 * @createStats function for the FPS (Frames per Second) statistics at the top left of the page
 */

const createStats = () => {
    let stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';
    return stats;
};


// Only make the function call if the environment is set to dev so that the Stats element is not shown on the production website 

if (environment === 'dev') {

    stats = createStats();
    document.body.appendChild(stats.domElement);

}


/*
 * @ ThreeJS - Plane Geometries Section 
 * This section declares the functions that call the different plane geometries that will be displayed across the different pages of the website
 * Loading of the plane geometries is done in two steps.
 * Step 1. The BlueRock texture & respective plane geometry is loaded as soon as the user loads the page through @createInitialPlaneGeometries
 * Step 2. When the page loads and the loading bar terminates, the user is allowed to click on the page to enter the website. When the user does 
 * so, the remaining functions (for the various black rock plane geometries / background) are loaded 
 * These functions were divided into two steps in order to decrease the initial network load, decrease the blocking time, accelerate the time to 
 * first paint, and therefore generally increase the performance of the website in terms of Google LightHouse
 * 
 */

// Example

const createBlackPlaneGeometry = () => {

    let planeTexture, planeMaterial, planeGeometry;

    // Black Plane that's displayed in the 'About' page
    planeGeometry = new THREE.PlaneGeometry(2000, 2000, 2000);


    if (imageFormat === 'webp') {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blackRockAbout.webp');
    } else {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blackRock.png');
    }

    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planeTexture, transparent: false});
    blackRockPlaneMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    blackRockPlaneMesh.position.set(0,-160,0);
    blackRockPlaneMesh.rotation.x =  - (Math.PI / 2);

    scene.add(blackRockPlaneMesh);
}


/**
 * 
 * ThreeJS - Particle System Related Code
 * What are fucking particles? The white dots that are moving across the scene to give the impression that it is underwater
 * 
 */


// @createParticleSystem - Honestly, will do as the name suggests, create a fucking particle system.

const createParticleSystem = () => {
    numParticles = 1000;
    let width = 500;
    let height = 500;
    let depth = 500;
    particles = []
    particleGeometry = new THREE.Geometry()

    for(let i=0; i<numParticles; i++) {
        const particle = {
            position: new THREE.Vector3(
                  Math.random() * (- 500),
                  Math.random() * (- 500),
                  Math.random() * (- 500),
            ),
            velocity: new THREE.Vector3(
                rand(-0.01, 0.01),
                0.06,
                rand(-0.01, 0.01)),
            acceleration: new THREE.Vector3(0, -0.001, 0),
        }

        const particleTwo = new THREE.Vector3(
            Math.random() * (-500),
            Math.random() * (-500),
            Math.random() * (-500),
        )

        let pX =  Math.random() * (- 500);
        let pY =  Math.random() * (- 500);
        let pZ =  Math.random() * (- 500);

        
        let particleThree = new THREE.Vector3(pX, pY, pZ);
        particleThree.diff = Math.random() + 0.2;
        // particleThree.position = new THREE.Vector3(pX, pY, pZ);
        particleThree.default = new THREE.Vector3(pX, pY, pZ);
        particleThree.nodes = []; // We add to this all the nodes that the particle is currently connected to
        particleThree.neighborCount = 0;
        
        particles.push(particleThree)
        
        // We add one vertex per particle to the geometry object which is
        // used to store the position of each particle
        // particleGeometry.vertices.push(particle.position)
        particleGeometry.vertices.push(particleThree);
    }

    // Center the geometry around it's center
    particleGeometry.center();

    const mat = new THREE.PointsMaterial({color:0xffffff, size: 0.1})

    // Previously loaded a material for the particles themselves

    let pMaterial = new THREE.PointsMaterial({
        color: 0xFFFFFF,
        size: 1.5,
        map: new THREE.TextureLoader().load(
            RELATIVE_URL + "particle.png"
        ),
        blending: THREE.AdditiveBlending,
        transparent: true
        });

    const particleMaterial = new THREE.ShaderMaterial({
        uniforms: { 
            color: { type: 'c', value: new THREE.Color( 0xffffff ) }, 
            height: { type: 'f', value: -200 }, 
            elapsedTime: { type: 'f', value: 0 },
            radiusX: { type: 'f', value: 2.5 },
            radiusY: { type: 'f', value: 2.5 },
        },
        vertexShader: document.getElementById( 'vertex-shader' ).textContent,
        fragmentShader: document.getElementById( 'fragment-shader' ).textContent
    })

    // ParticleMesh is the equivalent of ParticleSystem in all the tutorials
    particlesMesh = new THREE.Points(particleGeometry, pMaterial)
    // particlesMesh.position.z = 100;
    particlesMesh.position.y = - 100 / 2;
    // particlesMesh.position.x = 0;


    scene.add(particlesMesh);
}

// Create the particle system and render it into the scene
// createParticleSystem();


// Function triggered after the loading page is clicked, which allows us to lazy-load the potential remaining 3D models
// #performanceOptimization #performance

const loadRemainingModels = async () => {


}


/** End of ThreeJS section **/


// ------------------------------------------------------

// Load Web Audio API & shit
// WEb Audio API is a high level Javascript API for processing and synthesizing audio
// in web applications. Allows dynamic sound effects in games and real-time
// analysis in music visualizers.

// Music visuaalizers create to render ani;mations that are synchronized to changes in
// the music properties, suh as loundness, frequency, etc. 

const AudioContext = window.AudioContext || window.webkitAudioContext;
audioContext = new AudioContext();

let songBuffer, analyser;

// Function called when the user clicks on the SoundWave button on the bottom right when the song has finished
function playSong () {

    window.fetch(chosenSongLink)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => 
        // Creates a short audio asset stored in memory, created from an audio file
        // Once put into an AudioBuffer, the audio can be played by being passed
        // into AudioBufferSourceNode
        audioContext.decodeAudioData(arrayBuffer, 
            audioBuffer => {

                if (enableLogging === true) {
                    console.log(audioBuffer)
                }
        
                source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
        
                // Make sure that the onEnded function is called when the song ends 
                source.onended = onEnded;
        
                // Create the analyzer node and connect it between the input
                // and the output so that it can provide us with data
                // abou the actual sound we have
                analyser = audioContext.createAnalyser();
        
                source.connect(analyser);
        
                if (enableLogging === true) {
                    console.log('Source given is', source);
                }
        
                analyser.connect(audioContext.destination);
        
                // Change the analyser data available so that we can access it later on.
                // By default, the analyser will give us frequency data with 1024 data points.
                // We can change this by setting the fftSize property.
                analyser.fftSize = 64;
                frequencyData = new Uint8Array(analyser.frequencyBinCount);
                domainData = new Uint8Array(analyser.fftSize); // Uint8Array should be the same length as the fftSize
                
                // analyser.getByteFrequencyData(frequencyData);
        
                if (enableLogging === true) {
                    console.log('Analyser is', analyser);
                }
        
                source.start();

            },
            error => console.log('Error decoding audio data', error)
        )

    )
}

/**
 * 
 * Function that is called when the song ends playing
 * Not a pure function. The concept here is twofold:
 * 1. trigger / stop the animations related to the sound playing 
 * 2. hide / show the text related to the sound playing
 * 3. automatically re-play the sound (that can obviously be commented in or out)
 *
 * 
 **/

function onEnded () {

    isSongFinished = true;

    // Ensures that the sound wave shows 'Play' when the song ends & also that the variable musicPlaying is changed to the boolean false
    // at the end of the song
    // stopAnimations();

    if (enableLogging === true) {
        console.log(`Song finished playing ${isSongFinished}`);
        console.log('Now we have the choice between playing another song or replaying this one');
    }

}




// --------------------------------------------------------------------------------


/* Javascript Functions to control the page layout, structure, navigation */

/*
 * 
 * Includes functions that allow us to navigate between pages, to change the elements
 * displayed on the pages, to change the coloring / size / etc. of elements, and also
 * to trigger certain animations
 * 
 */


// Function that removes the initial loading page after the user clicks on the 'Click to Enter' message displayed the first time a user
// lands on the website

function removeInitialLoadingPage () {


    if (initialPageLoadingBarFullyLoaded === true) {

        // You can add if statements that take in account progressive loading
        // or whether the 3D scene and the objects have been completely loaded (thanks to the Loading Manager)

    };

};



/*
 * Cursor Animations & shit
 */

// Set starting position of the cursor outside of the screen

// These two variables will track * at all times * the position of the cursor within the application. 
// They should be used if one therefore wants to create effects related to the cursor or if one wants to display text
// close to the cursor

let clientX = -100;
let clientY = -100;
const innerCursor = document.querySelector(".cursor--small");

function initCursor () {

    // console.log('@initCursor called in order to move the cursor position to the right place');

    // Add listener to track the current mouse position, which constantly updates the two variables that are in the global scope
    document.addEventListener("mousemove", e => {
        clientX = e.clientX;
        clientY = e.clientY;
    },  {passive: true})

    // console.log('Client X for cursor is', clientX);
    // console.log('Client Y for cursor is', clientY);

    innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
    // Transform the inner cursor to the current mouse position
    // Use requestAnimationFrame for smotth perfromance
    

}

function updateCursor () {
    innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
}

/*
 * Cursor Animations II : Setting up the Circle on Canvas
 */

let lastX = 0;
let lastY = 0;
let isStuck = false;
let showCursor = false;
let group, stuckX, stuckY, fillOuterCursor;
let polygon;

function initCanvas () {

    const canvas = document.querySelector(".cursor--canvas");
    const shapeBounds = {
        width: 75,
        height: 75
    }

    paper.setup(canvas);
    const strokeColor = "rgba(255,255,240,1)";
    const strokeWidth = 1;
    const segments = 8;
    const radius = 12;

    // We need these later for the "noisy circle"
    const noiseScale = 150; // Speed
    const noiseRange = 4; // Range of Distortion
    let isNoisy = false; // State

    // The base shape for the noisy circle
    polygon = new paper.Path.RegularPolygon(
        new paper.Point(0,0),
        segments,
        radius,
    );
    polygon.strokeColor = strokeColor;
    polygon.strokeWidth = strokeWidth;
    polygon.smooth();

    group = new paper.Group([polygon]);
    group.applyMatrix = false;

    const noiseObjects = polygon.segments.map(() => new SimplexNoise());
    let bigCoordinates = [];

    // Function for linear interpolation of values
    const lerp = (a, b, n) => {
        return (1-n) * a + n * b;
    }

    // Function to map a value from one range to another range
    const map = (value, in_min, in_max, out_min, out_max) => {
        return (
            ((value - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
        );
    }

    // The Draw Loop of Paper.js
    // 60 FPS with requestAnimationFrame under the hood
    paper.view.onFrame = event => {
        // using linear interpolation, the circle will move 0.2 (20%)
        // of the distance between its current position and the mouse
        // coordinates per Frame
        if (!isStuck) {
          // move circle around normally
            lastX = lerp(lastX, clientX, 0.2);
            lastY = lerp(lastY, clientY, 0.2);
            group.position = new paper.Point(lastX, lastY);
        } else if (isStuck) {
          // fixed position on a nav item
            lastX = lerp(lastX, stuckX, 0.2);
            lastY = lerp(lastY, stuckY, 0.2);
            group.position = new paper.Point(lastX, lastY);
        }
        
        if (isStuck && polygon.bounds.width < shapeBounds.width) { 

            // scale up the shape 
            polygon.scale(1.08);
            
        } else if (!isStuck && polygon.bounds.width > 30) {

          // remove noise
        if (isNoisy) {

            polygon.segments.forEach((segment, i) => {
                segment.point.set(bigCoordinates[i][0], bigCoordinates[i][1]);
            });

            isNoisy = false;
            bigCoordinates = [];

        }
          // scale down the shape
        const scaleDown = 0.92;
        polygon.scale(scaleDown);

        }
        
        // while stuck and big, apply simplex noise
        if (isStuck && polygon.bounds.width >= shapeBounds.width) {
            isNoisy = true;
          // first get coordinates of large circle
            if (bigCoordinates.length === 0) {
                polygon.segments.forEach((segment, i) => {
                bigCoordinates[i] = [segment.point.x, segment.point.y];
            });
        }

          // loop over all points of the polygon
        polygon.segments.forEach((segment, i) => {
            
            // get new noise value
            // we divide event.count by noiseScale to get a very smooth value
            const noiseX = noiseObjects[i].noise2D(event.count / noiseScale, 0);
            const noiseY = noiseObjects[i].noise2D(event.count / noiseScale, 1);
            
            // map the noise value to our defined range
            const distortionX = map(noiseX, -1, 1, -noiseRange, noiseRange);
            const distortionY = map(noiseY, -1, 1, -noiseRange, noiseRange);
            
            // apply distortion to coordinates
            const newX = bigCoordinates[i][0] + distortionX;
            const newY = bigCoordinates[i][1] + distortionY;
            
            // set new (noisy) coodrindate of point
            segment.point.set(newX, newY);
        });

        }

        polygon.smooth();

    };
}

/*
 * Changes the Cursor color to black - Used when the menu transition is triggered
 */

function changeCursorColorToBlack () {
    
    setTimeout(() => {

        const cursorElement = document.getElementById('cursor--small');
        cursorElement.style.background = 'black';
        polygon.strokeColor = "rgba(0,0,0,1)"

    }, 450);

    setTimeout(() => {
        changeCursorColorToWhite();
    }, 1800)

}


/*
 * Changes the Cursor color to White - Used when the menu transition is triggered
 */

function changeCursorColorToWhite () {
    
    const cursorElement = document.getElementById('cursor--small');
    cursorElement.style.background = 'white';

    polygon.strokeColor = "rgba(255,255,240,1)"
}


/*
 * Cursor Animations III : Handling the Hover State
 */

function initHovers () {

    // Find the center of the link element and set stuckX and stuckY to these, so that we can set the position of the noisy circle more easily
    const handleMouseEnter = (e) => {

        // console.log('Mouse entering a button area');

        const navItem = e.currentTarget;
        const navItemBox = navItem.getBoundingClientRect();
        stuckX = Math.round(navItemBox.left + navItemBox.width / 2);
        stuckY = Math.round(navItemBox.top + navItemBox.height / 2);
        isStuck = true;

    }

    // Reset isStuck on MouseLeave
    const handleMouseLeave = (e) => {

        // console.log(`Mouse was stuck on button ${isStuck}`);

        isStuck = false;

    }

    // Add Event Listeners to all .Link class items
    // const linkItems = document.querySelectorAll('.browser-window__link');
    // const soundWaveItem = document.querySelectorAll('.soundwave-container');
    // const plusSignItem = document.querySelectorAll('.plus-sign-container');

    // linkItems.forEach(item => {
    //     item.addEventListener("mouseenter", handleMouseEnter);
    //     item.addEventListener("mouseleave", handleMouseLeave);
    // })

    // soundWaveItem.forEach(item => {
    //     item.addEventListener("mouseenter", handleMouseEnter);
    //     item.addEventListener("mouseleave", handleMouseLeave);
    // })

    // plusSignItem.forEach(item => {
    //     item.addEventListener("mouseenter", handleMouseEnter);
    //     item.addEventListener("mouseleave", handleMouseLeave);
    // })



    // Add Event Listeners to the Title
    // const textItems = document.querySelectorAll('.titleText');

    // textItems.forEach(item => {
    //     item.addEventListener("mouseenter", handleMouseEnter);
    //     item.addEventListener("mouseleave", handleMouseLeave);
    // })
}



function initiateContactPageHovers () {

        // Find the center of the link element and set stuckX and stuckY to these, so that we can set the position of the noisy circle more easily
        const handleMouseEnter = (e) => {

            // console.log('Circle cursor entering area of corner buttons or arrow');

            const navItem = e.currentTarget;
            const navItemBox = navItem.getBoundingClientRect();
            stuckX = Math.round(navItemBox.left + navItemBox.width / 2);
            stuckY = Math.round(navItemBox.top + navItemBox.height / 2);
            isStuck = true;
        }
    
        // Reset isStuck on MouseLeave
        const handleMouseLeave = (e) => {

            // console.log(`Circle cursor was stuck to one of the buttons ${isStuck}`);

            isStuck = false;
        }

        const arrowItem = document.querySelectorAll('.arrowContainer');

        arrowItem.forEach(item => {

            // console.log('Adding event listeners to #arrowItem ');

            item.addEventListener("mouseenter", handleMouseEnter);
            item.addEventListener("mouseleave", handleMouseLeave);
        })
}


/** Event Handler Functions */ 


/**
 * @onDocumentMouseMove: tracks mouse position & normalizes it 
 * 
 */

function onDocumentMouseMove (event) {

    mouseX = ( event.clientX - windowHalfX ) / 100;
    mouseY = ( event.clientY - windowHalfY ) / 100;

}


/**
 * @onActualMouseMove: tracks mouse position.
 * 
 * If we detect that the mouse is hovering a certain element, we can decide to show certain images. e.g. if the cursor hovers a
 * certain menu item
 * 
 */


function onActualMouseMove (event) {

	realMouseX = event.clientX;
    realMouseY = event.clientY;
    
}



/**
 * 
 * detectUserScroll: As the name suggests
 * 
 */

// Constants tracking the previous value of deltaY in order to determine in which direction the user is trying to scroll
let previousDeltaY = 0; 

function detectUserScroll (event) {

    if (enableLogging === true) {
        console.log('User scrolling event is', event);
        console.log('Delta Y is now', deltaY);
    }

    // Catches the Y direction of the wheel event.
    // If deltaY is negative the user is trying to scroll up
    // If deltaY is positive the user is trying to scroll down

    // This if statement ensures that the deltaY variable is only re-assigned and changed when the user is on the Main Menu page
    // Without this statement, then the deltaY would get updated at all times and every time the user would move away from the 
    // menu page and back to menu page, they'd find the White Marble Beetle Objec in a different position.

}


function windowResizeEventHandler () {

    // Update the global variables that we are going to use in order to track whether we need to remove
    // the beetle from the page when the beetle is too small
    dynamicWindowWidth = window.innerWidth;
    dynamicWindowHeight = window.innerHeight;

    // This keeps track of the window width & displays the 'Expertise' Button at the bottom of the company description when the browser window goes below a certain width
    // Chose JS over CSS Media Queries because more control over when the button is displayed 

    if (dynamicWindowWidth < 1000 && pageShown === 'aboutPage' && typeOfAboutPage === 'descriptionText') {

        if (enableLogging === true) {
            console.log('Firing showExpertiseButton function');
        }

    } else if (dynamicWindowWidth >= 1000 && pageShown === 'aboutPage') {

    }


}

/**
 * 
 * trackURLChangesHandler
 * @description: Tracks the pathname / URL in reaction to a browser popstate evetn (which happens when we
 * use history.pushState()) and calls the correct handlers in order to display the correct UI
 * 
 * 
 */

function trackURLChangesHandler () {

    let currentURL = window.location.href;
    let pathName = window.location.pathname;

    console.log('@trackURLChangesHandler var(currentURL) ', currentURL);
    console.log('@trackURLChangesHandler var(pathName)', pathName);

    // Note: Before this function is called, it is important to also create a meta function
    // that changes the path URL (this could potentially be done with history.pushState() or a similar
    // function)

    // Depending on the current path, we display different pages

}


function initializeEventListeners () {


    // Document Events

    // Mouse move used here in order to track the mouse position within the page

    // General
    document.addEventListener('mousemove', onDocumentMouseMove,  {passive: true} );
    document.addEventListener('mousemove', onActualMouseMove,  {passive: true} );
    // Loading Page
    document.addEventListener('click', addCircleToPage);

    // Window Events
    // Scroll related
    window.addEventListener('wheel', detectUserScroll);
    // Resize
    window.addEventListener('resize', windowResizeEventHandler);
    // URL
    window.addEventListener('popstate', trackURLChangesHandler);

}

/**
 * Page Related Functions
 * 
 * The functions below will be triggerered at different point in the application lifecycle 
 * 
 */


/** LOADING PAGE EVENTS **/

/**
 * 
 * Adds a circle that will expand into being a full blown page after the loading 
 * 
 */

// Global Var that tracks whether the main page of the website has been displayed.
// This allows us to prevent triggering the animation that displays the website for the first time
// again and again, based on user clicks.
// Whether the user initially loads the home page or the about page, the loading page will always be 
// the same, and the animation used to display the intended page will always be the same.

var mainPageHasAppeared = false;

function addCircleToPage () {

    if (mainPageHasAppeared == false) {

        // let landingPageElement = document.getElementById('landing--page');

        let landingPageElement = document.createElement('div');
        let mainElement = document.getElementById('main');

        // Set the styling and attributes
        landingPageElement.id = 'landing--page';
        landingPageElement.style.height = '5px';
        landingPageElement.style.minHeight = '5px';
        landingPageElement.style.width = '5px';
        landingPageElement.style.minWidth = '5px';
        landingPageElement.style.borderRadius = '50%';
        landingPageElement.style.position = 'absolute';
        landingPageElement.style.top = `${clientY}px`;
        landingPageElement.style.left = `${clientX}px`;
        landingPageElement.style.backgroundColor = `white`;
        landingPageElement.style.zIndex = `10`;

        document.body.appendChild(landingPageElement);

        // Expands it
        landingPageElement.classList.add('expanded');

        // Ensure to switch the value of the above boolean, to pr event the @addCircleToPage
        // function from running.
        mainPageHasAppeared = true;

        trackURLChangesHandler();

    }
}


function displayHomePage () {

    let homePageContainer = document.getElementById('home--page');
}

function displayAboutPage () {

    let aboutPageContainer = document.getElementById('about--page');

}



// ------------------------------------------------------

/*
*
* Function that will switch the menu button between a hamburger menu and an X depending on the page that we are in
*
*/

const changeMenuIcon = (nextPage) => {


}

// --------------------------------------------------------------------------------

/** 
 * 
 * Higher Order Functions (HOF) that initializes all the functions, variables, etc. that we need in order for the platform
 * and website to function properly
 * 
 */

function init() {

    // Initialize that shit motherfucker.
    initializeMobileDetector();
    initCursor();
    initCanvas();
    initHovers();
    initializeEventListeners();

}

init();


// ------------------------------------------------------

let animate = function () {

    requestAnimationFrame( animate );


    let delta = clock.getDelta(),
        elapsedTime = clock.getElapsedTime(),
        t = elapsedTime * 0.5;

    let time = Date.now() * 0.0005;

    // Can be used to hide or display the 3D models depending on the size of screen
    if (dynamicWindowWidth <= 1000 ) {

        // We remove the Blue Marble Beetle displayed on the Contact page earlier than the other beetles because there is more
        // content
        // if (blueMarbleBeetleObject !== undefined)  {
        //     blueMarbleBeetleObject.visible = false;
        // };

    } 
    

    // Make sure to update cursor
    updateCursor();

    // Update Controls
    controls.update();

    // Update stats
    if (environment === 'dev') {
        stats.update();
    }
    
    // Clear Renderer & re-render to scnee
    // renderer.clear();
    // renderer.render(scene, camera);

};

animate();