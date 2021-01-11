// ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤ INFORMATION TRIANGLE ├┬┴┬┴┬┴┤•ᴥ•ʔ├┬┴┬┴┬┴┬┤
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i) || navigator.userAgent.match(/WPDesktop/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};


export function Button(scene, x1, x2, y, delta, invert = false,path="button") {
    let loader  = new THREE.TextureLoader()
    let texture = loader.load('/assets-main/images/'+path+'.png');
    texture.minFilter = THREE.LinearFilter;

  const button = new THREE.Geometry();
  (invert ?
    button.vertices.push(
      new THREE.Vector3(x1, y - delta, 0),
      new THREE.Vector3(x1, y + delta, 0),
      new THREE.Vector3(x2, y, 0)

    ) :
    button.vertices.push(
      new THREE.Vector3(x1, y - delta, 0),
      new THREE.Vector3(x2, y, 0),
      new THREE.Vector3(x1, y + delta, 0),
    ))

  button.faces.push(new THREE.Face3(0, 1, 2));

    var meshButton = new THREE.Mesh(button,  new THREE.MeshBasicMaterial({
        wireframe:true,
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


export function Text(scene, x, y, width,height,fontSize,fontSizeC) {
    var canvas = document.createElement('canvas');
    canvas.height = height;
    var scaleFactorM=0.1;
    var scaleFactorT=-0.02;
    var f = 1.8;

  var context = canvas.getContext('2d');
    if (isMobile.any()) {
        scaleFactorM = 0.9
        scaleFactorT = 0.5
        fontSize = fontSizeC
        f = 1.5
    }

    this.generateMoon = function(){
        context.clearRect(0, 0, canvas.width, canvas.height);
        let l1,l2,l3,l4,l5,l6;
        l1=`    .°:*・°☆     `
        l2=`  ☆.☆.:.:°☆  `
        l3=` °☆.。.::*・°☆ `
        l4=` °☆. .:...・°☆ `
        l5=`  °☆.。.:* °☆  `
        l6=`    °☆.。*☆    `

        context.font = " Bold "+fontSize+"px Courier";
        context.fillStyle = "#FFFFFF";
        context.maxHeight= height;

        context.fillText(l1, width * scaleFactorM,f* height * 0.140);
        context.fillText(l2, width * scaleFactorM,f* height * 0.1975);
        context.fillText(l3, width * scaleFactorM,f* height * 0.275625);
        context.fillText(l4, width * scaleFactorM,f* height * 0.3537);
        context.fillText(l5, width * scaleFactorM,f* height * 0.431);
        context.fillText(l6, width * scaleFactorM,f* height * 0.4875);

        texture.needsUpdate = true;
    }

  this.generateText = function(text) {
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.font = "Bold "+fontSize+"px Courier";
      context.fillStyle = "#FFFFFF";
      context.maxWidth = width;
      context.maxHeight= width;
      context.fillText(text,scaleFactorT*width, 0.42*width);
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

export function Triangle(scene,width,height) {
    const geometry = new THREE.Geometry();
    let scaleX = .6;
    let scaleY = .53;
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

    let w = width;
    let h = height;
    let fontSize = w*0.0625, fontSizeC = w*0.0875;

    // lark - change new and full moon text to HTML here
    // const dateText = new Text(scene, w * 0.01, h * 0.2, w*0.35, w*0.3,fontSize, fontSizeC);
    const fullmoonText = new Text(scene,  w*0.02, h*0.07 ,  w*0.35, w*0.3,w*0.03);
    const quarterTextHelper =new Text(scene, w * 0.03, -h*0.095, w*0.35, w*0.3,fontSize, fontSizeC);
    const hourText = new Text(scene, w * 0.03, -h * 0.18, w*0.28, w*0.3,fontSize, fontSizeC);


    this.setDate = function(newText) {
      dateText.update(newText);
    }

    this.setFullMoonText = function(hour){
        fullmoonText.generateMoon();
       this.setQuarterText(2);
       hourText.update(` `+hour);
    }

    this.setNewMoonText = function(hour){
        quarterTextHelper.clear();
        this.setQuarterText(0);
        hourText.update(hour);
    }

    this.clear = function(){
       dateText.clear();
       fullmoonText.clear();
       quarterTextHelper.clear();
       hourText.clear();
    }

    this.setQuarterText = function(quarter){
        let quarterTexts = [
            `.*･｡ﾟ🌑 `,
            ` .*･🌓｡ﾟ`,
            ` ﾟ*.🌕.*.`,
            ` .🌗｡ﾟ.*`,
        ]

        quarterTextHelper.update(quarterTexts[quarter])
    }

}
