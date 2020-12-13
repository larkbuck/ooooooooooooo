// Circle spinner from: https://medium.com/swlh/create-a-three-js-object-wheel-638f04439bc4

import * as THREE from '/build/three.module.js';
// const TWEEN = require('@tweenjs/tween.js') >> installed TWEEN thru NPM but not recognizing "require" - prob need to import. For now, linking to TWEEN in index.html


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ MOONS  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
function GroupMoons(parent,scene){

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Initialization
    let imageRadius = parent.clientWidth * .08;
    const numberImages = 29;
    const radianInterval = (2.0 * Math.PI) / numberImages;
    const centerWheel = {
        x: 0,
        y: -900
    }

    const group = new THREE.Group();
    group.position.set(centerWheel.x, centerWheel.y)
    let loader = null;
    let texture = null;
    let material = null;
    let circle = null;
    let mesh = null;
    let radius = 1500; // reset to parent.clientWidth in resize function



    for (let i = 0; i < numberImages; i++) {
        // Create a texture loader so we can load our image file
        loader = new THREE.TextureLoader();
        texture = loader.load('/assets-main/images/moon.jpg');
        texture.minFilter = THREE.LinearFilter;


        // Load an image file into a custom material
        material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1
        });

        circle = new THREE.CircleGeometry(imageRadius, 100);
        mesh = new THREE.Mesh(circle, material);

        mesh.material.side = THREE.DoubleSide;

        mesh.position.set(
            (Math.cos(radianInterval * i) * radius),
            (Math.sin(radianInterval * i) * radius),
            // (Math.sin(radianInterval * i) * radius) * .4, // Sol: I tried to make oval but then it did a CRAZY spin
            0);

        // add the image to the group
        group.add(mesh);
    }

    scene.add(group);

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Event Listeners

    // ***** snap back functionality ****
    let wheelTheta = 0.0; // keep track of where we’ve spun the wheel
    let spinInProgress = false; // keep track of when the wheel is spinning
    let snapInProgress = false; // keep track of when the wheel is automatically spinning to the snapping point
    const snapPoint = { // used to calculate properties of our snapping point
        x: 0,
        y: 0,
        theta: 0.0
    }


    // ******* circle-spin event - just a mouse click here ******

    window.addEventListener('click', () => {

        // groupMoons.rotation.z += radianInterval;
        // ^ basically just doing this but using Tween to animate:

        new TWEEN.Tween(group.rotation)
            .to({
                z: group.rotation.z + radianInterval
            }, 600)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();

        for (let i = 0; i < group.children.length; i++) {
            // group.children[i].rotation.z += radianInterval;
            // ^ animating with Tween
            new TWEEN.Tween(group.children[i].rotation)
                .to({
                    z: group.children[i].rotation.z + radianInterval
                }, 600)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
        }
    });

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Methods

    this.update = function(){
        TWEEN.update();
    }


    this.setRadius = function(width){
        radius=width;
        imageRadius = width * 0.08;
    }


}

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INIT SCENE,CAMERA AND RENDERER  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
const parent = document.querySelector('#threejsDiv');
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xFFBEE8);

let camera = new THREE.PerspectiveCamera(75, 1 / .66, 0.1, 1000);
camera.position.z = 1000;

const renderer = new THREE.WebGLRenderer({
    parent,
    alpha: true,
    antialias: true
});
// renderer.setSize(parent.clientWidth, parent.clientHeight);
renderer.setSize(parent.clientWidth, parent.clientWidth * .66); // set to be movie-screen ratio 1.33
parent.append(renderer.domElement);


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INIT SCENE OBJECTS ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
const groupMoons = new GroupMoons(parent,scene);

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ LISTEN ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

// ******** animation loop *******
const render = function() {
    requestAnimationFrame(render);
    groupMoons.update();
    renderer.render(scene, camera);
};


// for resizing canvas when window is resized
const resizeRenderer = function() {
  // Get width & height of parentDiv
    let width = parent.clientWidth;
    let height = parent.clientWidth * .66;

    console.log(`window resized: to ${width}px`);

    groupMoons.setRadius(width);

    renderer.setSize(width, height);
}

// Add window resize listener
window.addEventListener('resize', resizeRenderer);

// Force renderer resizing once
resizeRenderer();

render();



// // ______________ Box demo code start
// var geometry = new THREE.BoxGeometry(1, 1, 1);
// var material = new THREE.MeshBasicMaterial({
//   color: 0x00ff00,
//   wireframe: true
// });
// var cube = new THREE.Mesh(geometry, material);
// scene.add(cube);
//
// cam.position.z = 5;
//
// var render = function() {
//   requestAnimationFrame(render);
//
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
//   console.log(radius)
//
//
//   renderer.render(scene, cam);
// };
// // ______________ Box demo code end
