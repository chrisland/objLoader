
var container;

var camera, scene, renderer;

var mouseX = 0, mouseY = 0;

var windowHalfX = 0;
var windowHalfY = 0;




document.getElementById('start').addEventListener('click', function (e) {

  var param = {
    model: false,
    texture: false,
    ambientLight: '101030',
    directionalLight: 'ffeedd'
  };

  var model = document.getElementById('file_model');
  var texture = document.getElementById('file_texture');
  var color_a = document.getElementById('color_ambient');
  var color_d = document.getElementById('color_directional');

  if (model.files && model.files[0] && model.files[0].path) {
    param.model = model.files[0].path;
  } else {
    return false;
  }
  if (texture.files && texture.files[0] && texture.files[0].path) {
    param.texture = texture.files[0].path;
  }
  if (color_a.value) {
    param.ambientLight = color_a.value;
  }
  if (color_d.value) {
    param.directionalLight = color_d.value;
  }

  init(param);

});


function init(data) {

  var info = document.getElementById('info');
  info.innerHTML = '';

  var neu = document.createElement('div');
  neu.innerHTML =  'Start...';
  info.appendChild(neu);

	//container = document.createElement( 'div' );
  container = document.getElementById('render');
  container.innerHTML = '';
	//document.body.appendChild( container );

	camera = new THREE.PerspectiveCamera( 45, container.offsetWidth / container.offsetHeight, 1, 2000 );
	camera.position.z = 250;

	// scene

	scene = new THREE.Scene();

	var ambient = new THREE.AmbientLight( '#'+data.ambientLight );
	scene.add( ambient );

	var directionalLight = new THREE.DirectionalLight( '#'+data.directionalLight );
	directionalLight.position.set( 0, 0, 1 );
	scene.add( directionalLight );

	// texture

	var manager = new THREE.LoadingManager();
	manager.onProgress = function ( item, loaded, total ) {

		console.log( item, loaded, total );

    var neu = document.createElement('div');
    neu.innerHTML =  item;
    info.appendChild(neu);

    if (loaded) {
      var neu = document.createElement('div');
      neu.innerHTML =  'Obj loaded';
      info.appendChild(neu);
    }

    if (total) {
      var neu = document.createElement('div');
      neu.innerHTML =  '... total!';
      info.appendChild(neu);
    }



	};

	var texture = new THREE.Texture();

	var onProgress = function ( xhr ) {
		if ( xhr.lengthComputable ) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log( Math.round(percentComplete, 2) + '% downloaded' );
      var neu = document.createElement('div');
      neu.innerHTML =  Math.round(percentComplete, 2) + '% downloaded';
      info.appendChild(neu);
		}
	};

	var onError = function ( xhr ) {
	};

  if (data.texture) {

  	var loader = new THREE.ImageLoader( manager );
  	loader.load( data.texture , function ( image ) {

  		texture.image = image;
  		texture.needsUpdate = true;

  	} );

  }
	// model

	var loader = new THREE.OBJLoader( manager );
	loader.load( data.model, function ( object ) {

		object.traverse( function ( child ) {

			if ( child instanceof THREE.Mesh ) {

				child.material.map = texture;

			}

		} );

		object.position.y = - 95;
		scene.add( object );

	}, onProgress, onError );

	//

	renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( container.offsetWidth, container.offsetHeight );
	container.appendChild( renderer.domElement );

  windowHalfX = container.offsetWidth / 2;
	windowHalfY = container.offsetHeight / 2;

	container.addEventListener( 'mousemove', onDocumentMouseMove, false );

	//

	window.addEventListener( 'resize', onWindowResize, false );


  animate();

}

function onWindowResize() {

	windowHalfX = container.offsetWidth / 2;
	windowHalfY = container.offsetHeight / 2;

	camera.aspect = container.offsetWidth / container.offsetHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( container.offsetWidth, container.offsetHeight );

}

function onDocumentMouseMove( event ) {

	mouseX = ( event.clientX - windowHalfX ) / 2;
	mouseY = ( event.clientY - windowHalfY ) / 2;

}

//

function animate() {

	requestAnimationFrame( animate );
	render();

}

function render() {

	camera.position.x += ( mouseX - camera.position.x ) * .05;
	camera.position.y += ( - mouseY - camera.position.y ) * .05;

	camera.lookAt( scene.position );

	renderer.render( scene, camera );

}
