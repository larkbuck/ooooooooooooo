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
        if(phaseDayIdx>29) phaseDayIdx=29;

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
    let all_data; let current_phase_idx = null;

    let newmoon_hour, fullmoon_hour;
    let newmoon_idx = 0;
    let fullmoon_idx, thirdquarter_idx, firstquarter_idx;

    const tidePredictor = new TidePredictor(tide);
    let firstPhaseIdx, firstMoonIdx;
    let lastPhaseIdx, lastMoonIdx;

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
      nextquarter: null,
      prevquarter:null,
  };

    const  getLightIntensity = function(){

      let res = (currentMoon.moonAge > 1 ?
                 1.-(currentMoon.moonAge - 1)  :
                 currentMoon.moonAge);
      return res;
    }

    const updateFirst = function(){
        let idx = firstMoonIdx + 1;
        if (idx > all_data[firstPhaseIdx].data[3].days.length - 1){ //TODO; check boundary
            idx = 0;
            firstPhaseIdx ++;
        }
        firstMoonIdx = idx;
    }

    const updateLast = function(){
        let idx = lastMoonIdx - 1;

        if (idx < 0 && lastPhaseIdx > 0){
            lastPhaseIdx --;
            idx = all_data[lastPhaseIdx].data[3].days.length - 1;
        }
        lastMoonIdx = idx;
    }


  this.init = function(json) {
      var obj = JSON.parse(json);
      //Store locally all data
      all_data = obj;

      const day = Date.now();
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //Look for current phase
      var idx = obj.findIndex(({data}) =>
                              (Date.parse(data[0]["newmoon 0"]["utctime"]) <= day &&
                               day <= Date.parse(data[1]["newmoon 30"]["utctime"])))
      current_phase_idx = idx; //Starts in 0
      //console.log("Phase Idx: ", current_phase_idx)

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //Look for current day
      idx = all_data[idx].data[3].days.findIndex(element => Date.parse(element.date) > day)
      idx --;


      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //Load quarters and time of current phase
      this.loadPhase();

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // Load all Moon images

      // Initialize pointers to `pre-load` moons
      firstPhaseIdx = current_phase_idx;
      lastPhaseIdx = current_phase_idx;
      firstMoonIdx = idx;
      lastMoonIdx = idx;


      //Fill Central Moon
      var centralIdx = 7;
      groupMoons.loadNewTexture(all_data, centralIdx, current_phase_idx, idx);

      // Fill left mid - anticlockwise
      for (var i = centralIdx + 1 ; i < 22; i++) {
          updateLast();
          groupMoons.loadNewTexture(all_data, i, lastPhaseIdx, lastMoonIdx);
      }

      // Fill upper right quater
      for (var i = centralIdx - 1; i >= 0; i--) {
          updateFirst();
          groupMoons.loadNewTexture(all_data, i, firstPhaseIdx, firstMoonIdx);
      }

      // Fill lower right quater
      for (var i = 29; i > 21; i--) {
          updateFirst();
          groupMoons.loadNewTexture(all_data, i, firstPhaseIdx, firstMoonIdx);
      }
      groupMoons.showChild(22);
      tidePredictor.update(idx);
      this.updateMoon(idx);
      //console.log("Day idx:", idx)

  }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Update Current Moon

    this.updateMoon = function(idx) {
        var days = all_data[current_phase_idx].data[3].days;
        currentMoon.idx= idx;
        currentMoon.date = days[idx].date;

        currentMoon.events = days[idx].events;
        currentMoon.moonphase = days[idx].moonphase;
        currentMoon.img =days[idx].image;
        currentMoon.moonAge = idx/fullmoon_idx;

        currentMoon.nextquarter = days[idx].nextquarter;
        currentMoon.prevquarter = days[idx].prevquarter;

        // lark
        document.querySelector("#date").innerHTML = currentMoon.date;

        let intensity = getLightIntensity();

        tide.setLight(intensity);
        background.setLight(intensity);

        triangle.clear();
        triangle.setDate(currentMoon.date);

        switch (idx){
        case 0:
            triangle.setNewMoonText(newmoon_hour)
            break;
        case firstquarter_idx:
            triangle.setQuarterText(1);
            break;
        case fullmoon_idx:
            triangle.setFullMoonText(fullmoon_hour)
            break;
        case thirdquarter_idx:
            triangle.setQuarterText(3);
            break;
        default:
            break;
        }

        sky.setLight(intensity);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Resolves next and prev `events`

   const loadFirst = function(){
        //pre-loads `first` Moon
        var idx = 22;
        updateFirst();
        groupMoons.loadNewTexture(all_data, idx, current_phase_idx, idx);
   }

    this.nextMoon = function() {
        var days = all_data[current_phase_idx].data[3].days;
        let newidx = currentMoon.idx + 1;
        if( newidx > days.length - 1 && current_phase_idx < 13){
            current_phase_idx ++;
            days = all_data[current_phase_idx].data[3].days;
            this.loadPhase();
            newidx = 0;
        }

        this.updateMoon(newidx);
        groupMoons.scaleCenterOnNextEvent();
        tidePredictor.update(newidx);

        loadFirst();

        return currentMoon;
    }


    const loadLast = function(){
        //pre-loads `last` Moon
        var idx = 21;
        updateLast();
        groupMoons.loadNewTexture(all_data, idx, current_phase_idx, idx);
    }

    this.prevMoon = function() {
        var days = all_data[current_phase_idx].data[3].days
        var newidx = (currentMoon.idx - 1)

        if( newidx < 0 && current_phase_idx > 0){
            current_phase_idx --;
            days = all_data[current_phase_idx].data[3].days;
            newidx = days.length - 1;
        }


        this.updateMoon(newidx);
        groupMoons.scaleCenterOnPrevEvent();
        tidePredictor.update(newidx);

        loadLast();

        return currentMoon
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Loads phase data
    const pad = function(d) {
        return (parseInt(d) < 10) ? '0' + d.toString() : d.toString();
    }

    this.loadPhase= function(){
        var days = all_data[current_phase_idx].data[3].days;
        firstquarter_idx = all_data[current_phase_idx].data[4].firstquarter.idx;
        thirdquarter_idx = all_data[current_phase_idx].data[5].thirdquarter.idx;

        // Get full moon index in array of days
        fullmoon_idx = all_data[current_phase_idx].data[2]["fullmoon"].idx;
        fullmoon_hour = pad(all_data[current_phase_idx].data[2]["fullmoon"].hour)+":"
            + pad(all_data[current_phase_idx].data[2]["fullmoon"].min) +":"
            + pad(all_data[current_phase_idx].data[2]["fullmoon"].sec);

        newmoon_hour = pad(all_data[current_phase_idx].data[0]["newmoon 0"].hour)+":"
            + pad(all_data[current_phase_idx].data[0]["newmoon 0"].min) +":"
            + pad(all_data[current_phase_idx].data[0]["newmoon 0"].sec);

    }
}


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INIT SCENE,CAMERA,RENDERER AND DOMEVENTS  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

const parent = document.querySelector('#threejsDiv');
let width = parent.clientWidth;
let height = parent.clientWidth * 1.2;

const scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 2000);
camera.position.z = width;

