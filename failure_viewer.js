import * as THREE from "./assets/failure-viewer/three.module.js";
import { OrbitControls } from "./assets/failure-viewer/OrbitControls.js";
import { GLTFLoader } from "./assets/failure-viewer/GLTFLoader.js";

const loader = new GLTFLoader();

function startFailureViewer(container) {
  const canvas = document.createElement("canvas");
  container.appendChild(canvas);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setClearColor(0x0b1116, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(34, 1, 0.001, 1000);
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.minDistance = 0.2;
  controls.maxDistance = 20;

  scene.add(new THREE.HemisphereLight(0xeaf4ff, 0x18232b, 2.2));
  const key = new THREE.DirectionalLight(0xffffff, 3.2);
  key.position.set(3, 4, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x5cc9c0, 1.7);
  rim.position.set(-4, 1, -3);
  scene.add(rim);

  const kind = container.dataset.failureModel;
  const movingToken = kind === "bicycle" ? "body_023" : "body_172";
  let root = null;

  function resize() {
    const rect = container.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  function frame(object) {
    const box = new THREE.Box3().setFromObject(object);
    const center = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const radius = Math.max(size.length() * 0.5, 0.001);
    object.position.sub(center);
    camera.position.set(radius * 1.7, radius * 1.15, radius * 1.7);
    controls.target.set(0, 0, 0);
    controls.minDistance = radius * 0.35;
    controls.maxDistance = radius * 8;
    controls.update();
  }

  loader.load(container.dataset.modelSrc, (gltf) => {
    root = gltf.scene;
    root.traverse((object) => {
      if (!object.isMesh) return;
      const moving = object.name.indexOf(movingToken) >= 0;
      object.material = new THREE.MeshStandardMaterial({
        color: moving ? 0xd95757 : 0x3f9cba,
        roughness: 0.48,
        metalness: 0.18,
        side: THREE.DoubleSide
      });
    });
    scene.add(root);
    frame(root);
    container.classList.add("ready");
  }, undefined, () => {
    container.classList.add("load-error");
    container.insertAdjacentHTML("beforeend", '<span class="failure-viewer-error">3D preview unavailable</span>');
  });

  const observer = new ResizeObserver(resize);
  observer.observe(container);
  resize();

  function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

document.querySelectorAll("[data-failure-model]").forEach(startFailureViewer);
