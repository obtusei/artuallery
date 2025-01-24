import "./style.css";
import { setupArtWork } from "./others/welcome";

import initGallery from "./gallery";
import gsap from "gsap";
document.querySelector("#app").innerHTML = `
    <div class="canvas-container">
  <div
    id="welcome-screen"
    class="absolute inset-0 flex items-center justify-center bg-red-200/10"
  >
    <div id="art-bg" class="absolute hidden md:grid grid-cols-10 inset-0 gap-2"></div>
    <div
      id="welcome-bg"
      class="flex flex-col items-center justify-center text-center gap-4 p-40 rounded-3xl relative"
    >
      <div class="absolute bg-white inset-0 blur-2xl rounded-3xl"></div>
      <div class="z-0 flex flex-col items-center justify-center">
        <p class="font-semibold text-lg md:text-2xl w1 uppercase">Welcome to</p>
        <h1 class="text-4xl md:text-8xl mt-5 yatri font-bold w1 tracking-widest">
          Artuallery
        </h1>
        <p class="text-lg md:text-2xl font-medium opacity-60 mt-6 uppercase w1">
          A virtual art gallery
        </p>
        <button
          id="start-exploring"
          class="bg-black text-white mt-24 flex gap-2 px-4 py-2 text-base rounded-lg w1"
        >
          Start Exploring <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-arrow-right"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
        </button>
      </div>
    </div>
  </div>

  <div
    id="art-info"
    class="absolute transition-all duration-300 hidden left-0 md:left-auto z-z-50 bottom-0 right-4 w-full md:w-[450px] h-[54%] overflow-y-scroll no-scrollbar bg-white/50 backdrop-blur-xl p-6 rounded-t-3xl"
  >
    <div class="flex items-start justify-between gap-10">
      <div class="">
        <h1 id="painting-title" class="text-3xl font-semibold leading-none">
          The Bedroom
        </h1>
        <button id="painting-painter" class="text-xl text-left font-semibold opacity-65">
          Vincent Van Gogh
        </button>
      </div>
      <button id="showMore" class="duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide text-2xl lucide-chevron-down"><path d="m6 9 6 6 6-6"/></svg>
      </button>
    </div>
    <div id="paiting-details" class="max-w-lg hidden space-y-2 mt-4">
      <p id="painting-desc" class="text-xl">
      </p>
    </div>
  </div>

  <div
    id="bottom-control"
    class="items-center gap-4 absolute top-20 right-4 md:top-auto md:right-auto md:bottom-4 md:left-4 hidden text-sm rounded-xl"
  >
    <button
      id="fullscreen-button"
      class="bg-white/20 backdrop-blur-xl text-white p-4 px-4 rounded-full"
    >
      <svg id="maximum" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-maximize"><path d="M8 3H5a2 2 0 0 0-2 2v3"/><path d="M21 8V5a2 2 0 0 0-2-2h-3"/><path d="M3 16v3a2 2 0 0 0 2 2h3"/><path d="M16 21h3a2 2 0 0 0 2-2v-3"/></svg>
      <svg id="minimum" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minimize absolute top-[30%] hidden origin-center"><path d="M8 3v3a2 2 0 0 1-2 2H3"/><path d="M21 8h-3a2 2 0 0 1-2-2V3"/><path d="M3 16h3a2 2 0 0 1 2 2v3"/><path d="M16 21v-3a2 2 0 0 1 2-2h3"/></svg>
      
    </button>
    <div
      class="md:flex bg-black/10 hidden backdrop-blur-xl text-white rounded-full items-center h-fit p-2 gap-2"
    >
      <div id="bottom-info" class="flex shrink-0 items-center gap-2 w-[460px]">
        <div class="flex gap-2 items-center shrink-0 p-2 px-3 rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-circle-arrow-up"><circle cx="12" cy="12" r="10"/><path d="m16 12-4-4-4 4"/><path d="M12 16V8"/></svg>Use keyboard Arrow keys to move
        </div>
        <div class="flex gap-2 items-center shrink-0 p-2 px-3 rounded-full">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="lucide lucide-rotate-3d"
          >
            <path
              d="M16.466 7.5C15.643 4.237 13.952 2 12 2 9.239 2 7 6.477 7 12s2.239 10 5 10c.342 0 .677-.069 1-.2"
            />
            <path d="m15.194 13.707 3.814 1.86-1.86 3.814" />
            <path
              d="M19 15.57c-1.804.885-4.274 1.43-7 1.43-5.523 0-10-2.239-10-5s4.477-5 10-5c4.838 0 8.873 1.718 9.8 4"
            />
          </svg>
          <p>Use Mouse to rotate</p>
        </div>
      </div>
      <button
        id="hide-control-button"
        class="flex hover:bg-white/30 gap-2 items-center p-2 px-2 rounded-full"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-right"><path d="m9 18 6-6-6-6"/></svg>
      </button>
    </div>
  </div>

  <div
    id="settings-container"
    class="fixed hidden top-4 left-4 bg-white/20 backdrop-blur-xl p-0 w-[48px] h-[48px] rounded-3xl"
  >
    <button
      id="settings-button"
      class="bg-white/20 text-white p-3 px-3 rounded-full"
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-settings-2"><path d="M20 7h-9"/><path d="M14 17H5"/><circle cx="17" cy="17" r="3"/><circle cx="7" cy="7" r="3"/></svg>
    </button>
    <div id="settings-list" class="mt-4 opacity-0 hidden space-y-3 ">
      

      <div class="flex items-center justify-between">
        <p class="text-lg">Wall</p>
        <select id="wall-select" class="bg-black/10 rounded-xl px-2 py-1">
          <option value="wall_1.jpg" selected>Wall 1</option>
          <option value="wall_2.jpg">Wall 2</option>
          <option value="wall_3.jpg">Wall 3</option>
          <option value="wall_4.jpg">Wall 4</option>
          <option value="wall_5.jpg">Wall 5</option>
        </select>
      </div>

      <div class="flex items-center justify-between">
        <p class="text-lg">Floor</p>
        <select id="floor-select" class="bg-black/10 rounded-xl px-2 py-1">
          <option value="floor.jpg">Floor 1</option>
          <option value="floorer.jpg">Floor 2</option>
          <option value="wall_1.jpg">Floor 3</option>
          <option value="wall_2.jpg">Floor 4</option>
        </select>
      </div>
    </div>
  </div>
  <audio id="audio-player" src="/music.mp3" loop></audio>
  <div
    id="music-player"
    class="fixed hidden top-4 right-4 bg-gray-400 p-0 w-[48px] h-[48px] rounded-3xl"
  >
    <button
      id="music-button"
      class="bg-white/20 text-white p-3 px-3 rounded-full"
    >
    <svg id="play-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-music"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>
      
    </button>
  </div>

  <!-- ARTIST INFO -->
  <div
    id="artist-info"
    class="absolute duration-300 transition-all translate-y-full h-1/2 left-4 md:left-auto bottom-0 right-4 md:w-[450px] overflow-y-scroll no-scrollbar bg-white/50 backdrop-blur-xl p-6 rounded-t-3xl"
  >
    <div class="flex items-start justify-between gap-10">
      <div class="">
        <h1 id="artist-title" class="text-2xl font-semibold leading-none"></h1>
        <h1 id="artist-dob" class="text-xl font-semibold opacity-65"></h1>
      </div>
      <button id="close-artist" class="duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x text-2xl"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
      </button>
    </div>
    <div class="max-w-lg space-y-2 mt-4">
      <p id="artist-desc" class="text-xl"></p>
    </div>
  </div>

  <canvas id="canvas" class="canvas"></canvas>
</div>



`;

