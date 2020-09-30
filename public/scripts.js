// ThreeJS related variables
let beetleObject, 
    particles, 
    particlesMesh,
    particleGeometry,  
    pivotPoint, 
    pivotPoint2, 
    light1, 
    clock;

// Raycaster-related variables
let raycaster, raycasterMouse;

// Real Mouse position
let realMouseX, realMouseY;

// Other Beetle Objects
let iceBeetleObject;
let greyBeetleObject;
let whiteBeetleObject;

// Plane Geometries - We're declaring them as global variables so that they can be accessible across different functions - may constitute a memory leak in the JS heap 
// Will look into that later #optimization

let blackRockPlaneGeometry;
let darkGreenPlaneGeometry;
let blackRockPlaneGeometryTwo;
let XPlaneGeometry;
let reversedPlaneGeometry;
let blackWavePlaneGeometry;

let blackRockPlaneMesh;
let darkGreenPlaneMesh;
let blackRockPlaneMeshTwo;
let xPlaneMesh;
let reversedPlaneMesh;
let blackWavePlaneMesh;

let blackMarbleBeetleObject;
let blueMarbleBeetleObject;
let whiteMarbleBeetleObject;
let greyMarbleBeetleObject;
let redPinkMarbleBeetleObject;

let currentBeetleObject; // The beetle object displayed on the page will be assigned (by reference obviously) to this variable
                         // this will ensure that we can always turn off the visibility and turn it back on on the right page

// Constants that controls the delay at which meshes' visibility gets changed
let MESH_VISIBILITY_DELAY = 1100;
let DOM_VISIBILITY_SHORT_DELAY = 200;
let DOM_VISIBILITY_LONG_DELAY = 1700;

let numParticles; // Number of particles that will be set in the Mesh of particles animating the ThreeJS project
let mouseX, mouseY;
let previousClientX, previousClientY, currentClientX, currentClientY;
let arrayOfCursorPositions = [];
let isBeetleWireframe = false;
let stats;

let currentMenuIcon = 'menuIcon';
let beetleColor = 'black';

// Loading Page Related Variables

let initialPageLoadingBarFullyLoaded = false;

// ENVIRONMENT VARIABLES

// IMPORTANT: Sets whether we're going to be in a local development environment or on a deployed server 
// Depending on which one we're in, the relative path to the different files will differ

let environment = 'prod';
// let environment = 'dev';
let RELATIVE_URL = environment === 'dev' ? '/assets/' : '/public/assets/';

let enableLogging = false;

let imageFormat = 'webp';

// Web Audio API-related Variables

let source;
let isSongFinished = false;
let musicStartedPlaying = false;

// Language Related

let frenchLanguageHovered;

// Contact Page Related Variables

let formShowing = false;

// let lightIntensityDivider = 33; // Nina Simone
// let lightIntensityDivider = 29; // Nina Simone
// let lightIntensityDivider = 25; // Trap Beldi
// let lightIntensityDivider = 20;
// let lightIntensityDivider = 8; // Not enough anymore for Erik Satie
let lightIntensityDivider = 7; // Better for Erik Satie

let planeGeometry, planeTexture, planeMaterial, planeMesh;

let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
let dynamicWindowWidth = window.innerWidth;
let dynamicWindowHeight = window.innerHeight;

// Voice Control related constants

let ACTIVATE_VOICE_SHOWN = false;
let DIRECTIONS_VOICE_SHOWN = false;

// Variables related to the different pages that will be shown are going to be declared here

let pageShown = 'homePage';

// The alternative is 'expertiseText' --> We use this variable in order to decide whether we show the expertiseButtonContainer DOM element or not
let typeOfAboutPage = 'descriptionText'

let PAGE_FIRST_LOADED = false;
let MUSIC_PLAYING = false;
let musicPlaying = true; // That's the one actually used

let ANIMATION_STARTED = false;
let MENU_BASED_ANIMATION_STARTED = false;

// Loading Page Based Variables

let loadingPageAnimationFinished = false;
let loadingGraphicalSceneFinished = false;

// --------------------------------------------------------------------------------

/*
 * Scripts that will split the characters of the DOM elements
 *
 *
 */

// const splitItems = Splitting();

// console.log('Split Items are', splitItems);


// --------------------------------------------------------------------------------

/*
 * Mobile Detect Script that will split the characters of the DOM elements
 *
 *
 */

let detector;
let isUserDesktop;

const initializeMobileDetector = () => {
    detector = new MobileDetect(window.navigator.userAgent)

    let isMobile = detector.mobile();
    let isTablet = detector.tablet();
    let phone = detector.tablet();
    let userAgent = detector.userAgent();

    if (enableLogging === true) {
        console.log(`Detector initialized ${detector}`);
        console.log(`Mobile: ${isMobile}`);
        console.log(`User Agent is ${userAgent}`);
    }


    if (isMobile !== null || isTablet !== null || phone !== null) {

        isUserDesktop = false;

    } else {
        
        isUserDesktop = true;
    }
}


initializeMobileDetector();

// --------------------------------------------------------------------------------

/*
 * Scripts that will run after all the items in the page are loaded
 *
 *
 */

const onCompleteLoading = () => {

    if (enableLogging === true) {
        console.log('Removing loading screen from the page');
    }

    let loadingPageElement = document.getElementById('loading-page');
    loadingPageElement.classList.toggle('hiding');

    let loadingPageText = document.getElementById('loadingPage--secondNormalText')

    // Hide the text that says 'Click Anywhere in order to Enter' which shows up within the page
    // if the user decreases the height of browser window
    setTimeout(() => {

        if (enableLogging === true) {
            console.log('Time out run after the page has complete loading');
        }

        loadingPageText.classList.remove('shown');
        // document.getElementById('loading-page').classList.add('deleted');
    }, 2000)

}


// Blotter Related Text

const blotterInitialization = () => {
    // BLOTTER - Example 2
    let text = new Blotter.Text("observation", {
        family : "'EB Garamond', serif",
        size : 27,
        fill : "#171717",
        paddingLeft : 40,
        paddingRight : 40
    });
    
    let material = new Blotter.LiquidDistortMaterial();
    
    // Play with the value for uSpeed. Lower values slow
    // down animation, while higher values speed it up. At
    // a speed of 0.0, animation is stopped entirely.
    material.uniforms.uSpeed.value = 0.25;
    
    // Try uncommenting the following line to play with
    // the "volatility" of the effect. Higher values here will
    // produce more dramatic changes in the appearance of your
    // text as it animates, but you will likely want to keep
    // the value below 1.0.
    //material.uniforms.uVolatility.value = 0.30;
    
    let blotter = new Blotter(material, {
        texts : text
    });
    
    let elem = document.getElementById("distortion-text");
    var scope = blotter.forText(text);
    
    scope.appendTo(elem);
}


// --------------------------------------------------------------------------------

/*
 * Loading Manager 
 * Object / Function provided by ThreeJS in order to track the loading progression of the different models and textures 
 * within the ThreeJS environment
 */

let loadingManager = new THREE.LoadingManager();

loadingManager.onStart = (url, itemsLoaded, itemsTotal) => {

    if (enableLogging === true) {
        console.log('Started loading file ', url, '.\n Loaded ', itemsLoaded, ' of ', itemsTotal, ' files');
        console.log('User desktop', isUserDesktop);
    };

    // Makes sure to start the loading bar animation as soon as the actual loading manager starts
    // & only trigger the loading bar animation if the user is not using a mobile device
    if (isUserDesktop === true) {
        document.getElementById('loadingPage--whiteLoadingBar').classList.add('loading');
    };

    // Makes sure to also trigger the directions that tell the user to turn up their volume

    let loadingPageFirstText = document.getElementById('loadingPage--normalText');

    if (isUserDesktop === false) {
        loadingPageFirstText.innerHTML = 'Please use your desktop for the full experience.';
    };

    document.getElementById('loadingPage--normalText').classList.add('shown');

}

// Function that gets triggered when all of the different objects and textures are correctly loaded 

loadingManager.onLoad = () => {

    if (enableLogging === true) {
        console.log('Loading complete of the file');
    }

    // We add the second variable to ensure that when the animation (the bar reached the end) is finished for the loading page
    // then as soon as the objects are downloaded, the animation for the loading page to be moved up is triggered
    if (PAGE_FIRST_LOADED === false && loadingPageAnimationFinished === true) {
        PAGE_FIRST_LOADED = true;
        // onCompleteLoading();
        loadingGraphicalSceneFinished = true;
    } else if (PAGE_FIRST_LOADED === false && loadingPageAnimationFinished === false) {
        // By doing that, we ensure that when the scene is ready, the variable is changed to true so that when the animation is finished after 10 seconds
        // it knows that it is safe to remove the loading page
        loadingGraphicalSceneFinished = true;
    }


}

// Tracks the progress of the loading of objects

loadingManager.onProgress = (url, itemsLoaded, itemsTotal) => {

    if (enableLogging === true) {
        console.log('Loading file ', url, ' \n Loaded ', itemsLoaded, ' of ', itemsTotal, ' files');

    }

}

// Message that gets logged out when the loading manager encounters an error

loadingManager.onError = (url) => {

    if (enableLogging === true) {
        console.log('An error was encountered while loading ', url);
    }

}

// Function that is triggered when the #loadingBar #animation ends, which triggers the loading page to be completely removed from the page

const showClickMessageToRemoveLoadingPage = () => {

    // Only remove the first type of text & show the second command if user is using a desktop browser
    if (isUserDesktop === true) {
        document.getElementById('loadingPage--secondNormalText').classList.add('shown');
        initialPageLoadingBarFullyLoaded = true;

        // Moves & hides the text that tells the user to 'Turn on the volume'
        // Remove the delay too so that it actually disappears faster - if the delay of 2s, which is written in the CSS rules, stays, then the transition
        // delay takes way too much time to disappear. 
        document.getElementById('loadingPage--normalText').style.transitionDelay = '0s';
        document.getElementById('loadingPage--normalText').style.webkitTransitionDuration = '0.15s';
        document.getElementById('loadingPage--normalText').style.transitionDuration = '0.15s';

        document.getElementById('loadingPage--normalText').classList.remove('shown');
        
    }



}

// Function that removes the initial loading page after the user clicks on the 'Click to Enter' message displayed the first time a user
// lands on the website

const removeInitialLoadingPage = () => {

    // console.log('Removing initial loading page')

    if (initialPageLoadingBarFullyLoaded === true) {

        // Here we get the element that represents the loading page & add the 'hiding' class to it in order to trigger the slideLoadingPage keyframes animation
        // that leads it to be translateY to the top

        if (loadingGraphicalSceneFinished === true)  {
            let loadingPageElement = document.getElementById('loading-page');
            loadingPageElement.classList.toggle('hiding');
            loadingPageAnimationFinished = true;

            let loadingPageText = document.getElementById('loadingPage--secondNormalText')

            // Hide the text that says 'Click Anywhere in order to Enter' which shows up within the page
            // if the user decreases the height of browser window
            setTimeout(() => {
                // console.log('Time out run after the page has complete loading');
                loadingPageText.classList.remove('shown');
                // document.getElementById('loading-page').classList.add('deleted');
            }, 0);

        } else if (loadingGraphicalSceneFinished === false) {
            loadingPageAnimationFinished = true;
        }

        // This should take care of it

        // Also now we trigger the music
        playSong();

        // We also make sure to remove the text from the loading page that asks the user to turn on the volume
        // The page cannot be seen but if the user actually minimizes the window vertically, they can see the message show up
        setTimeout(() => {
            document.getElementById('loadingPage--generalText').classList.add('hiddenAgain');
        }, 4000);

    }

}

// --------------------------------------------------------------------------------


// Split the sentences in different letters
// Used in order to actual reveal the text with a staggered effect.
// Not completed, will finish it later 


// Get relevant DOM elements

let DOM = {
    content: {
        home: {
            section: document.querySelector('content_item'),
            get chars() {
                // return this.section.querySelectorAll('.content_paragraph .word > .char, .whitespace')
            },
            isVisible: true,
        }
    }
}

const timelineSettings = {
    staggerValue: 0.014,
    charsDuration: 0.5,
}

const timeline = gsap.timeline({paused: true})
    .addLabel('start')
    .staggerTo(DOM.content.home.chars, timelineSettings.charsDuration,  {
        ease: 'Power3.easeIn',
        y: '-100%',
        opacity: 0,
    }, timelineSettings.staggerValue, 'start')
    .addLabel('switchtime')
    // Here we do the switch - toggle between the current class for content sections
    .add(() => {
        DOM.content.home.section.classList.toggle('content_item--current')
    })
    // Change the body's background color
    .to(document.body, {
        duration: 0.8,
        ease: 'Power1.easeInOut',
        backgroundColor: '#c3b996'
    }, 'switchtime-=timelineSettings.charsDuration/4')
    // Start values for the about section elemenets will animate in 
 
const switchContent = () => {
    // DOM.links.
}



// Web Audio API related variables
let frequencyData, averageFrequency;
let domainData, averageDomain; // Relates to the waveform of the current audio
let audioContext;

// Function that creates a random number between the min and max that are passed in
const rand = (min,max) => min + Math.random()*(max-min)

// Function which calculates the average number of an array 
const average = (array) => {
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

// Boilerplate code to set a scene, camera, renderer for the ThreeJS project
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 2000 );

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

/*
 * Here we set the Camera into the final position. The Test position is used to check on the particle and light movements from afar
 */

// setCameraTestPosition();
setCameraFinalPosition();


// Renderer & OrbitControls (which help us move around the scene are set)

let renderer = new THREE.WebGLRenderer({
    powerPreference: 'high-performance',
    antialias: false,
    stencil: false,
});

renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// #controls not used anymore so we comment them out 

let controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;


// Sets the stats at the top left of the page so that we can test the frame rate per second of the website as we develop it
const createStats = () => {
    let stats = new Stats();
    stats.setMode(0);
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0';
    stats.domElement.style.top = '0';
    return stats;
};


// Add Stats to the page

if (environment === 'dev') {

    stats = createStats();
    document.body.appendChild(stats.domElement);

}


// Clock
// Used in the shader that moves the different particles around
clock = new THREE.Clock();


// --------------------------------------------------------------------------------

// RAYCASTER-RELATED FUNCTIONS
// ALL DELETED - IT CAUSED ERRORS 

// --------------------------------------------------------------------------------



/*
 * Post Processing part of the code
 */

// let composer = new POSTPROCESSING.EffectComposer(renderer);
// composer.addPass(new POSTPROCESSING.RenderPass(scene, camera)); // Renders the main scene for other passes

// const effectPass = new POSTPROCESSING.EffectPass(
//     camera, 
//     new POSTPROCESSING.UnrealBloomPass()
// );
// effectPass.renderToScreen = true;
// composer.addPass(effectPass);

// const renderScene = new POSTPROCESSING.RenderPass(scene, camera); 

// let bloomPass = new POSTPROCESSING.BloomEffect();
// bloomPass.threshold = 0;
// bloomPass.strength = 1.5;
// bloomPass.radius = 0;

// const effectPass = new POSTPROCESSING.EffectPass(camera, bloomPass);

// composer = new POSTPROCESSING.EffectComposer(renderer);
// composer.addPass(renderScene);
// composer.addPass(bloomPass);

// console.log('Composer createad', composer);
// console.log('Effect pass created', bloomPass);


const bloomOptions = {
    luminanceThreshold: 89,
    luminanceSmoothing: 90.5,
    height: 480
};


// Commenting it out since we're commenting out the script from the index.html file in order to improve the loading performance of the website for Google

// const composer = new POSTPROCESSING.EffectComposer(renderer);
// composer.addPass(new POSTPROCESSING.RenderPass(scene, camera));

// let glitchPass = new POSTPROCESSING.GlitchEffect();
// let bloomEffect = new POSTPROCESSING.BloomEffect(bloomOptions);

// const effectPassA = new POSTPROCESSING.EffectPass(camera, bloomEffect);
// effectPassA.renderToScreen = true;

// glitchPass.renderToScreen = true;
// composer.addPass(effectPassA);

// Post Processing currently not working

// -------------------------------------------------

// Lights

let keyLight = new THREE.DirectionalLight(new THREE.Color('hsl(30, 100%, 75%)'), 1.0);
keyLight.position.set(-100, 0, 100);
keyLight.target.position.set(0, 180, 0)


let fillLightOne = new THREE.DirectionalLight(new THREE.Color('hsl(210, 100%, 75%)'), 0.75);
fillLightOne.position.set(100, 0, 100);

let fillLight = new THREE.DirectionalLight(new THREE.Color('hsl(240, 100%, 75%)'), 0.75);
fillLight.position.set(100, 0, 100);

let backLight = new THREE.DirectionalLight(0xffffff, 1.0);
backLight.position.set(100, 0, -100).normalize();

let pointLight = new THREE.PointLight( 0xffffff, 10, 40);
pointLight.position.set( 0, 120, 0 ).normalize(); 

let ambientLight = new THREE.AmbientLight(0x555555, 1);
// scene.add(0, 140, 0);
scene.add(ambientLight);

// Main Light used in order to light up the Beetle Object. A SpotLightHelper is created below in order to help us
// visualize how the light is moving and whether it's cone is wide enough to hit the object and light it, casting
// a shadow on it's corners

let spotLightIntensity = 2;
let spotLightColor = 0xffffff;
let spotLight = new THREE.SpotLight(spotLightColor, 4, 200, Math.PI/2);
spotLight.position.set(0, 160, 0);
spotLight.target.position.set(0, 100, 0);
spotLight.castShadow = true;
spotLight.angle = Math.PI / 10;
spotLight.intensity = 5;
scene.add(spotLight);
scene.add(spotLight.target);

// Set up shadow properties for the SpotLight
// spotLight.castShadow.camera.near = 0.5;
// spotLight.castShadow.camera.far = 15000;

let spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLightHelper);


// Previously added two spotlights that are located at the left and right of the BeetleObject and that were supposed to light up
// and illuminate the sides of the Object when the audio is above a certain frequency. Did not work correctly as it ended up 
// illuminating the actual Beetle Object too much and the effect was barely noticeable. Will come back to it or completely scratch
// that from the project later.

let spotLightTwo = new THREE.SpotLight(spotLightColor, 2);
let spotLightThree = new THREE.SpotLight(spotLightColor, 2);
spotLightTwo.position.set(-250, 220, 0);
spotLightThree.position.set(250, 220, 0);
spotLightTwo.target.position.set(0, 300, 0);
spotLightThree.target.position.set(0, 300, 0);
spotLightTwo.angle = Math.PI / 10;
spotLightThree.angle = Math.PI / 10;
let spotLightHelperTwo = new THREE.SpotLightHelper(spotLightTwo);
let spotLightHelperThree = new THREE.SpotLightHelper(spotLightThree);
// scene.add(spotLightTwo);
// scene.add(spotLightThree);
// scene.add(spotLightHelperTwo)
// scene.add(spotLightHelperThree);


// Point Light created and inspired by the previous code
// var sphere = new THREE.SphereBufferGeometry( 5, 16, 8 );
// light1 = new THREE.PointLight( 0xffffff, 2, 50 );
// light1.add( new THREE.Mesh( sphere, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) );
// light1.position.x = 0;
// light1.position.y = 180;
// light1.position.z = 0;

// #toDo: light1 doesn't seem to be changing anything. Revisit it it's purpose later on.
// scene.add( light1 );


// scene.add(pointLight);
// scene.add(keyLight);
// scene.add(fillLight);
// scene.add(backLight);

// ------------------------------------------------

/*
 * 
 * Fog Element
 * 
 */

 // Add Fog, set color and add it to the scene.
// scene.fog = new THREE.FogExp2(0x000000, 0.001);
// renderer.setClearColor(scene.fog.color);

scene.fog = new THREE.FogExp2(0x11111f, 0.002);
renderer.setClearColor(scene.fog.color);


// ------------------------------------------------

/*
 * 
 * Cloud Plane & Background
 * 
 */

let cloudParticles = [];
let cloud;
let lightning;

// Loader for the Smoke that will represent the different clouds
let textureLoader = new THREE.TextureLoader(loadingManager);
// Loader for all the different objects in the scene
let objLoader = new THREE.OBJLoader(loadingManager);

// textureLoader.load(RELATIVE_URL + 'smoke.png', (texture) => {
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
//     let cloudGeometry = new THREE.PlaneBufferGeometry(1500, 1500);
//     let cloudMaterial = new THREE.MeshLambertMaterial({
//         map: texture,
//         transparent: true,
//     })
//     let cloudMaterialTwo = new THREE.MeshBasicMaterial({
//         color: 0x0000ff, 
//         wireframe: true
//     })

//     for (let p=0; p<3; p++) {
//         cloud = new THREE.Mesh(cloudGeometry, cloudMaterial);
//         cloud.position.set(
//            0,
//             -50,
//             0,
//         );
//         cloud.rotation.x = - (Math.PI / 2);
//         // cloud.rotation.y = -0.12
//         cloud.rotation.z = -0.12;
//         cloud.material.opacity = 0.6;
//         cloudParticles.push(cloud);
//         // Clouds currently not working so we will actually hide them from the scene for now
//         // scene.add(cloud);


//     }
// })

// Function that animates the Cloud Plane Geometry

const animateCloud = () => {
    cloud.rotation.z += 0.002;
}

const createLightForCloud = () => {
    lightning = new THREE.PointLight(0x062d89, 100, 400 ,1.7);
    lightning.position.set(0,-200,0);
    let sphereSize = 10;
    let pointLightHelper= new THREE.PointLightHelper(lightning, sphereSize);
    scene.add(lightning);
    scene.add(pointLightHelper)
}


// createLightForCloud();

const animateLightning = () => {
    if(Math.random() > 0.93 || lightning.power > 100) {
        if(lightning.power < 100) 
          lightning.position.set(
            Math.random()*400,
            -200,
            Math.random()*400,
          );
        lightning.power = 50 + Math.random() * 500;
      }
}

// ------------------------------------------------


// Create and set the different Axes #helper #toDelete
let axesHelper = new THREE.AxisHelper(1000);
// scene.add(axesHelper);

// let mtlLoader = new THREE.TextureLoader();
// mtlLoader.setTexturePath(RELATIVE_URL);
// mtlLoader.setPath(RELATIVE_URL);
// mtlLoader.load('blackMarble.jpg', function (materials) {

// materials.preload();

/*
 * Initial Implemntation of the below function
 * We're commenting out the code below, which initially just ran uncontained and we put it in the createBlackMarbleBeetle function below
 */


// let texture = textureLoader.load(RELATIVE_URL + 'blackMarble2.jpg' );
// // immediately use the texture for material creation
// // let material = new THREE.MeshPhongMaterial( { map: texture } );
// // material.emissive('#4d2f78');
// // console.log('Material has properties', material);
// let material = new THREE.MeshPhongMaterial({ map: texture });

// let objLoader = new THREE.OBJLoader(loadingManager);
// // objLoader.setMaterials(materials);
// objLoader.setPath(RELATIVE_URL);
// objLoader.load('beetle.obj', function (object) {


//     object.traverse(function(node) {
//         if (node.isMesh) {
//             node.material = material;
//             // Output the different meshes that we found 
//             // console.log('Encountered Mesh', node)
//         }
//     })

//     beetleObject = object;
//     beetleObject.position.y = 100;
//     beetleObject.rotation.y = 158 * 0.02;
//     // beetleObject.rotation.z = - (Math.PI / 6)
//     beetleObject.position.z = 20;
//     beetleObject.scale.x = beetleObject.scale.y = beetleObject.scale.z = 1.15;
//     beetleObject.name = 'beetle';
//     scene.add(beetleObject);

//     // Activate this in order to get it to change colors automatically
//     // Will later on be set up so that the colors change depending on the actual buttons clicked
//     // setTimeout(changeTexture, 5000)


//     // Associate the light to the Beetle Object as a pivot point

//     pivotPoint = new THREE.Object3D();
//     beetleObject.add(pivotPoint);
//     pivotPoint.add(light1);

//     pivotPoint2 = new THREE.Object3D();
//     beetleObject.add(pivotPoint2);
//     pivotPoint2.add(spotLight);
//     // console.log('Pivot point 2', pivotPoint2);

//     // console.log('Pivot point one', pivotPoint)
// });

// });


/*
 * createBlackMarbleBeetle
 * Function designed in order to create black marble beetle and set it on the screen  
 */

