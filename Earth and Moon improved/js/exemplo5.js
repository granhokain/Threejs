/*global THREE*/

var scene;
var sceneBackground;
var camera;
var cameraBackground;

var renderer;
var composer;

var controls;

var earthMesh;
var moonMesh;
var cloudMesh;
var sunMesh;
var marsMesh;

var mesh;

var particleSystem;

var r = 45;
var theta = 0;
var dTheta = 2 * Math.PI / 1000;

var createASphereEarth = function() {
    var sphereGeometry = new THREE.SphereGeometry(25, 70, 70);
    var sphereMaterial = this.createEarthMaterial();

    earthMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);

    earthMesh.name = 'earth';

    earthMesh.position.x = 1;
    earthMesh.position.z = -5;
    
    scene.add(earthMesh);

    var cloudGeometry = new THREE.SphereGeometry(25.2, 70, 70);
    var cloudMaterial = createCloudMaterial();
    cloudMesh = new THREE.Mesh(cloudGeometry, cloudMaterial);
    cloudMesh.name = 'clouds';
    
    cloudMesh.position.x = 1;
    cloudMesh.position.z = -5;
    
    scene.add(cloudMesh);
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

var createASphereMoon = function() {
    var sphereGeometry2 = new THREE.SphereGeometry(8, 30, 30);
    var sphereMaterial2 = this.createMoonMaterial();

    moonMesh = new THREE.Mesh(sphereGeometry2, sphereMaterial2);

    moonMesh.name = 'moon';
    
    moonMesh.position.x = -10
    moonMesh.position.y = 1;
    moonMesh.position.z = 20;
    
    scene.add(moonMesh);
};

var createASphereSun = function() {
    var sphereGeometry3 = new THREE.SphereGeometry(8, 30, 30);
    var sphereMaterial3 = this.createSunMaterial();

    sunMesh = new THREE.Mesh(sphereGeometry3, sphereMaterial3);

    sunMesh.name = 'sun';
    
    sunMesh.position.x = 40;
    sunMesh.position.y = 15;
    sunMesh.position.z = -45;
    
    scene.add(sunMesh);
};

var createASphereMars = function() {
    var sphereGeometry4 = new THREE.SphereGeometry(12, 40, 40);
    var sphereMaterial4 = this.createMarsMaterial();

    marsMesh = new THREE.Mesh(sphereGeometry4, sphereMaterial4);

    marsMesh.name = 'mars';
    
    marsMesh.position.x = 40;
    marsMesh.position.y = 25;
    marsMesh.position.z = -45;
    
    scene.add(marsMesh);
};

var createCloudMaterial = function() {
    var cloudTexture = new THREE.TextureLoader().load("images/fair_clouds_4k.png");
    var cloudMaterial = new THREE.MeshPhongMaterial();
    cloudMaterial.map = cloudTexture;
    cloudMaterial.transparent = true;
    return cloudMaterial;
};

var createMoonMaterial = function() {
    var moonTexture = new THREE.TextureLoader().load("images/moonmap4k.jpg");
    var moonMaterial = new THREE.MeshPhongMaterial();

    moonMaterial.map = moonTexture;

    return moonMaterial;
};

var createSunMaterial = function() {
    var sunTexture = new THREE.TextureLoader().load("images/sunmap.jpg");
    var sunMaterial = new THREE.MeshPhongMaterial();

    sunMaterial.map = sunTexture;

    return sunMaterial;
};

var createMarsMaterial = function() {
    var marsTexture = new THREE.TextureLoader().load("images/marsmap.jpg");
    var marsMaterial = new THREE.MeshPhongMaterial();

    marsMaterial.map = marsTexture;

    return marsMaterial;
};

var createDirectionalLight = function() {
    var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
    directionalLight.position.set(100,50,-10);
    directionalLight.name='directional';
    scene.add(directionalLight);
};

var createAmbientLight = function() {
    var ambientLight = new THREE.AmbientLight(0x111111);
    ambientLight.name='ambient';
    scene.add(ambientLight);
};

var createBackground = function() {
    var texture = new THREE.TextureLoader().load("images/starry_background.jpg");

    var materialColor = new THREE.MeshBasicMaterial();

    materialColor.map = texture;
    materialColor.depthTest = false;

    var bgPlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), materialColor);

    bgPlane.position.z = -100;
    bgPlane.scale.set(window.innerWidth * 2, window.innerHeight * 2, 1);

    sceneBackground.add(bgPlane); 
}

var renderBackground = function(){
    var bgPass = new THREE.RenderPass(sceneBackground, cameraBackground);
    var renderPass = new THREE.RenderPass(scene, camera);
    
    renderPass.clear = false;
    
    var effectCopy = new THREE.ShaderPass(THREE.CopyShader);
    
    effectCopy.renderToScreen = true;
    
    composer = new THREE.EffectComposer(renderer);
    composer.addPass(bgPass);
    composer.addPass(renderPass);
    composer.addPass(effectCopy);
}

var createParticles = function () {
    var particleCount = 1500,
        particles = new THREE.Geometry(),
        pMaterial = new THREE.PointsMaterial({
            color: 0xFFFFFF,
            size: 20,
            map: new THREE.TextureLoader().load( "images/spikey.png" ),
            blending: THREE.AdditiveBlending,
            transparent: true
        });

    
    for (var p = 0; p < particleCount; p++) {
        var pX = Math.random() * window.innerWidth - (window.innerWidth/2),
            pY = Math.random() * window.innerHeight - (window.innerHeight/2),
            pZ = Math.random() * window.innerWidth - (window.innerWidth/2),
            particle = new THREE.Vector3(pX, pY, pZ);

        particle.velocity = new THREE.Vector3(0, 0, 0);
       
        particles.vertices.push(particle);
    }

    
    particleSystem = new THREE.Points(
        particles,
        pMaterial);

    particleSystem.sortParticles = true;

    scene.add(particleSystem);
};

var init = function() {
    scene = new THREE.Scene();
    sceneBackground = new THREE.Scene();

    camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 0.1, 1000 );
    cameraBackground = new THREE.OrthographicCamera( -window.innerWidth, window.innerWidth, window.innerHeight, -window.innerHeight, -10000, 10000 );
    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );

    this.createASphereEarth();
    this.createASphereMoon();
  
    controls = new THREE.OrbitControls(camera);
    
    camera.position.z = 100;
    camera.lookAt(scene.position);
    
    cameraBackground.position.z = 200;
    
    this.createBackground();
    this.renderBackground();
    
    this.createParticles();

    this.createDirectionalLight();
    this.createAmbientLight();

    document.body.appendChild( renderer.domElement );

    this.render();
};

var animageEarth = function() {
    earthMesh.rotation.y += 0.001;
    cloudMesh.rotation.y += 0.001*1.1;
}

var animageMoon = function() {
    moonMesh.rotation.y += 0.005;
    //moonPivot.rotation += 0.1;
}

var animageSun = function() {
    sunMesh.rotation.y += 0.005;
}

var animageMars = function() {
    marsMesh.rotation.y += 0.005;
}

var render = function() {
    this.animageEarth();
    this.animageMoon();
    
    controls.update();
    
    particleSystem.rotation.y += 0.001;
    
    renderer.autoClear = false;
    composer.render();
    
    requestAnimationFrame( render );
    
    theta += dTheta;
    moonMesh.position.x = r * Math.cos(theta);
    moonMesh.position.z = r * Math.sin(theta);  
};

window.onload = this.init;