// Get the canvas element
const canvas = document.getElementById("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// canvas.classList.add("nocursor");
const startExploring = document.getElementById("start-exploring");
const showMore = document.getElementById("showMore");
const paintingDetails = document.getElementById("paiting-details");
const bottomControl = document.getElementById("bottom-control");
const bottomInfo = document.getElementById("bottom-info");
const fullscreenButton = document.getElementById("fullscreen-button");
const hideControlButton = document.getElementById("hide-control-button");

//Settings
const settingsContainer = document.getElementById("settings-container");
const settingsButton = document.getElementById("settings-button");

settingsButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (settingsButton.classList.contains("show-settings")) {
    gsap.to("#settings-list", {
      opacity: 0,
      display: "none",
      duration: 0.1,
    });
    gsap.to("#settings-container", {
      width: "48px",
      height: "48px",
      padding: "0",
      delay: 0.1,
    });
  } else {
    gsap.to("#settings-container", {
      width: "288px",
      height: "208px",
      padding: "12px",
    });
    gsap.to("#settings-list", {
      opacity: 1,
      display: "block",
      duration: 0.1,
      delay: 0.3,
    });
  }
  settingsButton.classList.toggle("show-settings");
});

// Audio Player

const musicPlayer = document.getElementById("music-player");
//play audio on dom load
document.addEventListener("DOMContentLoaded", () => {
  const audioPlayer = document.getElementById("audio-player");
  const musicButton = document.getElementById("music-button");
  const playIcon = document.getElementById("play-icon");
  audioPlayer.play();
  musicButton.addEventListener("click", (event) => {
    event.preventDefault();
    if (musicButton.classList.contains("playing")) {
      audioPlayer.pause();
      playIcon.classList.remove("animate-ghum");
    } else {
      audioPlayer.play();
      playIcon.classList.add("animate-ghum");
    }
    musicButton.classList.toggle("playing");
  });
  playIcon.classList.add("animate-ghum");
  musicButton.classList.add("playing");
});