const createBlackMarbleBeetle = () => {
    
    let material;

    let assetURL = imageFormat === 'webp' ? 'blackMarble2.webp' : 'blackMarble2.jpg';

    textureLoader.load(RELATIVE_URL + assetURL, (texture) => {
        material = new THREE.MeshPhongMaterial({ map: texture });
        // objLoader.setMaterials(materials);
        objLoader.setPath(RELATIVE_URL);
        objLoader.load('beetle.obj', function (object) {


            object.traverse(function(node) {
                if (node.isMesh) {
                    node.material = material;
                    // Output the different meshes that we found 
                    // console.log('Encountered Mesh', node)
                }
            })

            blackMarbleBeetleObject = object;
            blackMarbleBeetleObject.position.y = 100;
            blackMarbleBeetleObject.rotation.y = 158 * 0.02;
            blackMarbleBeetleObject.position.z = 20;
            blackMarbleBeetleObject.scale.x = blackMarbleBeetleObject.scale.y = blackMarbleBeetleObject.scale.z = 1.15;
            blackMarbleBeetleObject.name = 'beetle';

            // Make invisible
            blackMarbleBeetleObject.visible = true;
            
            // We assign the object to the currentBeetleObject variable in order to be able to acces sit later on and change the visibility
            // back on when the width or height of the window changes sizes.
            currentBeetleObject = blackMarbleBeetleObject;

            // Evidently, we add the obejct to the scene. 
            scene.add(blackMarbleBeetleObject);



            // Activate this in order to get it to change colors automatically
            // Will later on be set up so that the colors change depending on the actual buttons clicked
            // setTimeout(changeTexture, 5000)

            // Associate the light to the Beetle Object as a pivot point

            // pivotPoint = new THREE.Object3D();
            // blackMarbleBeetleObject.add(pivotPoint);
            // pivotPoint.add(light1);

            // pivotPoint2 = new THREE.Object3D();
            // blackMarbleBeetleObject.add(pivotPoint2);
            // pivotPoint2.add(spotLight);

            // beetleObject.visible = false;
        });

    });

}



// -------------------------------------------------------

// Create Plane Geometry

const createPlaneGeometry = () => {
    planeGeometry = new THREE.PlaneGeometry(2000, 2000, 2000);

    let planeTexture;
    
    if (imageFormat === 'webp') {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blueRock.webp');
    } else {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blueRock.jpg');
    }

    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planeTexture, transparent: false});
    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set(0,-50,0);
    planeMesh.rotation.x =  - (Math.PI / 2);
    // planeMesh.visible = false;

    // Add Plane Mesh to the scene
    scene.add(planeMesh);
}

// 2. Black Rock Plane - About Page

const createBlackPlaneGeometry = () => {
    // Black Plane that's displayed in the 'About' page
    blackRockPlaneGeometry = new THREE.PlaneGeometry(2000, 2000, 2000);

    let planeTexture;

    if (imageFormat === 'webp') {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blackRockAbout.webp');
    } else {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blackRock.png');
    }

    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planeTexture, transparent: false});
    blackRockPlaneMesh = new THREE.Mesh(blackRockPlaneGeometry, planeMaterial);
    blackRockPlaneMesh.position.set(0,-160,0);
    blackRockPlaneMesh.rotation.x =  - (Math.PI / 2);

    scene.add(blackRockPlaneMesh);
}

// Not used anymore
// V.1
// 3. Turquoise Rock Plane - Main Menu
// V.1

const createTurquoisePlaneGeometry = () => {
    darkGreenPlaneGeometry = new THREE.PlaneGeometry(2000, 2000, 2000);
    planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'turquoiseMarble.jpg');
    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planeTexture, transparent: false});
    darkGreenPlaneMesh = new THREE.Mesh(darkGreenPlaneGeometry, planeMaterial);
    darkGreenPlaneMesh.position.set(0,-50,0);
    darkGreenPlaneMesh.rotation.x =  - (Math.PI / 2);

    scene.add(darkGreenPlaneMesh);
}

// 1. Blue Ice-Looking Plane - Home Page

const createBluePlaneGeometry = () => {
    planeGeometry = new THREE.PlaneGeometry(2000, 2000, 2000);

    let planeTexture;
    
    if (imageFormat === 'webp') {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blueRock.webp');
    } else {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blueRock.jpg');
    }

    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planeTexture, transparent: false});
    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set(0,-50,0);
    planeMesh.rotation.x =  - (Math.PI / 2);

    scene.add(planeMesh);
}

// Not Used

const createRockyTerrainGeometry = () => {
    planeGeometry = new THREE.PlaneGeometry(2000, 2000, 2000);
    planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'rockyTerrain.jpg');
    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planeTexture, transparent: false});
    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set(0,-50,0);
    planeMesh.rotation.x =  - (Math.PI / 2);
    scene.add(planeMesh);
}


// 3. Black Rocky Terrain - Contact Page

const createBlackRockGeometry = () => {
    // Black Plane that's displayed in the 'Contact page - difference between this and the one above
    // is the file type. png vs. jpg.
    blackRockPlaneGeometryTwo = new THREE.PlaneGeometry(2000, 2000, 2000);

    let planeTexture;
    
    if (imageFormat === 'webp') {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blackRockContact.webp');
    } else {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blackRock.jpg');
    }
    
    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planeTexture, transparent: false});
    blackRockPlaneMeshTwo = new THREE.Mesh(blackRockPlaneGeometryTwo, planeMaterial);
    blackRockPlaneMeshTwo.position.set(0,-250,0);
    blackRockPlaneMeshTwo.rotation.x =  - (Math.PI / 2);
    scene.add(blackRockPlaneMeshTwo);
}

// 4. Black & White Rock - Client Page

const createWhiteBlackPlaneGeometry = () => {

    XPlaneGeometry = new THREE.PlaneGeometry(2000, 2000, 2000);

    let planeTexture;
    
    if (imageFormat === 'webp') {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blackWhiteRock.webp');
    } else {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blackWhiteRock.jpg');
    }

    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planeTexture, transparent: false});
    xPlaneMesh = new THREE.Mesh(XPlaneGeometry, planeMaterial);
    xPlaneMesh.position.set(0,-280,0);
    xPlaneMesh.rotation.x =  - (Math.PI / 2);
    scene.add(xPlaneMesh);

}


// Not used
const createGreyGoldPlaneGeometry = () => {
    planeGeometry = new THREE.PlaneGeometry(2000, 2000, 2000);
    planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'greyMarble5.jpg');
    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planeTexture, transparent: false});
    planeMesh = new THREE.Mesh(planeGeometry, planeMaterial);
    planeMesh.position.set(0,-50,0);
    planeMesh.rotation.x =  - (Math.PI / 2);
    scene.add(planeMesh);
}

const createReversedBlackPlaneGeometry = () => {
    // Black Plane that's displayed in the 'About' page
    reversedPlaneGeometry = new THREE.PlaneGeometry(2000, 2000, 2000);
    planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blackRock.png');
    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planeTexture, transparent: false});
    reversedPlaneMesh = new THREE.Mesh(reversedPlaneGeometry, planeMaterial);
    reversedPlaneMesh.position.set(0,-48,0);
    reversedPlaneMesh.rotation.x = (Math.PI / 2);

    scene.add(reversedPlaneMesh);
}

// 5. Main Menu 
// V.2

const createBlackWavePlaneGeometry = () => {
    blackWavePlaneGeometry = new THREE.PlaneGeometry(2000, 2000, 2000);
    let planeTexture;
    
    if (imageFormat === 'webp') {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blackWaves.webp');
    } else {
        planeTexture = new THREE.TextureLoader().load(RELATIVE_URL + 'blackWaves.jpg');
    }

    planeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: planeTexture, transparent: false});
    blackWavePlaneMesh = new THREE.Mesh(blackWavePlaneGeometry, planeMaterial);
    blackWavePlaneMesh.position.set(0,-50,0);
    blackWavePlaneMesh.rotation.x =  - (Math.PI / 2);
    scene.add(blackWavePlaneMesh);
}
 


// Function used to remove the current plane geometry before we change it to something else

const removePlaneGeometry = () => {
    scene.remove(planeMesh);
    planeMesh.geometry.dispose();
    planeMesh.material.dispose();
    planeMesh = undefined; 
}

// Function Calls


// Not used anymore
// V.1 of the application --> We load the first plane geometry upon page loading and then load all the other planes one after the other when we decide to switch between pages

// createPlaneGeometry();


// Used now
// V.2 of the application, we load all of the different plane geometries (and the beetle objects with the correct textures upon loading) & then changed the visibility in order
// to ensure that they are always visible with no lag in between different page transitions

// The two functions below will create the planes & the beetle object upon first page load

const createInitialPlaneGeometries = () => {
    // About Page Plane
    createBlackPlaneGeometry();
    // Contact Page Plane 
    createBlackRockGeometry();
    // Main Menu
    createBlackWavePlaneGeometry();
    // Home Page Plane
    createPlaneGeometry();
    // Client Page Plane
    createWhiteBlackPlaneGeometry(); // Currently Grey
    // 

    // About Page
    blackRockPlaneMesh.visible = false;
    // Main Menu Page

    // V.1 
    // darkGreenPlaneMesh.visible = false;
    // V.1

    // V.2
    blackWavePlaneMesh.visible = false;

    // Contact Page
    blackRockPlaneMeshTwo.visible = false;
    // Home Page
    planeMesh.visible = true;
    // Client / FAQ Page
    xPlaneMesh.visible = false;
    // Reversed
    // reversedPlaneMesh.visible = false;

    // Used for testing in order to see how smooth the three js transition is between one plane's visibility turned off and another plane's visibility
    // turned on

    // setTimeout(() => {
    //     blackRockPlaneMesh.visible = true;
    //     planeMesh.visible = false;
    // }, 15000)

}

// Initial call #initialCall #initialization 

createInitialPlaneGeometries();

// Create particle system

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


    // console.log('particlesMesh is ', particlesMesh)
    // particlesMesh.sortParticles = true;
    // particlesMesh.scale.x = particlesMesh.scale.y = particlesMesh.scale.z = 0.01;

    scene.add(particlesMesh);
}

// Update Particle System


// Animation loop for particles

const createSmokeSystem = () => {
    let smokeTexture = new THREE.TextureLoader().load('https://s3-us-west-2.amazonaws.com/s.cdpn.io/95637/Smoke-Element.png');
    let smokeMaterial = new THREE.MeshLambertMaterial({color: 0xffffff, map: smokeTexture, transparent: true});
    let smokeGeo = new THREE.PlaneGeometry(300,300);
    let smokeParticles = [];


    for (p = 0; p < 150; p++) {
        var particle = new THREE.Mesh(smokeGeo,smokeMaterial);
        particle.position.set(Math.random()*500-250,Math.random()*500-250,Math.random()*1000-100);
        particle.rotation.z = Math.random() * 360;
        scene.add(particle);
        smokeParticles.push(particle);
    }
}

// createSmokeSystem()

createParticleSystem();

let textureCounter = 1;

// Not used

let changeTexture = () => {

    // Remove object from Scene
    let name = 'beetle'
    let selectedObject = scene.getObjectByName(beetleObject.name);
    scene.remove( selectedObject );
    // animate();
 

    let material = new THREE.MeshNormalMaterial({wireframe: true});
    // let objLoader = new THREE.OBJLoader();
    // objLoader.setMaterials(materials);
    objLoader.setPath(RELATIVE_URL);
    objLoader.load('beetle.obj', function (object) {
    
        object.traverse(function(node) {
            if (node.isMesh) {
                node.material = material;
                // console.log('Encountered Mesh', node)
            }

        })
    
        beetleObject = object;
        beetleObject.position.y = 100;
        beetleObject.rotation.y = 158 * 0.02;
        beetleObject.scale.x = beetleObject.scale.y = beetleObject.scale.z = 1.35;

        scene.add(beetleObject);
    });

    if (textureCounter === 1) {
        textureCounter = 2;
        setTimeout(changeBeetleToGreyMarble, 5000);
    } else if (textureCounter == 2) {
        textureCounter = 3;
        seTimeout(changeBeetleToWhiteMarble, 5000);
    } else if (textureCounter == 3) {
        textureCounter = 4;
        seTimeout(changeBeetleToGreenMarble, 5000);
    } 
}

// Black Marble Texture Change
const changeBeetleToBlackMarble = () => {

    let assetURL = imageFormat === 'webp' ? 'blackMarble2.webp' : 'blackMarble2.jpg';

    let texture = textureLoader.load(RELATIVE_URL + assetURL );
    // immediately use the texture for material creation
    let material = new THREE.MeshPhongMaterial( { map: texture } );
    
    // let objLoader = new THREE.OBJLoader();
    // objLoader.setMaterials(materials);
    objLoader.setPath(RELATIVE_URL);
    objLoader.load('beetle.obj', function (object) {
    
        object.traverse(function(node) {
            if (node.isMesh) {
                node.material = material;
                // console.log('Encountered Mesh', node)
            }

        })
    
        beetleObject = object;
        beetleObject.name = 'beetle'
        beetleObject.position.y = 100;
        beetleObject.rotation.y = 158 * 0.02;
        beetleObject.position.z = 20;
        beetleObject.scale.x = beetleObject.scale.y = beetleObject.scale.z = 1.15;

        
        scene.add(beetleObject);
        // setTimeout(changeBeetleToGreenMarble, 5000);

        // Associate the light to the pivot point once again
        pivotPoint = new THREE.Object3D();
        beetleObject.add(pivotPoint);
        pivotPoint.add(light1);
    
        pivotPoint2 = new THREE.Object3D();
        beetleObject.add(pivotPoint2);
        pivotPoint2.add(spotLight);
    });
}


// White Marble Texture Change
// Used in About Page

const changeBeetleToWhiteMarble = () => {

    let material;

    let assetURL = imageFormat === 'webp' ? 'whiteMarble.webp' : 'whiteMarble.jpg';

    textureLoader.load(RELATIVE_URL + assetURL, (texture) => {
        material = new THREE.MeshPhongMaterial( { map: texture } );

        // let objLoader = new THREE.OBJLoader();
        // objLoader.setMaterials(materials);
        objLoader.setPath(RELATIVE_URL);
        objLoader.load('beetle.obj', function (object) {
        
            object.traverse(function(node) {
                if (node.isMesh) {
                    node.material = material;
                    // console.log('Encountered Mesh', node)
                }

            })
        
            whiteMarbleBeetleObject = object;
            // whiteMarbleBeetleObject.name = 'beetle'
            whiteMarbleBeetleObject.position.y = 100;
            whiteMarbleBeetleObject.rotation.y = 158 * 0.02;
            whiteMarbleBeetleObject.position.z = 20;
            whiteMarbleBeetleObject.scale.x = whiteMarbleBeetleObject.scale.y = whiteMarbleBeetleObject.scale.z = 1.15;

            
            scene.add(whiteMarbleBeetleObject);
            // setTimeout(changeBeetleToGreenMarble, 5000);

            // Make Beetle Object Invisible upon first page loading
            whiteMarbleBeetleObject.visible = false;

            // Associate the light to the pivot point once again
            
            // Commenting these out since there's an error when we try to load all the beetles at once

            // pivotPoint = new THREE.Object3D();
            // whiteMarbleBeetleObject.add(pivotPoint);
            // pivotPoint.add(light1);
        
            // pivotPoint2 = new THREE.Object3D();
            // whiteMarbleBeetleObject.add(pivotPoint2);
            // pivotPoint2.add(spotLight);

            // console.log('White Beetle Object loaded');
        });

    });
    
}

// X Marble Texture Change
// Used in FAQ page

const changeBeetleToDarkGreyMarble = () => {

    let material;

    let assetURL = imageFormat === 'webp' ? 'greyMarble5copy.webp' : 'greyMarble5.jpg';

    textureLoader.load(RELATIVE_URL + assetURL, (texture) => {
        // immediately use the texture for material creation
        material = new THREE.MeshPhongMaterial( { map: texture } );
        // let objLoader = new THREE.OBJLoader();
        // objLoader.setMaterials(materials);

        objLoader.setPath(RELATIVE_URL);
        objLoader.load('beetle.obj', function (object) {
        
            object.traverse(function(node) {
                if (node.isMesh) {
                    node.material = material;
                    // console.log('Encountered Mesh', node)
                }

            })
        
            redPinkMarbleBeetleObject = object;
            redPinkMarbleBeetleObject.name = 'beetle'
            redPinkMarbleBeetleObject.position.y = 100;
            redPinkMarbleBeetleObject.rotation.y = 158 * 0.02;
            redPinkMarbleBeetleObject.position.z = 20;
            redPinkMarbleBeetleObject.scale.x = redPinkMarbleBeetleObject.scale.y = redPinkMarbleBeetleObject.scale.z = 1.15;

            scene.add(redPinkMarbleBeetleObject);

            // Make it visible or invisible
            redPinkMarbleBeetleObject.visible = false;


            // setTimeout(changeBeetleToGreenMarble, 5000);

            // Associate the light to the pivot point once again
            // pivotPoint = new THREE.Object3D();
            // greyMarbleBeetleObject.add(pivotPoint);
            // pivotPoint.add(light1);
        
            // pivotPoint2 = new THREE.Object3D();
            // greyMarbleBeetleObject.add(pivotPoint2);
            // pivotPoint2.add(spotLight);

        });

    });

};

// Grey Marble Texture Change
// Used in Main Menu Page
// Not used anymore

const changeBeetleToGreyMarble = () => {
    
    let material;

    let assetURL = imageFormat === 'webp' ? 'greyMarble5copy.webp' : 'greyMarble5.jpg';

    textureLoader.load(RELATIVE_URL + assetURL, (texture) => {
        // immediately use the texture for material creation
        material = new THREE.MeshPhongMaterial( { map: texture } );
        // let objLoader = new THREE.OBJLoader();
        // objLoader.setMaterials(materials);

        objLoader.setPath(RELATIVE_URL);
        objLoader.load('beetle.obj', function (object) {
        
            object.traverse(function(node) {
                if (node.isMesh) {
                    node.material = material;
                    // console.log('Encountered Mesh', node)
                }

            })
        
            greyMarbleBeetleObject = object;
            greyMarbleBeetleObject.name = 'beetle'
            greyMarbleBeetleObject.position.y = 100;
            greyMarbleBeetleObject.rotation.y = 158 * 0.02;
            greyMarbleBeetleObject.position.z = 20;
            greyMarbleBeetleObject.scale.x = greyMarbleBeetleObject.scale.y = greyMarbleBeetleObject.scale.z = 1.15;


            // Comment in the two lines below in order to make sure that the Beetle Mesh is positioned to the left
            // Experimented with this position & rotation once I decided to redesign the About page, remove the Samarra & Co. 
            // usually at the center, and put an 'About' header on the left of the page
            
            // greyMarbleBeetleObject.position.x = -60;
            // greyMarbleBeetleObject.rotation.z = 0.41;

            scene.add(greyMarbleBeetleObject);

            // Make it visible or invisible
            greyMarbleBeetleObject.visible = false;


            // setTimeout(changeBeetleToGreenMarble, 5000);

            // Associate the light to the pivot point once again
            // pivotPoint = new THREE.Object3D();
            // greyMarbleBeetleObject.add(pivotPoint);
            // pivotPoint.add(light1);
        
            // pivotPoint2 = new THREE.Object3D();
            // greyMarbleBeetleObject.add(pivotPoint2);
            // pivotPoint2.add(spotLight);

            // console.log('Grey Beetle Object Loaded')
        });

    });

}



// Green Marble Texture Change
// Not used

const changeBeetleToGreenMarble = () => {
    let texture = textureLoader.load(RELATIVE_URL + 'greenMarble.jpg' );
    // immediately use the texture for material creation
    let material = new THREE.MeshPhongMaterial( { map: texture } );
    
    // let objLoader = new THREE.OBJLoader();
    // objLoader.setMaterials(materials);
    objLoader.setPath(RELATIVE_URL);
    objLoader.load('beetle.obj', function (object) {
    
        object.traverse(function(node) {
            if (node.isMesh) {
                node.material = material;
                console.log('Encountered Mesh', node)
            }
        })
    
        beetleObject = object;
        beetleObject.name = 'beetle'
        beetleObject.position.y = 100;
        beetleObject.rotation.y = 158 * 0.02;
        beetleObject.scale.x = beetleObject.scale.y = beetleObject.scale.z = 1.35;

        scene.add(beetleObject);
        setTimeout(changeBeetleToRuby, 2000);

    });
}

// Blue Marble #blueMarble Beetle
// Used in Contact Page

const changeBeetleToBlueMarble = () => {

    let material;

    let assetURL = imageFormat === 'webp' ? 'blueMarble3.webp' : 'blueMarble3.jpg';

    // let texture = textureLoader.load( RELATIVE_URL + 'brownMarble.jpg' );
    textureLoader.load(RELATIVE_URL + assetURL, (texture) => {
        material = new THREE.MeshPhongMaterial( { map: texture } );


        // immediately use the texture for material creation
        // let material = new THREE.MeshNormalMaterial({wireframe: true});
        
        // let objLoader = new THREE.OBJLoader();
        // objLoader.setMaterials(materials);
        objLoader.setPath(RELATIVE_URL);
        objLoader.load('beetle.obj', function (object) {
        
            object.traverse(function(node) {
                if (node.isMesh) {
                    node.material = material;
                    // console.log('Encountered Mesh', node)
                }

            })
        
            blueMarbleBeetleObject = object;
            blueMarbleBeetleObject.name = 'beetle'
            blueMarbleBeetleObject.position.y = 100;
            blueMarbleBeetleObject.rotation.y = 158 * 0.02;
            blueMarbleBeetleObject.position.z = 20;
            blueMarbleBeetleObject.scale.x = blueMarbleBeetleObject.scale.y = blueMarbleBeetleObject.scale.z = 1.15;

            // Make the beetle invisible upon page initial loading
            blueMarbleBeetleObject.visible = false;

            scene.add(blueMarbleBeetleObject);

            // Associate the light to the pivot point once again
            // pivotPoint = new THREE.Object3D();
            // blueMarbleBeetleObject.add(pivotPoint);
            // pivotPoint.add(light1);
        
            // pivotPoint2 = new THREE.Object3D();
            // blueMarbleBeetleObject.add(pivotPoint2);
            // pivotPoint2.add(spotLight);

            // console.log('Blue Beetle Object loaded')
        });
    });
    
}


// Projects Michel Angelo's Creation of Adam's painting onto the Beetle
// Not used - also wrong names for both the texture & the above description

const changeBeetleToDarkGreenMarble = () => {

    let texture = textureLoader.load( RELATIVE_URL + 'brownMarble.jpg' );
    // immediately use the texture for material creation
    let material = new THREE.MeshPhongMaterial( { map: texture } );
    
    // let objLoader = new THREE.OBJLoader();
    // objLoader.setMaterials(materials);
    objLoader.setPath(RELATIVE_URL);
    objLoader.load('beetle.obj', function (object) {
    
        object.traverse(function(node) {
            if (node.isMesh) {
                node.material = material;
                // console.log('Encountered Mesh', node)
            }

        })
    
        beetleObject = object;
        beetleObject.name = 'beetle'
        beetleObject.position.y = 100;
        beetleObject.rotation.y = 158 * 0.02;
        beetleObject.position.z = 20;
        beetleObject.scale.x = beetleObject.scale.y = beetleObject.scale.z = 1.15;

        
        scene.add(beetleObject);
        // setTimeout(changeBeetleToGreenMarble, 5000);

        // Associate the light to the pivot point once again
        pivotPoint = new THREE.Object3D();
        beetleObject.add(pivotPoint);
        pivotPoint.add(light1);
    
        pivotPoint2 = new THREE.Object3D();
        beetleObject.add(pivotPoint2);
        pivotPoint2.add(spotLight);
    });


}

// Application V.1: Initial call that loads the Beetle Geometry with the homepage's correct texture and ensures that it appears on the screen

// createBlackMarbleBeetle();

// Application V.2: Initial call that loads all the different beetle object with the different textures and ensures that they are loaded onto the scene but with their visibility off

const createInitialBeetleObjects = async () => {

    // Contact Page Beetle
    changeBeetleToBlueMarble();
    // Home Page Beetle
    createBlackMarbleBeetle();
    // Main Menu Page Beetle
    changeBeetleToGreyMarble();
    // About Page Beetle
    changeBeetleToWhiteMarble();
    // FAQ Page Beetle 
    changeBeetleToDarkGreyMarble();

    // The functions above are asynchronous so none of these work 
    // blackMarbleBeetleObject.visible = false;
    // blueMarbleBeetleObject.visible = false;
    // greyMarbleBeetleObject.visible = false;
    // blueMarbleBeetleObject.visible = true;

}

// Call to the function

createInitialBeetleObjects();


// ------------------------------------------------------

// Light-related changes 
// Some light changes will shift depending on the color of the marble that is displayed

// This function modifies a variable called lightIntensityDivider based on the color of the marble 
// texture that is displayed on top of the Beetle object
// This is done because when we switch, for instance, to the white marble texture, the default light intensity divider
// set to 33, creates too much specular reflection on the object itself, which prevents the user / us from actually
// seeing the texture itself.

const changeLightIntensity = (marbleColor) => {

    // console.log(`lightIntensityDivider modified to color ${marbleColor}`);

    if (marbleColor === 'white') {
        lightIntensityDivider = 14;
    } else if (marbleColor === 'black') {
        lightIntensityDivider = 6;
    } else if (marbleColor === 'veryLight') {
        lightIntensityDivider = 110;
    } else if (marbleColor === 'grey') {    
        lightIntensityDivider = 7;
    } else if (marbleColor === 'lightBlue') {
        lightIntensityDivider = 7;
    }

}


// Re-connect pivot to the newly created beetle - to be added every time a new beetle is created and rendered with a different texture

