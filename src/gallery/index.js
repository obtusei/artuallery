"use strict";

// const { fetchDetail, fetchArtist } = require("../api/artic");
// const { fetchAuthorDetail } = require("../api/local");
import local from "../api/local";

export default function initGallery(canvas) {
  var useReflexion = false;
  var showStats = false;

  // Handle different screen ratios
  const mapVal = (value, min1, max1, min2, max2) =>
    min2 + ((value - min1) * (max2 - min2)) / (max1 - min1);
  var fovX = () =>
    mapVal(
      window.innerWidth / window.innerHeight,
      16 / 9,
      9 / 16,
      1.7,
      Math.PI / 3
    );

  if (navigator.userAgent.match(/(iPad)|(iPhone)|(iPod)|(android)|(webOS)/i)) {
    useReflexion = false;
    fovX = () =>
      mapVal(
        window.innerWidth / window.innerHeight,
        16 / 9,
        9 / 16,
        1.5,
        Math.PI / 3
      );
  }
  var fovY = () =>
    2 *
    Math.atan(
      (Math.tan(fovX() * 0.5) * window.innerHeight) / window.innerWidth
    );

  const Stats = require("stats.js");
  var stats = new Stats();
  stats.showPanel(0);
  if (showStats) {
    document.body.appendChild(stats.dom);
  }

  let regl, map, drawMap, placement, drawPainting, fps;

  regl = require("regl")({
    canvas: canvas, // Use the provided canvas
    extensions: ["OES_element_index_uint", "OES_standard_derivatives"],
    optionalExtensions: ["EXT_texture_filter_anisotropic"],
    attributes: { alpha: false },
  });

  map = require("./map")();
  const mesh = require("./mesh");
  drawMap = mesh(regl, map, useReflexion);
  placement = require("./placement")(regl, map);
  drawPainting = require("./painting")(regl);
  fps = require("./fps")(map, fovY);

  const context = regl({
    cull: {
      enable: true,
      face: "back",
    },
    uniforms: {
      view: fps.view,
      proj: fps.proj,
      yScale: 1.0,
    },
  });

  const reflexion = regl({
    cull: {
      enable: true,
      face: "front",
    },
    uniforms: {
      yScale: -1.0,
    },
  });

  let prevPos = [null, null, null]; // To store the previous position

  const positionChanged = (currentPos, prevPos, threshold = 0.1) => {
    return (
      Math.abs(currentPos[0] - prevPos[0]) > threshold ||
      Math.abs(currentPos[1] - prevPos[1]) > threshold ||
      Math.abs(currentPos[2] - prevPos[2]) > threshold
    );
  };

  regl.frame(({ time }) => {
    stats.begin();
    fps.tick({
      time,
    });
    // Check if position has changed significantly
    placement.update(fps.pos, fps.fmouse[1], fovX());
    if (positionChanged(fps.pos, prevPos)) {
      // Update painting placements
      // Proximity check for paintings
      const threshold = 5.0; // Define a threshold distance for "nearness"
      const paintings = placement.batch(); // Get visible paintings
      paintings.forEach(async (painting) => {
        const paintingPos = painting.vseg
          ? [
              (painting.vseg[0][0] + painting.vseg[1][0]) / 2,
              (painting.vseg[0][1] + painting.vseg[1][1]) / 2,
            ]
          : null;
        if (!paintingPos) return;
        const distance = Math.sqrt(
          Math.pow(fps.pos[0] - paintingPos[0], 2) +
            Math.pow(fps.pos[2] - paintingPos[1], 2) // Compare X and Z coordinates
        );
        if (distance < threshold) {
          let paintingTitle = document.getElementById("painting-title");
          let paintingPainter = document.getElementById("painting-painter");
          let paintingDesc = document.getElementById("painting-desc");
          // let paintingCreated = document.getElementById("painting-created");
          // let paintingOrigin = document.getElementById("painting-origin");
          // let paintingDimensions = document.getElementById(
          //   "painting-dimensions"
          // );
          // let paintingMedium = document.getElementById("painting-medium");
          // let paintingStyle = document.getElementById("painting-style");
          // let paintingCategory = document.getElementById("painting-category");
          // let paintingTags = document.getElementById("painting-tags");
          const artInfo = document.getElementById("art-info");
          // const data = await fetchDetail(painting.id);
          // console.log(painting);

          let artistTitle = document.getElementById("artist-title");
          let artistDesc = document.getElementById("artist-desc");
          let artistDob = document.getElementById("artist-dob");

          if (painting.author_id) {
            var artistData = await local().fetchAuthorDetail(
              painting.author_id
            );
            // console.log(artistData);
            artistTitle.innerHTML = artistData.name || "Unknown Artist";
            artistDesc.innerHTML = artistData.desc || "No Description";
            artistDob.innerHTML = `${artistData.images} images` || "N/A";
          }

          artInfo.classList.remove("hidden");
          paintingTitle.innerHTML = painting.title || "Unknown Title";
          paintingPainter.innerHTML = artistData.name || "Unknown Artist";
          paintingDesc.innerHTML = painting.desc || "No Description";
          // paintingCreated.innerHTML = data.date_display || "N/A";
          // paintingOrigin.innerHTML = data.place_of_origin || "N/A";
          // paintingDimensions.innerHTML = data.dimensions || "N/A";
          // paintingMedium.innerHTML = data.medium_display || "N/A";
          // paintingStyle.innerHTML = data.style_title || "N/A";
          // paintingCategory.innerHTML = data.category_titles.join(", ") || "N/A";
        }
      });
      // Update the previous position
      prevPos = [...fps.pos];
    }
    regl.clear({
      color: [0, 0, 0, 1],
      depth: 1,
    });
    context(() => {
      if (useReflexion) {
        reflexion(() => {
          drawMap();
          drawPainting(placement.batch());
        });
      }
      drawMap();
      drawPainting(placement.batch());
    });
    stats.end();
  });
}
