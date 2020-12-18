export function Door(scene,domEvents){
    let loader  = new THREE.TextureLoader()
    let texture = loader.load('/assets-main/images/door.png');
    texture.minFilter = THREE.LinearFilter;


    let material = new THREE.MeshBasicMaterial({
        map:texture,
        opacity: 1,
        side: THREE.DoubleSide,
    });

    let geometry = new THREE.PlaneBufferGeometry(30,30,30,20);
    const sphereG = new THREE.SphereBufferGeometry(32);

    const sphere = new THREE.Mesh( sphereG, new THREE.MeshBasicMaterial({
        wireframe: true,
        opacity: 1,
        side: THREE.DoubleSide,
        color: 0xff0000
    }) );
    const door = new THREE.Mesh( geometry, material );

    door.position.set(-200,-200,-200);
    sphere.position.set(-200,-200,-200);
    door.rotation.x = Math.PI/4.

    this.update = function(){

        const time =  scene.clock.getElapsedTime()*0.5;
        sphere.position.x = Math.sin( time * 0.7 ) * 40;
		sphere.position.y = Math.cos( time * 0.5 ) * 50;
		sphere.position.z = Math.cos( time * 0.3 ) * 90;

        door.position.x = Math.sin( time * 0.7 ) * 40;
		door.position.y = Math.cos( time * 0.5 ) * 50;
		door.position.z = Math.cos( time * 0.3 ) * 90;

        door.rotation.x += 0.02;
    }

    scene.add(sphere);
    scene.add(door);
    door.visible = false;

    let url = "/o0o"
    domEvents.addEventListener(door, 'click', function (event) {
        window.location.assign(url);
    }, false)

    domEvents.addEventListener(sphere, 'mouseover', function (event) {
        console.log("yey")
        door.visible = true;
        sphere.material.color.setHex( 0x00ffff );
    }, false)
    domEvents.addEventListener(sphere, 'mouseout', function (event) {
        console.log("yey")
        door.visible = false;
        sphere.material.color.setHex( 0xff0000);
    }, false)


}
