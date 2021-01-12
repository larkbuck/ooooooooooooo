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
    let newmoon_idx, fullmoon_idx, thirdquarter_idx, firstquarter_idx;

    const tidePredictor = new TidePredictor(tide);
    let firstPhaseIdx, firstMoonDataIdx, firstMoonIdx;
    let lastPhaseIdx, lastMoonDataIdx, lastMoonIdx;

    let onQuarter = false;

    //Initialize current tide
    const loadTide = (data) => tidePredictor.init(data);
    getText('/data/tides_hi-lo.JSON', loadTide)

  let currentMoon = {
      idx: null,
      date: null,
      events: null,
      moonphase: null,
      img: null,
      moonAge: null
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
      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      //Look for current phase
      var idx = obj.findIndex(({data}) =>
                              (Date.parse(data[0]["newmoon 0"]["utctime"]) <= day &&
                               day <= Date.parse(data[1]["newmoon 30"]["utctime"])))

      //console.log("Phase Idx: ", current_phase_idx)
      current_phase_idx = idx; //Starts in 0


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
      firstMoonDataIdx = idx;
      lastMoonDataIdx = idx;

      //Fill Central Moon
      var centralIdx = 7;
      groupMoons.loadNewTexture(all_data, centralIdx, current_phase_idx, idx);

      // Fill left mid - anticlockwise
      for (var i = centralIdx + 1 ; i < 22; i++) {
          updateLast();
          groupMoons.loadNewTexture(all_data, i, lastPhaseIdx, lastMoonDataIdx);
          lastMoonIdx = i;
      }

      // Fill upper right quater
      for (var i = centralIdx - 1; i >= 0; i--) {
          updateFirst();
          groupMoons.loadNewTexture(all_data, i, firstPhaseIdx, firstMoonDataIdx);
          firstMoonIdx = i;
      }

      // Fill lower right quater
      for (var i = 29; i > 21; i--) {
          updateFirst();
          groupMoons.loadNewTexture(all_data, i, firstPhaseIdx, firstMoonDataIdx);
          firstMoonIdx = i;
      }

      tidePredictor.update(idx);
      this.updateMoon(idx);
      //console.log("Day idx:", idx)

  }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Update Current Moon

    this.showCurrentMoon = function(){
        console.log(currentMoon);
    }

    this.updateMoon = function(idx) {
        var days = all_data[current_phase_idx].data[3].days;
        currentMoon.idx= idx;
        currentMoon.date = days[idx].date;

        currentMoon.events = days[idx].events;
        currentMoon.moonphase = days[idx].moonphase;
        currentMoon.img =days[idx].image;
        currentMoon.moonAge = idx/fullmoon_idx;

        // lark
        document.querySelector("#date").innerHTML = currentMoon.date;

        let intensity = getLightIntensity();

        tide.setLight(intensity);
        background.setLight(intensity);

        triangle.clear();
        triangle.setDate(currentMoon.date);

        switch (idx){
        case newmoon_idx:
            triangle.setNewMoonText(newmoon_hour)
            onQuarter = true;
            break;
        case firstquarter_idx:
            triangle.setQuarterText(1);
            onQuarter = true;
            break;
        case fullmoon_idx:
            triangle.setFullMoonText(fullmoon_hour)
            onQuarter = true;
            break;
        case thirdquarter_idx:
            triangle.setQuarterText(3);
            onQuarter = true;
            break;
        default:
            onQuarter = false;
            break;
        }

        sky.setLight(intensity);
    }

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Resolves next and prev `events`

    const updateFirst = function(){
        let idx = firstMoonDataIdx + 1;
        if (idx > all_data[firstPhaseIdx].data[3].days.length - 1){ //TODO; check boundary
            idx = 0;
            firstPhaseIdx ++;
        }

        firstMoonDataIdx = idx;
        firstMoonIdx --;
        if (firstMoonIdx < 0){
            firstMoonIdx = 29;
        }
    }

   const loadFirst = function(){
       //pre-loads `first` Moon
       updateFirst();

       //Update texture
       groupMoons.loadNewTexture(all_data, firstMoonIdx, firstPhaseIdx, firstMoonDataIdx);
       //Update New Last
       lastMoonIdx --;
       if (lastMoonIdx < 0){
           lastMoonIdx = 29;
       }
       groupMoons.loadNewTexture(all_data, lastMoonIdx, lastPhaseIdx, lastMoonDataIdx);

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

    const updateLast = function(){
        let idx = lastMoonDataIdx - 1;

        if (idx < 0){
            lastPhaseIdx = Math.max(0, lastPhaseIdx - 1) ;
            idx = all_data[lastPhaseIdx].data[3].days.length - 1;
        }

        lastMoonDataIdx = idx;
        lastMoonIdx  =  (lastMoonIdx + 1) % 30;
    }

    const loadLast = function(){
        //pre-loads `last` Moon
        updateLast();
        //Update texture
        groupMoons.loadNewTexture(all_data, lastMoonIdx, lastPhaseIdx, lastMoonDataIdx);

        //Update New First
        firstMoonIdx  =  (firstMoonIdx+1)% 30;
        groupMoons.loadNewTexture(all_data, firstMoonIdx, firstPhaseIdx, firstMoonDataIdx);

    }


    this.prevMoon = function() {
        var days = all_data[current_phase_idx].data[3].days
        var newidx = (currentMoon.idx - 1)

        if( newidx < 0 && current_phase_idx > 0){
            current_phase_idx --;
            days = all_data[current_phase_idx].data[3].days;
            this.loadPhase();
            newidx = days.length - 1;
        }

        this.updateMoon(newidx);
        groupMoons.scaleCenterOnPrevEvent();
        tidePredictor.update(newidx);

        loadLast();

        return currentMoon;
    }
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    // Resolves next and prev quarters

    this.nextQuarter = function() {
        let step = 0;

        if (onQuarter){
            this.nextMoon()
            step ++;
        }
        let idx = currentMoon.idx;
        while (idx !=  newmoon_idx &&
               idx != fullmoon_idx &&
               idx != thirdquarter_idx &&
               idx != firstquarter_idx){

            this.nextMoon();
            idx = currentMoon.idx;
            step ++;
        }
        return step;
    }

    this.prevQuarter = function() {
        let step = 0;

        if (onQuarter){
            this.prevMoon()
            step --;
        }
        let idx = currentMoon.idx;
        while (idx !=  newmoon_idx &&
               idx != fullmoon_idx &&
               idx != thirdquarter_idx &&
               idx != firstquarter_idx){

            this.prevMoon();
            idx = currentMoon.idx;
            step --;
        }
        return step;
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

        newmoon_idx = days.length -1;
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
const background = new Background(scene,width, height);
const tide = new Tide(scene,width, height);
const groupMoons = new GroupMoons(scene,width,height);

const moonPhaseAdmin = new MoonPhaseAdmin(background, tide, triangle,sky);


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ EVENTS ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
document.querySelector("#prevMoonBtn").addEventListener('click', () => {
    let currentMoon = moonPhaseAdmin.prevMoon();
    groupMoons.prev();

}, false)

document.querySelector("#nextMoonBtn").addEventListener('click', () => {
    let currentMoon = moonPhaseAdmin.nextMoon();
    groupMoons.next();

}, false)

document.querySelector("#prevQuarterBtn").addEventListener('click', () => {
    let step = moonPhaseAdmin.prevQuarter();
    groupMoons.prevQuarter(step);
}, false)

document.querySelector("#nextQuarterBtn").addEventListener('click', () => {
    let step = moonPhaseAdmin.nextQuarter();
    groupMoons.nextQuarter(step);

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
