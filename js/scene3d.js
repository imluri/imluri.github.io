import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

(function () {
  const canvas = document.getElementById('scene-canvas');
  if (!canvas || window.innerWidth <= 768) return;

  canvas.style.opacity = '0';
  canvas.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)';

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.outputColorSpace = THREE.SRGBColorSpace;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100000);
  camera.position.set(0, 0, 6);

  const ambient = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambient);

  const keyLight = new THREE.DirectionalLight(0x7784ff, 2.0);
  keyLight.position.set(3, 5, 3);
  scene.add(keyLight);

  const rimLight = new THREE.DirectionalLight(0x5f6be2, 1.0);
  rimLight.position.set(-4, 2, -2);
  scene.add(rimLight);

  // ── Girl model (home page) ──────────────────────────────────
  let girl = null;
  let girlBaseX = 0;
  let girlBaseY = 0;

  const loader = new GLTFLoader();
  loader.load('assets/model/girl/scene.gltf', (gltf) => {
    girl = gltf.scene;

    const box = new THREE.Box3().setFromObject(girl);
    const size = box.getSize(new THREE.Vector3());
    const centre = box.getCenter(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 17 / maxDim;

    girl.scale.setScalar(scale);
    girl.position.sub(centre.multiplyScalar(scale));
    girl.position.x += 1.7;
    girl.position.y += -3;
    girlBaseX = girl.position.x;
    girlBaseY = girl.position.y;
    girl.rotation.y = -0.25;

    const obj10 = girl.getObjectByName('Object_10');
    if (obj10) obj10.removeFromParent();

    girl.visible = currentPage === '/';
    scene.add(girl);
    if (currentPage === '/') canvas.style.opacity = '1';
  });

  // ── Computers model (projects page) ────────────────────────
  let computers = null;
  let computersBaseRotY = 0;

  loader.load('assets/model/computers/scene.gltf', (gltf) => {
    computers = gltf.scene;

    const box = new THREE.Box3().setFromObject(computers);
    const centre = box.getCenter(new THREE.Vector3());
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 15 / maxDim;

    computers.scale.setScalar(scale);
    computers.position.sub(centre.multiplyScalar(scale));
    computersBaseRotY = 0;
    computers.visible = currentPage === '/projects';
    scene.add(computers);
    if (currentPage === '/projects') canvas.style.opacity = '0.18';
  });

  // ── Input tracking ──────────────────────────────────────────
  let scrollY = 0;
  let smoothScrollY = 0;
  let mouseX = 0;
  let mouseY = 0;
  let smoothMouseX = 0;
  let smoothMouseY = 0;
  let currentPage = window.location.pathname;

  window.addEventListener('scroll', () => { scrollY = window.scrollY; });

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth  - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });

  const _origPushState = history.pushState.bind(history);
  history.pushState = (...args) => { _origPushState(...args); onRouteChange(); };
  window.addEventListener('popstate', onRouteChange);

  function onRouteChange() {
    currentPage = window.location.pathname;
    scrollY = 0;
    // Don't reset smoothScrollY yet — let the model stay where it is during fade-out
    // so it doesn't snap back into view before the canvas goes transparent

    // Fade out fast
    canvas.style.transition = 'opacity 0.3s ease';
    canvas.style.opacity = '0';

    // After fade-out completes, swap model and fade back in slowly
    setTimeout(() => {
      smoothScrollY = 0;
      if (girl)      girl.visible      = currentPage === '/';
      if (computers) computers.visible = currentPage === '/projects';
      canvas.style.transition = 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)';
      if (currentPage === '/') canvas.style.opacity = '1';
      else if (currentPage === '/projects') canvas.style.opacity = '0.18';
      // else: stay hidden (detail pages, etc.)
    }, 320);
  }

  // ── Animate ─────────────────────────────────────────────────
  const clock = new THREE.Clock();

  (function animate() {
    requestAnimationFrame(animate);

    const t = clock.getElapsedTime();
    smoothMouseX += (mouseX - smoothMouseX) * 0.05;
    smoothMouseY += (mouseY - smoothMouseY) * 0.05;

    if (girl && girl.visible) {
      smoothScrollY += (scrollY - smoothScrollY) * 0.06;
      girl.position.x = girlBaseX + smoothScrollY * 0.01;
      girl.position.y = girlBaseY + Math.sin(t * 0.6) * 0.04;
      const scrollTurn = Math.min(smoothScrollY * 0.0008, 0.5);
      girl.rotation.y = -0.25 + -scrollTurn + Math.sin(t * 0.35) * 0.06;

      // Fade out as scroll reaches the showcase snap point.
      // Only take over opacity once scrolled (smoothScrollY > 2) so the
      // route-change fade-in transition can complete uninterrupted.
      const showcase = document.getElementById('showcase');
      if (showcase && smoothScrollY > 2) {
        const snapY = Math.max(showcase.offsetTop - 50, 1);
        const fade = Math.max(0, 1 - smoothScrollY / snapY);
        canvas.style.transition = 'none';
        canvas.style.opacity = fade.toFixed(3);
      }
    }

    if (computers && computers.visible) {
      computers.rotation.y = computersBaseRotY + smoothMouseX * 0.06;
      computers.rotation.x = -smoothMouseY * 0.03;
    }

    renderer.render(scene, camera);
  }());
}());
