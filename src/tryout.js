import { Vologram } from "volograms-js";
import { Sky } from "three/addons/objects/Sky.js";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import stadium from "@/assets/stadium.glb?url";
import "./styles.scss";

const container = document.getElementById("tryout");
const renderer = new THREE.WebGLRenderer({ antialias: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 1;
controls.maxDistance = 4;

// Initialize the scene, sky, and model
initScene();
initSky();
loadModel();
initVologram();

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
  animate();
});

window.addEventListener("resize", onWindowResize, false);

// Function to initialize the Three.js scene
function initScene() {
  const WIDTH = container.clientWidth;
  const HEIGHT = WIDTH / (16 / 9);

  camera.aspect = WIDTH / HEIGHT;
  camera.position.set(0, 1, 2);
  camera.updateProjectionMatrix();

  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.7;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(WIDTH, HEIGHT);
  container.appendChild(renderer.domElement);
  scene.add(new THREE.AmbientLight(0xffffff, 1));
  controls.target.set(0, 0.9, 0);
  controls.update();
}

// Function to initialize the sky
function initSky() {
  const sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);

  const effectController = {
    turbidity: 10,
    rayleigh: 3,
    mieCoefficient: 0.005,
    mieDirectionalG: 0.7,
    elevation: 2,
    azimuth: 180,
    exposure: renderer.toneMappingExposure,
  };

  const uniforms = sky.material.uniforms;
  uniforms["turbidity"].value = effectController.turbidity;
  uniforms["rayleigh"].value = effectController.rayleigh;
  uniforms["mieCoefficient"].value = effectController.mieCoefficient;
  uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

  const sun = new THREE.Vector3();
  const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
  const theta = THREE.MathUtils.degToRad(effectController.azimuth);
  sun.setFromSphericalCoords(1, phi, theta);
  uniforms["sunPosition"].value.copy(sun);
  renderer.toneMappingExposure = effectController.exposure;
}

function loaded(xhr) {
  const el = document.getElementById("loading");
  el.innerText = Math.round((xhr.loaded / xhr.total) * 100) + "%";

  setTimeout(() => {
    el.classList.add("loaded");
  }, 2000);
}

// Function to load the GLTF model
function loadModel() {
  const loader = new GLTFLoader();
  loader.load(
    stadium,
    function (gltf) {
      const model = gltf.scene;
      model.scale.set(1, 1, 1);
      model.position.set(7, 10.05, -8);
      model.rotateY(-91);
      scene.add(model);
    },
    (xhr) => loaded(xhr),
    (error) => console.log(error)
  );
}

// Function to handle window resize
function onWindowResize() {
  const WIDTH = container.clientWidth;
  const HEIGHT = WIDTH / (16 / 9);

  camera.aspect = WIDTH / HEIGHT;
  camera.updateProjectionMatrix();
  renderer.setSize(WIDTH, HEIGHT);
}

// Function for the animation loop
function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}

// Debounce function to limit the rate of function execution
function debounce(func, delay) {
  let timeout;
  return function () {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

// Function to initialize the Vologram
function initVologram() {
  const updateLoading = (p, play) => {
    // const el = document.getElementById("loading");
    // el.innerText = Math.round(p * 100) + "%";
    vologram.elVideo.play();
  };

  let vologram = new Vologram("assets/left_1690983019490_ld", updateLoading);
  scene.add(vologram);

  // Play/Pause button and Sound/Mute button
  // Your click handlers
  document.getElementById("playpause").onclick = debounce((e) => {
    vologram.elVideo.paused
      ? vologram.elVideo.play()
      : vologram.elVideo.pause();
  }, 300); // Adjust the debounce delay as needed

  document.getElementById("left").onclick = debounce((e) => {
    vologram.clear();
    vologram = new Vologram("assets/left_1690983019490_ld", updateLoading);
    scene.add(vologram);
  }, 300); // Adjust the debounce delay as needed

  document.getElementById("head").onclick = debounce((e) => {
    vologram.clear();
    vologram = new Vologram("assets/head_1690983148857_ld", updateLoading);
    scene.add(vologram);
  }, 300); // Adjust the debounce delay as needed

  document.getElementById("right").onclick = debounce((e) => {
    vologram.clear();
    vologram = new Vologram("assets/right_1690983080648_ld", updateLoading);
    scene.add(vologram);
  }, 300); // Adjust the debounce delay as needed
}
