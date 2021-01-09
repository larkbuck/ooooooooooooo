// Circle spinner from: https://medium.com/swlh/create-a-three-js-object-wheel-638f04439bc4
// const TWEEN = require('@tweenjs/tween.js') >> installed TWEEN thru NPM but not recognizing "require" - prob need to import. For now, linking to TWEEN in index.html

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ MOONS  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

function Moon(){


}


export function GroupMoons(parent, scene) {

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
  let loader = new THREE.TextureLoader();
  let texture = null;
  let material = null;
  let circle = null;
  let mesh = null;
  let radius = 1500; // reset to parent.clientWidth in resize function

    //-------------------------------------------------------------------
    // Initialize moons with empty texture
    for (let i = 0; i < (numberImages+1); i++) {
        material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 1,

        });

        circle = new THREE.CircleGeometry(imageRadius, 100);

        mesh = new THREE.Mesh(circle, material);
        mesh.name = "circle "+ i;

        mesh.position.set(
            (Math.cos(radianInterval * i) * (radius)),
            (Math.sin(-radianInterval * i) * (radius)),
            //(Math.sin(radianInterval * i) * radius) * .4, // Sol: I tried to make oval but then it did a CRAZY spin
            0);
        group.add(mesh);
    }

    scene.add(group);

    //----------------------------------------------------------------
    //Add moons veil

    const shape  = new THREE.Shape()
          .moveTo(0,-200)
		  .lineTo(-800, -200 )
		  .lineTo(-800,400)
          .lineTo(800,400)
          .lineTo(800,-200)

    /*Maybe usefull for other veil?
      const moonEye = new THREE.Path()
		  .moveTo( 0, -100 )
		  .absellipse( 0, 250, 55, 55, 0, Math.PI * 2, true );

    shape.holes.push(moonEye)*/
    const triangle  = new THREE.Shape()
          .moveTo(-430,-200)
          .lineTo(0, 380)
          .lineTo(430,-200)
    shape.holes.push(triangle)

    loader = new THREE.TextureLoader();
    texture = loader.load('/assets-main/images/veil.jpg');


    var material2 = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        opacity: .3
    });
    //material2.side = THREE.BackSide
    const veilGeom = new THREE.ShapeBufferGeometry(shape);
    mesh = new THREE.Mesh( veilGeom, material2);

    mesh.position.set( 0, 0, 0);
    mesh.scale.set(2,2,2)
    scene.add(mesh)
    //-------------------------------------------------------------------
    // Auxiliars
    let firstPhaseIdx, firstMoonIdx;
    let lastPhaseIdx, lastMoonIdx;

    this.initIdx = function(currentPhaseIdx,idx){
        firstPhaseIdx = currentPhaseIdx;
        lastPhaseIdx = currentPhaseIdx;
        firstMoonIdx = idx;
        lastMoonIdx = idx;
    }

    this.updateFirst = function(all_data){
        let idx = firstMoonIdx + 1;
        if (idx > all_data[firstPhaseIdx].data[3].days.length - 1){ //TODO; check boundary
            idx = 0;
            firstPhaseIdx ++;
        }
        firstMoonIdx = idx;
    }

    this.updateLast = function(all_data){
        let idx = lastMoonIdx - 1;
        if (idx < 0){
            lastPhaseIdx --;
            idx = all_data[lastPhaseIdx].data[3].days.length - 1;
        }
        lastMoonIdx = idx;
    }

    this.loadNewTexture = function(all_data, idx, phaseIdx, dataIdx) {
        let moon, days, moonData,newMaterial,texture;

        moon =  group.children[idx];
        days = all_data[phaseIdx].data[3].days;
        moonData = days[dataIdx];

        texture = loader.load(moonData.image);
        texture.minFilter = THREE.LinearFilter;
        newMaterial = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,

        })

        moon.material = newMaterial;
        moon.material.map.needsUpdate = true

    }
    //////////////////////////////////////////////////////////////
    this.load = function(all_data, currentPhaseIdx, idx){
        this.initIdx(currentPhaseIdx, idx);
        //Fill Central Moon
        var centralIdx = 22;
        this.loadNewTexture(all_data, centralIdx, currentPhaseIdx, idx);

        // Fill left mid - anticlockwise
        for (var i = 21; i > 7; i--) {
            this.updateLast(all_data);
            this.loadNewTexture(all_data, i, lastPhaseIdx, lastMoonIdx);
        }


        // Fill upper right quater
        for (var i = 23; i < group.children.length; i++) {
            this.updateFirst(all_data);
            this.loadNewTexture(all_data, i, firstPhaseIdx, firstMoonIdx);

        }

        // Fill lower right quater
        for (var i = 0; i < 7; i++) {
            this.updateFirst(all_data);
            this.loadNewTexture(all_data, i, firstPhaseIdx, firstMoonIdx);
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
    }

    this.loadFirst = function(all_data,currentPhaseIdx){
        //Fill first Moon
        var idx = 6;
        this.updateFirst(all_data);
        this.loadNewTexture(all_data, idx, currentPhaseIdx, idx);
    }

    this.loadLast = function(all_data,currentPhaseIdx){
        //Fill last Moon
        var idx = 7;
        this.updateLast(all_data);
        this.loadNewTexture(all_data, idx, currentPhaseIdx, idx);
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
    this.spin = function(val=1){
        // groupMoons.rotation.z += radianInterval;
        // ^ basically just doing this but using Tween to animate:

        new TWEEN.Tween(group.rotation)
            .to({
                z: group.rotation.z + (radianInterval * val)
            }, 600)
            .easing(TWEEN.Easing.Cubic.InOut)
            .start();

        for (let i = 0; i < group.children.length; i++) {
            // group.children[i].rotation.z += radianInterval;
            // ^ animating with Tween
            new TWEEN.Tween(group.children[i].rotation)
                .to({
                    z: group.children[i].rotation.z - (radianInterval * val)
                }, 600)
                .easing(TWEEN.Easing.Cubic.InOut)
                .start();
        }
    }

    this.next = function(){
        this.spin();
    }
    this.prev = function(){
        this.spin(-1);
    }

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
