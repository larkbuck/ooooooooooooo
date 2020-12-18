// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INFORMATION TRIANGLE ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
export function Button(scene, x1, x2, y, invert = false,path="button") {
    let loader  = new THREE.TextureLoader()
    let texture = loader.load('/assets-main/images/'+path+'.png');
    texture.minFilter = THREE.LinearFilter;

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
    var meshButton = new THREE.Mesh(button,  new THREE.MeshBasicMaterial({
        map:texture,
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


export function Text(scene, x=20,y=300,width=300,height=350) {
    var canvas = document.createElement('canvas');
    canvas.height = height;
  var context = canvas.getContext('2d');

    this.generateMoon = function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        let l1,l2,l3,l4,l5,l6;
        l1=`      . :*・°☆     `
        l2=`    °☆ ☆.:.: °☆  `
        l3=`   °☆.。.::*・° ☆ `
        l4=`   °☆.。.:...・°☆ `
        l5=`    °☆.。.: * °☆  `
        l6=`      °☆ .。*☆    `

        context.font = " Bold 20px Courier";
        context.fillStyle = "#FFFFFF";
        context.maxHeight= height;
        context.fillText(l1, 10, 20);
        context.fillText(l2, 10, 45);
        context.fillText(l3, 10, 60);
        context.fillText(l4, 10, 85);
        context.fillText(l5, 10, 110);
        context.fillText(l6, 10, 135);
        context.fillText(`*＊~.+.full moon.+.~＊*`, 5, 185);

        texture.needsUpdate = true;
    }

  this.generateText = function(text) {
    context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = "Bold 40px Courier";
    context.fillStyle = "#FFFFFF";
    context.maxWidth = width;
    context.maxHeight= width;
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

    const dateText = new Text(scene);
    const fullmoonText = new Text(scene, 20,100);
    const hourText = new Text(scene,50, -100);


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
