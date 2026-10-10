import * as THREE from "./assets/failure-viewer/three.module.js";
import { OrbitControls } from "./assets/failure-viewer/OrbitControls.js";
import { GLTFLoader } from "./assets/failure-viewer/GLTFLoader.js";
import { RoomEnvironment } from "./assets/failure-viewer/RoomEnvironment.js";

// Interactive views of the two Figure 7 failure details. The blocked part is
// highlighted; everything else keeps the page's steel-blue structure color.
const BLOCKED_PART = { bicycle: "body_023", clock: "body_172" };
const loader = new GLTFLoader();

function stageColor() {
  return getComputedStyle(document.documentElement).getPropertyValue("--surface-2").trim() || "#f1f0eb";
}

function startViewer(container) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.NeutralToneMapping;
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environmentIntensity = 0.55;
  scene.add(new THREE.HemisphereLight(0xffffff, 0xcfc6b8, 0.7));
  const key = new THREE.DirectionalLight(0xfffaf0, 2.2);
  key.position.set(3, 5, 4);
  scene.add(key);

  const applyBackground = () => renderer.setClearColor(new THREE.Color(stageColor()), 1);
  applyBackground();
  document.addEventListener("funcad-theme", () => { applyBackground(); needsRender = true; });

  const camera = new THREE.PerspectiveCamera(32, 1, 0.001, 1000);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.08;
  controls.autoRotate = true;
  controls.autoRotateSpeed = 0.9;
  controls.enablePan = false;

  let needsRender = true;
  let visible = true;
  controls.addEventListener("change", () => { needsRender = true; });
  renderer.domElement.addEventListener("pointerdown", () => {
    controls.autoRotate = false;
    container.classList.add("interacted");
  }, { once: true });

  function resize() {
    const { width, height } = container.getBoundingClientRect();
    renderer.setSize(Math.max(1, width), Math.max(1, height), false);
    camera.aspect = Math.max(1, width) / Math.max(1, height);
    camera.updateProjectionMatrix();
    needsRender = true;
  }

  const blockedToken = BLOCKED_PART[container.dataset.failureModel] || "";
  loader.load(container.dataset.modelSrc, (gltf) => {
    const root = gltf.scene;
    const structure = new THREE.MeshStandardMaterial({ color: 0x3f7ea8, roughness: 0.5, metalness: 0.05, side: THREE.DoubleSide });
    const blocked = new THREE.MeshStandardMaterial({ color: 0xd8644c, roughness: 0.45, metalness: 0.05, side: THREE.DoubleSide, emissive: 0x3a0d05, emissiveIntensity: 0.25 });
    root.traverse((object) => {
      if (!object.isMesh) return;
      let node = object;
      let isBlocked = false;
      while (node) { if (blockedToken && node.name.includes(blockedToken)) { isBlocked = true; break; } node = node.parent; }
      object.material = isBlocked ? blocked : structure;
    });
    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    const radius = Math.max(box.getSize(new THREE.Vector3()).length() / 2, 1e-3);
    root.position.sub(center);
    scene.add(root);
    // Fit the bounding sphere inside the narrower field of view.
    const vfov = THREE.MathUtils.degToRad(camera.fov);
    const fov = Math.min(vfov, 2 * Math.atan(Math.tan(vfov / 2) * camera.aspect));
    camera.position.set(1.55, 1.05, 1.85).normalize().multiplyScalar((radius / Math.sin(fov / 2)) * 1.02);
    camera.near = radius / 100;
    camera.far = radius * 50;
    camera.updateProjectionMatrix();
    controls.target.set(0, 0, 0);
    controls.minDistance = radius * 0.6;
    controls.maxDistance = radius * 6;
    controls.update();
    container.classList.add("ready");
    needsRender = true;
  }, undefined, () => {
    const status = container.querySelector(".viewer-status");
    if (status) status.textContent = "3D preview unavailable";
  });

  new ResizeObserver(resize).observe(container);
  new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; }).observe(container);
  resize();

  renderer.setAnimationLoop(() => {
    if (!visible) return;
    if (controls.update() || controls.autoRotate) needsRender = true;
    if (!needsRender) return;
    renderer.render(scene, camera);
    needsRender = false;
  });
}

// Start each viewer only when it comes near the viewport.
const viewers = document.querySelectorAll("[data-failure-model]");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      io.unobserve(entry.target);
      startViewer(entry.target);
    });
  }, { rootMargin: "300px 0px" });
  viewers.forEach((v) => io.observe(v));
} else {
  viewers.forEach(startViewer);
}
