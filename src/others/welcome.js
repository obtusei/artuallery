const api = require("../api/local");

export function setupArtWork(element) {
  const images = ["/1.webp", "/2.webp", "/3.webp", "/4.webp", "/5.webp"];
  const columns = 10; // Number of columns in the grid
  const rows = 10; // Number of rows in the grid
  const totalImages = columns * rows;

  // Create the grid layout
  // element.style.display = "grid";
  // element.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  // element.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  // element.style.gap = "10px";

  let index = 0;

  // Function to update the grid
  function updateGrid() {
    element.innerHTML = ""; // Clear the current grid

    for (let i = 0; i < totalImages; i++) {
      const img = document.createElement("img");
      img.src = images[index];
      img.alt = "Artwork";
      img.style.width = "100%";
      img.style.height = "100%";
      img.style.objectFit = "cover";
      if (index % 2 == 0) {
        img.classList.add("bg-cover-even");
      } else {
        img.classList.add("bg-cover-odd");
      }

      element.appendChild(img);

      // Move to the next image, looping back to the start
      index = (index + 1) % images.length;
    }
  }

  // Initial grid setup
  updateGrid();

  // let counter = 0;
  // const setCounter = (count) => {
  //   counter = count;
  //   element.innerHTML = `count is ${counter}`;
  // };
  // element.addEventListener("click", () => setCounter(counter + 1));
  // setCounter(0);
}

export const setupCounter = (element) => {
  let counter = 0;
  let ws = document.getElementById("welcome-screen");

  const counterElement = element;
  const setCounter = (count) => {
    counter = count;
    // ws.classList.add("hidden");
  };
  element.addEventListener("click", () => setCounter(counter + 1));
  setCounter(0);
};

module.exports = { setupArtWork };