const connectPivotToBeetle = () => {
    pivotPoint2 = new THREE.Object3D();
    beetleObject.add(pivotPoint2);
    pivotPoint2.add(spotLight);
}

// De-activate this so that it doesn't switch it to black directly
// setTimeout(changeBeetleToWhiteMarble, 10000);

// Detect different actions

// const onDocumentMouseMove = (event) => {
//     console.log('Mouse moved');
//     console.log(event);
//     changeVelocityParticles(event);
// }

const changeVelocityParticles = (event) => {
    let lengthOfPositions = arrayOfCursorPositions.length;
    if (lengthOfPositions < 4) {
        arrayOfCursorPositions.push(event.clientX, event.clientY);
    } else {
        // Make it empty again so that we can keep filling it up
        arrayOfCursorPositions = []
    }

    // Now we compare positions to move particles
    previousClientX = arrayOfCursorPositions[0];
    previousClientY = arrayOfCursorPositions[1];
    currentClientX = arrayOfCursorPositions[2];
    currentClientY = arrayOfCursorPositions[3];

    if (previousClientX < currentClientX) {

        if (enableLogging === true) {
            console.log('ClientX is decreasing');
            console.log(previousClientY, ' is smaller than ', currentClientY);
        }

        mesh.rotation.z -= 0.05;
    } else if (previousClientX > currentClientX) {
        mesh.rotation.z += 0.05;
    } else if (previousClientY < currentClientY) {
        mesh.rotation.z -= 0.05;
    } else if (previousClientY < currentClientY) {
        mesh.rotation.z += 0.05;
    } 

    mesh.geometry.verticesNeedUpdate = true

}

const onDocumentMouseMove = (event) => {

    mouseX = ( event.clientX - windowHalfX ) / 100;
    mouseY = ( event.clientY - windowHalfY ) / 100;

    // console.log('Mouse X', mouseX);
    // console.log('Mouse Y', mouseY);

}


// Tracks Normalized Mouse Move

let hoveringElement = false;

const onActualMouseMove = (event) => {

	realMouseX = event.clientX;
    realMouseY = event.clientY;
    // console.log('Actual Mouse Move X', realMouseX, ' and Y: ', realMouseY);

    let imageElement = document.getElementById('venereMaisCourtoisContainer')
    // let hoveringElement = imageElement.classList.contains('shown');
    
    if (hoveringElement) {
        // console.log('Hovering element', hoveringElement);
        imageElement.style.top = realMouseY + 'px';
        imageElement.style.left = realMouseX + 20 + 'px';
        imageElement.style.opacity = 1;
        // imageElement.classList.add('shown');
        imageElement.style.visibility = 'visible';
    } else { 
        // console.log('Hovering element', hoveringElement);
        imageElement.style.opacity = 0;
        imageElement.style.visibility = 'hidden';
    }

    // if (frenchLanguageHovered === true) {
    //     console.log('Hovering over french language button');
    //     // innerCursor.style.webkitTransitionDuration = '1s';
    //     // innerCursor.style.transitionDelay = '0s';
    //     // innerCursor.style.transform = 'scale(3,3)';
    //     innerCursor.style.backgroundColor = '#ff8282';
    // } else {
    //     innerCursor.style.width = '5px';
    //     innerCursor.style.height = '5px';
    //     innerCursor.style.backgroundColor = '#ffffff';
    // }
    
}


// #toBeDeleted
const onMouseDown = () => {

    // console.log('Audio context state general', audioContext.state);

    // if (audioContext.state === 'running') {
    //     console.log('Audio Context is running');
    //     audioContext.suspend().then(() => {
    //         console.log('It is now paused')
    //     })
    // } else if (audioContext.state === 'suspended') {
    //     console.log('Audio Context state is suspended');
    //     audioContext.resume().then(() => {
    //         console.log(`Music is playing now`);
    //     })
        
    // }

    // Comment this out to prevent the Marble texture to change and from the different wireframes to show

    // if (isBeetleWireframe === false) {
    //     console.log('On Document Mouse move Two called')
    //     isBeetleWireframe = true;
    //     removeCurrentBeetleObject();
    
    //     let material = new THREE.MeshNormalMaterial({wireframe: true});
    //     let objLoader = new THREE.OBJLoader();
    //     // objLoader.setMaterials(materials);
    //     objLoader.setPath(RELATIVE_URL);
    //     objLoader.load('beetle.obj', function (object) {
        
    //         object.traverse(function(node) {
    //             if (node.isMesh) {
    //                 node.material = material;
    //                 console.log('Encountered Mesh', node)
    //             }
    
    //         })
        
    //         beetleObject = object;
    //         beetleObject.name = 'beetle'
    //         beetleObject.position.y = 100;
    //         beetleObject.rotation.y = 158 * 0.02;
    //         beetleObject.scale.x = beetleObject.scale.y = beetleObject.scale.z = 1.35;

    //         scene.add(beetleObject);
    //     });
    //     isBeetleWireframe = false;
    //     setTimeout(() => {
    //         changeBeetleToBlackMarble();
    //     }, 3000)
    // }
    

}

const removeCurrentBeetleObject = () => {
    // let name = 'beetle'
    // let selectedObject = scene.getObjectByName(beetleObject.name);
    scene.remove(beetleObject);
    // beetleObject.geometry.dispose();
    // beetleObject.material.dispose();
    beetleObject = undefined; 
}


// Event Listeners for the page

// Mouse down triggers the beetle's wireframe to show instead of the texture
document.addEventListener('mousedown', onMouseDown, false );
// Mouse move used here in order to track the mouse position within the page
document.addEventListener('mousemove', onDocumentMouseMove,  {passive: true} );
document.addEventListener('mousemove', onActualMouseMove,  {passive: true} );



// Event listener for the menu click


// ------------------------------------------------------

// Load Web Audio API & shit
// WEb Audio API is a high level Javascript API for processing and synthesizing audio
// in web applications. Allows dynamic sound effects in games and real-time
// analysis in music visualizers.

// Music visuaalizers create to render ani;mations that are synchronized to changes in
// the music properties, suh as loundness, frequency, etc. 

const AudioContext = window.AudioContext || window.webkitAudioContext;
audioContext = new AudioContext();

// Function that is called when the song ends playing
// #music

const onEnded = () => {

    isSongFinished = true;

    // Ensures that the sound wave shows 'Play' when the song ends & also that the variable musicPlaying is changed to the boolean false
    // at the end of the song
    toggleSoundWave();

    if (enableLogging === true) {
        console.log(`Song finished playing ${isSongFinished}`);
        console.log('Now we have the choice between playing another song or replaying this one');
    }



}


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
const FAMOUS_URL = 'https://music-samarra-group.s3.us-east-2.amazonaws.com/Octavian-Famous.mp3'

let songBuffer, analyser;

// Function called when the user clicks on the SoundWave button on the bottom right when the song has finished
const playSong = () => {
    window.fetch(ERIK_URL)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => 
        // Creates a short audio asset stored in memory, created from an audio file
        // Once put into an AudioBuffer, the audio can be played by being passed
        // into AudioBufferSourceNode
        audioContext.decodeAudioData(arrayBuffer)
    )
    .then(audioBuffer => {

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
    })
}


// Not necessary to play the #music on load

// window.onload = () => {
//     window.fetch(ERIK_URL)
//     .then(response => response.arrayBuffer())
//     .then(arrayBuffer => 
//         // Creates a short audio asset stored in memory, created from an audio file
//         // Once put into an AudioBuffer, the audio can be played by being passed
//         // into AudioBufferSourceNode
//         audioContext.decodeAudioData(arrayBuffer)
//     )
//     .then(audioBuffer => {
//         console.log('Audio buffer')
//         console.log(audioBuffer)
//         source = audioContext.createBufferSource();
//         source.buffer = audioBuffer;

//         // Make sure that the onEnded function is called when the song ends 
//         source.onended = onEnded;

//         // Create the analyzer node and connect it between the input
//         // and the output so that it can provide us with data
//         // abou the actual sound we have
//         analyser = audioContext.createAnalyser();

//         source.connect(analyser);

//         console.log('Source given is', source);
//         analyser.connect(audioContext.destination);

//         // Change the analyser data available so that we can access it later on.
//         // By default, the analyser will give us frequency data with 1024 data points.
//         // We can change this by setting the fftSize property.
//         analyser.fftSize = 64;
//         frequencyData = new Uint8Array(analyser.frequencyBinCount);
//         domainData = new Uint8Array(analyser.fftSize); // Uint8Array should be the same length as the fftSize
        
//         // analyser.getByteFrequencyData(frequencyData);

//         console.log('Analyser is', analyser);
//         source.start();
//     })

// }

const toggleMusicOnOff = () => {

    if (audioContext.state === 'running' && isSongFinished !== true) {

        if (enableLogging === true) {
            console.log('Audio Context is running');
        };

        audioContext.suspend().then(() => {
            console.log('Music is paused')
        })

    } else if (audioContext.state === 'suspended' && isSongFinished !== true) {

        if (enableLogging === true) {
            console.log('Audio Context state is suspended');
        }

        audioContext.resume().then(() => {
            console.log(`Music is playing`);
        })
        
    }
}

// Function focused on showing the 'Expertise' button text at the bottom of the minimally resized
// about Page

const showExpertiseButton = () => {

    if (enableLogging === true) {
        console.log('Inside @showExpertiseButton function');
    }

    document.getElementById('expertise--button--small--screen--container').classList.add('animated');  
    // document.getElementById('aboutPageArrowContainer').classList.add('animated');  

}


// The opposite of the above function - ensures that the Expertise button is hidden whenever the browser window
// width goes above a certain width

const hideExpertiseButton = () => {

    document.getElementById('expertise--button--small--screen--container').classList.remove('animated');  

}


// ------------------------------------------------------

// Inialize Pivot Point 2 Position so that the light is rendered the first time that the website
// is actually displayed

let time = Date.now() * 0.0005;
// pivotPoint2.position.x = Math.sin(time * 0.7) * mouseX;
// pivotPoint2.position.y = Math.sin(time * 0.1) * mouseY;
// pivotPoint2.position.z = Math.sin(time * 0.2) * mouseX;

// ------------------------------------------------------

// Ensures that the scale of the different objects doesn't change when the window is resized


// remember these initial values
let tanFOV = Math.tan( ( ( Math.PI / 180 ) * camera.fov / 2 ) );
let windowHeight = window.innerHeight;

// Event Listeners
// -----------------------------------------------------------------------------


window.onresize = function () {

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

        showExpertiseButton();
    } else if (dynamicWindowWidth >= 1000 && pageShown === 'aboutPage') {
        hideExpertiseButton();
    }

    let width = window.innerWidth;
    let height = window.innerHeight;

    camera.aspect = width / height;

    // adjust the FOV
    camera.fov = ( 360 / Math.PI ) * Math.atan( tanFOV * ( window.innerHeight / windowHeight ) );

    camera.updateProjectionMatrix();
    // camera look at here ?

    renderer.setSize( width, height );
    // composer.setSize( width, height );
    // renderer.render(scene, camera);

};

// ------------------------------------------------------

/*
 * Cursor Animations & shit
 */

// Set starting position of the cursor outside of the screen

let clientX = -100;
let clientY = -100;
const innerCursor = document.querySelector(".cursor--small");

