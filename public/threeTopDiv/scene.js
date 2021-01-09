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
    let all_data; let current_phase_idx = null; let fullmoon_idx, fullmoon_hour;
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
        if (idx < 0){
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
      //Look for current phase
      var idx = obj.findIndex(({data}) =>
                              (Date.parse(data[0]["newmoon 0"]["utctime"]) <= day &&
                               day <= Date.parse(data[1]["newmoon 30"]["utctime"])))

     // console.log("fullmon",all_data[idx].data[2]["fullmoon"]["utctime"])
      current_phase_idx = idx; //Starts in 0

      //Get full moon index in array of days
      fullmoon_idx = all_data[idx].data[2]["fullmoon"].idx;
      fullmoon_hour = all_data[idx].data[2]["fullmoon"].hour+":"
          + all_data[idx].data[2]["fullmoon"].min +":"
          + all_data[idx].data[2]["fullmoon"].sec;

      //Look for current day
      idx = all_data[idx].data[3].days.findIndex(element => Date.parse(element.date) > day)
      idx --;

      this.updateMoon(idx);
      //console.log("Phase Idx: ", current_phase_idx)
      //console.log("Day idx:", idx)

      //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      // Load all Moon images
      // Set pointers to `on-load` moons
      firstPhaseIdx = current_phase_idx;
      lastPhaseIdx = current_phase_idx;
      firstMoonIdx = idx;
      lastMoonIdx = idx;


        //Fill Central Moon
        var centralIdx = 22;
        groupMoons.loadNewTexture(all_data, centralIdx, current_phase_idx, idx);

        // Fill left mid - anticlockwise
        for (var i = 21; i > 7; i--) {
            updateLast();
            groupMoons.loadNewTexture(all_data, i, lastPhaseIdx, lastMoonIdx);
        }


        // Fill upper right quater
      for (var i = 23; i < 30; i++) {
          updateFirst();
          console.log("first", firstMoonIdx);
            groupMoons.loadNewTexture(all_data, i, firstPhaseIdx, firstMoonIdx);

        }

        // Fill lower right quater
        for (var i = 0; i < 8; i++) {
           updateFirst();
            groupMoons.loadNewTexture(all_data, i, firstPhaseIdx, firstMoonIdx);
        }

        /*
        //Debug
        moon =  group.children[24];
        newMaterial = new THREE.MeshBasicMaterial( {
            color: 0xff0000,
            transparent: true,
            side: THREE.DoubleSide,
            opacity: 10.3
        } );
        moon.material = newMaterial;
        */

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


        (idx == fullmoon_idx ?
         triangle.setFullMoonText(fullmoon_hour) :
         triangle.clearFullMoonText() )

        sky.setLight(intensity);
    }
    this.loadFirst = function(all_data,current_phase_idx){
        //Fill first Moon
        var idx = 6;
        this.updateFirst(all_data);
        this.loadNewTexture(all_data, idx, currentPhaseIdx, idx);
    }
    const loadFirst = function(){
        //Fill first Moon
        var idx = 6;
        updateFirst();
        groupMoons.loadNewTexture(all_data, idx, current_phase_idx, idx);
    }
    this.nextMoon = function() {
        var days = all_data[current_phase_idx].data[3].days;
        let newidx = currentMoon.idx + 1;
        if( newidx > days.length - 1 && current_phase_idx < 13){
            current_phase_idx ++;
            days = all_data[current_phase_idx].data[3].days;
            newidx = 0;
        }

        this.updateMoon(newidx);
        //TODO;
        //i- maybe show popup/warning for first?
        //ii- assets 29|30 days

        tidePredictor.update(newidx);

        loadFirst();

        return currentMoon;
    }


    const loadLast = function(){
        //Fill last Moon
        var idx = 7;
        updateLast();
        groupMoons.loadNewTexture(all_data, idx, current_phase_idx, idx);
    }
    this.prevMoon = function() {
        var days = all_data[current_phase_idx].data[3].days
        var newidx = (currentMoon.idx - 1)

        if( newidx > days.length - 1 && current_phase_idx > 0){
            current_phase_idx --;
            days = all_data[current_phase_idx].data[3].days;
            newidx = days.length - 1;
        }


        this.updateMoon(newidx);
        tidePredictor.update(newidx);

        loadLast();

        return currentMoon
    }
}


// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INIT SCENE,CAMERA,RENDERER AND DOMEVENTS  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

const parent = document.querySelector('#threejsDiv');
let width = parent.clientWidth;
let height = parent.clientWidth * 1.2;

const scene = new THREE.Scene();

let camera = new THREE.PerspectiveCamera(75, 1 / .66, 0.1, 2000);
camera.position.z = width;

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

const triangle = new Triangle(parent,scene,domEvents);
console.log(width,height)
const nextMoonBtn = new Button(scene, width*0.25, width*0.3, height*0.3,width*0.05);
const prevMoonBtn = new Button(scene, -width*0.25, -width*0.3, height*0.3,width*0.05, true);

const background = new Background(scene,width, height);
const tide = new Tide(scene,width, height);
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
