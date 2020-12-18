export function Sky(scene){
    let loader  = new THREE.TextureLoader()
    let texture = loader.load('/assets-main/images/sky.jpg');
    texture.minFilter = THREE.LinearFilter;


    let material = new THREE.MeshBasicMaterial({
        map:texture,
        opacity: 1,
        side: THREE.DoubleSide
    });

    let geometry = new THREE.PlaneBufferGeometry(30,30,30,20);
 
    const sphere = new THREE.Mesh( geometry, material );
    sphere.scale.set(200,100,100);
    sphere.position.set(0,0,-800);

    const directionalLight = new THREE.DirectionalLight( 0xffffff, 0.5 );
    scene.add( directionalLight );

    this.setLight = function(intensity){
        directionalLight.intensity = intensity;
    }

    this.update = function(){
        //Not updating for now
    }
    scene.add(sphere);

}
