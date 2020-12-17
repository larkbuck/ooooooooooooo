// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INFORMATION TRIANGLE ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
export function Button(scene, x1, x2, y, invert = false) {
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
  var meshButton = new THREE.Mesh(button, new THREE.MeshBasicMaterial({
      color: 0xd4af37,
      wireframe:true,
      side: THREE.DoubleSide
  }));
  meshButton.position.z = 0;
  scene.add(meshButton);

  const edges = new THREE.EdgesGeometry(button);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      wireframe:true,
      side: THREE.DoubleSide
  }));
  scene.add(line);

  return meshButton;//event listeners should be binded to mesh
}


export function Text(scene, y) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');

  this.generateText = function(text) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.font = "Bold 40px Courier";
    context.fillStyle = "#FFFFFF";
    context.maxWidth = 300;
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
  mesh.position.set(20, 300, 0);
  scene.add(mesh);

  this.update = function(newText) {
    this.generateText(newText);
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

   const infoText = new Text(scene, 300);
  this.setDate = function(newText) {
    infoText.update(newText);
  }
}
