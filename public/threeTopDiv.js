// Circle spinner from: https://medium.com/swlh/create-a-three-js-object-wheel-638f04439bc4

import * as THREE from '/build/three.module.js';
import {
  OrbitControls
} from '/jsm/controls/OrbitControls.js';

// const TWEEN = require('@tweenjs/tween.js') >> installed TWEEN thru NPM but not recognizing "require" - prob need to import. For now, linking to TWEEN in index.html

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ MOONS  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
function GroupMoons(parent, scene) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Initialization
  let imageRadius = parent.clientWidth * .08;
  const numberImages = 29;
  const radianInterval = (2.0 * Math.PI) / numberImages;

  const centerWheel = {
    x: -imageRadius, //temporal fix for display moon in center of triangle
    y: -900 - imageRadius
  }

  const group = new THREE.Group();
  group.position.set(centerWheel.x, centerWheel.y)
  let loader = null;
  let texture = null;
  let material = null;
  let circle = null;
  let mesh = null;
  let radius = 1500; // reset to parent.clientWidth in resize function

    // Not loading the image 30 when it is initialize
    for (let i = 1; i < (numberImages+1); i++) {
        // Create a texture loader so we can load our image file
        loader = new THREE.TextureLoader();
        texture = loader.load('/assets-main/images/moon-128/'+i+'.png');
        texture.minFilter = THREE.LinearFilter;

        material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1,

        });

        circle = new THREE.CircleGeometry(imageRadius, 100);
        mesh = new THREE.Mesh(circle, material);

        mesh.position.set(
            (Math.cos(radianInterval * i) * (radius)),
            (Math.sin(-radianInterval * i) * (radius)),
            // (Math.sin(radianInterval * i) * radius) * .4, // Sol: I tried to make oval but then it did a CRAZY spin
            0);

        // add the image to the group
        group.add(mesh);
    }

    scene.add(group);

    this.setCenter= function(idx){
        let origin = 8;
        var bigStep = (origin + idx - 1) * radianInterval //Check if the -1 is always necsarry or if because the testing phase has 31 days
        new TWEEN.Tween(group.rotation)
            .to({
                z: group.rotation.z + bigStep
            }, 600)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();

        for (let i = 0; i < group.children.length; i++) {
            new TWEEN.Tween(group.children[i].rotation)
                .to({
                    z: group.children[i].rotation.z - bigStep
                }, 600)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
        }
    }

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
         z: group.children[i].rotation.z - radianInterval
        }, 600)
        .easing(TWEEN.Easing.Cubic.InOut)
        .start();
    }
  });

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Methods

  this.update = function() {
    TWEEN.update();
  }


  this.setRadius = function(width) {
    radius = width;
    imageRadius = width * 0.08;
  }


}

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ TIDE  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
let TideConf = {
  fov: 75,
  cameraZ: 1000,
  xyCoef: 50,
  zCoef: 20,
  lightIntensity: 0.9,
  light1Color: 0x0E09DC,
  light2Color: 0x1CD1E1,
  light3Color: 0x18C02C,
  light4Color: 0xee3bcf,
  velocity: 1
};

