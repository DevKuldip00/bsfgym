/**
 * BSF THE GYM — Hero 3D Interactive Emblem
 * Three.js sculptural metallic fitness emblem with reactive specular lighting
 */
import * as THREE from 'three';

export function initHero3D() {
  const container = document.getElementById('hero3dContainer');
  if (!container) return;

  // Check for reduced motion preference
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // Check WebGL availability
  try {
    const canvasTest = document.createElement('canvas');
    if (!Boolean(window.WebGLRenderingContext && (canvasTest.getContext('webgl') || canvasTest.getContext('experimental-webgl')))) {
      return;
    }
  } catch (e) {
    return;
  }

  let scene, camera, renderer, emblemGroup, ringMesh, coreMesh, accentRing;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let isVisible = true;

  const width = container.clientWidth || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(0, 0, 7.5);

  // Renderer
  renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.25;

  container.appendChild(renderer.domElement);

  // Group
  emblemGroup = new THREE.Group();
  scene.add(emblemGroup);

  // Materials
  // 1. Heavy Dark Titanium
  const titaniumMaterial = new THREE.MeshStandardMaterial({
    color: 0x141A15,
    metalness: 0.92,
    roughness: 0.28,
  });

  // 2. Electric Lime Core Accent
  const limeGlowMaterial = new THREE.MeshStandardMaterial({
    color: 0xB7FF32,
    emissive: 0xB7FF32,
    emissiveIntensity: 0.45,
    metalness: 0.6,
    roughness: 0.2,
  });

  // 3. Dark Chrome Rim
  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0x242D26,
    metalness: 0.96,
    roughness: 0.15,
  });

  // Geometries: Sculptural Gyroscopic Fitness Core
  // Outer Ring: Calibrated Weight Ring
  const outerTorus = new THREE.TorusGeometry(2.35, 0.14, 24, 72);
  ringMesh = new THREE.Mesh(outerTorus, titaniumMaterial);
  emblemGroup.add(ringMesh);

  // Inner Geometric Core: Athletic Octahedron / Calibrated Prism
  const innerIcosa = new THREE.IcosahedronGeometry(1.35, 1);
  coreMesh = new THREE.Mesh(innerIcosa, titaniumMaterial);
  emblemGroup.add(coreMesh);

  // Lime Accent Ring
  const limeTorus = new THREE.TorusGeometry(1.85, 0.045, 16, 64);
  accentRing = new THREE.Mesh(limeTorus, limeGlowMaterial);
  accentRing.rotation.x = Math.PI / 3;
  emblemGroup.add(accentRing);

  // Small Precision Markers around ring
  const markerGeo = new THREE.BoxGeometry(0.08, 0.28, 0.08);
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2;
    const marker = new THREE.Mesh(markerGeo, chromeMaterial);
    marker.position.set(Math.cos(angle) * 2.35, Math.sin(angle) * 2.35, 0);
    marker.rotation.z = angle;
    emblemGroup.add(marker);
  }

  // Lighting
  // Ambient fill
  const ambientLight = new THREE.AmbientLight(0x0e1710, 2.5);
  scene.add(ambientLight);

  // Key Specular Spotlight (White / Steel)
  const keyLight = new THREE.DirectionalLight(0xffffff, 3.2);
  keyLight.position.set(5, 7, 5);
  scene.add(keyLight);

  // Electric Lime Rim Point Light
  const limeLight = new THREE.PointLight(0xB7FF32, 4.5, 12, 1.8);
  limeLight.position.set(-3.5, -2, 2.5);
  scene.add(limeLight);

  // Cyan-Lime Subtle Backlight
  const backLight = new THREE.DirectionalLight(0xD1FF68, 1.8);
  backLight.position.set(0, -5, -4);
  scene.add(backLight);

  // Position emblem slightly offset to the right on desktop for visual balance with hero text
  function updateEmblemPosition() {
    const w = window.innerWidth;
    if (w > 1024) {
      emblemGroup.position.set(2.4, 0.2, 0);
      emblemGroup.scale.set(1, 1, 1);
    } else if (w > 768) {
      emblemGroup.position.set(1.5, 0, 0);
      emblemGroup.scale.set(0.78, 0.78, 0.78);
    } else {
      // On mobile, center behind or slightly above
      emblemGroup.position.set(0, 0.6, -1);
      emblemGroup.scale.set(0.65, 0.65, 0.65);
    }
  }

  updateEmblemPosition();

  // Mouse Parallax
  let mouseX = 0;
  let mouseY = 0;

  function onMouseMove(event) {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;

    targetRotationY = mouseX * 0.45;
    targetRotationX = -mouseY * 0.35;

    // Shift point light slightly with mouse
    limeLight.position.x = -3.5 + mouseX * 1.5;
    limeLight.position.y = -2 + mouseY * 1.5;
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });

  // Resize Handler
  function onResize() {
    const newW = container.clientWidth || window.innerWidth;
    const newH = container.clientHeight || window.innerHeight;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    updateEmblemPosition();
  }

  window.addEventListener('resize', onResize);

  // Pause when not visible (Intersection Observer)
  const heroSection = document.getElementById('hero');
  if (heroSection) {
    const observer = new IntersectionObserver((entries) => {
      isVisible = entries[0].isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(heroSection);
  }

  // Animation Loop
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    if (!isVisible) return;

    const elapsedTime = clock.getElapsedTime();

    // Idle continuous kinematic rotation
    ringMesh.rotation.z += 0.003;
    ringMesh.rotation.y += 0.002;

    coreMesh.rotation.x += 0.005;
    coreMesh.rotation.y += 0.006;

    accentRing.rotation.z -= 0.004;

    // Floating bobbing motion
    emblemGroup.position.y = (updateEmblemPosition.baseY || emblemGroup.position.y) + Math.sin(elapsedTime * 1.5) * 0.003;

    // Smooth lerp to mouse target
    emblemGroup.rotation.y += (targetRotationY - emblemGroup.rotation.y) * 0.05;
    emblemGroup.rotation.x += (targetRotationX - emblemGroup.rotation.x) * 0.05;

    renderer.render(scene, camera);
  }

  animate();
}
