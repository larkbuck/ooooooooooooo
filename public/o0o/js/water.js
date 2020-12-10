AFRAME.registerComponent('wobble-normal', {
	schema: {},
	tick: function (t) {
		if (!this.el.components.material.material.normalMap) return;
		this.el.components.material.material.normalMap.offset.x += 0.0001 * Math.sin(t/10000);
		this.el.components.material.material.normalMap.offset.y += 0.0001 * Math.cos(t/8000);
		this.el.components.material.material.normalScale.x = 0.5 + 0.5 * Math.cos(t/1000);
		this.el.components.material.material.normalScale.x = 0.5 + 0.5 * Math.sin(t/1200);
	}
})

AFRAME.registerPrimitive('a-ocean-plane', {
	defaultComponents: {
		geometry: {
			primitive: 'plane',
			height: 5000,
			width: 5000
		},
		rotation: '-90 0 0',
		material: {
			shader: 'standard',
			color: '#8ab39f',
			metalness: 1,
			roughness: 0.2,
normalMap: "src: url(assets/waternormals.jpg)",
			normalTextureRepeat: '50 50',
			normalTextureOffset: '0 0',
			normalScale: '0.5 0.5',
			opacity: 0.7,
		},
		'wobble-normal': {}
	},
});


AFRAME.registerPrimitive('a-moon', {
	defaultComponents: {
		geometry: {
			primitive: 'plane',
			height: 5000,
			width: 5000
		},
		rotation: '-90 0 0',
		material: {
			shader: 'standard',
			color: '#8ab39f',
			metalness: 0,
			roughness: 0,
			normalMap: "src: url(assets/moon-texture.jpg)",
			// normalTextureRepeat: '50 50',
			// normalTextureOffset: '0 0',
			// normalScale: '0.5 0.5',
			opacity: 1
		},
	},
});