function Tide(scene) {
  let mat = new THREE.MeshLambertMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
  });

  const wsize = getRendererSize();
  const wWidth = wsize[0];
  const wHeight = wsize[1];
  let geo = new THREE.PlaneBufferGeometry(wWidth / 2, wHeight / 2, wWidth / 2, wHeight / 2);

  let plane = new THREE.Mesh(geo, mat);

  plane.rotation.x = -Math.PI / 2 - .2;
  plane.position.y = -180;
  plane.position.z = 600;

  scene.add(plane);

  const simplex = new SimplexNoise();
  const lightDistance = 500;
  const y = 100;
  //TODO: check lights  colors and positions
  let light1, light2, light3, light4;

  //Blue
  light1 = new THREE.PointLight(TideConf.light1Color, TideConf.lightIntensity, lightDistance);
  light1.position.set(0, 50, 900);
  scene.add(light1);

  //Cyan
  light2 = new THREE.PointLight(TideConf.light2Color, TideConf.lightIntensity, lightDistance);
  light2.position.set(10, -70, 800);
  scene.add(light2);

  //Green
  light3 = new THREE.PointLight(TideConf.light3Color, TideConf.lightIntensity, lightDistance);
  light3.position.set(30, 50, 700);
  scene.add(light3);

  //Magenta
  light4 = new THREE.PointLight(TideConf.light4Color, TideConf.lightIntensity, lightDistance);
  light4.position.set(-10, 50, 800);
  scene.add(light4);

  this.update = function() {
    let gArray = plane.geometry.attributes.position.array;
    let time = Date.now() * 0.0002 * TideConf.velocity; //CHECK: Scale constant factor for the `intensity`
    for (let i = 0; i < gArray.length; i += 3) {
      gArray[i + 2] = simplex.noise4D(gArray[i] / TideConf.xyCoef, gArray[i + 1] / TideConf.xyCoef, time, 1.) * TideConf.zCoef;
    }

    plane.geometry.attributes.position.needsUpdate = true;
  }

  let preconfig = {
    "H": {
      z: 25, //CHECK: Could be changing dynamically according to time
      xy: 50,
    },
    "L": {
      z: 10,
      xy: 100,
    },
  }

  this.setTide = function(currentTide) {
    TideConf.velocity = Math.abs(currentTide.velocity);
    TideConf.zCoef = preconfig[currentTide.type].z;
    TideConf.xyCoef = preconfig[currentTide.type].xy;

    this.update();
  }

  this.setLight = function(intensity) {
    light1.intensity = intensity;
    light2.intensity = intensity;
    light3.intensity = intensity;
    light4.intensity = intensity;
  }


}

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ BACKGROUND ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

function Background(scene) {
  let backgroundConf = {
    fov: 75,
    cameraZ: 1000,
    xyCoef: 1000,
    zCoef: 100,
    lightIntensity: 0.9,
    emissive: 0x270d0d,
    light1Color: 0xd7a682,
    light2Color: 0x9ad782,
    light3Color: 0x844340
  };

  let light1 = new THREE.PointLight(backgroundConf.light1Color, backgroundConf.lightIntensity, 1000);
  light1.position.set(1000, -100, 0);
  scene.add(light1);
  let light2 = new THREE.PointLight(backgroundConf.light2Color, backgroundConf.lightIntensity, 1000);
  light2.position.set(-1000, -100, 0);
  scene.add(light2);

  let mat = new THREE.MeshLambertMaterial({
    color: 0xab6733,
    side: THREE.DoubleSide,
    emissive: backgroundConf.emissive,
    combine: THREE.MixOperation,
    emissiveIntensity: 0.9
  });

  const wsize = getRendererSize();
  const wWidth = wsize[0];
  const wHeight = wsize[1];

  let geo = new THREE.PlaneBufferGeometry(wWidth * 1.8, wHeight / 3., wWidth / 2, wHeight / 2);
  let plane = new THREE.Mesh(geo, mat);
  plane.rotation.x = -Math.PI / 3.8;
  plane.position.y = -220;
  plane.position.z = -300;

  scene.add(plane);

  const simplex = new SimplexNoise();
  const lightDistance = 500;

  let gArray = plane.geometry.attributes.position.array;
  for (let i = 0; i < gArray.length; i += 3) {
    gArray[i + 2] = simplex.noise3D(gArray[i] / backgroundConf.xyCoef * 2, gArray[i + 1] / backgroundConf.xyCoef, 0.001) * backgroundConf.zCoef;
  }

  this.setLight = function(intensity) {
    light1.intensity = intensity;
    light2.intensity = intensity;
  }
}

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INFORMATION TRIANGLE ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
function Button(scene, x1, x2, y, invert = false) {
  const button = new THREE.Geometry();
  (invert ?
    button.vertices.push(
      new THREE.Vector3(x1, y - 50, 0),
      new THREE.Vector3(x1, y + 50, 0),
      new THREE.Vector3(x2, y, 0)

    ) :
    button.vertices.push(
      new THREE.Vector3(x1, y - 50, 0),
      new THREE.Vector3(x2, y, 0),
      new THREE.Vector3(x1, y + 50, 0),
    ))

  button.faces.push(new THREE.Face3(0, 1, 2));

  button.computeBoundingSphere();
  var meshButton = new THREE.Mesh(button, new THREE.MeshBasicMaterial({
    color: 0xaf0000,
    transparent: true
  }));
  meshButton.position.z = 0;
  scene.add(meshButton);

  const edges = new THREE.EdgesGeometry(button);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
    color: 0xff0000
  }));
  scene.add(line);

}


