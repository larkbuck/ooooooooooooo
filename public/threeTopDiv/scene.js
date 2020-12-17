import * as THREE from '/build/three.module.js';
import { OrbitControls } from '/jsm/controls/OrbitControls.js';
import { Triangle, Button, Text} from '/threeTopDiv/infoTriangle.js';
import { Tide } from '/threeTopDiv/Tide.js';
import { Background } from '/threeTopDiv/Background.js';
import { GroupMoons } from '/threeTopDiv/GroupMoons.js';
import { Sky } from '/threeTopDiv/Sky.js';

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ DEFINE SCENE HELPERS ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
function TidePredictor(tide) {
  let predictions;
  let currentTide = {
    idx: 0,
    date: null,
      h1: null,
      h2:null,
      l1: null,
      l2: null,
    type: null
  };

  this.init = function(json) {
    predictions = JSON.parse(json).predictions;
  }

    this.update = function(phaseDayIdx) {
        currentTide.idx = phaseDayIdx*4;

        currentTide.date = predictions[currentTide.idx].t;
        currentTide.h1 = predictions[currentTide.idx].v;
        currentTide.l1 = predictions[currentTide.idx + 1].v;
        currentTide.h2 = predictions[currentTide.idx + 2].v;
        currentTide.l2 = predictions[currentTide.idx + 3].v;
        currentTide.type = predictions[currentTide.idx].type;

        tide.setTide(currentTide);
    }

}


function MoonPhaseAdmin(background, tide, triangle,sky) {
  let all_data; let current_phase_idx = null; let fullmoon_idx;
    const tidePredictor = new TidePredictor(tide);
    //Initialize current tide
    const loadTide = (data) => tidePredictor.init(data);
    getText('/data/tides_hi-lo.JSON', loadTide)

  let currentMoon = {
      idx: null,
      date: null,
      events: null,
      moonphase: null,
      img: null,
      moonAge: null,
  };

    const  getLightIntensity = function(){

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
      tidePredictor.update(idx);
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
        sky.setLight(intensity);
    }

    this.nextMoon = function() {
        var days = all_data[current_phase_idx].data[3].days;
        let newidx = (currentMoon.idx + 1) % days.length;
        this.updateMoon(newidx); //TODO: fix bounding conditions
        tidePredictor.update(newidx);

        return currentMoon;
    }
    this.prevMoon = function() {
        var days = all_data[current_phase_idx].data[3].days
        var newidx = (currentMoon.idx - 1)
        newidx = (newidx < 0 ? days.length - 1 : newidx) //TODO: fix bounding conditions
        this.updateMoon(newidx)
        tidePredictor.update(newidx);

        return currentMoon
    }
}


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INIT SCENE,CAMERA,RENDERER AND DOMEVENTS  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

const parent = document.querySelector('#threejsDiv');
let width = parent.clientWidth;
let height = parent.clientWidth * .66;

const scene = new THREE.Scene();

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


const domEvents = new THREEx.DomEvents(camera, renderer.domElement);

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INIT SCENE OBJECTS ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
const sky = new Sky(scene);

const triangle = new Triangle(parent, scene,domEvents);

const nextMoonBtn = new Button(scene, 200, 250, 300);
const prevMoonBtn = new Button(scene, -200, -250, 300, true);
console.log(nextMoonBtn)
const background = new Background(scene);
const tide = new Tide(scene);
const groupMoons = new GroupMoons(parent, scene);

const moonPhaseAdmin = new MoonPhaseAdmin(background, tide, triangle,sky);


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ EVENTS ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
domEvents.bind(nextMoonBtn, 'click', () => {
    let currentMoon = moonPhaseAdmin.nextMoon();
    groupMoons.next();
}, false)

domEvents.bind(prevMoonBtn, 'click', () => {
    let currentMoon = moonPhaseAdmin.prevMoon();
    groupMoons.prev();
}, false)


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

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ LOAD INFORMATION FROM FILES ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
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

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ START ANIMATION ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
scene.clock = new THREE.Clock();

// Force renderer resizing once
resizeRenderer();
render();


//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//Add controls for debugging
const controls = new OrbitControls(camera, renderer.domElement);
