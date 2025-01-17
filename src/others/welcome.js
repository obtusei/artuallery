const api = require("../api/artic");

export function setupArtWork(element) {
  const images = [
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcFjdefo7IMBJWFavZbMXo3gUzjs5Ppt31CKOsP3n7F_ye118iIXf4_GG9ECBJQ-LeWe1fxv6ZFtN3FqdgpPEwhA", // Replace these with your actual image URLs
    "https://m.media-amazon.com/images/I/71fwPFoOGCL.jpg",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Edvard_Munch_-_Vampire_%281895%29_-_Google_Art_Project.jpg/800px-Edvard_Munch_-_Vampire_%281895%29_-_Google_Art_Project.jpg",
    "https://encrypted-tbn3.gstatic.com/images?q=tbn:ANd9GcSZcOPJMG1QkUwZClpPHZUwI45J6XQJRyil-il32-21mLfG_V-17ql7ZPLl5lYh0xXM6wPT06a4vhxfAmWc81vzoPtWsBxaoG-OhuuHUyc",
    "https://lh3.googleusercontent.com/ci/AL18g_Rfqyk6VUKEGh78wLGSTR8HOMQqJMzW6fz1aK4oEUentLkLdlSPsYYEBELF1cSAiOFE_mNA3w=s1200",
  ];

  api.fetchList(0, 100).then(async (paintings) => {
    const imageID = await paintings[0].image_id;
    try {
      // Fetch the image object using the image ID
      const image = await api.fetchImage({ image_id: imageID }, "high");

      // Check if image.image is a Blob
      if (image && image.image instanceof Blob) {
        // Create a URL for the Blob
        const imageUrl = URL.createObjectURL(image.image);
        // console.log("Image URL:", imageUrl);

        // Push the Blob URL into the images array
        images.push(imageUrl);
      } else {
        console.error("The fetched image is not a Blob:", image.image);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  });

  const columns = 10; // Number of columns in the grid
  const rows = 10; // Number of rows in the grid
  const totalImages = columns * rows;

  // Create the grid layout
  element.style.display = "grid";
  element.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
  element.style.gridTemplateRows = `repeat(${rows}, 1fr)`;
  element.style.gap = "10px";

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
