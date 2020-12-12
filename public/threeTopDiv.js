// Circle spinner from: https://medium.com/swlh/create-a-three-js-object-wheel-638f04439bc4

import * as THREE from '/build/three.module.js';


const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xFFBEE8);
const parent = document.querySelector('#threejsDiv');


let imageRadius = 66;
const numberImages = 29;
let radius = 1500; // reset to parent.clientWidth in resize function
const radianInterval = (2.0 * Math.PI) / numberImages;
const centerWheel = {
  x: 0,
  y: -900
}

const groupMoons = new THREE.Group();
groupMoons.position.set(centerWheel.x, centerWheel.y)
let loader = null;
let texture = null;
let material = null;
let circle = null;
let mesh = null;


for (let i = 0; i < numberImages; i++) {
  // Create a texture loader so we can load our image file
  loader = new THREE.TextureLoader();
  texture = loader.load('/assets-main/moon.jpg');
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
  groupMoons.add(mesh);
}

// add group to scene
scene.add(groupMoons);


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ CAMERA ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

// let camera = new THREE.PerspectiveCamera(75, 1 / 1.66, 0.1, 1000); // if super tall
// let camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000); // if square
let camera = new THREE.PerspectiveCamera(75, 1 / .66, 0.1, 1000);
camera.position.z = 1000;


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ RENDER & LISTEN ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

const renderer = new THREE.WebGLRenderer({
  parent,
  alpha: true,
  antialias: true
});

// renderer.setSize(parent.clientWidth, parent.clientHeight);
renderer.setSize(parent.clientWidth, parent.clientWidth * .66);
// renderer.setSize(parent.clientWidth, parent.clientWidth * 1.66);

parent.append(renderer.domElement);


// ***** snap back functionality ****
let wheelTheta = 0.0; // keep track of where we’ve spun the wheel
let spinInProgress = false; // keep track of when the wheel is spinning
let snapInProgress = false; // keep track of when the wheel is automatically spinning to the snapping point
const snapPoint = { // used to calculate properties of our snapping point
  x: 0,
  y: 0,
  theta: 0.0
}


function snapBack(){
  console.log('snap')
}

let scroll_speed = 0.0;
window.addEventListener('wheel', event => {
  if (!snapInProgress) {
    clearTimeout(spinInProgress);
    scroll_speed = event.deltaY * (Math.PI / 180) * 0.2;
    groupMoons.rotation.z += -1.0 * scroll_speed;
    for (let i = 0; i < groupMoons.children.length; i++) {
      groupMoons.children[i].scale.set(1, 1, 1);
      groupMoons.children[i].rotation.z +=
        scroll_speed;
    }
    spinInProgress = setTimeout(() => {
      snapBack();
    }, 100);
  } else {
    return;
  }
});


// ******* circle-spin event - from original ******
// let scroll_speed = 0.0;
// window.addEventListener('wheel', event => {
//   scroll_speed = event.deltaY * (Math.PI / 180) * 0.2;
//   groupMoons.rotation.z += -1.0 * scroll_speed;
//   for (let i = 0; i < groupMoons.children.length; i++) {
//     groupMoons.children[i].rotation.z += scroll_speed;
//   }
// });



// ******** animation loop *******
const render = function() {
  requestAnimationFrame(render);

  renderer.render(scene, camera);
};


// for resizing canvas when window is resized
const resizeRenderer = function() {
  // Get width & height of parentDiv
  let width = parent.clientWidth;
  let height = parent.clientWidth * .66;
  // let height = parent.clientWidth * 1.66;

  renderer.setSize(width, height);

  radius = width;
  console.log(width);
  imageRadius = width * 0.1;
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
