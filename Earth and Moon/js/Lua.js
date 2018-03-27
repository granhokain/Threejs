var scene;
var camera;
var earthMesh;
var moonMesh;
var renderer;
var cloudMesh;
var starMesh;
var r = 35;
var theta = 0;
var dTheta = 2 * Math.PI / 1000;

var init = function() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    
    this.createASphere();
    this.createDirectionalLight();
    this.createAmbientLight();

    camera.position.x = 25;
    camera.position.y = 10;
    camera.position.z = 60;
    camera.lookAt(scene.position);
    
    document.body.appendChild( renderer.domElement );

    this.render();

};

var render = function() {
    earthMesh.rotation.y += 0.001;
    cloudMesh.rotation.y += 0.001*1.1;
    moonMesh.rotation.y += 0.001;
    requestAnimationFrame( render );
    renderer.render( scene, camera );
    theta += dTheta;
    moonMesh.position.x = r * Math.cos(theta);
    moonMesh.position.z = r * Math.sin(theta);
};

var createASphere = function() {
    var sphereGeometry = new THREE.SphereGeometry(15, 60, 60);
    var sphereMaterial = this.createEarthMaterial();
    earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
    earthMesh.name = 'earth';
    scene.add(earthMesh);
    
    var cloudGeometry = new THREE.SphereGeometry(15.2, 60, 60);
    var cloudMaterial = this.createCloudMaterial();
    cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.name = 'clouds';
    scene.add(cloudMesh);
    
    var moonGeometry = new THREE.SphereGeometry(4,50,50);
    var moonMaterial = this.createMoonMaterial();
    moonMesh = new THREE.Mesh(moonGeometry, moonMaterial);
    moonMesh.name = 'moon';
    scene.add(moonMesh);
    

};

var createEarthMaterial = function() {
    var earthTexture = new THREE.TextureLoader().load("images/earthmap4k.jpg");
    var normalMap = new THREE.TextureLoader().load("images/earth_normalmap_flat4k.jpg");
    var specularMap = new THREE.TextureLoader().load("images/earthspec4k.jpg");

    var earthMaterial = new THREE.MeshPhongMaterial();

    earthMaterial.map = earthTexture;
    earthMaterial.normalMap = normalMap;
    earthMaterial.normalScale.set(0.5, 0.7);
    earthMaterial.specularMap = specularMap;
    earthMaterial.specular = new THREE.Color(0x262626);

    return earthMaterial;

};

var createMoonMaterial = function() {
    var moonTexture = new THREE.TextureLoader().load("images/moonmap4k.jpg");
    var moonMaterial = new THREE.MeshPhongMaterial();
    moonMaterial.map = moonTexture;
    return moonMaterial;
};

var createCloudMaterial = function() {
    var cloudTexture = new THREE.TextureLoader().load("images/fair_clouds_4k.png");
    var cloudMaterial = new THREE.MeshPhongMaterial();
    cloudMaterial.map = cloudTexture;
    
    cloudMaterial.transparent = true;
    
    return cloudMaterial;
};


var createDirectionalLight = function() {
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(100,10,-50);
    directionalLight.name='directional';
    scene.add(directionalLight);
};

var createAmbientLight = function() {
    var ambientLight = new THREE.AmbientLight(0x111111);
    ambientLight.name='ambient';
    scene.add(ambientLight);
};

window.onload = this.init;