const initCursor = () => {

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

const updateCursor = () => {
    innerCursor.style.transform = `translate(${clientX}px, ${clientY}px)`;
}

initCursor();

/*
 * Cursor Animations II : Setting up the Circle on Canvas
 */

let lastX = 0;
let lastY = 0;
let isStuck = false;
let showCursor = false;
let group, stuckX, stuckY, fillOuterCursor;
let polygon;

const initCanvas = () => {

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

initCanvas();

/*
 * Changes the Cursor color to black - Used when the menu transition is triggered
 */

const changeCursorColorToBlack = () => {
    
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

const changeCursorColorToWhite = () => {
    
    const cursorElement = document.getElementById('cursor--small');
    cursorElement.style.background = 'white';

    polygon.strokeColor = "rgba(255,255,240,1)"
}


/*
 * Cursor Animations III : Handling the Hover State
 */

 const initHovers = () => {

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
    const linkItems = document.querySelectorAll('.browser-window__link');
    const soundWaveItem = document.querySelectorAll('.soundwave-container');
    const plusSignItem = document.querySelectorAll('.plus-sign-container');

    linkItems.forEach(item => {
        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
    })

    soundWaveItem.forEach(item => {
        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
    })

    plusSignItem.forEach(item => {
        item.addEventListener("mouseenter", handleMouseEnter);
        item.addEventListener("mouseleave", handleMouseLeave);
    })



    // Add Event Listeners to the Title
    // const textItems = document.querySelectorAll('.titleText');

    // textItems.forEach(item => {
    //     item.addEventListener("mouseenter", handleMouseEnter);
    //     item.addEventListener("mouseleave", handleMouseLeave);
    // })
}

initHovers();


const initiateContactPageHovers = () => {

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

// ------------------------------------------------------

/*
 * Connecting Lines Animation: This part of the script includes functions that will be used to calculate the distance between
 * the different vertices that make up the ParticleMesh, create lines that connect them dynamically if the distance between those
 * points is under a certain maximum, and finally, functions that will take care of deleting and removing those lines if the distance
 * between the different vertices is too high
 */


// #lines

let line;
let linesObject = {};
let lineGroup = new THREE.Group();
let lineArray = [];
// console.log('Line group', lineGroup)
// lineGroup.verticesNeedUpdate = true;
let lineMaterial = new THREE.LineBasicMaterial({
    color: 0xffffff,
    lineWidth: 1,
});

// Max distance there should be between the different points
let maxDistance = 30;

// Add lineGroup to the scene
scene.add(lineGroup);

const animateParticles = () => {

    let particleCount = numParticles; 

    // console.log('Particle count before', particleCount)
    while (particleCount--) {

        let timestamp = new Date() * 0.0005;

        let particle = particleGeometry.vertices[particleCount];
        // particle.z -= 0.1;
        // particle.y = Math.cos(timestamp) * 7;
        // particle.z = Math.sin(timestamp) * 7;

        let move = Math.sin(clock.getElapsedTime() * Math.random()) / 2;
        let particleVelocityObject = particles[particleCount];

        // console.log('Particle passed', particle)
        // console.log('Move', move);
        // let offset = (move * particleVelocityObject.y);
        // particle.z += move;
        detectCloseByPoints(particle);

    };

    particleGeometry.verticesNeedUpdate = true;

}

const detectCloseByPoints = (particle) => {

    let particleCount = numParticles;
    while (particleCount--) {

        let comparedParticle = particleGeometry.vertices[particleCount];
        // console.log('Compared particle', comparedParticle);
        // Make sure that the particle we're comparing it to is not the same on. They're objects so the references would be compared here
        if (particle !== comparedParticle) { 

            let distanceBetweenParticles = particle.distanceTo(comparedParticle); // Calculate the distance between the two particles moving around the space
            // let connection = checkConnection(particle, comparedParticle);
            
            if (distanceBetweenParticles < maxDistance) {

                // console.log('Found particles that are close');
                // console.log('Particles are close to each other');
                // console.log(particle);
                // console.log(comparedParticle);
                // createLine(particle, comparedParticle);
                createLineTwo(particle, comparedParticle);

            }
        }

    };

}


const createLineTwo = (particleOne, particleTwo) => {
    
    let particleOneNCount = particleOne.neighborCount;
    let particleTwoNCount = particleTwo.neighborCount;

    if (particleOneNCount < 2 && particleTwoNCount < 2) {
        // console.log('Particle one', particleOne);
        // console.log('Particle two', particleTwo);
        let lineGeometry = new THREE.Geometry();
        // console.log('Particle one default', particleOne.default);
        lineGeometry.vertices.push(particleOne);
        lineGeometry.vertices.push(particleTwo);

        if (enableLogging === true) {
            console.log('Particle one position is', particleOne.position);
        }

        lineGeometry.dynamic = true;

        particleOne.neighborCount += 1;
        particleTwo.neighborCount += 1;
        let line = new THREE.Line(lineGeometry, lineMaterial);
        // line.geometry.verticesNeedUpdate = true;
        lineArray.push(line);
        lineGroup.add(line);
        scene.add(line);
        // lineGroup.verticesNeedUpdate = true;
        // console.log('Line group updated with new vertex', line);
    }

}

const updateLines = () => {
    // lineGroup.matrixAutoUpdate = true;
    // lineGroup.geometry.verticesNeedUpdate = true;

    let lineArrayLength = lineArray.length;

    if (enableLogging === true) {
        console.log('Line array length', lineArrayLength);
    }

    for (let i=0; i<lineArray.length; i++) {
        let currentLine = lineArray[i];
        // console.log('Update line', currentLine);
        lineGroup.verticesNeedUpdate = true;
        // console.log('Current line geometry', currentLine);
        currentLine.geometry.verticesNeedUpdate = true;
    }
}

// Checks whether there is already a line connection between the two vertices that we pass into it: particle & comparedParticle

const checkConnection = (particle, comparedParticle) => {
    
    let particleOneIndex = particleGeometry.vertices.indexOf(particle);
    let particleTwoIndex = particleGeometry.vertices.indexOf(comparedParticle);
    let connectionIndex = particleOneIndex + '-' + particleTwoIndex;
    let connectionExists = linesObject[connectionIndex];

    if (connectionExists === true) {
        return true;
    } else {
        return false;
    };

}

// Creates a line object between the two particles that we pass in

const createLine = (particleOne, particleTwo) => {

    // Add particle two to the list of neighbors / nodes of particleOne
    particleOne.nodes.push(particleTwo);
    // Add line
    addEventListener(particleOne, particleTwo);

}

// Adds line between the two particles. Used in the function above

const addLine = (particleOne, particleTwo) => {

    let lineID = particleGeometry.vertices.indexOf(particleOne) + '-' + particleGeometry.vertices.indexOf(particleTwo);
    let lineGeometry = new THREE.Geometry();

    // If there is no line with this ID within the line object that we created, then we add it
    if (!linesObject[lineID]) {

        lineGeometry.dynamic = true;
        lineGeometry.vertices.push(particleOne);
        lineGeometry.vertices.push(particleTwo);
        let currentLine = new THREE.Line(lineGeometry, lineMaterial);
        currentLine.touched = false;
        lines[lineID] = currentLine;
        lineGroup.add(currentLine);
        return currentLine;

    } else {
        return false;
    };

}

// ------------------------------------------------------

/*
*
* Sound Wave animation when clicked
*
*/

let numberOfBars = 9;
let soundWaveArray = [];

const toggleSoundWave = (e) => {

    if (enableLogging === true) {
        console.log('Sound wave clicked');
    }
 
    let soundWaveElement1 = document.getElementById(`Line_1`);
    let soundWaveElement2 = document.getElementById(`Line_2`);
    let soundWaveElement3 = document.getElementById(`Line_3`);
    let soundWaveElement4 = document.getElementById(`Line_4`);
    let soundWaveElement5 = document.getElementById(`Line_5`);
    let soundWaveElement6 = document.getElementById(`Line_6`);
    let soundWaveElement7 = document.getElementById(`Line_7`);
    let soundWaveElement8 = document.getElementById(`Line_8`);
    let soundWaveElement9 = document.getElementById(`Line_9`);

    let classList1 = soundWaveElement1.classList;
    let classList2 = soundWaveElement2.classList;
    let classList3 = soundWaveElement3.classList;
    let classList4 = soundWaveElement4.classList;
    let classList5 = soundWaveElement5.classList;
    let classList6 = soundWaveElement6.classList;
    let classList7 = soundWaveElement7.classList;
    let classList8 = soundWaveElement8.classList;
    let classList9 = soundWaveElement9.classList;

    classList1.toggle('paused');
    classList2.toggle('paused');
    classList3.toggle('paused');
    classList4.toggle('paused');
    classList5.toggle('paused');
    classList6.toggle('paused');
    classList7.toggle('paused');
    classList8.toggle('paused');
    classList9.toggle('paused');

    if (enableLogging === true) {
        console.log('Before button was clicked, music was playing:', musicPlaying);
    }

    // For now the music will play forever until the user stops it
    if (isSongFinished === true) {
        // Start the song again
        playSong();
        // Reset variable to false
        isSongFinished = false;
        // Get out of the function
        return;
    }

    if (musicPlaying === true) {

        if (enableLogging === true) {
            console.log('Sound Wave Description clicked while music is playing');
        }

        document.getElementById('soundwave-description').innerHTML = 'Play';
        musicPlaying = false;

        // Here we will trigger the actual text to be shown at the top of the page that lets users know that the page
        // is actually for people with disabilities
        toggleVoiceControl();

        if (enableLogging === true) {
            console.log('Is Music Playing now?', musicPlaying);
        }

    // If music is not playing, then we ensure that the boolean is switched to true while also making 
    // sure that the text disappears correctly.
    } else {

        if (enableLogging === true) {
            console.log('Going through the second music playing false Now');
        }

        document.getElementById('soundwave-description').innerHTML = 'Pause';
        musicPlaying = true;

        // Ensures thatvoice control is deactivated and doesn't keep track of what the user is saying
        deactivateVoiceControl();

        if (enableLogging === true) {
            console.log(`Is Music Playing now? ${musicPlaying}`);
        }

        // This ensures that the voice control elements are shown and hidden correctly
        
        if (DIRECTIONS_VOICE_SHOWN === false) {
            toggleVoiceControl();
        } else if (DIRECTIONS_VOICE_SHOWN === true) {
            // Removes the text of directions
            toggleVoiceControlDirections();
            // Also removes the activate voice cotnrol text
            toggleVoiceControl();
        }

        // Also need to make sure that the speech recognition is stopped

        // If music is not playing and we're trying to play music then we should hide everything tha

    }

    toggleMusicOnOff();

}

const showMusicText = () => {
    let toggleSoundTextElement = document.getElementById('soundwave-description');
    toggleSoundTextElement.style.visibility = 'visible';
    // toggleSoundTextElement.style.transform = 'translateX(-20px)';
    toggleSoundTextElement.style.opacity = '1';
}

const hideMusicText = () => {
    let toggleSoundTextElement = document.getElementById('soundwave-description');
    toggleSoundTextElement.style.visibility = 'hidden';
    // toggleSoundTextElement.style.transform = 'translateX(10px)';
    toggleSoundTextElement.style.opacity = '0';
}

const createSoundWaveAnimation = () => {

    // let soundWaveArray = [];
    // let soundWaveElement1 = document.getElementById(`Line_1`).addEventListener("click", toggleSoundWave);
    // let soundWaveElement2 = document.getElementById(`Line_2`).addEventListener("click", toggleSoundWave);
    // let soundWaveElement3 = document.getElementById(`Line_3`).addEventListener("click", toggleSoundWave);
    // let soundWaveElement4 = document.getElementById(`Line_4`).addEventListener("click", toggleSoundWave);
    // let soundWaveElement5 = document.getElementById(`Line_5`).addEventListener("click", toggleSoundWave);
    // let soundWaveElement6 = document.getElementById(`Line_6`).addEventListener("click", toggleSoundWave);
    // let soundWaveElement7 = document.getElementById(`Line_7`).addEventListener("click", toggleSoundWave);
    // let soundWaveElement8 = document.getElementById(`Line_8`).addEventListener("click", toggleSoundWave);
    // let soundWaveElement9 = document.getElementById(`Line_9`).addEventListener("click", toggleSoundWave);
    // soundWaveArray.push(soundWaveElement1);
    // soundWaveArray.push(soundWaveElement2);
    // soundWaveArray.push(soundWaveElement3);
    // soundWaveArray.push(soundWaveElement4);
    // soundWaveArray.push(soundWaveElement5);
    // soundWaveArray.push(soundWaveElement6);
    // soundWaveArray.push(soundWaveElement7);
    // soundWaveArray.push(soundWaveElement8);
    // soundWaveArray.push(soundWaveElement9);
    

    document.getElementById('wave').addEventListener('click', toggleSoundWave);
    document.getElementById('wave').addEventListener('mouseenter', showMusicText);
    document.getElementById('wave').addEventListener('mouseleave', hideMusicText);

    // #touchEvents #touch #touchstart
    document.getElementById('wave').addEventListener('touchstart', toggleSoundWave);

}

createSoundWaveAnimation();



// ------------------------------------------------------

/*
*
* Language Animation when clicked
*
*/

const toggleLanguageChoices = (languageChoice) => {
    // document.getElementById('languageOne').classList.toggle('showing');
    // document.getElementById('languageTwo').classList.toggle('showing');
    // document.getElementById('language-description').classList.toggle('showing');

}

// Language Animation that removes the languages

const removeLanguageChoices = () => {   
    document.getElementById('languageOne').classList.remove('showing');
    document.getElementById('languageTwo').classList.remove('showing');
}


// ------------------------------------------------------

/*
*
* JavaScript Event Handlers set up here
*
*/

// Animation for #pageTransition is also going to be here

let pageTransitionPlaying = false;


const showLanguagesText = () => {

    // Only show the 'Languages' text on the right of the Plus sign if the width of the page is too small
    if (dynamicWindowWidth > 700) {
        let toggleLanguageElement = document.getElementById('plus-sign-description');
        toggleLanguageElement.style.visibility = 'visible';
        // toggleLanguageElement.style.transform = 'translateX(48px)';
        toggleLanguageElement.style.opacity = '1';
        // toggleLanguageElement.style.transitionProperty = 'ease-out';
    }
}

const hideLanguagesText = () => {
    let toggleLanguageElement = document.getElementById('plus-sign-description');
    toggleLanguageElement.style.visibility = 'hidden';
    // toggleLanguageElement.style.transform = 'translateX(-16px)';
    toggleLanguageElement.style.opacity = '0';
    // toggleLanguageElement.style.transitionProperty = 'ease-in';
    // toggleLanguageChoices();
}

// This function is used as an intermediate function within the transitions in order to remove the meshes that are existing 
// and allow us to create new meshes to display visually - in this case, the plane geometry with the rock texture and the differing
// beetle geometry with the marble textures 

const removeThreeJSMeshes = () => {

    if (enableLogging === true) {
        console.log(`Currently removing three JS meshes of ${pageShown}`)
    }

    setTimeout(() => {
        
        // Remove plane geometry
        removePlaneGeometry();
        
        // Remove beetle object
        removeCurrentBeetleObject();

    }, 750)


}


// Functions that is called to change the visibility of the different meshes depending
// on the page that is passed

// There are 5 pages total: 1. Home 2. About 3. Client 4. Contact 5. Main Menu

const changeMeshVisibility = (currentPage) => {

    // console.log(`changeMeshVisibility function called with  ${currentPage}`);

    // 1. Home Page - First page that gets displayed to the user

    if (currentPage === 'homePage') {

        // Ensure that the incorrect beetle meshes are invisible
        blueMarbleBeetleObject.visible = false;
        whiteMarbleBeetleObject.visible = false;
        greyMarbleBeetleObject.visible = false;
        redPinkMarbleBeetleObject.visible = false;

        // Ensure that the incorrect planes are invisible too
        blackRockPlaneMesh.visible = false;
        blackWavePlaneMesh.visible = false;
        blackRockPlaneMeshTwo.visible = false;
        xPlaneMesh.visible = false;

        // Make correct beetle meshe visible
        blackMarbleBeetleObject.visible = true;

        // We re-assign the variable currentBeetleObject to the correct one (for the purpose) of turning on the visibility back 
        // on if it is necessary later on
        currentBeetleObject = blackMarbleBeetleObject;

        // Make correct plane visible
        planeMesh.visible = true;

        // Don't forget to change the light intensity

        // We create a set time out in order to give the time for the animation to start before we redefine the beetle color
        // This is done becasue in the requestAnimationFrame, we make the beetle visible as soon as the beetleColor is changed to anything
        // that isn't 'white' (so here 'black' counts). This means that without the setTimeout, the beetle would be directly made 
        // visible after one of the navigation buttons is clicked, which isn't the way it's supposed to appear. It' supposed to appear after
        // the actual animation started - in this case 400ms should be enough, but it might need to be longer than that 

        setTimeout(() => {
            beetleColor = 'black';
            changeLightIntensity(beetleColor);
        }, 400)


    // 5. Menu Page -- Page that gets displayed 
    } else if (currentPage === 'menuPage') {

        // Old Meshes
        
        // console.log('Entering if loop of MESH Visibility of menuPage')

        // // Ensure that the incorrect beetle meshes are invisible
        // // greyMarbleBeetleObject.visible = false;
        // blueMarbleBeetleObject.visible = false;
        // whiteMarbleBeetleObject.visible = false;
        // blackMarbleBeetleObject.visible = false;
        // redPinkMarbleBeetleObject.visible = false;

        // // console.log('BLUE MARBLE BEETLE', blueMarbleBeetleObject);
        // // console.log('WHITE MARBLE BEETLE', whiteMarbleBeetleObject);
        // // console.log('BLACK MARBLE BEETLE', blackMarbleBeetleObject);

        // // Ensure that the incorrect planes are invisible too
        // blackRockPlaneMesh.visible = false;
        // blackRockPlaneMeshTwo.visible = false;
        // planeMesh.visible = false;
        // xPlaneMesh.visible = false;

        // // console.log('BLACK PLANE MESH', blackRockPlaneMesh);
        // // console.log('BLACK PLANE MESH 2', blackRockPlaneMeshTwo);
        // // console.log('PLANE MESH', planeMesh);

        // // Make correct beetle meshe visible
        // // blueMarbleBeetleObject.visible = true;
        // greyMarbleBeetleObject.visible = true;
        // // Make correct plane visible
        // darkGreenPlaneMesh.visible = true;

        // New Meshes

        // Ensure that the incorrect beetle meshes are invisible
        blueMarbleBeetleObject.visible = false;
        greyMarbleBeetleObject.visible = false;
        blackMarbleBeetleObject.visible = false;
        redPinkMarbleBeetleObject.visible = false;

        // Ensure that the incorrect planes are invisible too
        blackRockPlaneMeshTwo.visible = false;
        planeMesh.visible = false;
        blackRockPlaneMesh.visible = false;
        xPlaneMesh.visible = false;

        // console.log('LOGGING IN MESH VISIBILITY SECOND LAYER FOR TESTING');
        // console.log('BLACK PLANE MESH TWO', blackRockPlaneMeshTwo);
        // console.log('BLACK PLANE MESH', blackRockPlaneMesh);
        // console.log('Dark GREEN PLANE MESH', darkGreenPlaneMesh);

        // Make correct beetle meshe visible
        whiteMarbleBeetleObject.visible = true;

        // We re-assign the variable currentBeetleObject to the correct one (for the purpose) of turning on the visibility back 
        // on if it is necessary later on
        currentBeetleObject = whiteMarbleBeetleObject;

        // Make correct plane visible
        blackWavePlaneMesh.visible = true;

        // Don't forget to change the light intensity
        // Same logic as in the above if loop, we use a set time out in order to ensure that the beetle object desn't appear too quickly
        setTimeout(() => {
            beetleColor = 'white';
            changeLightIntensity(beetleColor);
        }, 600);

    // 2. About Page 

    } else if (currentPage === 'aboutPage') {

        // Old Meshes

        // // console.log('ENTERING IF STATEMENT IN MESH VISIBILITY FUNCTION')

        // // Ensure that the incorrect beetle meshes are invisible
        // blueMarbleBeetleObject.visible = false;
        // greyMarbleBeetleObject.visible = false;
        // blackMarbleBeetleObject.visible = false;
        // redPinkMarbleBeetleObject.visible = false;

        // // Ensure that the incorrect planes are invisible too
        // blackRockPlaneMeshTwo.visible = false;
        // planeMesh.visible = false;
        // darkGreenPlaneMesh.visible = false;
        // xPlaneMesh.visible = false;

        // // console.log('LOGGING IN MESH VISIBILITY SECOND LAYER FOR TESTING');
        // // console.log('BLACK PLANE MESH TWO', blackRockPlaneMeshTwo);
        // // console.log('BLACK PLANE MESH', blackRockPlaneMesh);
        // // console.log('Dark GREEN PLANE MESH', darkGreenPlaneMesh);

        // // Make correct beetle meshe visible
        // whiteMarbleBeetleObject.visible = true;
        // // Make correct plane visible
        // blackRockPlaneMesh.visible = true;

        // // Don't forget to change the light intensity
        // beetleColor = 'white';
        // changeLightIntensity(beetleColor);

        // Set the beetle color to 'none' in order to ensure that the beetle object isn't shown when we click away from the 'About' page
        beetleColor = 'none';

        // New Meshes

        // Ensure that the incorrect beetle meshes are invisible
        // greyMarbleBeetleObject.visible = false;
        blueMarbleBeetleObject.visible = false;
        whiteMarbleBeetleObject.visible = false;
        blackMarbleBeetleObject.visible = false;
        redPinkMarbleBeetleObject.visible = false;
        greyMarbleBeetleObject.visible = false;

        // Ensure that the incorrect planes are invisible too
        blackRockPlaneMeshTwo.visible = false;
        planeMesh.visible = false; // Ice Mesh from Hoe Page
        xPlaneMesh.visible = false;
        blackWavePlaneMesh.visible = false;

        // V.1 
        // darkGreenPlaneMesh.visible = false;
        // V.1

        // console.log('BLACK PLANE MESH', blackRockPlaneMesh);
        // console.log('BLACK PLANE MESH 2', blackRockPlaneMeshTwo);
        // console.log('PLANE MESH', planeMesh);

        // Make correct beetle meshe visible
        // blueMarbleBeetleObject.visible = true;
        // Make correct plane visible
        // xPlaneMesh.visible = true;
        blackRockPlaneMesh.visible = true;


        // Commented out because we are not adding any Beetle anymore to the About page
        // Don't forget to change the light intensity
        // beetleColor = 'grey';
        // changeLightIntensity(beetleColor);


    // 4. Contact Page
    } else if (currentPage === 'contactPage') {

        // Ensure that the incorrect beetle meshes are invisible
        greyMarbleBeetleObject.visible = false;
        blackMarbleBeetleObject.visible = false;
        whiteMarbleBeetleObject.visible = false;
        redPinkMarbleBeetleObject.visible = false;
        // blueMarbleBeetleObject.visible = false;

        // console.log('GREY MARBLE BEETLE', greyMarbleBeetleObject);
        // console.log('WHITE MARBLE BEETLE', whiteMarbleBeetleObject);
        // console.log('BLACK MARBLE BEETLE', blackMarbleBeetleObject);

        // Ensure that the incorrect planes are invisible too
        blackRockPlaneMesh.visible = false;
        planeMesh.visible = false;
        blackWavePlaneMesh.visible = false;
        xPlaneMesh.visible = false;
        // blackRockPlaneMeshTwo.visible = false;

        // console.log('PLANE MESH', planeMesh);
        // console.log('BLACK PLANE', blackRockPlaneMesh);
        // console.log('Dark GREEN PLANE MESH', darkGreenPlaneMesh);

        // Make correct beetle meshe visible
        blueMarbleBeetleObject.visible = true;

        // We re-assign the variable currentBeetleObject to the correct one (for the purpose) of turning on the visibility back 
        // on if it is necessary later on
        currentBeetleObject = blueMarbleBeetleObject;

        // Make correct plane visible
        blackRockPlaneMeshTwo.visible = true;
        // planeMesh.visible = true;

        // Don't forget to change the light intensity
        beetleColor = 'lightBlue';
        changeLightIntensity(beetleColor);
 
    // 4. Client Page - Currently called faqPage
    } else if (currentPage === 'faqPage') {

        // Ensure that the incorrect beetle meshes are invisible
        blueMarbleBeetleObject.visible = false;
        whiteMarbleBeetleObject.visible = false;
        greyMarbleBeetleObject.visible = false;
        blackMarbleBeetleObject.visible = false;

        // Ensure that the incorrect planes are invisible too
        blackRockPlaneMesh.visible = false;
        blackWavePlaneMesh.visible = false;
        blackRockPlaneMeshTwo.visible = false;
        planeMesh.visible = false;

        // Make correct beetle meshe visible
        redPinkMarbleBeetleObject.visible = true;

        // We re-assign the variable currentBeetleObject to the correct one (for the purpose) of turning on the visibility back 
        // on if it is necessary later on
        currentBeetleObject = redPinkMarbleBeetleObject;

        // Make correct plane visible
        xPlaneMesh.visible = true;


        // Don't forget to change the light intensity
        beetleColor = 'grey';
        changeLightIntensity(beetleColor);

    // 6. Counts as a 6th page - Shows all the legal & privacy notices
    } else if (currentPage === 'legalPage') {
        
        // In the case that we are facing the legal page, then we hide all of the different beetles

        // Ensure that all of the beetle meshes are invisible
        blueMarbleBeetleObject.visible = false;
        whiteMarbleBeetleObject.visible = false;
        greyMarbleBeetleObject.visible = false;
        blackMarbleBeetleObject.visible = false;
        redPinkMarbleBeetleObject.visible = false;

        // We don't actually change the Plane Geometry or Texture of the plane, so unlike the above conditions,
        // in this case, we do nothing. 

        // Same logic as in the if loop for the 'aboutPage'
        // We ensure that beetleColor is set to none & throw a setTimeout in order to ensure that the beetle doesn't get displayed
        // too quickly - which it will because the code in the requestAnimationFrame will turn the visibility of the beetle object
        // to 'true' if it detects that the beetleColor is black, lightBlue, grey, or white.
        beetleColor = 'none';


    }

}

// Function that toggles the Animation, which creates the white lines next to the Contact components
// on the Contact page of the website

const animateContactLinesContactPage = () => {

    document.getElementById('address-line-right-two-two').classList.add('animated');
    document.getElementById('address-line-right-two-three').classList.add('animated');

}

// Function that removes the lines that show up next to the Contact information on the Main Menu Page

const removeContactInfoLinesMainMenu = () => {

    document.getElementById('address-line-left-two-zero').classList.remove('animated');
    document.getElementById('address-line-right-two-zero').classList.remove('animated');
    document.getElementById('address-line-left-two-one').classList.remove('animated');
    document.getElementById('address-line-right-two-one').classList.remove('animated');

}


// Function that removes the lines that show up next to the Contact information on the Contact Page

const removeContactInfoLinesContactPage = () => {

    document.getElementById('address-line-right-two-two').classList.remove('animated');
    document.getElementById('address-line-right-two-three').classList.remove('animated');

}


// Main Function to toggle between all the different pages

const toggleGeneralPageTransition = (event) => {

    // Don't forget to also hide the form in case we are in the contact page

    hideForm();
    
    if (enableLogging === true) {
        console.log('General transition triggered');
    }

    let id;

    if (MENU_BASED_ANIMATION_STARTED === false) {

        MENU_BASED_ANIMATION_STARTED = true;


        // In this function, we're going to take in account the current page that is being shown and use that
        // to remove all the elements that are related to that page (which will be called previousPage)
        // After that, we'll make sure to trigger the correct set of functions which will set the three.js 
        // environment to look the way we need it - mainly remove the previous plane & beetle meshes, and replace
        // them with the correct meshes


        if (typeof event !== 'string') {
            id = event.target.id;
            // console.log(`ID of event is ${id}`);
        }

        // console.log(`Argument passed in to @toggleGeneralPageTransition is ${event}`);
        // console.log('Initiating page transition')

        // First we initiate the page transition
        initiateTransitionAnimation();
    
        // First part we're checking the current page and removing the elements on the page that need to be taken away 
    
        // App V.1 Start - We remove the geometries / meshes from the scene - so in this case both the plane geometry & the beetle Mesh

        // console.log('Removing meshes')
        // removeThreeJSMeshes();

        // App V.1 End
    
        // Second remove, the different elements of the DOM that are displayed
        let oldPageShown = pageShown;
    
        // console.log('Old page shown is', oldPageShown);
    
        // Toggle DOM elements off accordingly
    
        if (oldPageShown === 'homePage') {
    
            // If we pass an empty string, it removes the elements
            // console.log('Removing elements from the homepage');

            toggleHomePage('')
    
    
        } else if (oldPageShown === 'menuPage') {
            
            // Make sure that the vertical lines next to the contact information disappear from the menu page with a delay
            setTimeout(() => {
                removeContactInfoLinesMainMenu();
            }, 300)

            // If we pass an empty string, it removes the elements for the menuPage
            toggleMenuPage('')

    
        } else if (oldPageShown === 'aboutPage') {

            // If we pass an empty string, it removes the elements from the 'aboutPage'
            toggleAboutPage('');
            // Removes the 'Expertise' related text 
            revertBackToAboutText();

        } else if (oldPageShown === 'contactPage') {

            // Make sure that the vertical lines next to the contact information disappear from the contact page with a delay
            // setTimeout(() => {
            //     removeContactInfoLinesContactPage();
            // }, 500)
    
            // Insert removing the different contact page elements here when you get to it
            // By passing this function and all the similar ones above an empty string, we ensure that the DOM elements
            // are correctly removed from the page
            toggleContactPage('')

        } else if (oldPageShown === 'faqPage') {

            toggleFAQPage('');

        } else if (oldPageShown === 'legalPage') {

            toggleLegalPage('');

        }
    
    
        // Second part we're adding the elements that we want and triggering the Three.JS animations

        if (typeof event === 'string') {

            // console.log('Received string event & not DOM element as an argument of @toggleGeneralPageTransition');
            
            if (event === 'aboutPage') {
                
                id = 'menuElementTwo'

            } else if (event === 'faqPage') {

                id = 'menuElementThree';

            } else if (event === 'contactPage') {

                id = 'menuElementFour';

            } else if (event === 'homePage') {

                id = 'menuElementOne';

            } else if (event === 'menuPage') {

                id = 'menuElementFive';

            } else if (event === 'legalPage') {

                id = 'menuElementSix';

            }

        }
    
        // This is the homePage
        if (id === 'menuElementOne') {
    
            // Make sure we add the Click & Hold Button that's shown on Home/Intro page
            setTimeout(() => {
                addAboutPageNavButtonAtBottom();
            }, DOM_VISIBILITY_SHORT_DELAY); // 200 MS delay in order for the transitiont to be more smooth. Or else it appears too quickly.

            // Removes the legal terms text at bottom of main menu
            removeLegalTermsText();
            // Removes the 'Contact' page button usually shown on Client page
            removeClientPageTransitionButtons();
            // Remove the 'About' page button usually shown
            removeAboutPageTransitionButtons();
            // Remove Contact page related buttons
            removeContactPageTransitionButtons();


            changeMenuIcon('')
            toggleHomePage('homePage');

            // We use a short set time out in order to make the action asynchronous & make sure that the White Beetle doesn't appear directly
            // when the user clicks on one of the pages from the minimized window of the Main Menu
            setTimeout(() => {
                changePageShown('homePage')
            }, 500)

            // App V.1 - Start
            // toggleHomePageMesh();
            // App V.1 - End

            // App V.2 - Start
            setTimeout(() => {
                changeMeshVisibility('homePage');
            }, MESH_VISIBILITY_DELAY);
            // App V.2 - End
    
        // This is the aboutPage
        } else if (id === 'menuElementTwo') {

            typeOfAboutPage = 'descriptionText';

            // The Expertise Button is shown on resize event if the window is below a certain width, but if the user moves away and comes back without changing 
            // the window width, then the 'Expertise' button isn't displayed until the user resizes the window

            // This ensures that a check is made in this scenario to display the button properly
            if (dynamicWindowWidth < 1000) {
                showExpertiseButton();
            }

            // Make sure we add the 'Client Page' Button that's shown at the bottom of the About page
            setTimeout(() => {
                addAboutPageTransitionButtons();
            }, DOM_VISIBILITY_LONG_DELAY); // 1700 MS delay in order for the transitiont to be more smooth. Or else it appears too quickly.

            // Removes the legal terms text at bottom of main menu
            removeLegalTermsText();
            // Remove Home page related buttons
            removeAboutPageNavButtonAtBottom();
            // Removes Client Page related buttons
            removeClientPageTransitionButtons();
            // Remove Contact page related buttons
            removeContactPageTransitionButtons();

            changeMenuIcon('')
            changePageShown('aboutPage');
            toggleAboutPage('aboutPage');

            // App V.1 - Start
            // toggleAboutPageMesh();
            // App V.1 - End

            // App V.2 - Start
            setTimeout(() => {
                changeMeshVisibility('aboutPage');
            }, MESH_VISIBILITY_DELAY);
            // App V.2 - End
    
        // This is the FAQ / Client Page
        } else if (id === 'menuElementThree') {

            // Make sure we add the Contact Page Button that's shown on Client page
            setTimeout(() => {
                addClientPageTransitionButtons();
            }, DOM_VISIBILITY_LONG_DELAY); // 200 MS delay in order for the transitiont to be more smooth. Or else it appears too quickly.


            // Removes the legal terms text at bottom of main menu
            removeLegalTermsText();

            // Remove Home Page related buttons
            removeAboutPageNavButtonAtBottom();
            // Remove About page related buttons
            removeAboutPageTransitionButtons();
            // Remove Contact page related buttons
            removeContactPageTransitionButtons();

            changeMenuIcon('');
            // The client page is the only one missing elements
            // Might miss elements for a bit since we don't have enough clients to display 

            // We use a short set time out in order to make the action asynchronous & make sure that the White Beetle doesn't appear directly
            // when the user clicks on one of the pages from the minimized window of the Main Menu
            setTimeout(() => {
                changePageShown('faqPage')
            }, 500);
            // Toggling on the DOM elements of the FAQ page
            toggleFAQPage('faqPage');

            // App V.1 - Start
            // toggleClientsPageMesh();
            // App V.1 - End

            // App V.2 - Start
            setTimeout(() => {
                changeMeshVisibility('faqPage');
            }, MESH_VISIBILITY_DELAY);
            // App V.2 - End
    
    
        // This is the contactPage
        } else if (id === 'menuElementFour') {
    
            // Removes the legal terms text at bottom of main menu
            removeLegalTermsText();

            // Remove Home page related buttons
            removeAboutPageNavButtonAtBottom();
            // Remove About page related buttons
            removeAboutPageTransitionButtons();
            // Removes the 'Contact' page button usually shown on Client page
            removeClientPageTransitionButtons();

            changeMenuIcon('');
            toggleContactPage('contactPage');
            // Ensures that the lines next to the contact information are shown
            animateContactLinesContactPage();

                        // We use a short set time out in order to make the action asynchronous & make sure that the White Beetle doesn't appear directly
            // when the user clicks on one of the pages from the minimized window of the Main Menu
            setTimeout(() => {
                changePageShown('contactPage');
            }, 500);

            // App V.1 - Start - We call functions that create the geometries & the Mesh
            // toggleContactPageMesh();
            // App V.1 - End

            // App V.2 - Start
            setTimeout(() => {
                changeMeshVisibility('contactPage');
            }, MESH_VISIBILITY_DELAY);
            // App V.2 - End

            setTimeout(() => {
                addContactPageTransitionButtons();
            }, DOM_VISIBILITY_LONG_DELAY)
    
        // This is the menu page
        } else if (id === 'menuElementFive') {

            // Adds the Legal Terms text
            setTimeout(() => {
                addLegalTermsText();
            }, DOM_VISIBILITY_LONG_DELAY);

            // Remove the Click & Hold Button if we're moving away from the Home Page
            removeAboutPageNavButtonAtBottom();
            // Remove About page related buttons
            removeAboutPageTransitionButtons();
            // Removes Client page related buttons
            removeClientPageTransitionButtons();
            // Remove Contact page related buttons
            removeContactPageTransitionButtons();

            if (enableLogging === true) {
                console.log('Running towards Menu Page again');
            }

            // if (currentMenuIcon !== 'menuIcon') {
            changeMenuIcon('menuPage');
            // }

            changePageShown('menuPage');
            toggleMenuPage('menuPage');

            // App V.1 - Start
            // toggleMenuPageMesh();
            // App V.1 - End

            // App V.2 - Start
            setTimeout(() => {
                changeMeshVisibility('menuPage');
            }, MESH_VISIBILITY_DELAY);
            // App V.2 - End
    
        // Legal Page shown
        } else if (id === 'menuElementSix')  {

            // Boilerplate functions that need to be called with every condition satisfied

            // Change pageShown variable to legalPage
            changePageShown('legalPage');
            // Removes the legal terms text at bottom of main menu
            removeLegalTermsText();
            // Remove the Click & Hold Button if we're moving away from the Home Page
            removeAboutPageNavButtonAtBottom();
            // Remove the 'Client Page' Button at the bottom of the About page 
            removeAboutPageTransitionButtons();
            // Removes the 'Contact' page button usually shown on Client page
            removeClientPageTransitionButtons();
            // Makes the top right button look like a Menu button
            changeMenuIcon('');
            
            // Makes the text of the legal page visible
            toggleLegalPage('legalPage');

            // Will ensure that the White Beetle isn't displayed
            setTimeout(() => {
                changeMeshVisibility('legalPage');
            }, MESH_VISIBILITY_DELAY);

        }

    }
}


// Function that will display to the user the Legal Terms of Samarra & Co.
// Attached to the click event of the 'privacy--click--container' in the HTML document, or in other words, to the 'Legal Terms' text
// that shows at the bottom of the 'Main Menu' page

const showLegalTermsPage = () => {

    // console.log('Legal & Privacy terms page is about to be toggled - currently in @showLegalTermsPage function');

    // Calls the general function with the correct argument in order to remove the incorrect meshes (the white Beetle) 
    // and display the correct HTML DOM elements

    toggleGeneralPageTransition('legalPage');

}

// Function associated to the 'click' event of the 'About Samarra & Co' button at the bottom of the About page
// Used in order to trigger an animation and afterwards a transition into the About page of 'Samarra & Co.'

const goToAboutPageFromHome = () => {

    // Two things will be done here, first, we're going to trigger an animation for the user

    // Second, we're going to go to the 'About page'
    toggleGeneralPageTransition('aboutPage');


}


// Same as above function but goes to the Client page from the About page

const goToClientPageFromAbout = () => {

        // Second, we're going to go to the 'Client Page'
        toggleGeneralPageTransition('faqPage');

}

// Same as above but goes to About page from Client page

const goToHomeFromAbout = () => {

    toggleGeneralPageTransition('homePage');

}

// Same as above - Goes to the About page from the Client page - Event triggered by the button at the 
// top of the Client page

const goToAboutFromClient = () => {

    toggleGeneralPageTransition('aboutPage');

}

// Enough said.

const goToClientFromContact = () => {

    toggleGeneralPageTransition('faqPage');

}

// Same as above function but goes to Contact page from Client page

const goToContactPageFromClient = () => {

    // Second, we're going to go to the 'Client Page'
    toggleGeneralPageTransition('contactPage');

}


// Function which will remove the 'Click & Hold' message so that it doesn't appear in any other page but the Intro page
// - Used in @toggleGeneralPageTransition function & most likely in @toggleMenuAnimation function
// Home Page Related

const removeAboutPageNavButtonAtBottom = () => {

    let clickHoldButton = document.getElementById('cta--click--container');
    clickHoldButton.classList.add('hidden');

}

// Function that does the opposite of the above function, it makes the Click & Hold Button visible whenever the user is on the About Page
// - Used in @toggleGeneralPageTransition function & most likely in @toggleMenuAnimation function
// Home Page Releated
const addAboutPageNavButtonAtBottom = () => {

    let clickHoldButton = document.getElementById('cta--click--container');
    clickHoldButton.classList.remove('hidden');

}

// Function which will add the 'Clients Page' message so that it doesn't appear in any other page but the About page
// - Used in @toggleGeneralPageTransition function & most likely in @toggleMenuAnimation function
// About Page Related
const  addAboutPageTransitionButtons= () => {

    let clickHoldButton = document.getElementById('cta--click--container--two');
    clickHoldButton.classList.add('shown');

    let clickHoldButtonTwo = document.getElementById('cta--click--container--two--about');
    clickHoldButtonTwo.classList.add('shown');

    let expertiseButton = document.getElementById('expertiseButtonContainer');
    expertiseButton.classList.add('shown');

}

// Function that does the opposite of the above function, it makes the 'Client Page' Button invisible whenever the user is on the About Page
// - Used in @toggleGeneralPageTransition function & most likely in @toggleMenuAnimation function
// About Page Releated
const removeAboutPageTransitionButtons = () => {

    let clickHoldButton = document.getElementById('cta--click--container--two');
    clickHoldButton.classList.remove('shown');

    let clickHoldButtonTwo = document.getElementById('cta--click--container--two--about');
    clickHoldButtonTwo.classList.remove('shown');

    let expertiseButton = document.getElementById('expertiseButtonContainer');
    expertiseButton.classList.remove('shown');

}

// Function which will add the 'Contact Page' message so that it doesn't appear in any other page but the Client page
// - Used in @toggleGeneralPageTransition function & most likely in @toggleMenuAnimation function
// Client Page Related
const  addClientPageTransitionButtons= () => {

    let clickHoldButton = document.getElementById('cta--click--container--three');
    clickHoldButton.classList.add('shown');

    let clickHoldButtonTwo = document.getElementById('cta--click--container--two--client');
    clickHoldButtonTwo.classList.add('shown');

}

// Function that does the opposite of the above function, it makes the 'Contact Page' Button invisible whenever the user is on the Client Page
// - Used in @toggleGeneralPageTransition function & most likely in @toggleMenuAnimation function
// Client Page Releated
const removeClientPageTransitionButtons = () => {

    let clickHoldButton = document.getElementById('cta--click--container--three');
    clickHoldButton.classList.remove('shown');

    let clickHoldButtonTwo = document.getElementById('cta--click--container--two--client');
    clickHoldButtonTwo.classList.remove('shown');

}

// Function which will add the 'Client Page' button so that it doesn't appear in any other page but the Contact page
// - Used in @toggleGeneralPageTransition function & most likely in @toggleMenuAnimation function
// Contact Page Related
const  addContactPageTransitionButtons= () => {

    let clickHoldButton = document.getElementById('cta--click--container--two--contact');
    clickHoldButton.classList.add('shown');

}

// Function that does the opposite of the above function, it makes the 'Client Page' Button invisible whenever the user is on the Contact Page
// - Used in @toggleGeneralPageTransition function & most likely in @toggleMenuAnimation function
// Contact Page Releated
const removeContactPageTransitionButtons = () => {

    let clickHoldButton = document.getElementById('cta--click--container--two--contact');
    clickHoldButton.classList.remove('shown');

}

const initiateTransitionAnimation = () => {

    let revealLayerOne = document.getElementById('reveal--layer');
    revealLayerOne.classList.toggle('showing');

    // When the animation, the class will be toggled back again

}

// Similar as the other two 
// Main Menu Related

// Function that shows the 'Legal Terms' text at the bottom of the Main Menu Page
// Called in @toggleMenuAnimation & @toggleGeneralTransition functions

const removeLegalTermsText = () => {

    let legalTermsText = document.getElementById('privacy--click--container');
    legalTermsText.classList.remove('shown');

    // Change Delay Durations to make sure it disappears quickly

    document.getElementById('mainMenuLegalTextCharacter1').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter2').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter3').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter4').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter5').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter6').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter7').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter8').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter9').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter10').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter11').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter12').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter13').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter14').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter15').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter16').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter17').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter18').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter19').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter20').style.transitionDelay = '0s';
    document.getElementById('mainMenuLegalTextCharacter21').style.transitionDelay = '0s';

    // Toggle the class

    document.getElementById('mainMenuLegalTextCharacter1').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter2').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter3').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter4').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter5').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter6').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter7').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter8').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter9').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter10').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter11').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter12').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter13').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter14').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter15').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter16').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter17').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter18').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter19').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter20').classList.remove('shown');
    document.getElementById('mainMenuLegalTextCharacter21').classList.remove('shown');


    // Reset the delays of the different spans

    setTimeout(() => {
        let delay = 0.1;
        let startDelay = 1.3
        document.getElementById('mainMenuLegalTextCharacter1').style.transitionDelay = '2.4s';
        document.getElementById('mainMenuLegalTextCharacter2').style.transitionDelay = '2.3s';
        document.getElementById('mainMenuLegalTextCharacter3').style.transitionDelay = '2.2s';
        document.getElementById('mainMenuLegalTextCharacter4').style.transitionDelay = '2.1s';
        document.getElementById('mainMenuLegalTextCharacter5').style.transitionDelay = '2s';
        document.getElementById('mainMenuLegalTextCharacter6').style.transitionDelay = '1.9s';
        document.getElementById('mainMenuLegalTextCharacter7').style.transitionDelay = '1.8s';
        document.getElementById('mainMenuLegalTextCharacter8').style.transitionDelay = '1.7s';
        document.getElementById('mainMenuLegalTextCharacter9').style.transitionDelay = '1.5s';
        document.getElementById('mainMenuLegalTextCharacter10').style.transitionDelay = '1.4s';
        document.getElementById('mainMenuLegalTextCharacter11').style.transitionDelay = '1.3s';
        document.getElementById('mainMenuLegalTextCharacter12').style.transitionDelay = '1.4s';
        document.getElementById('mainMenuLegalTextCharacter13').style.transitionDelay = '1.5s';
        document.getElementById('mainMenuLegalTextCharacter14').style.transitionDelay = '1.7s';
        document.getElementById('mainMenuLegalTextCharacter15').style.transitionDelay = '1.8s';
        document.getElementById('mainMenuLegalTextCharacter16').style.transitionDelay = '1.9s';
        document.getElementById('mainMenuLegalTextCharacter17').style.transitionDelay = '2s';
        document.getElementById('mainMenuLegalTextCharacter18').style.transitionDelay = '2.1s';
        document.getElementById('mainMenuLegalTextCharacter19').style.transitionDelay = '2.2s';
        document.getElementById('mainMenuLegalTextCharacter20').style.transitionDelay = '2.3s';
        document.getElementById('mainMenuLegalTextCharacter21').style.transitionDelay = '2.4s';
    }, 2000)

}