function Text(scene, y) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  this.generateText = function(text) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "Bold 40px Courier";
    context.fillStyle = "#FFFFFF";
    context.maxWidth = 300;
    context.fillText(text, 10, 90);
  }

  var texture = new THREE.Texture(canvas)

  var material = new THREE.MeshBasicMaterial({
    map: texture,
    side: THREE.DoubleSide
  });
  material.transparent = true;

  var mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(canvas.width, canvas.height),
    material
  );
  mesh.position.set(20, 300, 0);
  scene.add(mesh);

  this.update = function(newText) {
    this.generateText(newText);
    texture.needsUpdate = true;
  }

}

function Triangle(parent, scene) {
  const geometry = new THREE.Geometry();
  let scale = 1.15;
  geometry.vertices.push(
    new THREE.Vector3(0, parent.clientHeight * scale, 0),
    new THREE.Vector3(-parent.clientWidth * scale, -parent.clientHeight * scale, 0),
    new THREE.Vector3(parent.clientWidth * scale, -parent.clientHeight * scale, 0)
  );

  geometry.faces.push(new THREE.Face3(0, 1, 2));

  geometry.computeBoundingSphere();
  var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
    color: 0x000000,
    transparent: true
  }));
  mesh.position.z = 0;
  scene.add(mesh);

  const edges = new THREE.EdgesGeometry(geometry);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
    color: 0xff0000
  }));
  scene.add(line);

  //--------------------
  // Buttons
  const buttonR = new Button(scene, 200, 250, 300);
  const buttonL = new Button(scene, -200, -250, 300, true);
  const infoText = new Text(scene, 300);

  this.setDate = function(newText) {
    infoText.update(newText);
  }
}




// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INIT SCENE,CAMERA AND RENDERER  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

const parent = document.querySelector('#threejsDiv');
let width = parent.clientWidth;
let height = parent.clientWidth * .66;

const scene = new THREE.Scene();
// scene.background = new THREE.Color(0xFFBEE8);

