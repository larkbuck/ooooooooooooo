export function Sky(scene){
    scene.background = new THREE.Color(0x00000);
    const newS = new THREE.Color(0x00000);
    const fullS = new THREE.Color(0x060bb0);

    this.setLight = function(intensity){
        scene.background.copy(newS).lerp(fullS,intensity);
    }

    this.update = function(){
        //Not updating for now
    };

}