// Function that removes the 'Legal Terms' text at the bottom of the Main Menu Page (when we transition away from it)
// Called in @toggleMenuAnimation & @toggleGeneralTransition functions

const addLegalTermsText = () => {

    let legalTermsText = document.getElementById('privacy--click--container');
    legalTermsText.classList.add('shown');

    document.getElementById('mainMenuLegalTextCharacter1').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter2').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter3').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter4').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter5').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter6').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter7').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter8').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter9').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter10').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter11').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter12').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter13').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter14').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter15').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter16').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter17').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter18').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter19').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter20').classList.add('shown');
    document.getElementById('mainMenuLegalTextCharacter21').classList.add('shown');

}

// Main **Menu** related function
// This function ensures that when the menu button is clicked, we get redirected to the page correctly

// This function will be used in order to trigger initially the animation that will cause the page transition animation to be triggered
// and after that for the correct page to be displayed
const toggleMenuAnimation = () => {

    // console.log('@toggleMenuAnimation is starting')

    // Don't forget to hide the form of the contact page and reset everything
    hideForm();


    // Only play menu animation if the variable is false - preventing unnecessary re-rendering
    if (pageTransitionPlaying === false) {

        // Removes the current Three JS meshes that are present on screen
        // removeThreeJSMeshes();

        // This triggers the White Page Animation that goes from the bottom to the top o fthe page
        let revealLayerOne = document.getElementById('reveal--layer');
        revealLayerOne.classList.toggle('showing');

        // This part is to make sure that the variable that tells you which page it is, is correct
        let oldPageShown = pageShown; // pageShown is a global variable, not declared in this scope

        // Log in order to track the different steps of the function calls

        if (enableLogging === true) {
            console.log(`The previous page we are moving away from is ${oldPageShown}`);
        }

        // First Step is to analyze which page is currently being shown and remove the different DOM elements associated to it

        if (oldPageShown === 'menuPage') {

            // We're moving away from the menu icon so we pass an empty string to the changeMenuIcon function 
            // so that it disables the actual icons
            toggleMenuPage('');

        } else if (oldPageShown === 'homePage') {

            // Now we're moving into the actual menuPage so we pass that string to the icon
            toggleHomePage('')

        } else if (oldPageShown === 'aboutPage') {

            toggleAboutPage('');
            revertBackToAboutText();

        } else if (oldPageShown === 'faqPage') {
            
            if (enableLogging === true) {
                console.log('No toggle set to remove nonexistent elements of the client page');
            }

            toggleFAQPage('');

        } else if (oldPageShown === 'contactPage') {

            toggleContactPage('')

        } else if (oldPageShown === 'legalPage') {
            toggleLegalPage('');
        }


        // Second Step is to change the name of the actual page shown and change the hash table so that it displays 
        // the page status correctly


        if (oldPageShown !== 'menuPage') {

            // console.log('We are going to display the main menu page & call the function @changeMenuIcon to display the correct close icon in the top right');

            // Modify the variable to the page currently shown 
            // If the variable is not the menuPage and this button is clicked, then we are aiming to go towards the
            // menuPage - doesn't matter which page we came from
            // We set the new page shown to be equal to menuPage
            // We add a set time out in order to avoid that common behavior where the beetle would appear too quickly within
            // the screen

            // setTimeout(() => {
                pageShown = 'menuPage';
            // }, 500);

            // Make sure to change the menu icon according to what next page will be shown
            changeMenuIcon('menuPage');


        // If we click on the menu button (which will be soon changed into an X ) from the menu page then we either
        // return to the previous page or we return to the home page
        // For now, we'll just make it so that we return to the home page (first one) of the application
        } else if (oldPageShown === 'menuPage') {

            // Modify the variable to the page currently shown & make it setTimeout for above reason

            // setTimeout(() => {
                pageShown = 'homePage'; 
            // }, 500);
            
            // Make sure to change the menu icon according to what next page will be shown
            changeMenuIcon('');

        }  

        // This part here basically makes sure that the different animations that are necessary to be triggered will be
        // depending on which page you're on for the trigger

        // The text animations here are used in order to actually remove or add the different DOM elements of the page
        // depending on whether we're clicking on the burger menu or not
        // So the idea here is that when we click on the burger menu initially, we are actually moving away and adding to 
        // a page, therefore we need to make sure that we are removing the right things 

        // This code is run in order to decide which DOM elements to show depending on whether we're going to the 'Main Menu' or 'About Pag'e
        if (pageShown === 'menuPage') {
            // Makes the homepage invisible


            // Shows the Legal Terms text at the bottom of the page
            setTimeout(() => {
                addLegalTermsText();
            }, DOM_VISIBILITY_LONG_DELAY);

            // Makes the menu page visible
            // setTextAnimationTimers('menuPage');
            // setThreeAnimationTimers('menuPage');

            // App V.1 - Start
            // toggleMenuPageMesh();
            // App V.1 - End

            // App V.2
            setTimeout(() => {
                changeMeshVisibility('menuPage');
            }, MESH_VISIBILITY_DELAY);

            toggleMenuPage('menuPage');

            // Adds 'animated' class to the contact information components so that vertical lines next to the contact informations appear
            // with a delay after the page transition animation
            animateContactLines();
            
            // Removes the Vertical Lines next to the Contact Information in the pages that have contact information
            // Currently the only other page apart from the Main Menu that has Contact information is the Contact page
            setTimeout(() => {
                removeContactInfoLinesContactPage();
            }, 300);


            // Remove the Click & Hold / About Page Button that's showing in the Home Page
            removeAboutPageNavButtonAtBottom();
            // Remove the 'Client Page' button that's showing on the About Page
            removeAboutPageTransitionButtons();
            // Removes the 'Contact' page button usually shown on Client page
            removeClientPageTransitionButtons();
            // Remove Contact page related buttons
            removeContactPageTransitionButtons();

        // We're keeping it this way because after we click back on it the only place we should be able
        // to go is the homePage
        } else if (pageShown === 'homePage') {

            // Removes the legal terms text at bottom of main menu
            removeLegalTermsText();

            // Makes menu page invisible
            // setTextAnimationTimers('homePage')
            // setThreeAnimationTimers('homePage');

            // App V.1 - Start
            // toggleHomePageMesh();
            // App V.1 - End

            // App V.2
            setTimeout(() => {
                changeMeshVisibility('homePage');
            }, MESH_VISIBILITY_DELAY);

            toggleHomePage('homePage')

            // Remove Veritical Lines next to Contact Information
            setTimeout(() => {
                removeContactInfoLinesMainMenu();
            }, 300);

            setTimeout(() => {
                addAboutPageNavButtonAtBottom();
            }, DOM_VISIBILITY_SHORT_DELAY); // 200 MS delay in order for the transitiont to be more smooth. Or else it appears too quickly.


        } 

    }

}

// Function that animates the line that shows with the contact

const animateContactLines = () => {

    // console.log('Animating lines next to the contact information in main menu')

    document.getElementById('address-line-left-two-zero').classList.add('animated');
    document.getElementById('address-line-right-two-zero').classList.add('animated');
    document.getElementById('address-line-left-two-one').classList.add('animated');
    document.getElementById('address-line-right-two-one').classList.add('animated');

}

// Function that removes the line that shows with the contact

const removeContactLines = () => {

    // console.log('Removing lines next to the contact information in main menu')

    document.getElementById('address-line-left-two-zero').classList.remove('animated');
    document.getElementById('address-line-right-two-zero').classList.remove('animated');
    document.getElementById('address-line-left-two-one').classList.remove('animated');
    document.getElementById('address-line-right-two-one').classList.remove('animated');

}

// Not useed anymore

const setThreeAnimationTimers = (pageShown) => {

    if (pageShown === 'menuPage') {

        // Removes the Blue Ice Plane, creates a new black one, removes Black Beetle, creates a Beetle with White Texture
        setTimeout(() => {

            removePlaneGeometry();
            createTurquoisePlaneGeometry();
            removeCurrentBeetleObject();
            changeBeetleToGreyMarble();
            changeLightIntensity('white');

        }, 1000);

    } else if (pageShown === 'homePage') {

        // Removes Black Plane, replaces it with the Blue one, removes the White Beetle & replaces it with the default Black one

        setTimeout(() => {
            removePlaneGeometry();
            createBluePlaneGeometry();
            removeCurrentBeetleObject();
            changeBeetleToBlackMarble();
            changeLightIntensity('black');
        }, 1000);

    } else if (pageShown === 'aboutPage') {

        setTimeout(() => {
            removePlaneGeometry();
            createBlackPlaneGeometry();
            removeCurrentBeetleObject();
            changeBeetleToWhiteMarble();
            changeLightIntensity('veryLight');
        }, 1500);

    }
}


// FUNCTIONS THAT FOCUS ON CREATING THE MESHES THAT WE NEED 

// Not used anymore

const toggleHomePageMesh = () => {

    setTimeout(() => {
        createBluePlaneGeometry();
        changeBeetleToBlackMarble();
    }, 1000)

}


// Not used anymore

const toggleMenuPageMesh = () => {

    setTimeout(() => {
        createTurquoisePlaneGeometry();
        changeBeetleToGreyMarble();
    }, 1000)

}

const toggleAboutPageMesh = () => {

    if (enableLogging === true) {
        console.log('Toggling the about page mesh');
    }

    setTimeout(() => {
        const beetleColor = 'white';
        createBlackPlaneGeometry();
        changeBeetleToWhiteMarble();
        changeLightIntensity(beetleColor)
    }, 1000)

}

const toggleContactPageMesh = () => {

    if (enableLogging === true) {
        console.log('Toggling the contact page mesh');
    }

    setTimeout(() => {
        const beetleColor = 'lightBlue'
        createBlackRockGeometry();
        changeBeetleToBlueMarble();
        changeLightIntensity(beetleColor)
    }, 1000)


}

const toggleClientsPageMesh = () => {

    if (enableLogging === true) {
        console.log('Toggling the Clients page Mesh');
    }
    
    setTimeout(() => {
        const beetleColor = 'black'
        createGreyGoldPlaneGeometry();
        changeBeetleToDarkGreenMarble();
        changeLightIntensity(beetleColor)
    }, 1000)

}


// Changes the page to the correct one
const changePageShown = (newPageShown) => {

    if (enableLogging === true) {
        console.log(`Changing pageShown variable to ${newPageShown}`);
    }

    pageShown = newPageShown;

}

// This function toggles on / off the menu elements based on whether we're moving away from the menu page
// or moving into it 
// @pageShown (string): if the pageShown is 'menupage' then we toggle them on through a timeout, if not then 
// we toggle them off through another timeout that runs at a different speed

const toggleMenuPage = (pageShown) => {

    // console.log('Adding / hiding the DOM elements of the #menuPage - we inside the @function now');


    if (pageShown === 'menuPage') {

        // Toggle Address 
        toggleAddressElements('menuPage');

        // Ensures that the menu options are displayed and hidden with a delay so that 
        // they don't appear or disappear too quickly throughout the page animation

        setTimeout(() => {

            // Menu Elements are the options shown to the user to navigate through the website
            // In this case, 'Home', 'About', 'Clients', and 'Contact'
            document.getElementById('menuElements').style.visibility = 'visible';
            document.getElementById('menuElements').style.visibility = 'visible';
            document.getElementById('menuElementOne').style.visibility = 'visible';
            document.getElementById('menuElementTwo').style.visibility = 'visible';
            document.getElementById('menuElementThree').style.visibility = 'visible';
            document.getElementById('menuElementFour').style.visibility = 'visible';
            document.getElementById('menuElementOne').style.opacity = 1;
            document.getElementById('menuElementTwo').style.opacity = 1;
            document.getElementById('menuElementThree').style.opacity = 1;
            document.getElementById('menuElementFour').style.opacity = 1;


        }, 1000)


        // setTimeout(() => {

        //     // Animation for the logo
        //     document.getElementById('company-logo-two').classList.toggle('showing');

        // }, 300);

        // ENsures that the title doesn't disappear directly when the actual animation is initiated
        setTimeout(() => {
            document.getElementById('homePage').style.opacity = 0;
            document.getElementById('homePage').style.visibility = 'hidden';      
        }, 1600)



    } else if (pageShown !== 'menuPage') {

        // This ensures that when we're moving awa from the actual menu page, we turn it off accordingly

        // Toggle Address 
        toggleAddressElements('');

        // Ensures that the Title elements appears quickly when the animation is re-initiated
        setTimeout(() => {
            document.getElementById('menuElementOne').style.opacity = 0;
            document.getElementById('menuElementTwo').style.opacity = 0;
            document.getElementById('menuElementThree').style.opacity = 0;
            document.getElementById('menuElementFour').style.opacity = 0; 
            document.getElementById('menuElements').style.visibility = 'hidden';
            document.getElementById('menuElements').style.visibility = 'hidden';
            document.getElementById('menuElementOne').style.visibility = 'hidden';
            document.getElementById('menuElementTwo').style.visibility = 'hidden';
            document.getElementById('menuElementThree').style.visibility = 'hidden';
            document.getElementById('menuElementFour').style.visibility = 'hidden';
                    
        }, 500);

        // Makes sure that the menu Elements don't hide too quickly
        setTimeout(() => {

            document.getElementById('menuElements').style.visibility = 'hidden';
            // document.getElementById('company-logo-two').classList.toggle('showing');

        }, 1400);


    }
    
}


// This function will be used in order to toggle the 'homePage' elements on / off depending on whether we're moving towards
// the homepage or away from the homepage

const toggleHomePage = (pageShown) => {

    // If it is the homePage, then we toggle these elements on
    if (pageShown === 'homePage') {

        // Ensures that the homePage elemnts are toggle on when we're moving to the homepage
        setTimeout(() => {
            document.getElementById('homePage').style.opacity = 1;
            document.getElementById('homePage').style.visibility = 'visible';
            document.getElementById('titleText').classList.add('showing');
        }, 1700);


    // If it's not the homePage we toggle the homePage elements off
    } else if (pageShown !== 'homePage') {

        // Ensures that the title doesn't disappear directly when the actual animation is initiated
        setTimeout(() => {
            document.getElementById('homePage').style.opacity = 0;
            document.getElementById('homePage').style.visibility = 'hidden';  
            document.getElementById('titleText').classList.remove('showing');
        }, 340);

    }

}


// Function focuses on togglign the About Page instead

const toggleAboutPage = (pageShown) => {
    
    // console.log('Adding / hiding the DOM elements of the #aboutPage - we inside the @function now');

    // If we are moving towards the About Page and landing on it
    if (pageShown === 'aboutPage') {

        // Add the elements towards the end of the transition
        // Slower than the time out below
        setTimeout(() => {
            document.getElementById('aboutPageTitleContainer').classList.add('showing');
            document.getElementById('aboutPageMainText').classList.add('animated');
            document.getElementById('aboutRotatedText').classList.add('animated');
            document.getElementById('aboutPageSubText1').classList.add('animated');
            document.getElementById('aboutPageSubText2').classList.add('animated');
            document.getElementById('aboutPageSubText3').classList.add('animated');
            document.getElementById('aboutPageSubText4').classList.add('animated');

            // Ensures that it doesn't show if the window width is below 1000px
            if (dynamicWindowWidth < 1000) {
                document.getElementById('expertise--button--small--screen--container').classList.add('animated');
            }

        }, 1700);

    // If we are moving away from the About page and staying away from it
    } else if (pageShown !== 'aboutPage') {

        // Remove the elements very quickly
        setTimeout(() => {
            document.getElementById('aboutPageTitleContainer').classList.remove('showing');
            document.getElementById('aboutPageMainText').classList.remove('animated');
            document.getElementById('aboutRotatedText').classList.remove('animated');
            document.getElementById('aboutPageSubText1').classList.remove('animated');
            document.getElementById('aboutPageSubText2').classList.remove('animated');
            document.getElementById('aboutPageSubText3').classList.remove('animated');
            document.getElementById('aboutPageSubText4').classList.remove('animated');
            document.getElementById('expertise--button--small--screen--container').classList.remove('animated');
        }, 250);

    }

}


// Function that focuses on toggling the Contact Page

const toggleFAQPage = (pageShown) => {

    // console.log('Adding / hiding the DOM elements of the #faq/clientPage - we inside the @function now');

    if (pageShown === 'faqPage') {

        setTimeout(() => {
            document.getElementById('faqPageContainer').classList.add('showing');
            document.getElementById('pageMainTextCharacter1').classList.add('animated');
            document.getElementById('pageMainTextCharacter2').classList.add('animated');
            document.getElementById('pageMainTextCharacter3').classList.add('animated');
            document.getElementById('pageMainTextCharacter4').classList.add('animated');
            document.getElementById('pageMainTextCharacter5').classList.add('animated');
            document.getElementById('pageMainTextCharacter6').classList.add('animated');
            document.getElementById('pageMainTextCharacter7').classList.add('animated');
            document.getElementById('faqPageTempText1').classList.add('shown');
            // document.getElementById('faqPageTempText2').classList.add('shown');
        }, 1700);

    } else if (pageShown !== 'faqPage') {

        setTimeout(() => {
            document.getElementById('faqPageContainer').classList.remove('showing');
            document.getElementById('pageMainTextCharacter1').classList.remove('animated');
            document.getElementById('pageMainTextCharacter2').classList.remove('animated');
            document.getElementById('pageMainTextCharacter3').classList.remove('animated');
            document.getElementById('pageMainTextCharacter4').classList.remove('animated');
            document.getElementById('pageMainTextCharacter5').classList.remove('animated');
            document.getElementById('pageMainTextCharacter6').classList.remove('animated');
            document.getElementById('pageMainTextCharacter7').classList.remove('animated');
            document.getElementById('faqPageTempText1').classList.remove('shown');
            // document.getElementById('faqPageTempText2').classList.remove('shown');
        
        }, 250);

    }

}


