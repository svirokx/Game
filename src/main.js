import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.164.0/build/three.module.js';
import { PointerLockControls } from 'https://cdn.jsdelivr.net/npm/three@0.164.0/examples/jsm/controls/PointerLockControls.js';

let camera, scene, renderer, controls;
let objects = [];

init();
animate();

function init() {
    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x202020);

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.y = 10;

    // Light
    const light = new THREE.HemisphereLight(0xffffff, 0x444444);
    light.position.set(0, 200, 0);
    scene.add(light);

    // Ground
    const floorGeometry = new THREE.PlaneGeometry(2000, 2000, 100, 100);
    const floorMaterial = new THREE.MeshPhongMaterial({ color: 0x999999, depthWrite: false });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Simple target box
    const boxGeometry = new THREE.BoxGeometry(20, 20, 20);
    const boxMaterial = new THREE.MeshPhongMaterial({ color: 0xff0000 });
    const box = new THREE.Mesh(boxGeometry, boxMaterial);
    box.position.set(0, 10, -100);
    box.castShadow = true;
    scene.add(box);
    objects.push(box);

    // Controls
    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    blocker.addEventListener('click', () => {
        controls.lock();
    });

    controls.addEventListener('lock', () => {
        blocker.style.display = 'none';
    });

    controls.addEventListener('unlock', () => {
        blocker.style.display = 'flex';
    });

    scene.add(controls.getObject());

    // Movement
    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    const moveSpeed = 400.0;

    const keyState = {};

    document.addEventListener('keydown', (event) => {
        keyState[event.code] = true;
    });

    document.addEventListener('keyup', (event) => {
        keyState[event.code] = false;
    });

    // Resize handling
    window.addEventListener('resize', onWindowResize, false);

    // Animation loop helper (adds movement)
    function updateMovement(delta) {
        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;

        direction.z = Number(keyState['KeyW']) - Number(keyState['KeyS']);
        direction.x = Number(keyState['KeyD']) - Number(keyState['KeyA']);
        direction.normalize();

        if (keyState['KeyW'] || keyState['KeyS']) velocity.z -= direction.z * moveSpeed * delta;
        if (keyState['KeyA'] || keyState['KeyD']) velocity.x -= direction.x * moveSpeed * delta;

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);
    }

    // Attach to the render loop
    let prevTime = performance.now();
    function animate() {
        const time = performance.now();
        const delta = (time - prevTime) / 1000;

        if (controls.isLocked === true) {
            updateMovement(delta);
        }

        renderer.render(scene, camera);
        prevTime = time;
        requestAnimationFrame(animate);
    }

    // Expose animate to outer scope
    window._renderLoop = animate;
}

function animate() {
    if (window._renderLoop) window._renderLoop();
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}
