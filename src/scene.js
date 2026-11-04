import * as THREE from 'three';

export function initScene() {
  const scene = new THREE.Scene();

  // Фоновый цвет
  scene.background = new THREE.Color(0x202020);

  // Основная камера (Perspective)
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.6, 5); // стартовая позиция глаза игрока

  // Освещение
  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const directional = new THREE.DirectionalLight(0xffffff, 0.8);
  directional.position.set(5, 10, 7);
  scene.add(directional);

  // Простейший пол
  const floorGeometry = new THREE.PlaneGeometry(200, 200);
  const floorMaterial = new THREE.MeshStandardMaterial({ color: 0x444444 });
  const floor = new THREE.Mesh(floorGeometry, floorMaterial);
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);

  // TODO: добавить placeholder‑модели врагов

  return { scene, camera };
}