hideControlButton.addEventListener("click", (event) => {
  event.preventDefault();
  if (bottomInfo.classList.contains("w-[460px]")) {
    gsap
      .to("#bottom-info", {
        opacity: 0,
        width: 0,
        duration: 0.5,
      })
      .then(() => {
        bottomInfo.classList.toggle("hidden");
        bottomInfo.classList.toggle("flex");
      });
  } else {
    gsap.to("#bottom-info", {
      opacity: 1,
      width: "460px",
      duration: 0.5,
    });
    bottomInfo.classList.toggle("hidden");
    bottomInfo.classList.toggle("flex");
  }
  bottomInfo.classList.toggle("w-[460px]");
});

// Fullscreen and Guidance

fullscreenButton.addEventListener("click", (event) => {
  event.preventDefault();
  document.documentElement.requestFullscreen();
  let maximunIcon = document.getElementById("maximum");
  let minimumIcon = document.getElementById("minimum");
  maximunIcon.classList.add("invisible");
  minimumIcon.classList.remove("hidden");
  if (document.fullscreenElement) {
    document.exitFullscreen();
    maximunIcon.classList.remove("invisible");
    minimumIcon.classList.add("hidden");
    return;
  }
});

//4. art and artist (bottom right)
const artistInfo = document.getElementById("artist-info");
const artInfo = document.getElementById("art-info");
const showMoreArtist = document.getElementById("painting-painter");
const closeArtist = document.getElementById("close-artist");

showMoreArtist.addEventListener("click", (event) => {
  artistInfo.classList.toggle("translate-y-full");
  artInfo.classList.remove("rounded-t-3xl");
  artInfo.classList.add("rounded-t-xl");
  artInfo.classList.add("scale-90");
  artInfo.classList.add("opacity-80");
});

closeArtist.addEventListener("click", (event) => {
  artistInfo.classList.toggle("translate-y-full");
  artInfo.classList.add("rounded-t-3xl");
  artInfo.classList.remove("rounded-t-xl");
  artInfo.classList.remove("scale-90");
  artInfo.classList.remove("opacity-80");
});

showMore.addEventListener("click", (event) => {
  event.preventDefault();

  showMore.classList.toggle("-rotate-180");

  if (paintingDetails.classList.contains("hidden")) {
    // artInfo.classList.toggle("h-[54%]");
    artInfo.classList.add("h-[54%]");
    artInfo.classList.remove("h-[12%]");
    gsap.to("#paiting-details", {
      height: "550px",
      // opacity: 1,
      duration: 0.5,
    });
    gsap.to("#paiting-details", {
      opacity: 1,
      delay: 0.2,
    });
    document.getElementById("paiting-details").classList.toggle("hidden");
  } else {
    artInfo.classList.remove("h-[54%]");
    artInfo.classList.add("h-[12%]");
    gsap.to("#paiting-details", {
      opacity: 0,
    });
    gsap
      .to("#paiting-details", {
        height: "0px",
        display: "hidden",
        duration: 0.5,
        delay: 0.2,
      })
      .then(() => {
        document.getElementById("paiting-details").classList.toggle("hidden");
      });
  }
});

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
});

function startExploringfun() {
  // wc.classList.add("hidden");
  // Trigger GSAP animations
  // bottomControl.classList.remove("hidden");
  // bottomControl.classList.add("flex");
  paintingDetails.classList.toggle("hidden");
  settingsContainer.classList.toggle("hidden");
  bottomControl.classList.add("flex");
  bottomControl.classList.remove("hidden");
  musicPlayer.classList.toggle("hidden");
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
  duration: 4,
});

gsap.from(".bg-cover-odd", {
  y: "-200%",
  delay: 0,
  duration: 4,
});

initGallery(canvas);
