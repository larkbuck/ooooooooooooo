// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INFORMATION TRIANGLE ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


export function Button(scene, x1, x2, y, delta, invert = false,path="button") {
    let loader  = new THREE.TextureLoader()
    let texture = loader.load('/assets-main/images/'+path+'.png');
    texture.minFilter = THREE.LinearFilter;

  const button = new THREE.Geometry();
  (invert ?
    button.vertices.push(
      new THREE.Vector3(x1, y - delta, 0),
      new THREE.Vector3(x1, y + delta, 0),
      new THREE.Vector3(x2, y, 0)

    ) :
    button.vertices.push(
      new THREE.Vector3(x1, y - delta, 0),
      new THREE.Vector3(x2, y, 0),
      new THREE.Vector3(x1, y + delta, 0),
    ))

  button.faces.push(new THREE.Face3(0, 1, 2));

    var meshButton = new THREE.Mesh(button,  new THREE.MeshBasicMaterial({
        wireframe:true,
        opacity: 1,
        transparent: true,
        side: THREE.DoubleSide
    }));


  meshButton.position.z = 0;
  scene.add(meshButton);
/*Debug line
  const edges = new THREE.EdgesGeometry(button);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color: 0xff0000,
      transparent: true,
      side: THREE.DoubleSide
  }));
  scene.add(line);*/

  return meshButton;//event listeners should be binded to mesh
}


export function Text(scene, x, y, width,height,fontSize) {
    var canvas = document.createElement('canvas');
    canvas.height = height;
    var scaleFactorM=0.0357;
    var scaleFactorT=-0.01;
  var context = canvas.getContext('2d');
    if (isMobile.any()) {
        scaleFactorM = 0.7
        scaleFactorT = 0.7
    }

    this.generateMoon = function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        let l1,l2,l3,l4,l5,l6;
        l1=`    . :*・°☆     `
        l2=`  °☆ ☆.:.: °☆  `
        l3=` °☆.。.::*・° ☆ `
        l4=` °☆.。.:...・°☆ `
        l5=`  °☆.。.: * °☆  `
        l6=`    °☆ .。*☆    `

        context.font = " Bold "+fontSize+"px Courier";
        context.fillStyle = "#FFFFFF";
        context.maxHeight= height;
        context.fillText(l1, width * scaleFactorM, height * 0.140);
        context.fillText(l2, width * scaleFactorM, height * 0.1975);
        context.fillText(l3, width * scaleFactorM, height * 0.275625);
        context.fillText(l4, width * scaleFactorM, height * 0.3537);
        context.fillText(l5, width * scaleFactorM, height * 0.431);
        context.fillText(l6, width * scaleFactorM, height * 0.47875);
        context.font = " Bold "+fontSize*1.2+"px Courier";
        context.fillText(`*~.full moon.°`, scaleFactorT*width,  width * 0.85);

        texture.needsUpdate = true;
    }

  this.generateText = function(text) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      console.log(width)
      context.font = "Bold "+fontSize+"px Courier";
      context.fillStyle = "#FFFFFF";
      context.maxWidth = width;
      context.maxHeight= width;
      context.fillText(text,scaleFactorT*width, 0.42*width);
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
    mesh.position.set(x,y, 0);
    scene.add(mesh);

  this.update = function(newText) {
    this.generateText(newText);
      texture.needsUpdate = true;
  }

    this.clear = function(){
      context.clearRect(0, 0, canvas.width, canvas.height);
        texture.needsUpdate = true;
    }

}

export function Triangle(parent, scene) {
    const geometry = new THREE.Geometry();
    let scaleX = 1.5;
    let scaleY = 1.8
    geometry.vertices.push(
        new THREE.Vector3(0, parent.clientHeight * scaleY, 0),
        new THREE.Vector3(-parent.clientWidth * scaleX, -parent.clientHeight * scaleX, 0),
        new THREE.Vector3(parent.clientWidth * scaleX, -parent.clientHeight * scaleX, 0)
    );

    geometry.faces.push(new THREE.Face3(0, 1, 2));

    geometry.computeBoundingSphere();
    var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true
    }));
    mesh.position.z = 0;

    mesh.scale.setY(parent.clientHeight/parent.clientWidth)
    scene.add(mesh);

    let w = parent.clientWidth;
    let h = parent.clientHeight;

    const dateText = new Text(scene, w * 0.03, h * 0.3, w*0.35, w*0.3,w*0.0625);
    const fullmoonText = new Text(scene,  w * 0.01, 0.,  w*0.35, w*0.4,w*0.0375);
    const hourText = new Text(scene, w * 0.08, -h * 0.32, w*0.35, w*0.3,w*0.0625);

    this.setDate = function(newText) {
      dateText.update(newText);
    }


    this.setFullMoonText = function(hour){
       fullmoonText.clear();
       fullmoonText.generateMoon();
       hourText.update(hour);
    }

    this.clearFullMoonText = function(){
        fullmoonText.clear();
        hourText.clear();
    }
}
