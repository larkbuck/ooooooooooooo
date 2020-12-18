import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import { Door }  from '/threeDoorDiv/Door.js';
import { Water }  from '/threeDoorDiv/Water.js';

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ DEFINE SCENE HELPERS ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INIT SCENE,CAMERA,RENDERER AND DOMEVENTS  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

const parent = document.querySelector('#threejsDivBottom');
let width = parent.clientWidth;
let height = parent.clientWidth * .66;

const scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(90, 1 / .66, 0.1, 2000);
camera.position.set(0, -250, 0);
//camera.rotation.y = Math.PI/3.

const renderer = new THREE.WebGLRenderer({
  parent,
  alpha: true,
  antialias: true
});
// renderer.setSize(parent.clientWidth, parent.clientHeight);
renderer.setSize(parent.clientWidth, parent.clientWidth * .66); // set to be movie-screen ratio 1.33
parent.append(renderer.domElement);


const domEvents = new THREEx.DomEvents(camera, renderer.domElement);

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INIT SCENE OBJECTS ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
const door = new Door(scene,domEvents)
const water = new Water(scene,domEvents)
// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ EVENTS ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤



// ******** animation loop *******
const render = function() {
  requestAnimationFrame(render);
    door.update()
    camera.lookAt(0.,0.,0.);
    water.update()
    renderer.render(scene, camera);
};

// for resizing canvas when window is resized
const resizeRenderer = function() {
  // Get width & height of parentDiv
  console.log(`window resized: to ${width}px`);

  renderer.setSize(width, height);
}

// Add window resize listener
window.addEventListener('resize', resizeRenderer);

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ START ANIMATION ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
scene.clock = new THREE.Clock();

// Force renderer resizing once
resizeRenderer();
render();


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Add controls for debugging
const controls = new OrbitControls(camera, renderer.domElement);
