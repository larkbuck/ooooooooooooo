import * as THREE from '/build/three.module.js';



var scene = new THREE.Scene();
var cam = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const parent = document.querySelector('#threejsDiv');

// const renderer = new THREE.WebGLRenderer();
const renderer = new THREE.WebGLRenderer({
  parent,
  alpha: true,
});

// document.body.appendChild(renderer.domElement);

// Append the output of the renderer to the html element
// Save reference of the parentDiv to be used later
// Save reference of the parentDiv to be used later


// renderer.setSize(parent.clientWidth, parent.clientHeight);
renderer.setSize(parent.clientWidth, parent.clientWidth * .66);

parent.append(renderer.domElement);



var geometry = new THREE.BoxGeometry(1, 1, 1);
var material = new THREE.MeshBasicMaterial({
  color: 0x00ff00,
  wireframe: true
});
var cube = new THREE.Mesh(geometry, material);
scene.add(cube);

cam.position.z = 5;

var render = function() {
  requestAnimationFrame(render);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, cam);
};

// for resizing canvas
// When window is resized
var resizeRenderer = function() {
  // Get width & height of parentDiv
  var width = parent.clientWidth;
  var height = parent.clientWidth * .66;
  renderer.setSize(width, height);
}

// Add window resize listener
window.addEventListener('resize', resizeRenderer);

// Force renderer resizing once
resizeRenderer();



render();
