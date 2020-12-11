// Circle spinner from: https://medium.com/swlh/create-a-three-js-object-wheel-638f04439bc4

import * as THREE from '/build/three.module.js';



const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xFFBEE8);

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

camera.position.z = 1000;

const parent = document.querySelector('#threejsDiv');

let image_radius = 20;
const number_of_images = 8;
let radius = 200; // reset to parent.clientWidth in resize function
const radian_interval = (2.0 * Math.PI) / number_of_images;
const center_of_wheel = {
  x: 0,
  y: 0
}

// const renderer = new THREE.WebGLRenderer();
let renderer = new THREE.WebGLRenderer({
  parent,
  alpha: true,
  antialias: true
});

// document.body.appendChild(renderer.domElement);

// Append the output of the renderer to the html element
// Save reference of the parentDiv to be used later
// Save reference of the parentDiv to be used later


// renderer.setSize(parent.clientWidth, parent.clientHeight);
renderer.setSize(parent.clientWidth, parent.clientWidth * .66);

parent.append(renderer.domElement);
// circle tut uses this syntax:
// Add the canvas to the DOM
//document.querySelector('body').appendChild(renderer.domElement);


const group_cards = new THREE.Group();
let loader = null;
let texture = null;
let material = null;
let circle = null;
let mesh = null;

for (let i = 0; i < number_of_images; i++) {
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

  circle = new THREE.CircleGeometry(image_radius, 100);
  mesh = new THREE.Mesh(circle, material);

  mesh.material.side = THREE.DoubleSide;

  mesh.position.set(
    center_of_wheel.x + (Math.cos(radian_interval * i) * radius),
    center_of_wheel.y + (Math.sin(radian_interval * i) * radius),
    0);

  // add the image to the group
  group_cards.add(mesh);
}

// add group to scene
scene.add(group_cards);

// cam.position.z = 5;

let scroll_speed = 0.0;
window.addEventListener('wheel', event => {
  scroll_speed = event.deltaY * (Math.PI / 180) * 0.2;
  group_cards.rotation.z += -1.0 * scroll_speed;
  for (let i = 0; i < group_cards.children.length; i++) {
    group_cards.children[i].rotation.z += scroll_speed;
  }
});

// requestAnimationFrame(animate);
//
// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }


var render = function() {
  requestAnimationFrame(render);

  renderer.render(scene, camera);
};


// for resizing canvas when window is resized
var resizeRenderer = function() {
  // Get width & height of parentDiv
  var width = parent.clientWidth;
  var height = parent.clientWidth * .66;
  renderer.setSize(width, height);

  radius = parent.clientWidth * 0.5;
  image_radius = parent.clientWidth * 0.05;
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
