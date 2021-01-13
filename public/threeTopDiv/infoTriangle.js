// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INFORMATION TRIANGLE ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
export function Triangle(scene,width,height) {
    const geometry = new THREE.Geometry();
    let scaleX = .7;
    let scaleY = .535;
    geometry.vertices.push(
        new THREE.Vector3(0, height * scaleY, 0),
        new THREE.Vector3(-width * scaleX, -height*0.2, 0.),
        new THREE.Vector3(width * scaleX, -height*0.2, 0.)
    );

    geometry.faces.push(new THREE.Face3(0, 1, 2));

    geometry.computeBoundingSphere();
    var mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
        color: 0x000000,
        transparent: true
    }));
    mesh.position.z = 0;

    mesh.scale.setY(height/width)
    scene.add(mesh);

}
