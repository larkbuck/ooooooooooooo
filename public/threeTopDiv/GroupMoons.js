// Circle spinner from: https://medium.com/swlh/create-a-three-js-object-wheel-638f04439bc4
// const TWEEN = require('@tweenjs/tween.js') >> installed TWEEN thru NPM but not recognizing "require" - prob need to import. For now, linking to TWEEN in index.html

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ MOONS  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤

export function GroupMoons(parent, scene) {

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // Initialization
  let imageRadius = parent.clientWidth * .15;
  const numberImages = 29;
  const radianInterval = (2.0 * Math.PI) / numberImages;

  const centerWheel = {
    x: -imageRadius*0.8, //temporal fix for display moon in center of triangle
    y: -parent.clientHeight * 2.8 - imageRadius*0.8
  }
 //Geometric Structure
  const group = new THREE.Group();
  group.position.set(centerWheel.x, centerWheel.y)
  let loader = new THREE.TextureLoader();
  let texture = null;
  let material = null;
  let circle = null;
  let mesh = null;
  let radius = parent.clientWidth * 2.5;
 // Array showing current moons information
  var groupData = new Array(29);

    //-------------------------------------------------------------------
    // Initialize moons with empty texture
    for (let i = 0; i < (numberImages+1); i++) {
        material = new THREE.MeshBasicMaterial({
            color: 0x000000,
        });

        circle = new THREE.CircleGeometry(imageRadius, 100);

        mesh = new THREE.Mesh(circle, material);
        mesh.scale.setY(parent.clientHeight/parent.clientWidth)
        mesh.name = "circle "+ i;

        mesh.position.set(
            (Math.cos(radianInterval * i) * radius),
            (Math.sin(radianInterval * i) * radius),
            0);
        group.add(mesh);
    }

    scene.add(group);

    //----------------------------------------------------------------
    //Add moons veil

    const shape  = new THREE.Shape()
          .moveTo(0,-200)
		  .lineTo(-parent.clientWidth , -parent.clientWidth *0.25 )
		  .lineTo(-parent.clientWidth ,parent.clientWidth *0.5)
          .lineTo(parent.clientWidth ,parent.clientWidth *0.5)
          .lineTo(parent.clientWidth ,-parent.clientWidth *0.25)
    /*
    //Maybe usefull for other veil?
      const moonEye = new THREE.Path()
		  .moveTo( 0, -100 )
		  .absellipse( 0, 250, 55, 55, 0, Math.PI * 2, true );

    shape.holes.push(moonEye)
  */
    const triangle  = new THREE.Shape()
          .moveTo(parent.clientWidth *0.64,-parent.clientWidth *0.25)
          .lineTo(0, parent.clientHeight *.6)
          .lineTo(-parent.clientWidth *0.64,-parent.clientWidth *0.25)
    shape.holes.push(triangle)

    loader = new THREE.TextureLoader();
    texture = loader.load('/assets-main/images/veil.jpg');

	texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    texture.repeat.set( 0.0006, 0.0006 );
    texture.center = new THREE.Vector2(0.,0.5);


    var veilMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        side: THREE.DoubleSide,
        opacity:.3
    });

    const veilGeom = new THREE.ShapeBufferGeometry(shape);

    mesh = new THREE.Mesh( veilGeom, veilMaterial);

    mesh.position.set( 0, 0, 5);
    mesh.scale.set(2,2,2)
    scene.add(mesh)

    //-------------------------------------------------------------------

    this.loadNewTexture = function(all_data, idx, phaseIdx, dataIdx) {
        let moon, days, moonData,newMaterial,texture;

        moon =  group.children[idx];
        days = all_data[phaseIdx].data[3].days;
        moonData = days[dataIdx];
        groupData[idx] = moonData;

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
    this.showChild = function(idx){
        console.log(groupData[idx], group.children[idx])
    }

    this.debugMoon = function(all_data,idx,phaseIdx){
        let moon =  group.children[idx];
        let old = moon.material;
        let days = all_data[phaseIdx].data[3].days;

        let newMat = new THREE.MeshBasicMaterial({
            color: 0xff0000,
            transparent: true,
            side: THREE.DoubleSide,
        });

        moon.material = newMat;
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

    this.group = function(){
        return group;
    }
}
