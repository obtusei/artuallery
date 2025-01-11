"use strict";

module.exports = function initGallery(canvas) {
  var useReflexion = true;
  var showStats = true;

  // Set the canvas size to match the screen
  // canvas.width = window.innerWidth * window.devicePixelRatio;
  // canvas.height = window.innerHeight * window.devicePixelRatio;

  // Scale down for CSS dimensions
  // canvas.style.width = `${window.innerWidth}px`;
  // canvas.style.height = `${window.innerHeight}px`;

  // ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

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
      paintings.forEach((painting) => {
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
          const artInfo = document.getElementById("art-info");
          artInfo.classList.remove("hidden");
          let paintingTitle = document.getElementById("painting-title");
          let paintingPainter = document.getElementById("painting-painter");
          paintingTitle.innerHTML = painting.title || "Unknown Title";
          paintingPainter.innerHTML = painting.artist_title || "Unknown Artist";
          // console.log(
          //   `Near painting: ${JSON.stringify(painting) || "Unknown Title"}`
          // );
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
};
