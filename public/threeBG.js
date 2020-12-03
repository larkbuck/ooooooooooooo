import * as THREE from '/build/three.module.js';


function init() {
  let scene = new THREE.Scene();

  let box = getBox(1, 1, 1);
  let plane = getPlane(5);

  box.position.y = box.geometry.parameters.height/2; // get height of box through geometry!
  plane.rotation.x = Math.PI / 2;

  scene.add(box);
  scene.add(plane);



  let camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 10;

  camera.lookAt(new THREE.Vector3(0, 0, 0));


  let renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.querySelector('#bgCanvas').appendChild(renderer.domElement);
  renderer.render(
    scene,
    camera
  );
  update(renderer,scene, camera);
  return scene;

}

function getBox(w, h, d) {
  let geometry = new THREE.BoxGeometry(w, h, d);
  let material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    // wireframe: true
  });
  let mesh = new THREE.Mesh(
    geometry,
    material
  );

  return mesh;
};

function getPlane(size) {
  let geometry = new THREE.PlaneGeometry(size, size);
  let material = new THREE.MeshBasicMaterial({
    color: 0xffff00,
    side: THREE.DoubleSide, // will make sure you can see either side
    // wireframe: true
  });
  let mesh = new THREE.Mesh(
    geometry,
    material
  );

  return mesh;
};

function update(renderer, scene, camera){
  renderer.render(
    scene,
    camera
  );
  requestAnimationFrame(function(){
    update(renderer, scene, camera);
  })
}

// init returns scene, so you can save scene object in variable when calling init
// init();
let threeScene = init();
console.log(threeScene)
