// Circle spinner from: https://medium.com/swlh/create-a-three-js-object-wheel-638f04439bc4

import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';

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

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ TIDE  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
let  conf = {
    fov: 75,
    cameraZ: 1000,
    xyCoef: 50,
    zCoef: 20,
    lightIntensity: 0.9,
    ambientColor: 0x000000,
    light1Color: 0x0E09DC,
    light2Color: 0x1CD1E1,
    light3Color: 0x18C02C,
    light4Color: 0xee3bcf,
};

function Tide(scene){
    let mat = new THREE.MeshLambertMaterial({ color: 0xffffff, side: THREE.DoubleSide });

    const wsize = getRendererSize();
    const wWidth = wsize[0];
    const wHeight = wsize[1];
    let geo = new THREE.PlaneBufferGeometry(wWidth, wHeight, wWidth / 2, wHeight / 2);

    let plane = new THREE.Mesh(geo, mat);

    plane.rotation.x = -Math.PI / 2 - .2;
    plane.position.y = -180;
    plane.position.z =300;

    scene.add(plane);

    const simplex = new SimplexNoise();
    const lightDistance = 500;
    const y = 100;
    //TODO: check lights  colors and positions
    let light1, light2, light3, light4;

    //Blue
    light1 = new THREE.PointLight(conf.light1Color, conf.lightIntensity, lightDistance);
    light1.position.set(0, 50, 900);
    scene.add(light1);

    //Cyan
    light2 = new THREE.PointLight(conf.light2Color, conf.lightIntensity, lightDistance);
    light2.position.set(10, -70, 800);
    scene.add(light2);

    //Green
    light3 = new THREE.PointLight(conf.light3Color, conf.lightIntensity, lightDistance);
    light3.position.set(30, 50, 700);
    scene.add(light3);

    //Magenta
    light4 = new THREE.PointLight(conf.light4Color, conf.lightIntensity, lightDistance);
    light4.position.set(-10, 50, 800);
    scene.add(light4);

    this.update= function(){
        let gArray = plane.geometry.attributes.position.array;
        let time = Date.now() * 0.0002;
        for (let i = 0; i < gArray.length; i += 3) {
                gArray[i + 2] = simplex.noise4D(gArray[i] / conf.xyCoef, gArray[i + 1] / conf.xyCoef, time, 1.) * conf.zCoef;
            }

        plane.geometry.attributes.position.needsUpdate = true;
        /* TODO: check if we dynamic lights
        time = Date.now() * 0.001;
        light1.position.x = Math.sin(time * 0.1) * 100;
        light1.position.z = 900 + Math.cos(time * 0.2) * 100;
        light2.position.x = Math.cos(time * 0.3) * 100;
        light2.position.z = 800 +Math.sin(time * 0.4) * 150;
        light3.position.x = Math.sin(time * 0.5) * 100;
        light3.position.z = 700+ Math.sin(time * 0.6) * 50;
        light4.position.x = Math.sin(time * 0.7) * 100;
        light4.position.z = 800 +Math.cos(time * 0.8) * 250;
        */
        }
}

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ BACKGROUND ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

function Background(scene){
    let  backgroundConf = {
        fov: 75,
        cameraZ: 1000,
        xyCoef: 300,
        zCoef: 50,
        lightIntensity: 0.9,
        emissive: 0x31404,
        light1Color: 0x844340
    };
    //Blue
    let light5 = new THREE.PointLight(backgroundConf.light1Color, backgroundConf.lightIntensity, 1000);
    light5.position.set(10, 100, -400);
    scene.add(light5);

    let mat = new THREE.MeshLambertMaterial({ color: 0xfffffff, side: THREE.DoubleSide, emissive: backgroundConf.emissive});

    const wsize = getRendererSize();
    const wWidth = wsize[0];
    const wHeight = wsize[1];
    let geo = new THREE.PlaneBufferGeometry(wWidth, wHeight, wWidth / 2, wHeight / 2);

    let plane = new THREE.Mesh(geo, mat);

    plane.rotation.x = -Math.PI / 2.9 -0.1;
    plane.position.y = -320;
    plane.position.z = -20;

    scene.add(plane);

    const simplex = new SimplexNoise();
    const lightDistance = 500;
    const y = 100;



    let gArray = plane.geometry.attributes.position.array;

    for (let i = 0; i < gArray.length; i += 3) {
        gArray[i + 2] = simplex.noise3D(gArray[i] / backgroundConf.xyCoef *2, gArray[i + 1] / backgroundConf.xyCoef,0.001) * backgroundConf.zCoef;
    }



    this.update= function(){
      //TODO: Update light with Moon phase
     }
}
// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ TRIANGLE ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
function Triangle(parent,scene){
    const geometry = new THREE.Geometry();
    let scale= 1.15;
    geometry.vertices.push(
	    new THREE.Vector3( 0,  parent.clientHeight*scale, 0 ) ,
	    new THREE.Vector3( -parent.clientWidth*scale, -parent.clientHeight*scale, 0 ),
	    new THREE.Vector3( parent.clientWidth*scale, -parent.clientHeight*scale, 0)
    );

    geometry.faces.push( new THREE.Face3( 0, 1, 2 ) );

    geometry.computeBoundingSphere();
    var mesh= new THREE.Mesh( geometry, new THREE.MeshBasicMaterial() );

    scene.add(mesh);
}

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INIT SCENE,CAMERA AND RENDERER  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

const parent = document.querySelector('#threejsDiv');
let width = parent.clientWidth;
let height = parent.clientWidth * .66;

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
const triangle = new Triangle(parent, scene);
const background = new Background(scene);
const tide = new Tide(scene);
const groupMoons = new GroupMoons(parent,scene);


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ LISTEN ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

// ******** animation loop *******
const render = function() {
    requestAnimationFrame(render);
    background.update();
    tide.update();
    groupMoons.update();


    renderer.render(scene, camera);
};


// for resizing canvas when window is resized
const resizeRenderer = function() {
  // Get width & height of parentDiv
    console.log(`window resized: to ${width}px`);

    groupMoons.setRadius(width);

    renderer.setSize(width, height);
}


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ UTILS ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
function getRendererSize() {
    const cam = new THREE.PerspectiveCamera(camera.fov, camera.aspect);
    const vFOV = cam.fov * Math.PI / 180;
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(conf.cameraZ);
    const width = height * cam.aspect;
    return [width, height];
}



// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ START ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

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


//Add controls for debugging
//const controls = new OrbitControls( camera, renderer.domElement );
