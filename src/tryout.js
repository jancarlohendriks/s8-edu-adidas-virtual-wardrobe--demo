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

  if ((xhr.loaded / xhr.total) * 100 == 100) {
    el.classList.add("loaded");
  }
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
  document.getElementById("playpause").onclick = (e) =>
    vologram.elVideo.paused
      ? vologram.elVideo.play()
      : vologram.elVideo.pause();

  // document.getElementById("slider").oninput = (e) => {
  //   const zoomValue = e.target.value;
  //   const initialCameraPosition = new THREE.Vector3(0, 1, 2);
  //   const zoomFactor = 0.01;
  //   const deltaZ = zoomValue * zoomFactor;
  //   camera.position.setZ(initialCameraPosition.z + deltaZ);
  //   camera.updateProjectionMatrix();
  //   controls.update();
  //   renderer.render(scene, camera);
  // };

  document.getElementById("left").onclick = (e) => {
    vologram.clear();
    vologram = new Vologram("assets/left_1690983019490_ld", updateLoading);
    scene.add(vologram);
  };

  document.getElementById("head").onclick = (e) => {
    vologram.clear();
    vologram = new Vologram("assets/head_1690983148857_ld", updateLoading);
    scene.add(vologram);
  };

  document.getElementById("right").onclick = (e) => {
    vologram.clear();
    vologram = new Vologram("assets/right_1690983080648_ld", updateLoading);
    scene.add(vologram);
  };
}

// import { Vologram } from "volograms-js";
// import { Sky } from "three/addons/objects/Sky.js";
// import * as THREE from "three";
// import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import stadium from "@/assets/stadium.glb?url";

// // Initialize the Three.js scene
// const container = document.getElementById("tryout");

// const WIDTH = container.clientWidth;
// const HEIGHT = WIDTH / (16 / 9);

// const renderer = new THREE.WebGLRenderer({ antialias: true });
// const scene = new THREE.Scene();

// const camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, 0.1, 1000);
// camera.position.set(0, 1, 2);

// const controls = new OrbitControls(camera, renderer.domElement);
// controls.target.set(0, 0.9, 0);
// controls.update();

// function initScene() {
//   renderer.toneMapping = THREE.ACESFilmicToneMapping;
//   renderer.toneMappingExposure = 0.7;
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(WIDTH, HEIGHT);
//   container.appendChild(renderer.domElement);
//   scene.add(new THREE.AmbientLight(0xffffff, 1));
// }

// // Function to initialize the sky
// function initSky() {
//   var sky = new Sky();
//   sky.scale.setScalar(450000);
//   scene.add(sky);

//   const effectController = {
//     turbidity: 10,
//     rayleigh: 3,
//     mieCoefficient: 0.005,
//     mieDirectionalG: 0.7,
//     elevation: 2,
//     azimuth: 180,
//     exposure: renderer.toneMappingExposure,
//   };

//   const uniforms = sky.material.uniforms;
//   uniforms["turbidity"].value = effectController.turbidity;
//   uniforms["rayleigh"].value = effectController.rayleigh;
//   uniforms["mieCoefficient"].value = effectController.mieCoefficient;
//   uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

//   var sun = new THREE.Vector3();
//   const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
//   const theta = THREE.MathUtils.degToRad(effectController.azimuth);
//   sun.setFromSphericalCoords(1, phi, theta);
//   uniforms["sunPosition"].value.copy(sun);
//   renderer.toneMappingExposure = effectController.exposure;
// }

// // Function to load the GLTF model
// function loadModel() {
//   const loader = new GLTFLoader();
//   loader.load(
//     stadium,
//     function (gltf) {
//       var model = gltf.scene;

//       model.scale.set(1, 1, 1);
//       model.position.set(7, 10.05, -8);
//       // model.rotateY(-91);

//       scene.add(model);
//     },
//     (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
//     (error) => console.log(error)
//   );
// }

// // Function to initialize the Vologram
// function initVologram() {
//   const updateLoading = (p, play) => {
//     const el = document.getElementById("loading");
//     el.innerText = Math.round(p * 100) + "%";

//     // if (window.location.hash) {
//     vologram.elVideo.play();
//     // }

//     if (p === 1.0) {
//       //when loaded/100%
//       // Play and unmute when clicking on canvas (because of Chrome policy; cannot be autoplay)
//       renderer.domElement.onclick = (e) => {
//         vologram.elVideo.muted = true;
//         renderer.domElement.onclick = null;
//       };
//     }
//   };

//   // Play/Pause button and Sound/Mute button
//   document.getElementById("playpause").onclick = (e) =>
//     vologram.elVideo.paused
//       ? vologram.elVideo.play()
//       : vologram.elVideo.pause();
//   document.getElementById("sound").onclick = (e) =>
//     (vologram.elVideo.muted = !vologram.elVideo.muted);

//   let vologram = new Vologram("assets/left_1690983019490_ld", updateLoading);
//   scene.add(vologram);
// }

// // Function for the animation loop
// function animate() {
//   requestAnimationFrame(animate);
//   renderer.render(scene, camera);
// }

