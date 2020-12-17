// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ TIDE  ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
export function Tide(scene) {

    let TideConf = {
        lightIntensity: 0.9,
        velocity: 1
    };
    let vertexShaderStr=`precision mediump float;
varying vec2 vUv;
varying vec3 vNormal;
uniform float uTime;

uniform float l1;
uniform float h1;
uniform float l2;
uniform float h2;

float wave(float time, float freq, float amp) {
  float angle = (time+position.y)*freq;
  return sin(angle)*amp;
}
float waveNorm(float time, float freq, float amp) {
  float angle = (time+position.y)*freq;
  return -amp * freq * cos(angle);
}

void main(){
vUv = uv;
vec3 pos = position - vec3(0.5);
float dx = position.x; float dy = position.y;
float freq = sqrt(dx*dx + dy*dy);

float mid= (uv.x < .5 ? 0. : 1.);
float quarter = ( abs(.5-uv.x ) < .25 ? 0. :1.);

float angle = -uTime*20.0+freq*.5;

float noisePos = 20.*pos.x+0.1*angle;
float old = pos.z;

float tideVal;
float fq=(1.- mid) * quarter;
float sq=(1.- mid) * (1.-quarter);
float tq= mid * (1.-quarter);
float ffq=mid * quarter;

tideVal  = h1 *fq + l1 *sq + h2 * tq + l2*ffq;

float amp = (0.2+tideVal*0.2)*fq+(0.1+tideVal*0.2)*sq+tq*(0.4+tideVal*0.2)+ffq*(0.05+tideVal*0.2);

pos.z += amp*sin(noisePos)*sin(pos.y*200.+angle*0.1)-0.1*sin(pos.y*30.);
//pos.z += smoothstep(old,tideVal*0.3+pos.z,pos.z)*0.3;

vec3 objectNormal = normalize(vec3(0.0,-amp * freq * cos(angle),1.0));
vNormal = normalMatrix * objectNormal;
gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.);

}`

    let fragmentShaderStr=`precision mediump float;
varying vec2 vUv;
uniform float uTime;
uniform float lightIntensity;

void main() {
 float r = sin(vUv.y*vUv.x);
float g = cos(uTime*0.5+vUv.y);
float b = cos(vUv.y*vUv.y)*0.8;
vec2 uv = vUv*2.-1.;
vec3 lines =vec3(sin(uv.y*200.))/.1;//Currently not using
vec3 color = mix(vec3(r,g,b)/vec3(1./1.8), lines, 0.);
 float light = 1.5-length(vUv*2.-vec2(1.));
  gl_FragColor = vec4(color, 1.)*vec4(light/1.8)*(lightIntensity+0.01);
}`

    let material = new THREE.ShaderMaterial({
        vertexShader: vertexShaderStr,
        fragmentShader: fragmentShaderStr,
        uniforms: {
            uTime: { value: 0.0 },
            lightIntensity: {value: 0.5},
            h1: {value:  1.229 },
            l1: {value: -1.1439},
            h2: {value: -4.369 },
            l2: {value: 1.189},
        },

    });

    let geo = new THREE.PlaneBufferGeometry(20,20,20,20);
    let plane = new THREE.Mesh(geo, material);
    plane.rotation.x = -Math.PI / 2 -0.2;
    plane.position.y = -180;
    plane.position.z = 500;
    plane.scale.set(50,50,50)
    scene.add(plane);


    this.update = function() {
        material.uniforms.uTime.value = scene.clock.getElapsedTime()*0.5;
    }
    this.setTide = function(currentTide) {
        material.uniforms.h1.value = currentTide.h1;
        material.uniforms.h2.value = currentTide.h2;
        material.uniforms.l1.value = currentTide.l1;
        material.uniforms.l2.value = currentTide.l2;

    }

    this.setLight = function(intensity) {
        material.uniforms.lightIntensity.value = intensity;

    }


}