let camera = new THREE.PerspectiveCamera(75, 1 / .66, 0.1, 2000);
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
const groupMoons = new GroupMoons(parent, scene);
const tidePredictor = new TidePredictor(tide);
const moonPhaseAdmin = new MoonPhaseAdmin(background, tide, triangle);

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ LISTEN ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
// ******** animation loop *******
const render = function() {
  requestAnimationFrame(render);

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

// Add window resize listener
window.addEventListener('resize', resizeRenderer);


window.addEventListener('click', () => {
  let currentMoon = moonPhaseAdmin.nextMoon();
  tidePredictor.updateCurrentTide(currentMoon.date);
});


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ START ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
// Utility functions for gettins files
async function getText(path, onSuccess) {
  fetch(path).then(function(response) {
      return response.text()
    })
    .then((text) => onSuccess(text))
    .catch(function(error) {
      console.log("Failed!", error);
    })
}

//Initialize current moon
const loadMoonPhase = (data) => moonPhaseAdmin.init(data);
getText('/data/moonPhases.JSON', loadMoonPhase)

//Initialize current tide
const loadTide = (data) => tidePredictor.init(data);
getText('/data/tides_hi-lo.JSON', loadTide)

// Force renderer resizing once
resizeRenderer();
render();


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Add controls for debugging
const controls = new OrbitControls(camera, renderer.domElement);

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ UTILS  & HELPERS ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
function getRendererSize() { //Used for plane size of tide and background
  const cam = new THREE.PerspectiveCamera(camera.fov, camera.aspect);
  const vFOV = cam.fov * Math.PI / 180;
  const height = 2 * Math.tan(vFOV / 2) * Math.abs(TideConf.cameraZ);
  const width = height * cam.aspect;
  return [width, height];
}


function TidePredictor(tide) {
  let predictions;
  let currentTide = {
    idx: 0,
    date: null,
    velocity: null,
    type: null
  };

  this.init = function(json) {
    predictions = JSON.parse(json).predictions;
    this.updateCurrentTide(null);

  }

  this.updateCurrentTide = function(date) {
    var idx = (date ? (
      predictions.findIndex(element => Date.parse(element.t) > Date.parse(date))
    ) : (
      predictions.findIndex(element => Date.parse(element.t) > Date.now())
    ));

    if (idx != 0) {
      currentTide.idx = (idx != -1 ? idx - 1 : predictions.length - 1);
    } else {
      currentTide.idx = idx;
    }

    currentTide.date = predictions[currentTide.idx].t;
    currentTide.velocity = predictions[currentTide.idx].v;
    currentTide.type = predictions[currentTide.idx].type;

    tide.setTide(currentTide);

  }

}


function MoonPhaseAdmin(background, tide, triangle) {
  let all_data; let current_phase_idx = null; let fullmoon_idx;

  let currentMoon = {
      idx: null,
      date: null,
      events: null,
      moonphase: null,
      img: null,
      moonAge: null,
  };

    const  getLightIntensity = function(){
        console.log(currentMoon)
      let res = (currentMoon.moonAge > 1 ?
                 1.-(currentMoon.moonAge - 1)  :
                 currentMoon.moonAge);
      return res;
  }

  this.init = function(json) {
      var obj = JSON.parse(json);
      //Store locally all data
      all_data = obj;

      const day = Date.now();
      //Look for current phase
      var idx = obj.findIndex(({data}) =>
                              (Date.parse(data[0]["newmoon 0"]["utctime"]) <= day &&
                               day <= Date.parse(data[1]["newmoon 30"]["utctime"])))
      console.log("fillmon",all_data[idx].data[2]["fullmoon"]["utctime"])
      current_phase_idx = idx; //Starts in 0

      //Get full moon index in array of days
      fullmoon_idx = all_data[idx].data[2]["fullmoon"].idx;

      //Look for current day
      idx = all_data[idx].data[3].days.findIndex(element => Date.parse(element.date) > day)
      this.updateMoon(idx);
      groupMoons.setCenter(idx);

      //console.log("Phase Idx: ", current_phase_idx)
      //console.log("Day idx:", idx)
  }

    this.updateMoon = function(idx) {
        var days = all_data[current_phase_idx].data[3].days;
        currentMoon.idx= idx;

        currentMoon.date = days[idx].date;
        currentMoon.events = days[idx].events;
        currentMoon.moonphase = days[idx].moonphase;
        currentMoon.img =days[idx].image;
        currentMoon.moonAge = idx/fullmoon_idx;

        let intensity = getLightIntensity();

        tide.setLight(intensity);
        background.setLight(intensity);
        triangle.setDate(currentMoon.date);

    }

    this.nextMoon = function() {

        var days = all_data[current_phase_idx].data[3].days;
        let newidx = (currentMoon.idx + 1) % days.length;

        currentMoon.idx = newidx;
        currentMoon.date = days[currentMoon.idx].date;
        currentMoon.events = days[currentMoon.idx].events;
        currentMoon.moonphase = days[currentMoon.idx].moonphase;
        currentMoon.moonAge = newidx/fullmoon_idx;
        let intensity = getLightIntensity();

        tide.setLight(intensity);
        background.setLight(intensity);
        triangle.setDate(currentMoon.date);

        return currentMoon;
    }
}