// // Event listener for DOMContentLoaded
// document.addEventListener("DOMContentLoaded", function () {
//   initScene();
//   initSky();
//   loadModel();
//   initVologram();
//   animate();
// });

// window.addEventListener("resize", onWindowResize, false);

// function onWindowResize() {
//   // camera.aspect = window.innerWidth / window.innerHeight;
//   // camera.updateProjectionMatrix();
//   const WIDTH = container.clientWidth;
//   const HEIGHT = WIDTH / (16 / 9);
//   renderer.setSize(WIDTH, HEIGHT);
// }

// document.addEventListener("DOMContentLoaded", function () {
//   var container = document.getElementById("tryout");

//   const renderer = new THREE.WebGLRenderer({ antialias: true });
//   renderer.toneMapping = THREE.ACESFilmicToneMapping;
//   renderer.toneMappingExposure = 0.7;
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(container.clientWidth, container.clientWidth / (16 / 9));
//   container.appendChild(renderer.domElement);

//   const scene = new THREE.Scene();
//   scene.add(new THREE.AmbientLight(0xffffff, 1));

//   const camera = new THREE.PerspectiveCamera(
//     75,
//     window.innerWidth / window.innerHeight,
//     0.1,
//     1000
//   );
//   camera.position.set(0, 1, 2);

//   const controls = new OrbitControls(camera, renderer.domElement);
//   controls.target.set(0, 0.9, 0);
//   // controls.addEventListener("change", renderer);
//   // controls.minDistance(2500);
//   // controls.maxDistance(2500);
//   controls.update();

//   const updateLoading = (p, play) => {
//     const el = document.getElementById("loading");
//     el.innerText = Math.round(p * 100) + "%";

//     // if (window.location.hash) {
//     vologram.elVideo.play();
//     // }

//     if (p === 1.0) {
//       //when loaded/100%
//       // Play and unmute when clicking on canvas (because of Chrome policy; cannot be autoplay)
//       renderer.domElement.onclick = (e) => {
//         vologram.elVideo.muted = true;
//         renderer.domElement.onclick = null;
//       };
//     }
//   };

//   // Play/Pause button and Sound/Mute button
//   document.getElementById("playpause").onclick = (e) =>
//     vologram.elVideo.paused
//       ? vologram.elVideo.play()
//       : vologram.elVideo.pause();
//   document.getElementById("sound").onclick = (e) =>
//     (vologram.elVideo.muted = !vologram.elVideo.muted);

//   var sky = new Sky();
//   sky.scale.setScalar(450000);
//   scene.add(sky);

//   const effectController = {
//     turbidity: 10,
//     rayleigh: 3,
//     mieCoefficient: 0.005,
//     mieDirectionalG: 0.7,
//     elevation: 2,
//     azimuth: 180,
//     exposure: renderer.toneMappingExposure,
//   };

//   const uniforms = sky.material.uniforms;
//   uniforms["turbidity"].value = effectController.turbidity;
//   uniforms["rayleigh"].value = effectController.rayleigh;
//   uniforms["mieCoefficient"].value = effectController.mieCoefficient;
//   uniforms["mieDirectionalG"].value = effectController.mieDirectionalG;

//   var sun = new THREE.Vector3();

//   const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
//   const theta = THREE.MathUtils.degToRad(effectController.azimuth);

//   sun.setFromSphericalCoords(1, phi, theta);

//   uniforms["sunPosition"].value.copy(sun);

//   renderer.toneMappingExposure = effectController.exposure;

//   const loader = new GLTFLoader();
//   loader.load(
//     stadium,
//     function (gltf) {
//       var model = gltf.scene;

//       model.scale.set(1, 1, 1);
//       model.position.set(7, 10.05, -8);
//       // model.rotateY(-91);

//       scene.add(model);
//     },
//     (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
//     (error) => console.log(error)
//   );

//   // let vologramUrl = ""; // Initialize the vologram URL

//   // if (window.location.hash.includes("static")) {
//   //   vologramUrl = "assets/left_1690983019490_ld"; // Set the URL for "left" pathname
//   // } else if (window.location.hash.includes("left")) {
//   //   vologramUrl = "assets/left_1690983019490_ld"; // Set the URL for "left" pathname
//   // } else if (window.location.hash.includes("right")) {
//   //   vologramUrl = "assets/right_1690983080648_ld"; // Set the URL for "right" pathname
//   // } else if (window.location.hash.includes("head")) {
//   //   vologramUrl = "assets/head_1690983148857_ld"; // Set the URL for "head" pathname
//   // } else {
//   //   vologramUrl = "assets/left_1690983019490_ld"; // Default URL if no specific pathname matches
//   // }

//   // let url = "assets/1690983019490_ld";
//   let vologram = new Vologram("assets/left_1690983019490_ld", updateLoading);
//   // vologramUrl && scene.add(vologram);
//   scene.add(vologram);

//   var head = document.getElementById("head");
//   head.addEventListener("click", () => {
//     console.log(head);
//   });

//   function animate() {
//     requestAnimationFrame(animate);
//     renderer.render(scene, camera);
//   }

//   animate();
// });
