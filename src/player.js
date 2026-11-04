import * as THREE from 'three';
import { Input } from './utils/input';

export class Player {
  constructor(camera, domElement) {
    this.camera = camera;
    this.domElement = domElement;
    this.input = new Input(domElement);
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    // Параметры движения
    this.moveSpeed = 5; // м/с
    this.lookSpeed = 0.002;
  }

  update() {
    const delta = this._getDelta();

    // Обновление направления взгляда (мышь)
    const { movementX, movementY } = this.input.mouseDelta;
    this.camera.rotation.y -= movementX * this.lookSpeed;
    this.camera.rotation.x -= movementY * this.lookSpeed;
    this.camera.rotation.x = Math.max(
      -Math.PI / 2,
      Math.min(Math.PI / 2, this.camera.rotation.x)
    );

    // Сброс мышиного дельта
    this.input.resetMouseDelta();

    // Обновление движения (WASD)
    this.direction.set(
      Number(this.input.keys.ArrowRight || this.input.keys.KeyD) -
        Number(this.input.keys.ArrowLeft || this.input.keys.KeyA),
      0,
      Number(this.input.keys.ArrowDown || this.input.keys.KeyS) -
        Number(this.input.keys.ArrowUp || this.input.keys.KeyW)
    );
    this.direction.normalize();

    // Применяем движение в направлении камеры
    if (this.direction.length() > 0) {
      const move = new THREE.Vector3();
      move.copy(this.direction);
      move.applyAxisAngle(new THREE.Vector3(0, 1, 0), this.camera.rotation.y);
      move.multiplyScalar(this.moveSpeed * delta);
      this.camera.position.add(move);
    }
  }

  _getDelta() {
    const now = performance.now() / 1000;
    this._lastTime = this._lastTime || now;
    const delta = now - this._lastTime;
    this._lastTime = now;
    return delta;
  }
}
