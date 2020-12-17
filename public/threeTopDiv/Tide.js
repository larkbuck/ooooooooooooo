// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ TIDE  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
export function Tide(scene) {

    let TideConf = {
        fov: 75,
        cameraZ: 1000,
        xyCoef: 50,
        zCoef: 20,
        lightIntensity: 0.9,
        light1Color: 0x0E09DC,
        light2Color: 0x1CD1E1,
        light3Color: 0x18C02C,
        light4Color: 0xee3bcf,
        velocity: 1
    };

    let vertexShaderStr=`precision mediump float;
varying vec2 vUv;
uniform float uTime;

//
// Description : Array and textureless GLSL 2D/3D/4D simplex
//               noise functions.
//      Author : Ian McEwan, Ashima Arts.
//  Maintainer : ijm
//     Lastmod : 20110822 (ijm)
//     License : Copyright (C) 2011 Ashima Arts. All rights reserved.
//               Distributed under the MIT License. See LICENSE file.
//               https://github.com/ashima/webgl-noise
//

vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

vec4 permute(vec4 x) {
     return mod289(((x*34.0)+1.0)*x);
}

vec4 taylorInvSqrt(vec4 r)
{
  return 1.79284291400159 - 0.85373472095314 * r;
}

float snoise(vec3 v) {
  const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
  const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

  // First corner
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 =   v - i + dot(i, C.xxx) ;

  // Other corners
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );

  //   x0 = x0 - 0.0 + 0.0 * C.xxx;
  //   x1 = x0 - i1  + 1.0 * C.xxx;
  //   x2 = x0 - i2  + 2.0 * C.xxx;
  //   x3 = x0 - 1.0 + 3.0 * C.xxx;
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
  vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

  // Permutations
  i = mod289(i);
  vec4 p = permute( permute( permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

  // Gradients: 7x7 points over a square, mapped onto an octahedron.
  // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
  float n_ = 0.142857142857; // 1.0/7.0
  vec3  ns = n_ * D.wyz - D.xzx;

  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);

  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );

  //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
  //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));

  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);

  // Normalise gradients
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;

  // Mix final noise value
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
}

void main() {
  vUv = uv;
float max = 3.;
  vec3 pos = position;
  float noiseFreq = 1.5;
  float midAmp = (uv.x < .5 ? .2 :.8);

  float quarterAmp = ( abs(.5-uv.x ) < .25 ? 0. :1.);

  float noisePos = pos.x* noiseFreq + uTime;
 float old = pos.z;
 pos.z += sin(noisePos)*sin(pos.y) * midAmp;

 pos.z += quarterAmp *midAmp*sin(noisePos)*sin(pos.y)+ smoothstep(old,max,pos.z)*midAmp;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}`;

    let fragmentShaderStr=`precision mediump float;
varying vec2 vUv;
uniform float uTime;
uniform float lightIntensity;

void main() {
 float r = sin(vUv.y*vUv.x);
float g = cos(uTime*0.2);
float b = cos(vUv.y*vUv.y);
vec3 color = vec3(r,g,b);
  gl_FragColor = vec4(color/vec3(1./2.2), 1.) *vec4(1.-length(vUv*2.-1.))*(lightIntensity+0.01);
}`

    let material = new THREE.ShaderMaterial({
        vertexShader: vertexShaderStr,
        fragmentShader: fragmentShaderStr,
        uniforms: {
            uTime: { value: 0.0 },
            lightIntensity: {value: 0.5}
        },

    });

    let geo = new THREE.PlaneBufferGeometry(20,10,20,10);
    let plane = new THREE.Mesh(geo, material);
    plane.rotation.x = -Math.PI / 2 -0.2;
    plane.position.y = -180;
    plane.position.z = 500;
    plane.scale.set(50,60,50)
    scene.add(plane);


    this.update = function() {
        material.uniforms.uTime.value = scene.clock.getElapsedTime()*0.5;
    }

    this.setTide = function(currentTide) {
        //FIXME;
    }

    this.setLight = function(intensity) {
        material.uniforms.lightIntensity.value = intensity;

    }


}