// Function which toggles the Contact Page when the correct button is clicked 

const toggleContactPage = (pageShown) => {


    // console.log('Adding / hiding the DOM elements of the #contactPage - we inside the @function now');

    if (pageShown === 'contactPage') {

        // Add the elements towards the end of the page transition 
        // Slower than the time out below it because we need it to appear after the transition is over

        setTimeout(() => {
            document.getElementById('contactPageContainer').classList.toggle('showing');
            document.getElementById('contactPageTitleID').classList.add('shown');
            document.getElementById('contactPageSubTitleID').classList.add('shown');
            document.getElementById('firstOptionContainer').classList.add('shown');
            document.getElementById('secondOptionContainer').classList.add('shown');
            document.getElementById('thirdOptionContainer').classList.add('shown');
            // document.getElementById('samarraContactPageTitle').classList.add('shown');
            document.getElementById('contactPageNewYorkOfficeID').classList.add('shown');
            document.getElementById('contactPageNewYorkOfficeEmailID').classList.add('shown');
            document.getElementById('contactPageNewYorkOfficePhoneID').classList.add('shown');
            document.getElementById('parisOfficeID').classList.add('shown');
            document.getElementById('parisOfficeEmailID').classList.add('shown');
            document.getElementById('parisOfficePhoneID').classList.add('shown');

            document.getElementById('contactPageMainTextCharacter1').classList.add('animated');
            document.getElementById('contactPageMainTextCharacter2').classList.add('animated');
            document.getElementById('contactPageMainTextCharacter3').classList.add('animated');
            document.getElementById('contactPageMainTextCharacter4').classList.add('animated');
            document.getElementById('contactPageMainTextCharacter5').classList.add('animated');
            document.getElementById('contactPageMainTextCharacter6').classList.add('animated');
            document.getElementById('contactPageMainTextCharacter7').classList.add('animated');
        }, 1700)

        setTimeout(() => {
            initiateContactPageHovers();
        }, 2200)


    } else if (pageShown !== 'contactPage') {

        // Remove the elements very quickly

        setTimeout(() => {
            document.getElementById('contactPageContainer').classList.toggle('showing')
            document.getElementById('contactPageTitleID').classList.remove('shown');
            document.getElementById('contactPageSubTitleID').classList.remove('shown');
            document.getElementById('firstOptionContainer').classList.remove('shown');
            document.getElementById('secondOptionContainer').classList.remove('shown');
            document.getElementById('thirdOptionContainer').classList.remove('shown');
            // document.getElementById('samarraContactPageTitle').classList.remove('shown');
            document.getElementById('contactPageNewYorkOfficeID').classList.remove('shown');
            document.getElementById('contactPageNewYorkOfficeEmailID').classList.remove('shown');
            document.getElementById('contactPageNewYorkOfficePhoneID').classList.remove('shown');
            document.getElementById('parisOfficeID').classList.remove('shown');
            document.getElementById('parisOfficeEmailID').classList.remove('shown');
            document.getElementById('parisOfficePhoneID').classList.remove('shown');

            document.getElementById('address-line-right-two-two').classList.remove('animated');
            document.getElementById('address-line-right-two-three').classList.remove('animated');


            document.getElementById('contactPageMainTextCharacter1').classList.remove('animated');
            document.getElementById('contactPageMainTextCharacter2').classList.remove('animated');
            document.getElementById('contactPageMainTextCharacter3').classList.remove('animated');
            document.getElementById('contactPageMainTextCharacter4').classList.remove('animated');
            document.getElementById('contactPageMainTextCharacter5').classList.remove('animated');
            document.getElementById('contactPageMainTextCharacter6').classList.remove('animated');
            document.getElementById('contactPageMainTextCharacter7').classList.remove('animated');
        }, 250);

    }


}

// This function will be used in order to toggle the 'legalPage' elements on / off depending on whether we're moving towards
// the legal page or away from the legal page

const toggleLegalPage = (pageShown) => {

    
    if (enableLogging === true) {
        console.log('Toggling the legal page');
    }

    // If it is the homePage, then we toggle these elements on
    if (pageShown === 'legalPage') {

        // Ensures that the legalPage elemnts are toggle on when we're moving to the homepage
        setTimeout(() => {
            document.getElementById('legalPage').style.opacity = 1;
            document.getElementById('legalPage').style.visibility = 'visible';
            document.getElementById('legalPage').style.display = 'flex';
            document.getElementById('legalPage').style.pointerEvents = 'auto';
        }, 1700);


    // If it's not the legalPage we toggle the legalPage elements off
    } else if (pageShown !== 'legalPage') {

        // Ensures that the title doesn't disappear directly when the actual animation is initiated
        setTimeout(() => {
            document.getElementById('legalPage').style.opacity = 0;
            document.getElementById('legalPage').style.visibility = 'hidden'; 
            document.getElementById('legalPage').style.display = 'none';
            document.getElementById('legalPage').style.pointerEvents = 'none';
        }, 400);

    }

}

// Function & Event listener attached to the text area for resizing

const OnInput = (event) => {

    if (enableLogging === true) {
        console.log('Input is being added to text area');
        console.log('Element event', event);
    }

    const element = event.srcElement;
    element.style.height = 'auto';
    element.style.height = (element.scrollHeight) + 'px';
  }

const textArea = document.getElementById('messageInput');

// for (let i = 0; i < textArea.length; i++) {
//   textArea[i].setAttribute('style', 'height:' + (textArea[i].scrollHeight) + 'px;overflow-y:hidden;');
textArea.addEventListener("input", OnInput, false);
// }


// Helper functions that orchestrates which texts are hidden and which texts are shown

const setTextAnimationTimers = (pageShown) => {

    // Toggle Menu Elements
    toggleMenuElement();


    if (pageShown === 'menuPage') {

        // Toggle Address 
        toggleAddressElements('menuPage');

        // Ensures that the menu options are displayed and hidden with a delay so that 
        // they don't appear or disappear too quickly throughout the page animation

        setTimeout(() => {

            document.getElementById('menuElements').style.visibility = 'visible';
            document.getElementById('menuElements').style.visibility = 'visible';
            document.getElementById('menuElementOne').style.visibility = 'visible';
            document.getElementById('menuElementTwo').style.visibility = 'visible';
            document.getElementById('menuElementThree').style.visibility = 'visible';
            document.getElementById('menuElementFour').style.visibility = 'visible';
            document.getElementById('menuElementOne').style.opacity = 1;
            document.getElementById('menuElementTwo').style.opacity = 1;
            document.getElementById('menuElementThree').style.opacity = 1;
            document.getElementById('menuElementFour').style.opacity = 1;


        }, 1000)


        // Adds the logo to the transition page while it is animating
        // setTimeout(() => {
        //     // Animation for the logo
        //     document.getElementById('company-logo-two').classList.toggle('showing');
        // }, 300);

        // Ensures that the title doesn't disappear directly when the actual animation is initiated
        setTimeout(() => {
            document.getElementById('homePage').style.opacity = 0;
            document.getElementById('homePage').style.visibility = 'hidden';      
        }, 1600)

        // We also need to make sure to also toggle the AboutPage so that the elements disappear
        // Passing in the 'menuPage' will ensure that the elements with the About description of the 
        // company are removed
   

    } else if (pageShown === 'homePage') {

        // Toggle Address 
        toggleAddressElements('homePage');

        // Makes sure that the menu Elements don't hide too quickly
        setTimeout(() => {

            document.getElementById('menuElements').style.visibility = 'hidden';
            // document.getElementById('company-logo-two').classList.toggle('showing');

        }, 1400);

        // Ensures that the Title elements appears quickly when the animation is re-initiated
        setTimeout(() => {
            document.getElementById('menuElementOne').style.opacity = 0;
            document.getElementById('menuElementTwo').style.opacity = 0;
            document.getElementById('menuElementThree').style.opacity = 0;
            document.getElementById('menuElementFour').style.opacity = 0; 
                  
        }, 500);

        // Everything here is orchestrated so that the elements show exactly at the correct time within the page
        // We can't have the elements of the page disappear and reappear at the wrong times. Perfection is what we aim for here.
        // How we do  small things is how do larger things. How do you cook your food? Clean your dishes? Your room? How do you treat your
        // family, the people that you know are going to stay either way? You got what I'm trying to say.
        setTimeout(() => {
            document.getElementById('homePage').style.opacity = 1;
            document.getElementById('homePage').style.visibility = 'visible';
        }, 500);

    } else if (pageShown === 'aboutPage') {

        if (enableLogging === true) {
            console.log('Toggling the about page');
        }

        setTimeout(() => {
            document.getElementById('aboutPageTitleContainer').classList.toggle('showing')
        }, 450)

    }

}

// Simply ensures that the address elements are directly toggled off

const toggleOffAddressElements = () => {

    setTimeout(() => {
        document.getElementById('address-information-left').classList.toggle('showing');
        document.getElementById('address-information-right').classList.toggle('showing');
    }, 200)

}

// Ensures that the address only shows up only when the menu page
// #toImprove: use remove / add instead of fucking toggle - applies to the function above
// @toggleOffAddressElements & this one + change the fucking name to make it more precise 
const toggleAddressElements = (pageShown) => {

    // console.log('Adding / Removing DOM contact elements through @toggleAddressElements');

    // Timeout is shorter for when the homepage shoes again because we need it to disappear quickly
    // since the first part of the animation that translatesY  the white div goes very fast initially
    // very quickly

    if (pageShown === 'menuPage') {

            setTimeout(() => {
                document.getElementById('address-information-left').classList.toggle('showing');
                document.getElementById('address-information-right').classList.toggle('showing');
                document.getElementById('menuPageNewYorkOfficeID1').classList.add('shown');
                document.getElementById('menuPageNewYorkOfficeStreetID').classList.add('shown');
                document.getElementById('menuPageNewYorkOfficeZipID').classList.add('shown');
                document.getElementById('menuPageNewYorkOfficeID2').classList.add('shown');
                document.getElementById('menuPageNewYorkOfficeEmailID').classList.add('shown');
                document.getElementById('menuPageNewYorkOfficePhoneID').classList.add('shown');
                document.getElementById('menuPageParisOfficeID1').classList.add('shown');
                document.getElementById('menuPageParisOfficeStreetID').classList.add('shown');
                document.getElementById('menuPageParisOfficeZipID').classList.add('shown');
                document.getElementById('menuPageParisOfficeID2').classList.add('shown');
                document.getElementById('menuPageParisOfficeEmailID').classList.add('shown');
                document.getElementById('menuPageParisOfficePhoneID').classList.add('shown');

            }, 1700)

    } else if (pageShown !== 'menuPage') {


            setTimeout(() => {
                document.getElementById('address-information-left').classList.toggle('showing');
                document.getElementById('address-information-right').classList.toggle('showing');
                document.getElementById('menuPageNewYorkOfficeID1').classList.remove('shown');
                document.getElementById('menuPageNewYorkOfficeStreetID').classList.remove('shown');
                document.getElementById('menuPageNewYorkOfficeZipID').classList.remove('shown');
                document.getElementById('menuPageNewYorkOfficeID2').classList.remove('shown');
                document.getElementById('menuPageNewYorkOfficeEmailID').classList.remove('shown');
                document.getElementById('menuPageNewYorkOfficePhoneID').classList.remove('shown');
                document.getElementById('menuPageParisOfficeID1').classList.remove('shown');
                document.getElementById('menuPageParisOfficeStreetID').classList.remove('shown');
                document.getElementById('menuPageParisOfficeZipID').classList.remove('shown');
                document.getElementById('menuPageParisOfficeID2').classList.remove('shown');
                document.getElementById('menuPageParisOfficeEmailID').classList.remove('shown');
                document.getElementById('menuPageParisOfficePhoneID').classList.remove('shown');

            }, 200)

    }
}

const toggleMenuElement = (pageShown) => {

    document.getElementById('menuElementOne').classList.toggle('showing');
    document.getElementById('menuElementTwo').classList.toggle('showing');
    document.getElementById('menuElementThree').classList.toggle('showing');
    document.getElementById('menuElementFour').classList.toggle('showing');

}

// Function that ensures that Samarra & Co. and the color of the cursor change colors when the 
// generalPageTransition is triggered
// Two timeouts are involved here. First one to make sure the text is black, and a second to revert the text color to 
// white if we are back on the homePage, amongst other things

// #toImprove: in this case the name is not clear enough
const toggleTextColor = (event) => {

    // Changes the cursor to black
    changeCursorColorToBlack();

    // console.log('Page transition text & cursor changes initiated')

    ANIMATION_STARTED = true;
    pageTransitionPlaying = true;
    

    // The Samarra Group / Capital doesn't show when we move from the actual other pages
    // because of the fact that it's made invisible. So we need to make sure to make it 
    // visibile

    setTimeout(() => {

        // console.log('Quickly changing the colors of the text of Samarra & Co.');

        document.getElementById('companyName').style.color = 'black';
        document.getElementById('homePage').style.opacity = 1;
        document.getElementById('homePage').style.visibility = 'visible';
    }, 450)

    setTimeout(() => {
        document.getElementById('companyName').style.color = 'white';

        if (pageShown !== 'homePage') {
            document.getElementById('homePage').style.opacity = 0;
            document.getElementById('homePage').style.visibility = 'hidden';
        }

    }, 1600)
}

const makeTitleTextWhite = () => {

    if (enableLogging === true) {
        console.log('Animation ended');
    }

    document.getElementById('companyName').style.color = 'white';
}

const myRepeatFunction = (event) => {
    let elapsedTime = "Elapsed time: " + event.elapsedTime;

    if (enableLogging === true) {
        console.log('Inner HTML', elapsedTime);
    }

}

// GLOBAL VARIABLE

const showContactMenu = (event) => {

    formShowing = !formShowing;

    // First we set the formShowing boolean to true - we use it later in the hideForm but more importantly
    // in the transition-related events that will reset the transition delays for the two divs to be their
    // initial value

    if (enableLogging === true) {
        console.log('Contact menu #contactMenu is supposed to be shown');
        console.log('Event fired is ', event);
    }

    const id = event.target.id;

    const formTitleElement = document.getElementById('contactPageTitle');
    const formSubTitleElement = document.getElementById('contactPageSubTitle');

    if (id === 'askAQuestion' || id === 'askAQuestionArrowSVG') {
        formTitleElement.innerHTML = 'Ask a Question';
        formSubTitleElement.innerHTML = "Ask us anything, we'll make sure to answer in the briefest delay.";

    } else if (id === 'joinTeam' || id === 'joinTeamArrowSVG') {
        formTitleElement.innerHTML = 'Join our Team';
        formSubTitleElement.innerHTML = "Please tell us about yourself.";
    } else if (id === 'startProject' || id === 'startProjectArrowSVG') {
        formTitleElement.innerHTML = 'Start a Project';
        formSubTitleElement.innerHTML = "Tell us more about your project and how we can help.";
    }

    if (formShowing === true) {
        // We hide the general options and the initial presentation of the contact page 
        document.getElementById('contactPageOptions').classList.add('hidden');

        // Remove the shown class from all the correct DOM elements
        // document.getElementById('contactPageTitleID').classList.remove('shown');
        // document.getElementById('contactPageSubTitleID').classList.remove('shown');
        // document.getElementById('firstOptionContainer').classList.remove('shown');
        // document.getElementById('secondOptionContainer').classList.remove('shown');
        // document.getElementById('thirdOptionContainer').classList.remove('shown');
        // document.getElementById('samarraContactPageTitle').classList.remove('shown');

        // We display the form associated to the question / option that is clicked by the user
        document.getElementById('contactPageOptionsTwo').classList.add('showing');

    } else if (formShowing === false) {

        document.getElementById('contactPageOptions').classList.remove('hidden');

        // Add 'shown' class to all the targeted elements so that the animations display properly
        // document.getElementById('contactPageTitleID').classList.add('shown');
        // document.getElementById('contactPageSubTitleID').classList.add('shown');
        // document.getElementById('firstOptionContainer').classList.add('shown');
        // document.getElementById('secondOptionContainer').classList.add('shown');
        // document.getElementById('thirdOptionContainer').classList.add('shown');
        // document.getElementById('samarraContactPageTitle').classList.add('shown');
        
        document.getElementById('contactPageOptionsTwo').classList.remove('showing');

    }
}

// #form #contactPage

// Function used in order to send the client email to the Samarra email

// Sending the email is taken care of through FormSpree.io, this function will simply be used in order to validate that the correct inputs have been
// actually filled up

// Variables that will be used and modified by the actual validation form in order to track which inputs have errors and which haven't

// These are actually useless #delete

let firstNameInputError = false, 
    lastNameInputError = false, 
    companyNameInputError = false, 
    phoneNumberInputError = false, 
    emailInputError = false, 
    messageInputError = false;

const validateForm = () => {

    const lastNameElement = document.getElementById('lastNameActualInput');
    const firstNameElement=  document.getElementById('firstNameActualInput');
    const emailElement=  document.getElementById('emailActualInput');
    const phoneNumberElement=  document.getElementById('phoneNumberActualInput');
    const companyNameElement=  document.getElementById('companyNameActualInput');
    const messageElement =  document.getElementById('messageInput');

    const lastNameText = document.getElementById('lastNameInput');
    const firstNameText=  document.getElementById('firstNameInput');
    const emailText =  document.getElementById('emailInput');
    const phoneNumberText =  document.getElementById('phoneNumberInput');
    const companyNameText =  document.getElementById('companyNameInput');

    const lastNameActualInput =  document.getElementById('lastNameActualInput').value;
    const firstNameActualInput =  document.getElementById('firstNameActualInput').value;
    const emailActualInput =  document.getElementById('emailActualInput').value;
    const phoneNumberActualInput =  document.getElementById('phoneNumberActualInput').value;
    const companyNameActualInput =  document.getElementById('companyNameActualInput').value;
    const messageInput =  document.getElementById('messageInput').value;

    if (lastNameActualInput == '') {
        lastNameElement.classList.toggle('inputError');
        lastNameText.classList.toggle('inputError');
        lastNameInputError = true;
    }

    if (firstNameActualInput === '') {
        firstNameElement.classList.toggle('inputError');
        firstNameText.classList.toggle('inputError');
        firstNameInputError = true;
    }

    if (emailActualInput === '') {
        emailElement.classList.toggle('inputError');
        emailText.classList.toggle('inputError');
        emailInputError = true;
    }

    if (phoneNumberActualInput === '') {
        phoneNumberElement.classList.toggle('inputError');
        phoneNumberText.classList.toggle('inputError');
        phoneNumberInputError = true;
    }

    if (companyNameActualInput === '') {
        companyNameElement.classList.toggle('inputError');
        companyNameText.classList.toggle('inputError');
        companyNameInputError = true;
    }

    if (messageInput === '') {
        messageElement.classList.toggle('inputError');
        messageInputError = true;    
    }

}


// Function that will track the different inputs & will change the color of the descriptive text and the border bottom to white when the user actually writes
// in the input

const trackTextInputForm = (event) => {

    if (enableLogging === true) {
        console.log('Tracking text input form by User');
    }

    const lastNameText = document.getElementById('lastNameInput');
    const firstNameText=  document.getElementById('firstNameInput');
    const emailText =  document.getElementById('emailInput');
    const phoneNumberText =  document.getElementById('phoneNumberInput');
    const companyNameText =  document.getElementById('companyNameInput');

    const lastNameActualInput =  document.getElementById('lastNameActualInput');
    const firstNameActualInput =  document.getElementById('firstNameActualInput');
    const emailActualInput =  document.getElementById('emailActualInput');
    const phoneNumberActualInput =  document.getElementById('phoneNumberActualInput');
    const companyNameActualInput =  document.getElementById('companyNameActualInput');
    const messageInput =  document.getElementById('messageInput');

    const inputID = event.target.id;

    if (enableLogging === true) {
        console.log('INPUT ID OF EVENT IS', inputID);
    }

    if (inputID === 'firstNameActualInput') {

        firstNameText.classList.remove('inputError');
        firstNameActualInput.classList.remove('inputError');

    } else if (inputID === 'lastNameActualInput') {

        lastNameText.classList.remove('inputError');
        lastNameActualInput.classList.remove('inputError');

    } else if (inputID === 'emailActualInput') {

        emailText.classList.remove('inputError');
        emailActualInput.classList.remove('inputError');

    } else if (inputID === 'phoneNumberActualInput') {

        phoneNumberText.classList.remove('inputError');
        phoneNumberActualInput.classList.remove('inputError');

    } else if (inputID === 'companyNameActualInput') {

        companyNameText.classList.remove('inputError');
        companyNameActualInput.classList.remove('inputError');

    } else if (inputID === 'messageInput') {
        messageInput.classList.remove('inputError');
    }

}


// Function that is triggered by 1. the Back button at the top of the form when the form is shown & 2. when the menu is clicked while the form is actually showing
const hideForm = (event) => {

    // console.log('Hiding the contact form with all the user inputs');

    // When we hide the form, before we toggle the class to do it successfully, we change the delays of the transitions so that it mirrors the first transition
    // when the user first lands on the contact page
    document.getElementById('contactPageOptions').style.transitionDelay = '0.4s';
    document.getElementById('contactPageOptionsTwo').style.transitionDelay = '0s';

    // We hide the form associated to the question / option that is clicked by the user
    document.getElementById('contactPageOptionsTwo').classList.remove('showing');

    // We show the general options and the initial presentation of the contact page 
    document.getElementById('contactPageOptions').classList.remove('hidden');

    // Throw an asynchronous event reset delays so that the transition delays are reset after the asynchronous DOM events above
    resetDelaysContactPage();

    // Clear all the inputs of the form
    clearAllInputs();

}

// Function that will be called by the hideForm function above, triggered by the Back button at the top of the contact form on the Contact page.
// Will ensure that all of the values written by the user within the function are cleared out

const clearAllInputs = () => {

    const lastNameActualInput =  document.getElementById('lastNameActualInput');
    const firstNameActualInput =  document.getElementById('firstNameActualInput');
    const emailActualInput =  document.getElementById('emailActualInput');
    const phoneNumberActualInput =  document.getElementById('phoneNumberActualInput');
    const companyNameActualInput =  document.getElementById('companyNameActualInput');
    const messageInput =  document.getElementById('messageInput');

    const lastNameInput =  document.getElementById('lastNameInput');
    const firstNameInput =  document.getElementById('firstNameInput');
    const emailInput =  document.getElementById('emailInput');
    const phoneNumberInput =  document.getElementById('phoneNumberInput');
    const companyNameInput =  document.getElementById('companyNameInput');

    lastNameActualInput.value = '';
    firstNameActualInput.value = '';
    emailActualInput.value = '';
    phoneNumberActualInput.value = '';
    companyNameActualInput.value = '';
    messageInput.value = '';

    lastNameInput.classList.remove('clicked');
    firstNameInput.classList.remove('clicked');
    emailInput.classList.remove('clicked');
    phoneNumberInput.classList.remove('clicked');
    companyNameInput.classList.remove('clicked');

    lastNameTextMoved = false;
    firstNameTextMoved = false;
    phoneNumberTextMoved = false;
    companyNameTextMoved = false;
    emailTextMoved = false;

    // Clear the color of the inputs

    lastNameInput.classList.remove('inputError');
    firstNameInput.classList.remove('inputError');
    emailInput.classList.remove('inputError');
    phoneNumberInput.classList.remove('inputError');
    companyNameInput.classList.remove('inputError');
    messageInput.classList.remove('inputError');


    lastNameActualInput.classList.remove('inputError');
    firstNameActualInput.classList.remove('inputError');
    emailActualInput.classList.remove('inputError');
    phoneNumberActualInput.classList.remove('inputError');
    companyNameActualInput.classList.remove('inputError');

}

const resetDelaysContactPage = (event) => {

    setTimeout(() => {
    // After the transitions are done and the elements are shown / hidden respectively, we can actually reset the delays to be the accurate ones
        document.getElementById('contactPageOptions').style.transitionDelay = '0s';
        document.getElementById('contactPageOptionsTwo').style.transitionDelay = '0.4s';
    }, 1000);

}

// Ensures that the class is toggled back so that .showing isn't on the element. Allows us to re-trigger the animation whenever we click on the actual menu button.
// This function always runs at the end of the animation

// #toImprove: the name of this function is not very accurate / precise & the way of interacting with the classList below
// namely the toggle method is awkward

const toggleClassOnAnimation = (event) => {

    // Change cursor to white
    // changeCursorColorToWhite();

    // Set the two to false in order to enable animations in the future
    ANIMATION_STARTED = false;
    MENU_BASED_ANIMATION_STARTED = false;

    // Set it to false again to allow the user to click on the menu button again
    pageTransitionPlaying = false;
    
    // Toggle the reveal layer
    let revealLayerOne = document.getElementById('reveal--layer');
    revealLayerOne.classList.toggle('showing');
    
    // Toggle the class of the vertical logo too
    let logo = document.getElementById('company-logo-two');
    // logo.classList.toggle('showing');

}


