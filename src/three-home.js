import * as THREE from '../src/three.module.js';

		

		var container
		var camera, scene, renderer, mesh
		var instances = 5000;
		var lastTime = 0;

		var moveQ = new THREE.Quaternion( 0.5, 0.5, 0.5, 0.0 ).normalize();
		var tmpQ = new THREE.Quaternion();
		var tmpM = new THREE.Matrix4();
		var currentM = new THREE.Matrix4();

		
		init();
		animate();

		function init() {

			container = document.getElementById( 'container' );

			camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 1, 1000 );

		


			scene = new THREE.Scene();
			scene.background = new THREE.Color(  'black' );

			// geometry

			var geometry = new THREE.InstancedBufferGeometry();


			
			// per mesh data x,y,z,w,u,v,s,t for 4-element alignment
			// only use x,y,z and u,v; but x, y, z, nx, ny, nz, u, v would be a good layout
			var vertexBuffer = new THREE.InterleavedBuffer( new Float32Array( [
				// Front
				- 1, 1, 1, 0, 0, 0, 0, 0,
				1, 1, 1, 0, 1, 0, 0, 0,
				- 1, - 1, 1, 0, 0, 1, 0, 0,
				1, - 1, 1, 0, 1, 1, 0, 0,
				// Back
				1, 1, - 1, 0, 1, 0, 0, 0,
				- 1, 1, - 1, 0, 0, 0, 0, 0,
				1, - 1, - 1, 0, 1, 1, 0, 0,
				- 1, - 1, - 1, 0, 0, 1, 0, 0,
				// Left
				- 1, 1, - 1, 0, 1, 1, 0, 0,
				- 1, 1, 1, 0, 1, 0, 0, 0,
				- 1, - 1, - 1, 0, 0, 1, 0, 0,
				- 1, - 1, 1, 0, 0, 0, 0, 0,
				// Right
				1, 1, 1, 0, 1, 0, 0, 0,
				1, 1, - 1, 0, 1, 1, 0, 0,
				1, - 1, 1, 0, 0, 0, 0, 0,
				1, - 1, - 1, 0, 0, 1, 0, 0,
				// Top
				- 1, 1, 1, 0, 0, 0, 0, 0,
				1, 1, 1, 0, 1, 0, 0, 0,
				- 1, 1, - 1, 0, 0, 1, 0, 0,
				1, 1, - 1, 0, 1, 1, 0, 0,
				// Bottom
				1, - 1, 1, 0, 1, 0, 0, 0,
				- 1, - 1, 1, 0, 0, 0, 0, 0,
				1, - 1, - 1, 0, 1, 1, 0, 0,
				- 1, - 1, - 1, 0, 0, 1, 0, 0
			] ), 8 );

			// Use vertexBuffer, starting at offset 0, 3 items in position attribute
			var positions = new THREE.InterleavedBufferAttribute( vertexBuffer, 3, 0 );
			geometry.setAttribute( 'position', positions );
			// Use vertexBuffer, starting at offset 4, 2 items in uv attribute
			var uvs = new THREE.InterleavedBufferAttribute( vertexBuffer, 2, 4 );
			geometry.setAttribute( 'uv', uvs );

			var indices = new Uint16Array( [
				0, 2, 1,
				2, 3, 1,
				4, 6, 5,
				6, 7, 5,
				8, 10, 9,
				10, 11, 9,
				12, 14, 13,
				14, 15, 13,
				16, 17, 18,
				18, 17, 19,
				20, 21, 22,
				22, 21, 23
			] );

			geometry.setIndex( new THREE.BufferAttribute( indices, 1 ) );

			// material

			var material = new THREE.MeshBasicMaterial();
			material.map = new THREE.TextureLoader().load( 'data:image/png;base64,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' );

			// per instance data

			var matrix = new THREE.Matrix4();
			var offset = new THREE.Vector3();
			var orientation = new THREE.Quaternion();
			var scale = new THREE.Vector3( 1, 1, 1 );
			var x, y, z, w;

			mesh = new THREE.InstancedMesh( geometry, material, instances );

			for ( var i = 0; i < instances; i ++ ) {

				// offsets

				x = Math.random() * 100 - 50;
				y = Math.random() * 100 - 50;
				z = Math.random() * 100 - 50;

				offset.set( x, y, z ).normalize();
				offset.multiplyScalar( 5 ); // move out at least 5 units from center in current direction
				offset.set( x + offset.x, y + offset.y, z + offset.z );

				// orientations

				x = Math.random() * 2 - 1;
				y = Math.random() * 2 - 1;
				z = Math.random() * 2 - 1;
				w = Math.random() * 2 - 1;

				orientation.set( x, y, z, w ).normalize();

				matrix.compose( offset, orientation, scale );

				mesh.setMatrixAt( i, matrix );

			}
			
			

			scene.add( mesh );

			

	
			
	

			renderer = new THREE.WebGLRenderer();
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize( window.innerWidth, window.innerHeight );
			container.appendChild( renderer.domElement );

			if ( renderer.extensions.get( 'ANGLE_instanced_arrays' ) === null ) {

				document.getElementById( 'notSupported' ).style.display = '';
				return;

			}

			

			window.addEventListener( 'resize', onWindowResize, false );

		}

		function onWindowResize() {

			camera.aspect = window.innerWidth / window.innerHeight;
			camera.updateProjectionMatrix();

			renderer.setSize( window.innerWidth, window.innerHeight );

		}

		//

		function animate() {

			requestAnimationFrame( animate );

			render();
			

		}

		function render() {

			
			var time = performance.now();

			mesh.rotation.y = time * 0.00005;

			var delta = ( time - lastTime ) / 5000;
			tmpQ.set( moveQ.x * delta, moveQ.y * delta, moveQ.z * delta, 1 ).normalize();
			tmpM.makeRotationFromQuaternion( tmpQ );

			for ( var i = 0, il = instances; i < il; i ++ ) {

				mesh.getMatrixAt( i, currentM );
				currentM.multiply( tmpM );
				mesh.setMatrixAt( i, currentM );

			}

			mesh.instanceMatrix.needsUpdate = true;

			lastTime = time;

			renderer.render( scene, camera );

		}

