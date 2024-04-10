import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls}  from 'three/addons/controls/OrbitControls.js'

//create renderer
const renderer = new THREE.WebGLRenderer( { antialias: true } );
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.setClearColor( 0x000000 );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.getElementById( 'container' ).appendChild( renderer.domElement );

//create scene
const scene = new THREE.Scene();

//create camera
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1 , 1000 );
camera.position.set( 8, 8, 8);
camera.lookAt( 0 ,0 ,0 );

//controls
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 5;
controls.maxDistance = 20;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = false;
controls.target = new THREE.Vector3( 0, 1, 0);
controls.update();

//--add ground
const groundGeometry = new THREE.PlaneGeometry(50, 100, 32, 32);
groundGeometry.rotateX( -Math.PI / 2 );
const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x222222, side: THREE.DoubleSide});
const groundMesh = new THREE.Mesh( groundGeometry, groundMaterial );
groundMesh.castShadow = false;
groundMesh.receiveShadow = true;
scene.add( groundMesh );

//--add light
const spotLight = new THREE.SpotLight( 0xffffff, 500 );
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 1;
spotLight.decay = 2;
spotLight.position.set(0, 10, 0);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);

const ambientLigth = new THREE.AmbientLight(undefined, 0.4);
scene.add(ambientLigth)

console.log("Dave", spotLight)

//loader
const loader = new GLTFLoader().setPath('model/');
loader.load(
      'scene.gltf'
    , (gltf) => {
        const mesh = gltf.scene;

        mesh.traverse( (child) => {
            if ( child.isMesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        });

        //mesh.rotateY( -Math.PI/2 );

        //mesh.position.set( 0, 1.05, -1 );
        scene.add( mesh );
    }
    , undefined
    , (error) => {
        console.error( error );
    }
)

window.onresize = function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}


function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

animate();
