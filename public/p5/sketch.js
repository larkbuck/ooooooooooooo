'use strict';

let threeContainer;
let bubbleArray = [];
let numOfBubbles = 20;
let bubbleArrayLength;
let intention;
let numLayers;
let layerHeight;
let startCol;
let endCol;
let colIncr;
let intentionArray = [];
let waves;

function preload() {
  waves = loadImage('../assets-main/images/waves.png');
}

function setup() {
  threeContainer = document.querySelector("#threeContainer");

  let c = createCanvas(windowWidth, threeContainer.clientHeight);
  c.parent("#p5Div");

  frameRate(20);
  textAlign(CENTER);
  textSize(36);


  //water
  numLayers = 150;
  layerHeight = height / numLayers;
  startCol = color(57, 191, 171);
  endCol = color(26, 33, 68);
  colIncr = 1 / numLayers;


  createBubbleArray();

  document.querySelector("#intentionBtn").addEventListener('click', () => {
    intention = document.querySelector('#intention').value;
    document.querySelector('#intention').value = '';
    intentionArray.push(new Intention(intention));
  }, false)

}

function windowResized() {
  // resizeCanvas(p5Div.clientWidth, p5Div.clientHeight);
  resizeCanvas(p5Div.clientWidth, p5Div.clientWidth * .66);
}

function draw() {

  clear();

  //draw water - each rect get darker as height increases
  for (let i = 0; i < numLayers; i++) {
    let waterCol = lerpColor(startCol, endCol, colIncr * i);
    fill(waterCol);
    rect(0, layerHeight * i, width, layerHeight);
  }

  noStroke();

  drawBubbles();

  for (let i = 0; i < intentionArray.length; i++) {
    intentionArray[i].displayIntention();
    intentionArray[i].moveIntention();
  }


  for (let i = -1; i < 16; i++) {
    image(waves, i * 128 + frameCount % 128, -20 + sin(frameCount * 0.08)*2);
  }

  // for (let i = 0; i < 16; i++){
  //   image(waves, i * 128 + frameCount, -33);
  // }

}


// p5Div starter code
// let p5Div;
//
// function setup() {
//   p5Div = document.querySelector("#p5Div");
//
//   // let c = createCanvas(p5Div.clientWidth, p5Div.clientHeight);
//   let c = createCanvas(p5Div.clientWidth, p5Div.clientWidth * .66);
//   c.parent("#p5Div");
//
// }
//
// function windowResized(){
//   // resizeCanvas(p5Div.clientWidth, p5Div.clientHeight);
//   resizeCanvas(p5Div.clientWidth, p5Div.clientWidth * .66);
// }
//
// function draw(){
//   background(13);
//   stroke(0, 255, 0);
//   noFill();
//   ellipse(width / 2, height / 2, 80, 80);
// }
