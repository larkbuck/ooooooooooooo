AFRAME.registerComponent('octahedron', {
  schema: {
    bar: {
      type: 'number'
    }, // To declare your own attribute that can be customized when entity created
    color: {
      default: '#bbbfff'
    },
  },

  init: function() {
    // Do something when component first attached.
  },

  update: function() {
    var material = new THREE.MeshPhongMaterial({
      color: this.data.color,
      wireframe: false,
      shininess: 150,
      specular: 0xffffff
    });

    // const radius = 1;
    // const geometry = new THREE.DodecahedronBufferGeometry(radius);
    // var geometry = new THREE.BoxGeometry(2, 2, 2);

    const radius = 7;
    const geometry = new THREE.OctahedronBufferGeometry(radius);

    this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
  },

  tick: function(time, timeDelta) {
    // Do something on every scene tick or frame.
  },

  remove: function() {
    this.el.removeObject3D('mesh');
  }
});



AFRAME.registerComponent('curves', {
  schema: {
    bar: {
      type: 'number'
    }, // To declare your own attribute that can be customized when entity created
    color: {
      default: '#00ff00'
    },
  },

  init: function() {
    // Do something when component first attached.
  },

  update: function() {
    const outline = new THREE.Shape([
      [-2, -0.1],
      [2, -0.1],
      [2, 0.6],
      [1.6, 0.6],
      [1.6, 0.1],
      [-2, 0.1],
    ].map(p => new THREE.Vector2(...p)));

    const x = -2.5;
    const y = -5;
    const shape = new THREE.CurvePath();
    const points = [
      [x + 2.5, y + 2.5],
      [x + 2.5, y + 2.5],
      [x + 2, y],
      [x, y],
      [x - 3, y],
      [x - 3, y + 3.5],
      [x - 3, y + 3.5],
      [x - 3, y + 5.5],
      [x - 1.5, y + 7.7],
      [x + 2.5, y + 9.5],
      [x + 6, y + 7.7],
      [x + 8, y + 4.5],
      [x + 8, y + 3.5],
      [x + 8, y + 3.5],
      [x + 8, y],
      [x + 5, y],
      [x + 3.5, y],
      [x + 2.5, y + 2.5],
      [x + 2.5, y + 2.5],
    ].map(p => new THREE.Vector3(...p, 0));
    for (let i = 0; i < points.length; i += 3) {
      shape.add(new THREE.CubicBezierCurve3(...points.slice(i, i + 4)));
    }
    const extrudeSettings = {
      steps: 50,
      bevelEnabled: false,
      extrudePath: shape,
    };

    const geometry = new
    THREE.ExtrudeBufferGeometry(outline, extrudeSettings);

    this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
  },

  tick: function(time, timeDelta) {
    // Do something on every scene tick or frame.
  },

  remove: function() {
    this.el.removeObject3D('mesh');
  }
});







// AFRAME.registerComponent('octahedron', {
//   schema: {
//      bar: {type: 'number'}, // To declare your own attribute that can be customized when entity created
//     color: {
//       default: '#00ff00'
//     },
//   },
//
//   init: function() {
//     // Do something when component first attached.
//   },
//
//   update: function() {
//     var material = new THREE.MeshBasicMaterial({
//       color: this.data.color,
//       wireframe: true
//     });
//
//     var geometry = new THREE.BoxGeometry(19, 19, 19);
//
//     this.el.setObject3D('mesh', new THREE.Mesh(geometry, material));
//   },
//
//   tick: function(time, timeDelta) {
//     // Do something on every scene tick or frame.
//   },
//
//   remove: function() {
//     this.el.removeObject3D('mesh');
//   }
// });