// Animation in order to show / hide the voice control for the website

const toggleVoiceControl = () => {

    // Variable used in order to track whether the actual activate voice text is displayed on the user page
    ACTIVATE_VOICE_SHOWN = !ACTIVATE_VOICE_SHOWN;

    let voiceControlElement = document.getElementById('disabilitiesRelatedText');
    voiceControlElement.classList.toggle('showing');
}

// Animation to show the second part of voice control for the website

const toggleVoiceControlDirections = () => {

    // Variable used to track whether the directions are displayed
    DIRECTIONS_VOICE_SHOWN = !DIRECTIONS_VOICE_SHOWN;

    // First we hide the element that says 'Activate Voice Control'
    let voiceControlElement = document.getElementById('disabilitiesRelatedText');
    voiceControlElement.classList.toggle('showing');

    // Second we show the element that gives the user directions as to how to use voice control
    let directionsVoiceControlElement = document.getElementById('directionsVoiceControl');
    directionsVoiceControlElement.classList.toggle('showing');

}


// ----------------------------------------------------------------------------------------------------

/*
 * Voice Control Area 
 */


let USER_DECIDED_TO_DEACTIVATE = false;

const triggerEndOfSpeechRecognition = () => {

    // We reset it to 0 so that next time the user actually talks to the speech recognition API we know which index we're at
    // and where to get the latest actual command given

    if (enableLogging === true) {
        console.log('Speech recognition service has disconnected successfully');
        console.log('DID USER DECIDE TO DEACTIVATE', USER_DECIDED_TO_DEACTIVATE);
    }

    CURRENT_SPEECH_SESSION_COUNTER = 0;

    if (USER_DECIDED_TO_DEACTIVATE === false) {
        // Restart speech recognition
        speechRecognitionListening = true;
        startSpeechRecognition();
    } else if (USER_DECIDED_TO_DEACTIVATE === true) {
        speechRecognitionListening = true; 
    }

    // Reset the constant above to false so that the user can click again
    USER_DECIDED_TO_DEACTIVATE = false;

}

const triggerStartOfSpeechRecognition = () => {

    if (enableLogging === true) {
        console.log('Speech recognition service has started successfully');
    }

}

// Constants

// Attention
// VOICE_RESULTS_COUNTER sometimes is higher than the actual count because the SpeechRecognition API does not run continuously for some reason 
let VOICE_RESULTS_COUNTER = 0;
let CURRENT_SPEECH_SESSION_COUNTER = 0;

// Array that stores all the commands spoken by the user
let arrayOfUserCommands = [];

// Get SpeechRecognition API
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let speechRecognitionListening = false;

// Check if it's not undefined and initialize if it is accesible to this browser
if (typeof SpeechRecognition !== 'undefined') {
    
    if (enableLogging === true) {
        console.log('Speech Recognition API is compatible with this browser')
    }

    recognition = new SpeechRecognition;
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.addEventListener('end', triggerEndOfSpeechRecognition)
    recognition.addEventListener('start', triggerStartOfSpeechRecognition)

} else if (typeof SpeechRecognition === 'undefined') {
    const voiceControlElement = document.getElementById('voiceControlText');
    voiceControlElement.innerHTML = 'Voice Control not available in this browser';

    if (enableLogging === true) {
        console.log('Voice control #voiceControl is not available in this browser');
    }

}
// Event that triggers the speech to text recognition when the voice control is clicked 

const stopSpeechRecognition = () => {
    recognition.stop();

    // Don't forget to change the boolean to false so the text can appear afterwards
    if (enableLogging === true) {
        console.log('Speech recognition listening', speechRecognitionListening);
        console.log('#Recognition #recognition stopped');
        console.log('Recognition stopped')
    }

}

const startSpeechRecognition = () => {

    console.log('Starting speech recognition')
    if (speechRecognitionListening === false) {

        if (enableLogging === true) {
            console.log('TOGGLING THE VOICE CONTROL DIRECTIONS');
        };

        toggleVoiceControlDirections();
    }
    recognition.start();

    if (enableLogging === true) {
        console.log('Listening.')
    }

}

const onSpeechRecognitionResult = (event) => {

    if (enableLogging === true) {
        console.log('Event of results of recognition is', event);
    }

    // Function returns an object that has the transcript of the user's speech, a confidence percentage of how accurate it is, and a boolean isFinal that 
    // indicates whether it is the last sentence mentioned by the user
    let finalResultObject = extractTextFromSpeech(event);


    // We push the object that shows the user command into an array in order to always be able to track all of the previous commands.
    // The SpeechRecognition API returns an array of objects continuously, constantly adding to the next index the new result, so we initially
    // used a counter in order to track how many commands were given. But the SpeechRecognition API also goes to sleep after a certain period (read seconds)
    // of inactivity, which means that it'll be easier for us to track all the commands through an array
    arrayOfUserCommands.push(finalResultObject);

    if (enableLogging === true) {
        console.log('Array of user commands', arrayOfUserCommands);
    }

    let finalCommand = arrayOfUserCommands[VOICE_RESULTS_COUNTER];

    if (enableLogging === true) {
        console.log('VOICE RESULTS COUNTER', VOICE_RESULTS_COUNTER);
    }

    // Increment the counter every time so we know what's the index of the last element
    VOICE_RESULTS_COUNTER += 1;

    if (enableLogging === true) {
        console.log('Final Command Given by User', finalCommand);
    }

    // Only trigger the analysis of the speech when the boolean returns true & if the confidence level is above 85%;
    if (finalResultObject.isFinal === true && finalResultObject.confidence > 0.65) {
        analyzeSpeech(finalCommand);
    }

}

// Add Event listener to speech recognition
recognition.addEventListener('result', onSpeechRecognitionResult);

// const activateVoiceControl = () => {

//     console.log('Activating voice control');
//     let voiceControlElement = document.getElementById('disabilitiesRelatedText');

//     if (typeof SpeechRecognition === 'undefined') {
//         const voiceControlElement = document.getElementById('voiceControlText');
//         voiceControlElement.innerHTML = 'Voice Control not available in this browser';
//         console.log('Voice control #voiceControl is not available in this browser');
//     } else {


//         // Toggle The Voice Control Directions so the user knows what to say in order to navigate the website
//         // toggleVoiceControlDirections();

//         // let listening  = false;
//         // const recognition = new SpeechRecognition;

//         // const start = () => {

//         // };

//         // const stop = () => {

//         // };



        

//         // voiceControlElement.addEventListener('click', () => {
//         //     listening ? stop() : start();
//         //     listening = !listening;
//         // });

//     }


// }


// Utility Function that extracts the final result from the speech recognition

const extractTextFromSpeech = (event) => {
    
    // Always gets the last result 
    // SpeechRecognition API adds all the results to the same array, so we have to make sure to always get the latest element of the array

    // VOICE_RESULTS_COUNTER = counts the amount of commands given to the SpeechRecognition API. Used to keep track of the different indices of the
    // results so that we can access them every time
    let resultObject = event.results[CURRENT_SPEECH_SESSION_COUNTER][0];

    if (enableLogging === true) {
        console.log('Last result object', resultObject);
    }
    // Tells you if this event is the final speech given by the user
    let resultObjectFinal = event.results[CURRENT_SPEECH_SESSION_COUNTER].isFinal;

    if (enableLogging === true) {
        console.log('Current speech session counter is', CURRENT_SPEECH_SESSION_COUNTER);
    }

    // Increment the counter for the current session
    CURRENT_SPEECH_SESSION_COUNTER += 1;

    if (enableLogging === true) {
        console.log('Result object is', resultObject);
    }

    let finalResult = {
        speech: resultObject.transcript,
        confidence: resultObject.confidence,
        isFinal: resultObjectFinal,
    }

    if (enableLogging === true) {
        console.log('final result', finalResult)
        console.log('Analyzing presence of string through index')
    }


    const { speech } = finalResult;

    let isStringPresent = speech.indexOf('deactivate voice control');

    if (enableLogging === true) {
        console.log('Is string present within speech', isStringPresent);
    }

    if (finalResult.isFinal === true ) {

        if (enableLogging === true) {
            console.log('Object of speech results', finalResult);
        }

        return finalResult;
    }

    return finalResult;

}

const deactivateVoiceControl = () => {

    // First we reset all the counters to 0, flush out the array, and after that we stop the voice control
    VOICE_RESULTS_COUNTER = 0;
    CURRENT_SPEECH_SESSION_COUNTER = 0;
    arrayOfUserCommands = [];
    stopSpeechRecognition();

    // Second we toggle the class so that it looks like what it is supposed to look with 'Activate Voice Control'
    document.getElementById('directionsVoiceControl').classList.toggle('showing');
    document.getElementById('disabilitiesRelatedText').classList.toggle('showing');

}

// FORM RELATED VARIABLES

let lastNameTextMoved = false;
let firstNameTextMoved = false;
let emailTextMoved = false;
let companyNameTextMoved = false;
let phoneNumberTextMoved = false;

const triggerInputAnimation = (event) => {

    if (enableLogging === true) {
        console.log('Event triggered by input', event);
    }

    const inputName = event.target.id;

    if (enableLogging === true) {
        console.log('Input name is', inputName)
    }

    const lastNameActualInput =  document.getElementById('lastNameActualInput').value;
    const firstNameActualInput =  document.getElementById('firstNameActualInput').value;
    const emailActualInput =  document.getElementById('emailActualInput').value;
    const phoneNumberActualInput =  document.getElementById('phoneNumberActualInput').value;
    const companyNameActualInput =  document.getElementById('companyNameActualInput').value;

    if (enableLogging === true) {
        console.log('Last Name Actual Input', lastNameActualInput);
        console.log('First Name Actual Input', firstNameActualInput);
        console.log('Email Actual Input', emailActualInput);
    }

    if (inputName === 'lastNameInput') {

        // Do not toggle it if the value is different than empty string

        if (lastNameActualInput === '') {
            lastNameTextMoved = !lastNameTextMoved;
            document.getElementById('lastNameInput').classList.toggle('clicked');
        }

    } else if (inputName === 'firstNameInput') {

        if (firstNameActualInput === '') {
            firstNameTextMoved = !firstNameTextMoved;
            document.getElementById('firstNameInput').classList.toggle('clicked');
        }

    } else if (inputName === 'emailInput') {

        if (emailActualInput === '') {
            emailTextMoved = !emailTextMoved;
            document.getElementById('emailInput').classList.toggle('clicked');
        }

    }  else if (inputName === 'phoneNumberInput') {

        if (phoneNumberActualInput === '') {
            phoneNumberTextMoved = !phoneNumberTextMoved;
            document.getElementById('phoneNumberInput').classList.toggle('clicked');
        }

    }  else if (inputName === 'companyNameInput') {

        if (companyNameActualInput === '') {
            companyNameTextMoved = !companyNameTextMoved;
            document.getElementById('companyNameInput').classList.toggle('clicked');
        }

    }

}

// This function takes care of the scenario when a user tabs into an input without actually clicking it.
// Without this function, the text that describes the input would stay in the same position (within the input)
// instead of being moved up for the user to be able to write in the input - which is the behavior that takes
// place when the user clicks on the text

const triggerTextRiseAnimation = (event) => {

    if (enableLogging === true) {
        console.log('ELEMENT FOCUSED THROUGH TABBING');
    }

    const inputName = event.target.id;

    if (enableLogging === true) {
        console.log('Input name is', inputName)
    }

    const lastNameActualInput =  document.getElementById('lastNameActualInput').value;
    const firstNameActualInput =  document.getElementById('firstNameActualInput').value;
    const emailActualInput =  document.getElementById('emailActualInput').value;
    const phoneNumberActualInput =  document.getElementById('phoneNumberActualInput').value;
    const companyNameActualInput =  document.getElementById('companyNameActualInput').value;

    if (inputName === 'lastNameActualInput') {

        // Do not toggle it if the value is different than empty string

        if (lastNameTextMoved === false) {
            document.getElementById('lastNameInput').classList.add('clicked');
            lastNameTextMoved = true;
        }

    } else if (inputName === 'firstNameActualInput') {

        if (firstNameTextMoved === false) {
            document.getElementById('firstNameInput').classList.add('clicked');
            firstNameTextMoved = true;
        }

    } else if (inputName === 'emailActualInput') {

        if (emailTextMoved === false) {
            document.getElementById('emailInput').classList.add('clicked');
            emailTextMoved = true;
        }

    }  else if (inputName === 'phoneNumberActualInput') {

        if (phoneNumberTextMoved === false) {
            document.getElementById('phoneNumberInput').classList.add('clicked');
            phoneNumberTextMoved = true;
        }

    }  else if (inputName === 'companyNameActualInput') {

        if (companyNameTextMoved === false) {
            document.getElementById('companyNameInput').classList.add('clicked');
            companyNameTextMoved = true;
        }

    }
}

// #speech #speechRecognition

const analyzeSpeech = (speechResultObject) => {

    if (enableLogging === true) {
        console.log('About to analyzes speech');
        console.log('Object given to analyzer is', speechResultObject);    
    }

    let { speech } = speechResultObject;
    speech = speech.toLowerCase();
    speech = speech.trim();

    if (enableLogging === true) {
        console.log('Speech is NOW', speech);
        console.log('Speech extracted is', speech);
    }


    const mainMenuSpeech = 'go to main menu';
    const mainMenuSpeech2 = 'main menu';
    const mainMenuSpeech3 = 'mainmenu';
    const mainMenuSpeech4 = 'go to mainmenu';
    const mainMenuSpeech5 = 'go back to main menu';

    const aboutPageSpeech = 'go to about page';
    const aboutPageSpeech2 = 'go to aboutpage';
    const aboutPageSpeech3 = 'about page';
    const aboutPageSpeech4 = 'aboutpage';
    const aboutPageSpeech5 = 'go back to about page';

    const contactPageSpeech = 'go to contact page';
    const contactPageSpeech2 = 'go to contactpage';
    const contactPageSpeech3 = 'contact page';
    const contactPageSpeech4 = 'contactpage';
    const contactPageSpeech5 = 'go back to contact page';


    const clientPageSpeech = 'go to client page';
    const clientPageSpeech2 = 'go to clientpage';
    const clientPageSpeech3 = 'client page';
    const clientPageSpeech4 = 'clientpage';
    const clientPageSpeech5 = 'go back to client page';


    const homePageSpeech = 'go to home page';
    const homePageSpeech2 = 'go to homepage';
    const homePageSpeech3 = 'homepage';
    const homePageSpeech4 = 'home page';
    const homePageSpeech5 = 'go back to home page';

    const deactivateSpeech = 'deactivate voice control';
    const deactivateSpeech2 = 'Deactivate voice control';
    const deactivateSpeech3 = 'deactivate voicecontrol';


    // if (speech === mainMenuSpeech || speech === mainMenuSpeech2 || speech === mainMenuSpeech3 || speech === mainMenuSpeech4 || speech === mainMenuSpeech5) {
    //     toggleMenuAnimation();
    // } else if (speech === aboutPageSpeech || speech === aboutPageSpeech2 || speech === aboutPageSpeech3 || speech === aboutPageSpeech4 || speech === aboutPageSpeech5) {
    //     toggleGeneralPageTransition('aboutPage');
    // } else if (speech === contactPageSpeech || speech === contactPageSpeech2 || speech === contactPageSpeech3 || speech === contactPageSpeech4 || speech === contactPageSpeech5) {
    //     toggleGeneralPageTransition('contactPage');
    // } else if (speech === clientPageSpeech || speech === clientPageSpeech2 || speech === clientPageSpeech3 || speech === clientPageSpeech4 || speech === clientPageSpeech5) {
    //     toggleGeneralPageTransition('clientPage');
    // } else if (speech === homePageSpeech || speech === homePageSpeech2 || speech === homePageSpeech3 || speech === homePageSpeech4 || speech === homePageSpeech5) {
    //     toggleMenuAnimation();
    // } else if (speech === deactivateSpeech || speech === deactivateSpeech2 || speech === deactivateSpeech3) {
    //     // By switching this to true, we prevent it from starting again automatically
    //     USER_DECIDED_TO_DEACTIVATE = true;
    //     deactivateVoiceControl();
    // }

    let mainMenuFinder = speech.indexOf('main menu');
    let aboutPageFinder = speech.indexOf('about page');
    let contactPageFinder = speech.indexOf('contact page');
    let clientPageFinder = speech.indexOf('client page');
    let homePageFinder = speech.indexOf('home page');
    let homePageFinder2 = speech.indexOf('homepage');

    if (enableLogging === true) {
        console.log('Main Menu Finder', mainMenuFinder);
        console.log('About Page Finder', aboutPageFinder);
        console.log('Contact Page Finder', contactPageFinder);
        console.log('Client Page Finder', clientPageFinder);
        console.log('Home Page 1 Finder', homePageFinder);
        console.log('Home Page 2 Finder', homePageFinder2);
    };
    
    if (mainMenuFinder != -1) {
        toggleGeneralPageTransition('menuPage');
    } else if (aboutPageFinder != -1) {
        toggleGeneralPageTransition('aboutPage');
    } else if (contactPageFinder != -1) {
        toggleGeneralPageTransition('contactPage');
    } else if (clientPageFinder != -1) {
        toggleGeneralPageTransition('clientPage');
    } else if (homePageFinder != -1 || homePageFinder2 != -1) {
        toggleGeneralPageTransition('homePage');
    } else if (speech === deactivateSpeech) {
        USER_DECIDED_TO_DEACTIVATE = true;
        deactivateVoiceControl();
    }


}

const testClick = () => {

    if (enableLogging === true) {
        console.log('Testing the click of the loading page');
    }

}

const loadingPageEndTransitions = () => {

    if (enableLogging === true) {
        console.log('Hiding the direction messages displayed on the initial loading page');
    }

}

// Function that will modify the aspect of the noisy circle

const modifyNoisyCircle = () => {

    if (enableLogging === true) {
        console.log('Hovering the Click & Hold Container ')
    }
    // polygon.radius = 1;

    // Not doing anything yet

    // const radius = 1;
    // const segments = 8;

    // polygon = new paper.Path.RegularPolygon(
    //     new paper.Point(0,0),
    //     segments,
    //     radius,
    // );

}

const showVenereMaisCourtois = (event) => {

    // console.log('Trying to show magazine');
    // let imageElement = document.getElementById('venereMaisCourtoisContainer');
    // console.log('Mouse Y', mouseY);
    // console.log('mouse X', mouseX);
    // imageElement.style.top = realMouseY - 100 + 'px';
    // imageElement.style.left = realMouseX + 'px';
    // imageElement.classList.add('shown');

    // console.log('Mouse Event for Over', event.target);

    hoveringElement = true;

}

const hideVenereMaisCourtois = () => {

    // console.log('HIDE VENERE MAIS COURTOIS')
    // let imageEl = document.getElementById('venereMaisCourtoisContainer');
    // imageEl.style.opacity = 0;
    // imageEl.classList.remove('shown');

    hoveringElement = false;


}

// Function that hides the 'About' text and shows the expertise Text

const showExpertiseText = () => {


    typeOfAboutPage = 'expertiseText';

    // Make the pointer events of the container none so that the user can actually scroll the expertise text 
    document.getElementById('aboutExpertiseTextContainer').style.pointerEvents = 'auto';
    document.getElementById('aboutExpertiseTextContainer').style.overflowY = 'scroll';

    // Hide the 'About' text & the button that leads us to the Expertise information
    // document.getElementById('aboutPageExperimentalContainer').classList.add('hidden');
    document.getElementById('expertiseButtonContainer').classList.remove('shown');

    // Remove the classes from the 'About' page text to allow for the animations to be triggered later
    // setTimeout(() => {
    document.getElementById('expertise--button--small--screen--container').classList.remove('animated');
    // document.getElementById('aboutPageArrowContainer').classList.remove('animated');
    document.getElementById('aboutPageMainText').classList.remove('animated');
    document.getElementById('aboutRotatedText').classList.remove('animated');
    document.getElementById('aboutPageSubText1').classList.remove('animated');
    document.getElementById('aboutPageSubText2').classList.remove('animated');
    document.getElementById('aboutPageSubText3').classList.remove('animated');
    document.getElementById('aboutPageSubText4').classList.remove('animated');
    // }, 1600)

    // Show the 'Expertise' text
    // document.getElementById('aboutPageExpertiseContainer').classList.add('shown');
    document.getElementById('aboutRotatedText2').classList.add('shown');
    document.getElementById('expertiseGroupTitle1').classList.add('shown');
    document.getElementById('expertiseGroupTitle2').classList.add('shown');
    document.getElementById('expertiseGroupTitle3').classList.add('shown');
    document.getElementById('expertiseGroupTitle4').classList.add('shown');
    document.getElementById('expertiseGroupTitle5').classList.add('shown');
    document.getElementById('expertiseGroupTitle6').classList.add('shown');

    
    let expertiseOneElements = document.getElementsByClassName('expertiseText1');

    let expertiseOneDivs = Array.prototype.forEach.call(expertiseOneElements, function(element){
        element.classList.add('shown')
      });


    let expertiseTwoElements = document.getElementsByClassName('expertiseText2');

    let expertiseTwoDivs = Array.prototype.forEach.call(expertiseTwoElements, function(element){
        element.classList.add('shown')
    });
  
    let expertiseThreeElements = document.getElementsByClassName('expertiseText3');

    let expertiseThreeDivs = Array.prototype.forEach.call(expertiseThreeElements, function(element){
        element.classList.add('shown')
      });


    let expertiseFourElements = document.getElementsByClassName('expertiseText4');

    let expertiseFourDivs = Array.prototype.forEach.call(expertiseFourElements, function(element){
        element.classList.add('shown')
    });
  
  
    let expertiseFiveElements = document.getElementsByClassName('expertiseText5');

    let expertiseFiveDivs = Array.prototype.forEach.call(expertiseFiveElements, function(element){
        element.classList.add('shown')
      });


    let expertiseSixElements = document.getElementsByClassName('expertiseText6');

    let expertiseSixDivs = Array.prototype.forEach.call(expertiseSixElements, function(element){
        element.classList.add('shown')
    });
  
    document.getElementById('aboutButtonContainer').classList.add('shown');


}

// Function that hides the 'About' text and shows the expertise Text

const hideExpertiseText = () => {


    typeOfAboutPage = 'descriptionText';
    // console.log('Hide Expertise Text')

    // Make the pointer events of the container none so that the user can actually scroll the description page
    document.getElementById('aboutExpertiseTextContainer').style.pointerEvents = 'none !important';
    document.getElementById('aboutExpertiseTextContainer').style.overflowY = 'hidden';

    // Hide the 'Expertise' text
    // document.getElementById('aboutPageExpertiseContainer').classList.remove('shown');
    document.getElementById('aboutRotatedText2').classList.remove('shown');
    document.getElementById('expertiseGroupTitle1').classList.remove('shown');
    document.getElementById('expertiseGroupTitle2').classList.remove('shown');
    document.getElementById('expertiseGroupTitle3').classList.remove('shown');
    document.getElementById('expertiseGroupTitle4').classList.remove('shown');
    document.getElementById('expertiseGroupTitle5').classList.remove('shown');
    document.getElementById('expertiseGroupTitle6').classList.remove('shown');
    
    let expertiseOneElements = document.getElementsByClassName('expertiseText1');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseOneDivs = Array.prototype.forEach.call(expertiseOneElements, function(element){
        element.classList.remove('shown')
      });


    let expertiseTwoElements = document.getElementsByClassName('expertiseText2');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseTwoDivs = Array.prototype.forEach.call(expertiseTwoElements, function(element){
        element.classList.remove('shown')
    });
  
    let expertiseThreeElements = document.getElementsByClassName('expertiseText3');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseThreeDivs = Array.prototype.forEach.call(expertiseThreeElements, function(element){
        element.classList.remove('shown')
      });


    let expertiseFourElements = document.getElementsByClassName('expertiseText4');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseFourDivs = Array.prototype.forEach.call(expertiseFourElements, function(element){
        element.classList.remove('shown')
    });
  
  
    let expertiseFiveElements = document.getElementsByClassName('expertiseText5');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseFiveDivs = Array.prototype.forEach.call(expertiseFiveElements, function(element){
        element.classList.remove('shown')
      });


    let expertiseSixElements = document.getElementsByClassName('expertiseText6');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseSixDivs = Array.prototype.forEach.call(expertiseSixElements, function(element){
        element.classList.remove('shown')
    });
  
    document.getElementById('aboutButtonContainer').classList.remove('shown');


    // SHow About Page Text - After delay set by setTimeout to ensure that all the expertise related
    // text disappears from the page

    setTimeout(() => {
        document.getElementById('aboutPageExperimentalContainer').classList.remove('hidden');
        document.getElementById('expertiseButtonContainer').classList.add('shown');
        document.getElementById('aboutPageMainText').classList.add('animated');
        document.getElementById('aboutRotatedText').classList.add('animated');
        document.getElementById('aboutPageSubText1').classList.add('animated');
        document.getElementById('aboutPageSubText2').classList.add('animated');
        document.getElementById('aboutPageSubText3').classList.add('animated');
        document.getElementById('aboutPageSubText4').classList.add('animated');

        // Only show the Expertise Button at the bottom if the page is below a certain width
        if (dynamicWindowWidth < 1000) {
            document.getElementById('expertise--button--small--screen--container').classList.add('animated');
        };

    }, 1900)

}