export function LightTideFlow(scene){
    let frontVertexShaderStr=`precision mediump float;
    varying vec2 vUv;
uniform float uTime;

void main() {
  vUv = uv;
  vec3 pos = position;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
`
    let frontFragmentShaderStr=`precision mediump float;
varying vec2 vUv;
uniform float iTime;
uniform float lightIntensity;
uniform float l1;
uniform float h1;
uniform float l2;
uniform float h2;

#define Use_Catmull_Rom

// The functions use the following format:

// v0----v1--x--v2----v3

// Where 'x' is the fractional diff betweeen v1 and v2.

//--------------------------------------------------------------------------------
//  1 out, 1 in...
#define HASHSCALE .1031
float Hash(float p)
{
	vec3 p3  = fract(vec3(p) * HASHSCALE);
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.x + p3.y) * p3.z);
}

//--------------------------------------------------------------------------------
float Cubic(float x, float v0,float v1, float v2,float v3)
{
	float p = (v3 - v2) - (v0 - v1);
	return p*(x*x*x) + ((v0 - v1) - p)*(x*x) + (v2 - v0)*x + v1;
}

//--------------------------------------------------------------------------------
float Catmull_Rom(float x, float v0,float v1, float v2,float v3)
{
	float c2 = -.5 * v0	+ 0.5*v2;
	float c3 = v0		+ -2.5*v1 + 2.0*v2 + -.5*v3;
	float c4 = -.5 * v0	+ 1.5*v1 + -1.5*v2 + 0.5*v3;
	return(((c4 * x + c3) * x + c2) * x + v1);


}

//--------------------------------------------------------------------------------
float ThirdOrderSpline(float x, float L1,float L0, float H0,float H1)
{
	return 		  L0 +.5 *
			x * ( H0-L1 +
			x * ( H0 + L0 * -2.0 +  L1 +
			x * ((H0 - L0)* 9.0	 + (L1 - H1)*3.0 +
			x * ((L0 - H0)* 15.0 + (H1 - L1)*5.0 +
			x * ((H0 - L0)* 6.0	 + (L1 - H1)*2.0 )))));
}

//--------------------------------------------------------------------------------
float Cosine(float x, float v0, float v1)
{
	x = (1.0-cos(x*3.1415927)) * .5;
	return (v1-v0)*x + v0;
}

//--------------------------------------------------------------------------------
float Linear(float x, float v0, float v1)
{
	return (v1-v0)*x + v0;
}

//--------------------------------------------------------------------------------
float Smoothstep(float x, float v0, float v1)
{
	x = x*x*(3.0-2.0*x);
	return (v1-v0)*x + v0;
}

//================================================================================
void main()
{
	vec2 uv = vUv;

	float pos = (iTime*.5+uv.x) * 4.0;
	float x  = fract(pos);
	float v0 = Hash(floor(pos));
	float v1 = Hash(floor(pos)+1.0);
	float v2 = Hash(floor(pos)+2.0);
	float v3 = Hash(floor(pos)+3.0);

	float f;

#ifdef Use_Linear
	f = Linear(x, v1, v2);
#elif defined Use_Cosine
	f = Cosine(x, v1, v2);
#elif defined Use_Smoothstep
	f = Smoothstep(x, v1, v2);
#elif defined Use_Cubic
	f = Cubic(x, v0, v1, v2, v3);
#elif defined Use_Catmull_Rom
	f = Catmull_Rom(x, v0, v1, v2, v3);
#elif defined Use_ThirdOrderSpline
	f = ThirdOrderSpline(x, v0, v1, v2, v3);
#endif

	// Blobs...
	f = .02 / abs(f-uv.y);
	float d = .03/length((vec2(((uv.x)/9.0*.25), uv.y)-vec2(x+.03, v1)) * vec2(.25,1.0));
	f = max(f, d*d);
	d = .03/length((vec2(((uv.x)/9.0*.25), uv.y)-vec2(x-.97, v2)) * vec2(.25,1.0));
	f = max(f, d*d)*1.4;

	gl_FragColor = vec4(vec3(.1,.4, .4)* f, 1.*f);
}`

 let material= new THREE.ShaderMaterial({
        vertexShader: frontVertexShaderStr,
        fragmentShader: frontFragmentShaderStr,
        uniforms: {
            iTime: { value: 0.0 },
            lightIntensity: {value: 0.5},
            h1: {value:  1.229 },
            l1: {value: -1.1439},
            h2: {value: -4.369 },
            l2: {value: 1.189},

        },
     transparent:true
    });

    let geo = new THREE.PlaneBufferGeometry(100,35,10,10);
    let plane = new THREE.Mesh(geo, material);
    plane.rotation.x = - Math.PI/20.;
    plane.position.y = -180;
    plane.position.z = 600;
    plane.scale.set(20,20,20)
   scene.add(plane);

    this.update = function() {
        //Uncommenting this the tide wave has movement
        material.uniforms.iTime.value = scene.clock.getElapsedTime()*0.2;
    }

}