const renderer = new THREE.WebGLRenderer({
  parent,
  alpha: true,
  antialias: true
});
// renderer.setSize(parent.clientWidth, parent.clientHeight);
// renderer.setSize(parent.clientWidth, parent.clientWidth * .66); // set to be movie-screen ratio 1.33
renderer.setSize(width, height); // set to be mobile friendly narrow
parent.append(renderer.domElement);


const domEvents = new THREEx.DomEvents(camera, renderer.domElement);

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INIT SCENE OBJECTS ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
const sky = new Sky(scene);

const triangle = new Triangle(scene, width, height);
const nextMoonBtn = new Button(scene, width*0.32, width*0.38, height*0.2,width*0.05);
const prevMoonBtn = new Button(scene, -width*0.32, -width*0.38, height*0.2,width*0.05, true);

const background = new Background(scene,width, height);
const tide = new Tide(scene,width, height);
const groupMoons = new GroupMoons(scene,width,height);

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

document.querySelector("#prevMoonBtn").addEventListener('click', () => {
    let currentMoon = moonPhaseAdmin.prevMoon();
    groupMoons.prev();
}, false)

document.querySelector("#nextMoonBtn").addEventListener('click', () => {
    let currentMoon = moonPhaseAdmin.prevMoon();
    groupMoons.next();
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
//const controls = new OrbitControls(camera, renderer.domElement);
//console.log(width,height)
