import "./style.css";
import { setupArtWork } from "./others/welcome";

import initGallery from "./gallery";
import gsap from "gsap";
document.querySelector("#app").innerHTML = `
    <div class="canvas-container">
        <div id="welcome-screen" class="absolute inset-0 hidden items-center justify-center bg-red-200/10">
        <div id="art-bg" class="absolute inset-0 bg-white"></div>
        <div id="welcome-bg" class="flex flex-col items-center justify-center text-center gap-4 p-40 rounded-3xl relative">
          <div class="absolute bg-white  inset-0  blur-2xl rounded-3xl"></div>
          <div class="z-0 flex flex-col items-center justify-center ">
          <p class="font-semibold text-2xl w1 uppercase">Welcome to</p>
          <h1 class="text-8xl mt-5 yatri font-bold w1 tracking-widest">Artuallery</h1>
          <p class="text-2xl font-medium opacity-60 mt-6 uppercase w1">A virtual art gallery</p>
          <br/><br/>
          <div class="flex gap-10 text-xl items-center w1">
          
            <div class="text-center ">
              <i class="ri-arrow-up-line"></i>
              <div class="flex gap-10">
                <i class="ri-arrow-left-line"></i>
                <i class="ri-arrow-right-line"></i>
              </div>
              <i class="ri-arrow-down-line"></i>
            </div>
            <p>Control with arrow keys </p>
            <div>
              <i class="ri-mouse-line"></i>
            </div>
            <p>Control With Mouse</p>
          </div>
           <button
              id="start-exploring"
              class="bg-black text-white mt-24 px-4 py-2 text-base rounded-lg w1"
            >
              Start Exploring <i class="ri-arrow-right-line"></i>
            </button></div>
        </div>
        
        </div>
        <div id="art-info" class="absolute hidden top-4 right-4 bg-white p-4 rounded-xl">
        <div class="flex items-start justify-between gap-10">
        <div class="">
        <h1 id="painting-title" class="text-2xl font-semibold leading-none"></h1>
        <h1 id="painting-painter" class="text-lg font-semibold opacity-65"></h1></div>
        <button id="showMore"><i class="ri-arrow-down-s-line text-2xl"></i></button>
        </div>
        <div class=" max-w-lg space-y-2">
        <p id="painting-desc" class="text-xl line-clamp-2">"Wheat Field with Cypresses" is one of Vincent van Gogh's most vibrant and expressive landscape paintings, created in 1889 while he was staying at the Saint-Paul-de-Mausole asylum in Saint-Rémy-de-Provence. The painting depicts a golden wheat field with towering cypress trees set against a swirling, energetic sky</p>
        <table>
        
        </table>        
        </div>

        
        </div>
        <canvas id="canvas" class="canvas"></canvas>
    </div>
`;

// Get the canvas element
const canvas = document.getElementById("canvas");
const startExploring = document.getElementById("start-exploring");
const shoreMore = document.getElementById("showMore");

shoreMore.addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("painting-desc").classList.toggle("hidden");
});

const wc = document.getElementById("welcome-screen");
startExploring.addEventListener("click", startExploringfun);
gsap.from("#welcome-bg", {
  width: "100%",
  height: "100%",
  delay: 1,
  duration: 2,
});
gsap.from(".w1", {
  y: 20,
  opacity: 0,
  delay: 0.2,
  duration: 1,
  ease: "back.inOut ",
  stagger: 0.2,
  // repeat: -1,
  // yoyo: true,
});

function startExploringfun() {
  // wc.classList.add("hidden");
  // Trigger GSAP animations

  gsap.from("#welcome-bg", {
    width: "100%",
    height: "100%",
    delay: 0.5,
    duration: 2,
  });

  gsap.from(".w1", {
    y: 20,
    opacity: 0,
    delay: 0.2,
    duration: 1,
    ease: "back.inOut",
    stagger: 0.2,
  });

  // Optional: Perform other actions on button click (e.g., hiding the welcome screen)
  gsap.to("#welcome-screen", {
    opacity: 0,
    duration: 1,
    onComplete: () => {
      document.getElementById("welcome-screen").style.display = "none"; // Hide the welcome screen
    },
  });
}

// setupCounter(startExploring);

const artWork = document.getElementById("art-bg");
setupArtWork(artWork);

gsap.to(".bg-cover-even", {
  y: "-200%",
  delay: 0,
  // repeat: 3,
  duration: 4,
  // ease: "expo.in",
  // yoyo: true,
});

gsap.from(".bg-cover-odd", {
  y: "-200%",
  delay: 0,
  duration: 4,
  // ease: "elastic.in",
  // yoyo: true,
});

// Make the canvas cover the screen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// initializeRegl(canvas);
initGallery(canvas);
