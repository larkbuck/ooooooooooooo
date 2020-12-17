// Circle spinner from: https://medium.com/swlh/create-a-three-js-object-wheel-638f04439bc4
// const TWEEN = require('@tweenjs/tween.js') >> installed TWEEN thru NPM but not recognizing "require" - prob need to import. For now, linking to TWEEN in index.html

// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ MOONS  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
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
    texture.minFilter = THREE.LinearFilter;


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