// Same as the function above
// The purpose is to hide the 'Expertise' text when a user either clicks on the menu @toggleMenuAnimation
// OR clicks on the top / bottom navigation buttons 'Home' or 'Client' which triggers @toggleGeneralPageTransition

const revertBackToAboutText = () => {

    // Hide the 'Expertise' text
    // document.getElementById('aboutPageExpertiseContainer').classList.remove('shown');
    document.getElementById('aboutRotatedText2').classList.remove('shown');
    document.getElementById('expertiseGroupTitle1').classList.remove('shown');
    document.getElementById('expertiseGroupTitle2').classList.remove('shown');
    document.getElementById('expertiseGroupTitle3').classList.remove('shown');
    document.getElementById('expertiseGroupTitle4').classList.remove('shown');
    document.getElementById('expertiseGroupTitle5').classList.remove('shown');
    document.getElementById('expertiseGroupTitle6').classList.remove('shown');
    
    let expertiseOneElements = document.getElementsByClassName('expertiseText1');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseOneDivs = Array.prototype.forEach.call(expertiseOneElements, function(element){
        element.classList.remove('shown')
      });


    let expertiseTwoElements = document.getElementsByClassName('expertiseText2');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseTwoDivs = Array.prototype.forEach.call(expertiseTwoElements, function(element){
        element.classList.remove('shown')
    });
  
    let expertiseThreeElements = document.getElementsByClassName('expertiseText3');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseThreeDivs = Array.prototype.forEach.call(expertiseThreeElements, function(element){
        element.classList.remove('shown')
      });


    let expertiseFourElements = document.getElementsByClassName('expertiseText4');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseFourDivs = Array.prototype.forEach.call(expertiseFourElements, function(element){
        element.classList.remove('shown')
    });
  
  
    let expertiseFiveElements = document.getElementsByClassName('expertiseText5');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseFiveDivs = Array.prototype.forEach.call(expertiseFiveElements, function(element){
        element.classList.remove('shown')
      });


    let expertiseSixElements = document.getElementsByClassName('expertiseText6');
    // console.log('Expertise text one array', expertiseTextOneArray);

    let expertiseSixDivs = Array.prototype.forEach.call(expertiseSixElements, function(element){
        element.classList.remove('shown')
    });
  
    document.getElementById('aboutButtonContainer').classList.remove('shown');


}


// These two functions are used to track whether the user is hovering over the French option or not

const userHoverOverFrench = () => {
    frenchLanguageHovered = true;
}


const userNotHoverOverFrench = () => {
    frenchLanguageHovered = false;
}

const initializeEventListeners = () => {
    document.getElementById('plus-sign-container').addEventListener('mouseenter', showLanguagesText);
    document.getElementById('plus-sign-container').addEventListener('mouseleave', hideLanguagesText);


    document.getElementById('hamburger').addEventListener('click', toggleMenuAnimation);
    document.getElementById('closeButton').addEventListener('click', toggleMenuAnimation);

    // #touchEvents #touch #touchstart
    document.getElementById('hamburger').addEventListener('touchstart', toggleMenuAnimation);
    document.getElementById('closeButton').addEventListener('touchstart', toggleMenuAnimation);

    document.getElementById('reveal--layer').addEventListener("animationstart", toggleTextColor);
    document.getElementById('reveal--layer').addEventListener("animationend", toggleClassOnAnimation);


    document.getElementById('plus-sign-container').addEventListener('click', toggleLanguageChoices);
    document.getElementById('menuElementOne').addEventListener('click', toggleGeneralPageTransition);
    document.getElementById('menuElementTwo').addEventListener('click', toggleGeneralPageTransition);
    document.getElementById('menuElementThree').addEventListener('click', toggleGeneralPageTransition);
    document.getElementById('menuElementFour').addEventListener('click', toggleGeneralPageTransition);
    document.getElementById('firstOptionContainer').addEventListener('click', showContactMenu);
    document.getElementById('secondOptionContainer').addEventListener('click', showContactMenu);
    document.getElementById('thirdOptionContainer').addEventListener('click', showContactMenu);

    // #touchEvents #touch #touchstart

    document.getElementById('plus-sign-container').addEventListener('touchstart', toggleLanguageChoices);
    document.getElementById('menuElementOne').addEventListener('touchstart', toggleGeneralPageTransition);
    document.getElementById('menuElementTwo').addEventListener('touchstart', toggleGeneralPageTransition);
    document.getElementById('menuElementThree').addEventListener('touchstart', toggleGeneralPageTransition);
    document.getElementById('menuElementFour').addEventListener('touchstart', toggleGeneralPageTransition);
    document.getElementById('firstOptionContainer').addEventListener('touchstart', showContactMenu);
    document.getElementById('secondOptionContainer').addEventListener('touchstart', showContactMenu);
    document.getElementById('thirdOptionContainer').addEventListener('touchstart', showContactMenu);

    // document.getElementById('disabilitiesRelatedText').addEventListener('click', activateVoiceControl);
    // document.getElementById('menuElementFive').addEventListener('click', toggleGeneralPageTransition);


    document.getElementById('lastNameInput').addEventListener('click', triggerInputAnimation);
    document.getElementById('firstNameInput').addEventListener('click', triggerInputAnimation);
    document.getElementById('emailInput').addEventListener('click', triggerInputAnimation);
    document.getElementById('phoneNumberInput').addEventListener('click', triggerInputAnimation);
    document.getElementById('companyNameInput').addEventListener('click', triggerInputAnimation);

    // #touchEvents #touch #touchstart

    document.getElementById('lastNameInput').addEventListener('touchstart', triggerInputAnimation);
    document.getElementById('firstNameInput').addEventListener('touchstart', triggerInputAnimation);
    document.getElementById('emailInput').addEventListener('touchstart', triggerInputAnimation);
    document.getElementById('phoneNumberInput').addEventListener('touchstart', triggerInputAnimation);
    document.getElementById('companyNameInput').addEventListener('touchstart', triggerInputAnimation);

    document.getElementById('lastNameActualInput').addEventListener('focus', triggerTextRiseAnimation);
    document.getElementById('firstNameActualInput').addEventListener('focus', triggerTextRiseAnimation);
    document.getElementById('emailActualInput').addEventListener('focus', triggerTextRiseAnimation);
    document.getElementById('phoneNumberActualInput').addEventListener('focus', triggerTextRiseAnimation);
    document.getElementById('companyNameActualInput').addEventListener('focus', triggerTextRiseAnimation);


    document.getElementById('goBackElement').addEventListener('click', hideForm);
    document.getElementById('submitFormButton').addEventListener('click', validateForm);

    // #touchEvents #touch #touchstart

    document.getElementById('goBackElement').addEventListener('touchstart', hideForm);
    document.getElementById('submitFormButton').addEventListener('touchstart', validateForm);


    // Makes sure the text and border go back to white when the input is selected
    document.getElementById('lastNameActualInput').addEventListener('input', trackTextInputForm);
    document.getElementById('firstNameActualInput').addEventListener('input', trackTextInputForm);
    document.getElementById('emailActualInput').addEventListener('input', trackTextInputForm);
    document.getElementById('phoneNumberActualInput').addEventListener('input', trackTextInputForm);
    document.getElementById('companyNameActualInput').addEventListener('input', trackTextInputForm);
    document.getElementById('messageInput').addEventListener('input', trackTextInputForm);

    document.getElementById('lastNameActualInput').addEventListener('focus', trackTextInputForm);
    document.getElementById('firstNameActualInput').addEventListener('focus', trackTextInputForm);
    document.getElementById('emailActualInput').addEventListener('focus', trackTextInputForm);
    document.getElementById('phoneNumberActualInput').addEventListener('focus', trackTextInputForm);
    document.getElementById('companyNameActualInput').addEventListener('focus', trackTextInputForm);
    document.getElementById('messageInput').addEventListener('focus', trackTextInputForm);

    document.getElementById('disabilitiesRelatedText').addEventListener('click', () => {
        speechRecognitionListening ? stopSpeechRecognition() : startSpeechRecognition();
        speechRecognitionListening = !speechRecognitionListening;

        if (enableLogging === true) {
            console.log('Speech recognition listening', speechRecognitionListening);
        }

    });

    // #touchEvents #touch #touchstart

    document.getElementById('disabilitiesRelatedText').addEventListener('touchstart', () => {
        speechRecognitionListening ? stopSpeechRecognition() : startSpeechRecognition();
        speechRecognitionListening = !speechRecognitionListening;

        if (enableLogging === true) {
            console.log('Speech recognition listening', speechRecognitionListening);
        }

    });

    // Ensures the loading page is removed once the animation for the actual loading bar is finished
    document.getElementById('loadingPage--whiteLoadingBar').addEventListener('animationend', showClickMessageToRemoveLoadingPage);


    document.getElementById('loading-page').addEventListener('click', removeInitialLoadingPage);
    // document.getElementById('cta--click--container').addEventListener('mouseenter', modifyNoisyCircle); // Not currently used
    document.getElementById('cta--click--container').addEventListener('click', goToAboutPageFromHome);
    document.getElementById('cta--click--container--two').addEventListener('click', goToClientPageFromAbout);
    document.getElementById('cta--click--container--two--about').addEventListener('click', goToHomeFromAbout);
    document.getElementById('cta--click--container--two--client').addEventListener('click', goToAboutFromClient);
    document.getElementById('cta--click--container--two--contact').addEventListener('click', goToClientFromContact);
    document.getElementById('cta--click--container--three').addEventListener('click', goToContactPageFromClient);
    document.getElementById('privacy--click--container').addEventListener('click', showLegalTermsPage);
    // document.getElementById('loading-page').addEventListener('click', testClick);
    // document.getElementById('loading-page').addEventListener('animationend', loadingPageEndTransitions)

    // #touchEvents #touch #touchstart
    document.getElementById('loading-page').addEventListener('touchstart', removeInitialLoadingPage);
    document.getElementById('cta--click--container').addEventListener('touchstart', goToAboutPageFromHome);
    document.getElementById('cta--click--container--two').addEventListener('touchstart', goToClientPageFromAbout);
    document.getElementById('cta--click--container--two--about').addEventListener('touchstart', goToHomeFromAbout);
    document.getElementById('cta--click--container--two--client').addEventListener('touchstart', goToAboutFromClient);
    document.getElementById('cta--click--container--two--contact').addEventListener('touchstart', goToClientFromContact);
    document.getElementById('cta--click--container--three').addEventListener('touchstart', goToContactPageFromClient);
    document.getElementById('privacy--click--container').addEventListener('touchstart', showLegalTermsPage);

    document.getElementById('venereMaisCourtois').addEventListener('mouseenter', showVenereMaisCourtois);
    document.getElementById('venereMaisCourtois').addEventListener('mouseleave', hideVenereMaisCourtois);


    document.getElementById('expertiseButtonContainer').addEventListener('click', showExpertiseText);
    document.getElementById('aboutButtonContainer').addEventListener('click', hideExpertiseText);

    // #touchEvents #touch #touchstart
    document.getElementById('expertiseButtonContainer').addEventListener('touchstart', showExpertiseText);
    document.getElementById('aboutButtonContainer').addEventListener('touchstart', hideExpertiseText);


    // Sames as the two above but makes sure that the page transition is attached to the second button that is displayed
    // when the page width is smaller.
    document.getElementById('expertise--button--small--screen--text').addEventListener('click', showExpertiseText);

    // #touchEvents #touch #touchstart
    document.getElementById('expertise--button--small--screen--text').addEventListener('touchstart', showExpertiseText);

    // Language Related

    document.getElementById('languageOne').addEventListener('mouseenter', userHoverOverFrench);
    document.getElementById('languageOne').addEventListener('mouseleave', userNotHoverOverFrench);


}

 
initializeEventListeners();


// ------------------------------------------------------

/*
*
* Area where we will focus on switching the icons back and forth between the different pages of the website
*
*/

const changeMenuIcon = (nextPage) => {

    if (nextPage === 'menuPage') {

        currentMenuIcon = 'xIcon'

        // console.log('Moving towards the main menu page, so we change the top right icon into an X');

        setTimeout(() => {
            document.getElementById('closeButton').classList.add('shown');
            document.getElementById('hamburger').classList.add('hidden');
        }, 1800);

    } else if (nextPage !== 'menuPage') {

        currentMenuIcon = 'menuIcon';

        // console.log('Leaving the Main Menu page therefore we change the Icon at the top to an X');

        // Might need to create a timer here that will take care of changing the stroke 
        // of the svg to white momentarily while the actual page transition is being triggered
        // Best scenario is to create an actual animation that will be switching the menu into 
        // an X but I don't want to focus on that detail right now
        // #future #futureWork #futureDetails

        setTimeout(() => {
            document.getElementById('closeButton').classList.remove('shown');
            document.getElementById('hamburger').classList.remove('hidden');
        }, 1900);

    }

}

// ------------------------------------------------------

let animate = function () {
    requestAnimationFrame( animate );

    // Can be used later in order to increase the velocity of the mesh
    // depending on the actual tempo or BPM of the music that's going to be played

    // particles.forEach(p => {
    //     p.velocity.add(p.acceleration)
    //     p.position.add(p.velocity)
    //  })

    // Rotate the Mesh of Particles
    // particlesMesh.rotation.z += 0.005;

    if (ANIMATION_STARTED === false) {
        particlesMesh.position.z -= 0.1;
    }

    // animateParticles();

    // console.log('Particles Mesh Z', particlesMesh.position.z);

    // Hack but will do for now

    // particlesMesh.position.x += Math.sin(particlesMesh.position.z) * 0.05;
    // particlesMesh.position.y += Math.sin(particlesMesh.position.x) * 0.05;
    // particlesMesh.geometry.verticesNeedUpdate = true

    // Makes the SpotLight rotate
    let axis = new THREE.Vector3(0,0,1);
    let rad = 0.01
    // spotLight.rotateOnAxis(axis, rad);

    // let spotLightX = spotLight.position.x;
    // let spotLightY = spotLight.position.y
    // let spotLightZ = spotLight.position.z;
    // console.log('Spotlight X', spotLightX)
    // // Two breaking points for it to decrease
    // // First decrease happens if x is 0, if x is negative but higher than -220, and if x is higher than 220
    // // Increase happens when x is lower than 220 and x is lower than 220 (positive)
    // if (spotLightX === -220 ) {
    //     spotLight.position.y -= 1;
    // } else if (spotLightX == 0 || spotLightX < 0 ) {
    //     spotLight.position.x -= 1;
    // } else if (spotLightY == -220) {
    //     spotLight.position.x += 1
    // } else if (spotLightX == 220 ) {
    //     spotLight.position.y += 1;
    // }

    
    // spotLight.position.x = 0
    // spotLight.position.y = Math.cos( time * 0.5 ) * 10;
    // spotLight.position.z = Math.cos( time * 0.3 ) * 10;

    spotLight.position.x = 0
    spotLight.position.y = 200
    spotLight.position.z = 0
    spotLight.angle = Math.PI / 2;

    // Move the particles with the shader

    let delta = clock.getDelta(),
        elapsedTime = clock.getElapsedTime(),
        t = elapsedTime * 0.5;

    // console.log('Elapsed time', elapsedTime)

    // particlesMesh.material.uniforms.elapsedTime.value = elapsedTime * 10;

    // spotLight.target.position.set(0, 100, 0);
    // // scene.add(spotLight.target);
    // console.log('Spotlight position', spotLight.position.x);
    let time = Date.now() * 0.0005;

    // light1.position.x = Math.sin( time * 0.7 ) * 100;
    // light1.position.y = Math.cos( time * 0.5 ) * 100;
    // light1.position.z = Math.cos( time * 0.3 ) * 100;

    // light1.rotation.y += 0.5;
    // pivotPoint2.rotation.y += 0.5;

    // Comment this out in order to remove the light hovering above the Scarab in a Sin fashion

    // if (musicPlaying === true)  {

        spotLight.position.x = Math.sin( time * 0.7 ) * 80;
        // pivotPoint2.position.y = Math.sin( time  ) * 30; 
        spotLight.position.z = Math.sin( time  ) * 80;

    // }

    // Experimental - allows the light to move depending on the position of the mouse within
    // the screen itself

    // pivotPoint2.position.x += Math.sin(time * 0.7) * mouseX;
    // pivotPoint2.position.y += Math.sin(time * 0.1) * mouseY;
    // pivotPoint2.position.z += Math.sin(time * 0.2) * mouseX;

    // console.log('Mouse X', mouseX)
    // console.log('Pivot point position x', pivotPoint2.position.x);
    // console.log('Pivot point position y', pivotPoint2.position.y);
    // console.log('Pivot point position z', pivotPoint2.position.z);


    // Web Audio Analyser - Get the new frequency data
    if (frequencyData !== undefined) {
        analyser.getByteFrequencyData(frequencyData);
        analyser.getByteTimeDomainData(domainData);
        // console.log('Frequency data for song', frequencyData);
        // console.log('Domain data for song', domainData);
        averageFrequency = average(frequencyData);
        averageDomain = average(domainData);
        // console.log('Average frequency', averageFrequency);
        
        // console.log('Average Frequency', averageFrequency);
        // console.log('Light intensity divider', lightIntensityDivider);
        // console.log('Computed Intensity ', averageFrequency / lightIntensityDivider);
        // console.log('Is music playing', musicPlaying)
    }

    // If there is an average frequency, then it must not be equal to 0, therefore we make sure that the intensity of the actual spotlight is related
    // to the average frequency of the music that is playi
    // #music #toBeFinished
    if (musicPlaying === true) {
        spotLight.intensity = averageFrequency === 0 ? 3 : averageFrequency / lightIntensityDivider;
    } else if (musicPlaying === false) {
        // If the beetle color is white then we decrease the spotlight intensity because the specular reflection is too high
        spotLight.intensity = beetleColor === 'white' ? 2 : 3;
    }

    // console.log('Spotlight Intensity', spotLight.intensity);
    // console.log('Music Playing', musicPlaying)
    // console.log('Beetle Color', beetleColor);

    // spotLightTwo.intensity = averageFrequency === 0 ? 2 : averageFrequency / 20;
    // spotLightThree.intensity = averageFrequency === 0 ? 2 : averageFrequency / 20;

    // console.log('Spotlihgt intensity IS ', spotLight.intensity);

    // Experimenting with these two different ways of dealing with the animations 

    // We combine the two so that when the mesh goes too far out of range it comes back to the very beginning
    // If the general position of the mesh particles goes too far away from the general frame / frustum of the camera
    // then we re-assign it to it's earlier position
    // Important: The mesh of particles (particlesMesh) is re-assigned it's original position whenever the frequency of the
    // music goes above a certain maximum. This ensures that as long as the music is playing, the particles will always be
    // within view
    // This, on the other hand, ensures that when no music is playing (and therefore the particlesMesh is never reset), the mesh
    // is reset when they go too far out of view.
    // Long explanation but this is my project and more details is better than not enough, bitch.
    if (particlesMesh.position.z < -120) {
        particlesMesh.position.z = 160;
    }

    // Second one here --> Particles get re-assigned when the domain reaches a different level
    // if (averageDomain > 160 ) {
    //     particlesMesh.position.z += 5;
    // }

    // Cloud Animation
    // animateCloud();
    // animateLightning();

    // Updates Lines
    // #lines
    // updateLines();

    // Window Width & Height tracker in order to remove the beetle when the window is too small
    // console.log('Dynamic window height', dynamicWindowHeight);
    // console.log('Dynamic window width', dynamicWindowWidth);

    // If the window width is too small, either on desktop or on mobile device, we have to make sure to remove the beetle object
    // in order to make the text more legible throughout the website
    
    if (dynamicWindowWidth <= 1000 ) {

        // We remove the Blue Marble Beetle displayed on the Contact page earlier than the other beetles because there is more
        // content
        if (blueMarbleBeetleObject !== undefined)  {
            // console.log('BLUE MARBLE BEETLE OBJECT IS NOT UNDEFINED');
            blueMarbleBeetleObject.visible = false;
        };

    } 
    
    if (dynamicWindowWidth <= 850 ) {

        // Gets rid of the Beetle in the Main Menu page
        if (whiteMarbleBeetleObject !== undefined) {
            whiteMarbleBeetleObject.visible = false;
        };

    }  
    
    if (dynamicWindowWidth <= 501 || dynamicWindowHeight <= 700) {

        // initiateTransitionAnimation();

        if (blackMarbleBeetleObject !== undefined) {
            blackMarbleBeetleObject.visible = false;
        };

        // if (blueMarbleBeetleObject !== undefined) {
        //     blueMarbleBeetleObject.visible = false;
        // };


        if (greyMarbleBeetleObject !== undefined) {
            greyMarbleBeetleObject.visible = false;
        };

        if (redPinkMarbleBeetleObject !== undefined) {
            redPinkMarbleBeetleObject.visible = false;
        };

    } 
    
    if (dynamicWindowWidth > 501 && dynamicWindowHeight > 700) {
        
        // The whole reason that we kept re-assigning the currentBeetleObject variable to the different beetleObjects that populate the scene in @changMeshVisibility
        // and @createBlackMarbleBeetle is so that when the window increases back in size, we automatically show the beetle with the correct texture

        // The second condition here, which ensures that the pageShown is not the 'aboutPage', makes it that the beetle is never shown if the user is on the aboutPage
        // console.log('Current Beetle Color is', beetleColor);

        if (currentBeetleObject !== undefined && pageShown !== 'aboutPage' && pageShown !== 'legalPage' && pageShown !== 'menuPage') {

            // initiateTransitionAnimation();
            if (beetleColor === 'black' || beetleColor === 'white' || beetleColor === 'grey') {
                currentBeetleObject.visible = true;
            }
        }
    } 

    if (dynamicWindowWidth >= 850 && dynamicWindowHeight > 700) {

        if (currentBeetleObject !== undefined && pageShown === 'menuPage') {

            if (beetleColor === 'white') {
                whiteMarbleBeetleObject.visible = true;
            }
        }

    }

    if (dynamicWindowWidth >= 1000 && dynamicWindowHeight > 700) {
        
        // The whole reason that we kept re-assigning the currentBeetleObject variable to the different beetleObjects that populate the scene in @changMeshVisibility
        // and @createBlackMarbleBeetle is so that when the window increases back in size, we automatically show the beetle with the correct texture

        // The second condition here, which ensures that the pageShown is not the 'aboutPage', makes it that the beetle is never shown if the user is on the aboutPage
        // console.log('Current Beetle Color is', beetleColor);

        if (currentBeetleObject !== undefined && pageShown !== 'aboutPage' && pageShown !== 'legalPage') {

            // initiateTransitionAnimation();
            if (beetleColor === 'lightBlue' ) {
                currentBeetleObject.visible = true;
            }
        }
    }

    // Make sure to update cursor
    updateCursor();

    // Update the light angle when the music is off 

    if (musicPlaying === false) {
        // console.log('Music is not playing anymore');

        // This part here moves the SpotLight around when the music stops
        // Commenting it out because the effect doesn't look that good
        // Might replace it through a click effect accompanied with a flash effect when the music
        // is stopped

        // pivotPoint2.position.x += (mouseX - pivotPoint2.position.x ) * 0.4;
        // pivotPoint2.position.z += ( - mouseY - pivotPoint2.position.z ) * 0.4;

        // let intensity = spotLight.intensity;
        // console.log('Intensity', spotLight.intensity);

        // if (spotLight.intensity < 4) {
        //     console.log('Intensity increasing')
        //     spotLight.intensity += 0.01;
        // } else if (spotLight.intensity > 4) {
        //     console.log('Intensity is decreasing');
        //     spotLight.intensity -= 0.01;
        // }

        // End of the part that animates the SpotLight

        // This part will animate the particles

    }

    if (ANIMATION_STARTED === true) {
        particlesMesh.position.z += (mouseY + particlesMesh.position.y) * 0.1;
    }

    // About Page - Related Effect

    // For now, the plane will only slightly rotate from left to right
    if (pageShown === 'aboutPage') {
        blackRockPlaneMesh.rotation.y = mouseX / 100; // Previously 120 & 160

        // if (mouseY > 1 || mouseY < -1) {
        //     console.log('Mouse Y divided is', mouseY / 2000)
        //     blackRockPlaneMesh.rotation.x = (mouseY / 2000);
        // }

    }
    // Test
    // console.log('Current page shown is', pageShown);
    // console.log('Mouse X', mouseX, ' and Mouse Y', mouseY);

    // Update Controls
    // Commented out since we're not using #controls anymore

    controls.update();
    


    // Update stats
    if (environment === 'dev') {
        stats.update();
    }
    
    renderer.clear();
    renderer.render(scene, camera);
    // composer.render(); 

};

animate();