/**
* The 3d box shot rendering script.
* Ronen Ness, 2016
*/

if (!window.WebGLRenderingContext) {
	alert ("This tool requires WebGL support to run!\nPlease use a newer browser with WebGL (recommended: Chrome or FireFox).");
}

// create renderer and append to container
var container = $("#canvas-container");
var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, preserveDrawingBuffer: true });
container.append(renderer.domElement);

// create scene and camera
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, container.width() / container.height(), 1, 10000);
camera.position.set(-1000, 540, 780);
scene.add(camera);

// handle resize + initial renderer init
$(document ).ready(onResize);
$(window).resize(onResize);
function onResize()
{
	renderer.setSize(container.width(), container.height());
    camera.aspect = container.width() / container.height();
    camera.updateProjectionMatrix();
}

// update camera fov
function updateCameraFov(fov)
{
    camera.fov = parseInt(fov);
    camera.updateProjectionMatrix();
}

// create an orbit controller
var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.dampingFactor = 0.25;
controls.enableZoom = true;

// create texture loader
var loader = new THREE.TextureLoader();

// add ambient light
var ambient_light = new THREE.AmbientLight( 0xD6D6D6 );
scene.add( ambient_light );

// set ambient light
function setAmbientLight(val)
{
	ambient_light.color = new THREE.Color(val);
}

// directional light
var directional_light = new THREE.DirectionalLight( 0xffffff, 0.5 );
directional_light.position.set( 0.5, 0, 1 );
scene.add( directional_light );

// set directional color
function setDirectionalLight(val)
{
	directional_light.color = new THREE.Color(val);
}

// set point light
var point_light;
function setPointLight(position, color, intensity)
{
	if (point_light) {camera.remove(point_light);}
	point_light = new THREE.PointLight( color, intensity, 4500 );
	point_light.position.set( position.x, position.y, position.z );
	camera.add( point_light );
}
setPointLight({x: 100, y: 100, z: 100}, 0x0, 1);

// will contain the box mesh
var box_mesh;

// list with all resources that need to be disposed of
var resources = [];
				
// store all textures
var textures = {};
				
// get the texture for one of the box's sides.
// type is a a string: front / back / left / right / top
function getTexture(type)
{	
	// create the texture from image
	var img = product_texture_images["texture-" + type];
	texture = loader.load(img.src);
	
	// set no mipmaps and filters
	texture.generateMipmaps = false;
	texture.anisotropy = renderer.getMaxAnisotropy();
	texture.magFilter = THREE.LinearFilter;
	texture.minFilter = THREE.LinearFilter;
	
	// add to resources and return
	resources.push(texture);
	return texture;
}

// create and return material for a certain face of the box
// type is a a string: front / back / left / right / top
function getMaterial(type)
{
	var ret = new THREE.MeshPhongMaterial({
           map: getTexture(type),
		   specular: $("#specular-color")[0].jscolor.toHEXString(), 
		   shininess: parseFloat($("#material-shine").val()),
       });
	resources.push(ret);
	return ret;
}

// generate the 3d box
function renderProductBox()
{
	// if had previous mesh get rid of it first
	if (box_mesh) {clearProductBox();}
	
	// create geometry
	var w = parseInt($("#size-x").val());
	var h = parseInt($("#size-y").val());
	var d = parseInt($("#size-z").val());
	var geometry = new THREE.BoxGeometry(w, h, d, 10, 10, 10);
	resources.push(geometry);
	
	// create materials
	var materials = [
       getMaterial("right"),
       getMaterial("left"),
       getMaterial("top"),
       getMaterial("top"),
       getMaterial("front"),
       getMaterial("back")
    ];
	var material = new THREE.MeshFaceMaterial( materials );
	resources.push(material);
	
	// create the mesh and add to scene
	box_mesh = new THREE.Mesh(geometry, material);
	resources.push(box_mesh);
	scene.add(box_mesh);
}

// try to make first render in a loop until success.
// this is to wait until everything is loaded, init etc.
function tryRenderProduct()
{
	try
	{
		renderProductBox();
	}
	catch (e)
	{
		setTimeout(tryRenderProduct, 100);
	}
}
tryRenderProduct();

// remove previous box before re-rendering it
function clearProductBox()
{
	scene.remove(box_mesh);
	for (var i = 0; i < resources.length; ++i)
	{
		var curr = resources[i];
		if (curr.dispose) {curr.dispose();}
	}
	resources = [];
}

// set rendering background
var back_color;
function setBackground(color)
{
	back_color = color;
	$(renderer.domElement).css("background", back_color);
	renderer.setClearColor(back_color, back_color == "none" ? 0 : 1);
}
var default_background = "#9999aa"
setBackground(default_background);

// to make sure we have requestAnimationFrame function (not fully supported)
requestAnimationFrame = requestAnimationFrame || function(callback) {setTimeout(callback, 1000/60);};

// render canvas!
function toImage()
{
	var width = parseInt(document.getElementById("result-img-size-x").value);
	var height = width * 1000 / 1400;
	renderer.setSize(width,height);
	render();
	var canvas = renderer.domElement;
	var img_data = canvas.toDataURL("image/png");
	document.getElementById('result-img-div').style.display = "block";
	document.getElementById('result-img').src = img_data;
	document.getElementById('save-img-link').href = img_data;
	onResize();
	render();
}

// render scene loop
function render() {
	
	// set directional light position to source from camera
	if (!isDirectionalLightLocked())
	{
		var dir_pos = camera.position.clone().normalize();
		directional_light.position.set(dir_pos.x, dir_pos.y, dir_pos.z);
	}
	
	// request next frame and render
	requestAnimationFrame(render);
	renderer.render(scene, camera);
}
render();