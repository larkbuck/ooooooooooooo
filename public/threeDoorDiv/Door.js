
import { FresnelShader } from '/jsm/shaders/FresnelShader.js';

export function Door(scene,domEvents){
    let loader  = new THREE.TextureLoader()
    let texture = loader.load('/assets-main/images/door.png');
    texture.minFilter = THREE.LinearFilter;


    let materialDoor = new THREE.MeshBasicMaterial({
        map:texture,
        opacity: 1,
        side: THREE.DoubleSide,
    });

    //Set up water like
    const path = '/assets-main/images/cubemapFG/';
	const format = '.jpg';
    const urls = [
	    path + 'front' + format, path + 'back' + format,
		path + 'up' + format, path + 'down' + format,
        path + 'right' + format, path + 'left' + format,

	];

	const textureCube = new THREE.CubeTextureLoader().load( urls );

	scene.background = textureCube;

    const shader = FresnelShader;
	const uniforms = THREE.UniformsUtils.clone( shader.uniforms );

	uniforms[ "tCube" ].value = textureCube;


    const materialFresnel = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
	} );

    const spheres = [];
    const geometry_ = new THREE.SphereBufferGeometry( 40, 32, 16 );

    for ( let i = 0; i < 150; i ++ ) {

		const mesh = new THREE.Mesh( geometry_, materialFresnel );

		mesh.position.x = Math.random() * 10000 - 5000;
		mesh.position.y = Math.random() * 10000 - 5000;
		mesh.position.z = Math.random() * 10000 - 5000;

		mesh.scale.x = mesh.scale.y = mesh.scale.z = Math.random() * 3 + 1;

		scene.add( mesh );

		spheres.push( mesh );

	}

    let geometry = new THREE.PlaneBufferGeometry(30,30,30,20);
    const sphereG = new THREE.SphereBufferGeometry(50,16);
	const materialMagic = new THREE.ShaderMaterial( {
		uniforms: uniforms,
		vertexShader: shader.vertexShader,
		fragmentShader: shader.fragmentShader,
	} );
    const sphere = new THREE.Mesh( sphereG, materialMagic);

    const door = new THREE.Mesh( geometry, materialDoor );

    door.position.set(-200,-200,-200);
    sphere.position.set(-200,-200,-200);
   // door.rotation.x = Math.PI/4.

    this.update = function(){

        const time =  scene.clock.getElapsedTime()*0.5;
        sphere.position.x = Math.sin( time * 0.7 ) * 40;
		sphere.position.y = Math.cos( time * 0.5 ) * 50;
		sphere.position.z = Math.cos( time * 0.3 ) * 90;


        door.position.x = Math.sin( time * 0.7 ) * 40;
		door.position.y = Math.cos( time * 0.5 ) * 50;
		door.position.z = Math.cos( time * 0.3 ) * 90;



    }

    scene.add(sphere);
    scene.add(door);
    door.visible = false;

    let url = "/o0o"
    domEvents.addEventListener(door, 'click', function (event) {
        window.location.assign(url);
    }, false)

    domEvents.addEventListener(sphere, 'mouseover', function (event) {
        door.visible = true;
        sphere.material.wireframe = true;
    }, false)
    domEvents.addEventListener(sphere, 'mouseout', function (event) {
        door.visible = false;
        sphere.material.wireframe = false;

    }, false)


}