//Tried curve/plane fixing point in curve
export function FrontTide(scene){
    let frontVertexShaderStr=`precision mediump float;
    varying vec2 vUv;
uniform float uTime;
uniform float h1;
uniform float h2;
uniform float l1;
uniform float l2;


float Cubic(float x, float v0,float v1, float v2,float v3)
{
	float p = (v3 - v2) - (v0 - v1);
	return p*(x*x*x) + ((v0 - v1) - p)*(x*x) + (v2 - v0)*x + v1;
}
float Catmull_Rom(float x, float v0,float v1, float v2,float v3)
{
	float c2 = -.5 * v0	+ 0.5*v2;
	float c3 = v0		+ -2.5*v1 + 2.0*v2 + -.5*v3;
	float c4 = -.5 * v0	+ 1.5*v1 + -1.5*v2 + 0.5*v3;
	return(((c4 * x + c3) * x + c2) * x + v1);
}

float Cosine(float x, float v0, float v1)
{
	x = (1.0-cos(x*3.1415927)) * .5;
	return (v1-v0)*x + v0;
}

//--------------------------------------------------------------------------------
float Linear(float x, float v0, float v1)
{
	return (v1-v0)*x + v0;
}

//--------------------------------------------------------------------------------
float Smoothstep(float x, float v0, float v1)
{
	x = x*x*(3.0-2.0*x);
	return (v1-v0)*x + v0;
}
//from https://www.shadertoy.com/view/WsdfW8
// Fits half of a sine wave between two points:
float curve(in vec2 p, in vec2 a, in vec2 b, in float thickness) {
    if (min(a.x, b.x) < p.x && p.x <= max(a.x, b.x)) {
        float sine = sin(((p.x - a.x) / (b.x - a.x) * 2.0 - 1.0) * 1.5707963267);
        float cy = a.y + (0.5 + 0.5 * sine) * (b.y - a.y);
        return smoothstep(thickness, 0.0, abs(p.y - cy));
    }

    return 0.0;
}

void main() {
  vUv = uv;
  vec3 pos = position;
/*
float delta=0.;
  if (uv.x <0.25){
  delta += Catmull_Rom(pos.x/length(pos),0.,l1/2.,l1, (l1+h1)/2.);
  }else if (uv.x <0.5){
  delta += Catmull_Rom(pos.x/length(pos),(l1+h1)/2.,h1,(h1+l2)/2.,l2);
  }else if (uv.x <0.75){
  delta += Catmull_Rom(pos.x/length(pos),l2,(h2+l2)/2.,h2, (h2+l2)/2.);
  }else {
  delta += Cosine(pos.x/length(pos),(h2+l2)/2.,0.);
  }*/
 pos.z = smoothstep(pos.x*0.1+uTime)*0.1 +delta * 4).;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);
}
`
    let frontFragmentShaderStr=`precision mediump float;
varying vec2 vUv;
uniform float uTime;
uniform float lightIntensity;

void main() {
 float r = sin(vUv.y*vUv.x);
float g = cos(uTime*0.2);
float b = cos(vUv.y*vUv.y);
vec3 color = vec3(r,g,b);
  gl_FragColor = vec4(vUv,0.,1.);
}`


    let material= new THREE.ShaderMaterial({
        vertexShader: frontVertexShaderStr,
        fragmentShader: frontFragmentShaderStr,
        uniforms: {
            uTime: { value: 0.0 },
            lightIntensity: {value: 0.5},
            h1: {value:  100.229 },
            l1: {value: -100.1439},
            h2: {value: -400.369 },
            l2: {value: 100.189},

        },
    });

    let geo = new THREE.PlaneBufferGeometry(100,100,100,100);
    let plane = new THREE.Mesh(geo, material);
    plane.rotation.x = -Math.PI / 2 ;
    plane.position.y = -180;
    plane.position.z = 500;
    plane.scale.set(30,30,30)
    scene.add(plane);

    this.update = function() {
        material.uniforms.uTime.value = scene.clock.getElapsedTime()*0.5;
    }

}


