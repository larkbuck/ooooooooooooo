export function Door(scene,domEvents){
    let loader  = new THREE.TextureLoader()
    let texture = loader.load('/assets-main/images/door.png');
    texture.minFilter = THREE.LinearFilter;


    let material = new THREE.MeshBasicMaterial({
        map:texture,
        opacity: 1,
        side: THREE.DoubleSide
    });

    let geometry = new THREE.PlaneBufferGeometry(30,30,30,20);
 
    const door = new THREE.Mesh( geometry, material );
    //door.scale.set(200,100,100);
    door.position.set(0,150,0);
    door.rotation.x = Math.PI/4.

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );

    this.setLight = function(intensity){
        directionalLight.intensity = intensity;
    }

    this.update = function(){
        door.rotation.x += 0.01;
       // door.position.z += 0.2;
    }

    scene.add(door);

    let url = "/o0o"
    domEvents.addEventListener(door, 'click', function (event) {
        window.location.assign(url);
    }, false)


}