//TRIED: https://codepen.io/zadvorsky/pen/brporW
// not working because of Three.js version
//Maybe trying something like this:
//https://www.shadertoy.com/view/4djfW3
//2D spline curve
export function FrontTideFlow(scene){
    // create meshes
    var cubes;
    var geometry;
    var material;
    var debug;

    var config = {
        cubeCount: 400,
        duration: 6.0,
        totalDelay: 4.0
    }
    // lights

    var light;

    light = new THREE.DirectionalLight(0xff0000, 1);
    light.position.set(-1, 1, 1);
    scene.add(light);

    light = new THREE.DirectionalLight(0x0000ff, 1);
    light.position.set(1, 1, 1);
    scene.add(light);

    light = new THREE.PointLight(0x00ff00, 1, 200);
   // scene.add(light);

    // create meshes

    // dispose previous cubes
    dispose();

    // define the master spline

    var spline = [];
    var splineLenth = 8;

    var x, y, z, offsetScale;

    for (var i = 0; i < splineLenth; i++) {
        // spread x linearly from -1000 to 1000
        x = THREE.Math.mapLinear(i, 0, splineLenth - 1, -150, 150);
        // alternate y so the spline becomes wavy
        y = THREE.Math.randFloat(4, 32) * (i % 2 ? 1 : -1);
        z = THREE.Math.randFloatSpread(128);
        // the first and last point will have a offset scale of 0, the others will be randomized
        offsetScale = (i === 0 || i === splineLenth - 1) ? 0 : THREE.Math.randFloat(4, 32);

        spline.push(new THREE.Vector4(x, y, z, offsetScale));
    }


    // the master spline
    var curve = new THREE.CatmullRomCurve3(spline.map(function(p) {
        return new THREE.Vector3(p.x, p.y, p.z);
    }));
    curve.type = 'catmullrom';

    // create the geometry that will be repeated in the buffer geometry
    // I refer to this 'base' geometry as a prefab
    var cubeSize = 2.0;
    var prefab = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);

    // create the buffer geometry where a set number of prefabs are repeated
    // PrefabBufferGeometry offers some utility methods for working with such geometries
    console.log(prefab, config.cubeCount)
    var geometry = new THREE.BAS.PrefabBufferGeometry(prefab,400);

    // create a buffer for the offset, with an item size of 3 (x, y, z)
    var offsetBuffer = geometry.createAttribute('offset', 3);
    // create a buffer for rotation with 4 components per vertex
    var rotationBuffer = geometry.createAttribute('rotation', 4);
    // create a buffer for duration per prefab, with the item size of 1
    var durationBuffer = geometry.createAttribute('duration', 1);
    // create a buffer for start time per prefab, with the item size of 1
    var startTimeBuffer = geometry.createAttribute('startTime', 1);


    // populate the buffers
    var cubeIndex = 0;
    // reuse the same array each loop iteration
    var tmpa = [];
    var tmpv = new THREE.Vector3();

    for (var x = 0; x < config.cubeCount; x++) {

        tmpa[0] = THREE.Math.randFloatSpread(2);
        tmpa[1] = THREE.Math.randFloatSpread(2);
        tmpa[2] = THREE.Math.randFloatSpread(2);
        geometry.setPrefabData(offsetBuffer, cubeIndex, tmpa);

        // get a random axis
        THREE.BAS.Utils.randomAxis(tmpv);
        // store the x, y and z values in the array
        tmpv.toArray(tmpa);
        // set the rotation
        tmpa[3] = Math.PI*PI- 32;

        geometry.setPrefabData(rotationBuffer, cubeIndex, tmpa);

        // duration
        tmpa[0] = config.duration;
        geometry.setPrefabData(durationBuffer, cubeIndex, tmpa);

        // startTime (delay)
        tmpa[0] = (config.totalDelay / config.cubeCount) * cubeIndex;
        geometry.setPrefabData(startTimeBuffer, cubeIndex, tmpa);

        // increment the cubeIndex for the next iteration
        cubeIndex++;
    }

    console.log(spline, (spline.length - 1).toFixed(1));

    // create the animation material
    // it 'extends' THREE.MeshPhongMaterial by injecting arbitrary GLSL code at key places in the shader code
    material = new THREE.BAS.PhongAnimationMaterial({
        shading: THREE.FlatShading,
        // define a time uniform that will control the state of the animation
        // the uniform will be the same for each vertex
        uniforms: {
            time: {value: 0},
            spline: {value: spline},
            // smoothness changes how the path forms between points
            // crank it up to see how the curve changes (the LineHelper will not be updated)
            smoothness: {value: new THREE.Vector2(0.5, 0.5)}
        },
        // defines act as static, immutable values
        defines: {
            // we need integer representation of spline length
            SPLINE_LENGTH: spline.length,
            // we also need a max index float for the catmull-rom interpolation
            // adding .toFixed(1) will set value as {{length}}.0, which will identify it as a float
            SPLINE_MAX: (spline.length - 1).toFixed(1)
        },
        // add GLSL definitions for the uniform and the 4 attributes we defined on the geometry
        // the names and types must be the same as defined above
        vertexParameters: [
            'uniform float time;',
            // use the define to set the lenth of the array in GLSL
            'uniform vec4 spline[SPLINE_LENGTH];',
            'uniform vec2 smoothness;',

            'attribute vec3 offset;',
            'attribute vec4 rotation;',
            'attribute float startTime;',
            'attribute float duration;',
        ],
        // add definitions for functions to be used in the vertex shader
        vertexFunctions: [
            // catmull_rom_spline defines the catmullRomSpline and getCatmullRomSplineIndices functions used in the vertexPosition chunk
            // it also defines getCatmullRomSplineIndicesClosed, which is not used in this example
            THREE.BAS.ShaderChunk['catmull_rom_spline'],
            THREE.BAS.ShaderChunk['quaternion_rotation'],
            THREE.BAS.ShaderChunk['ease_quad_in_out'],
            THREE.BAS.ShaderChunk['lights_pars'],
        ],
        // add the GLSL animation update logic
        vertexPosition: [
            // progress is calculated based on the time uniform, and the duration and startTime attributes
            'float progress = clamp(time - startTime, 0.0, duration) / duration;',

            'progress = easeQuadInOut(progress);',

            // rotate the vertex
            'vec4 quat = quatFromAxisAngle(rotation.xyz, rotation.w * progress);',
            'transformed = rotateVector(quat, transformed);',

            // first we need get the progress relative to the max index of the spline (length - 1)
            'float pathProgress = progress * SPLINE_MAX;',
            // getCatmullRomSplineIndices returns an integer vector with 4 indices based on pathProgress
            'ivec4 indices = getCatmullRomSplineIndices(SPLINE_MAX, pathProgress);',
            // use these indices to get the four points that will influence the position
            'vec4 p0 = spline[indices[0]];', // max(0, floor(pathProgress) - 1)
            'vec4 p1 = spline[indices[1]];', // floor(pathProgress)
            'vec4 p2 = spline[indices[2]];', // min(length, floor(pathProgress) + 1)
            'vec4 p3 = spline[indices[3]];', // min(length, floor(pathProgress) + 2)

            // we only care about the fractal part of the pathProgress float (what comes after the .)
            'float pathProgressFract = fract(pathProgress);',

            // get the offset scale by using catmull-rom interpolation on the fourth component of the vector (w)
            'transformed += offset * catmullRomSpline(p0.w, p1.w, p2.w, p3.w, pathProgressFract);',

            // then add the 'master' spline position
            'transformed += catmullRomSpline(p0.xyz, p1.xyz, p2.xyz, p3.xyz, pathProgressFract, smoothness);'
        ]
    });

    // once the geometry and metrials are defined we can use them to create one single mesh, and add it to the scene
    cubes = new THREE.Mesh(geometry, material);
    scene.add(cubes);


    function dispose() {
        cubes && scene.remove(cubes);

        geometry && geometry.dispose();
        material && material.dispose();
    }


    // loop

    this.stats = new Stats();
    document.body.appendChild(this.stats.dom);


    this.update=function() {
        if (!cubes) return;
        // increment global time
        cubes.material.uniforms.time.value += 1/60;
        // reset time when it exceeds the total duration
        cubes.material.uniforms.time.value %= (config.duration + config.totalDelay);
    }
    // helpers
    function PointHelper(color, size, position) {
       /* THREE.Mesh.call(this,
                        new THREE.SphereGeometry(size || 1.0, 8, 8),
                        new THREE.MeshBasicMaterial({
                            color: color || 0xff0000,
                            wireframe: true,
                            depthWrite: false,
                            depthTest: false
                        })
                       );

        position && this.position.copy(position);
        */
        }
    PointHelper.prototype = Object.create(THREE.Mesh.prototype);
    PointHelper.prototype.constructor = PointHelper;

    function LineHelper(points, params) {
        var g = new THREE.Geometry();
        var m = new THREE.LineBasicMaterial(params);

        g.vertices = points;

//        THREE.Line.call(this, g, m);
    }
}

