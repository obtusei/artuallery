"use strict";

const cardCanvas = document.createElement("canvas");
const maxWidth = (cardCanvas.width = cardCanvas.height = 1024);
const ctx = cardCanvas.getContext("2d");

// Card styling constants
const CARD_PADDING = 20;
const TITLE_FONT_SIZE = 24;
const DESC_FONT_SIZE = 16;
const BUTTON_HEIGHT = 40;
const CARD_MARGIN = 40;
const POPOVER_WIDTH = 300;
const POPOVER_HEIGHT = 200;

// Create and style the popover element
const createPopover = (text) => {
  const popover = document.createElement("div");
  popover.style.cssText = `
    position: fixed;
    background: white;
    border-radius: 8px;
    padding: 16px;
    width: ${POPOVER_WIDTH}px;
    max-height: ${POPOVER_HEIGHT}px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: none;
    z-index: 1000;
    font-family: Arial, sans-serif;
  `;
  popover.textContent = text;
  document.body.appendChild(popover);
  return popover;
};

// Create and style the button
const createButton = (text, onClick) => {
  const button = document.createElement("button");
  button.style.cssText = `
    position: absolute;
    padding: 8px 16px;
    background: #f1f5f9;
    border: 1px solid #e2e8f0;
    border-radius: 4px;
    cursor: pointer;
    font-family: Arial, sans-serif;
    transition: background 0.2s;
  `;
  button.textContent = text;
  button.addEventListener(
    "mouseover",
    () => (button.style.background = "#e2e8f0")
  );
  button.addEventListener(
    "mouseout",
    () => (button.style.background = "#f1f5f9")
  );
  button.addEventListener("click", onClick);
  return button;
};

// Draw the card on the canvas
function drawCard(ctx, title, description) {
  // Clear canvas
  ctx.clearRect(0, 0, cardCanvas.width, cardCanvas.height);

  // Draw white card background
  ctx.fillStyle = "white";
  ctx.shadowColor = "rgba(0, 0, 0, 0.1)";
  ctx.shadowBlur = 10;
  ctx.shadowOffsetY = 4;
  ctx.fillRect(
    CARD_MARGIN,
    CARD_MARGIN,
    cardCanvas.width - CARD_MARGIN * 2,
    cardCanvas.height - CARD_MARGIN * 2
  );

  // Reset shadow
  ctx.shadowColor = "transparent";
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;

  // Draw title
  ctx.font = `bold ${TITLE_FONT_SIZE}px Arial`;
  ctx.fillStyle = "#1a1a1a";
  ctx.fillText(
    title,
    CARD_MARGIN + CARD_PADDING,
    CARD_MARGIN + CARD_PADDING + TITLE_FONT_SIZE
  );

  // Draw description
  ctx.font = `${DESC_FONT_SIZE}px Arial`;
  ctx.fillStyle = "#4a4a4a";
  const words = description.split(" ");
  let line = "";
  let y = CARD_MARGIN + CARD_PADDING + TITLE_FONT_SIZE + 20;

  for (let word of words) {
    const testLine = line + word + " ";
    const metrics = ctx.measureText(testLine);
    if (metrics.width > cardCanvas.width - (CARD_MARGIN + CARD_PADDING) * 2) {
      ctx.fillText(line, CARD_MARGIN + CARD_PADDING, y);
      line = word + " ";
      y += DESC_FONT_SIZE + 5;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, CARD_MARGIN + CARD_PADDING, y);

  // Draw button outline
  ctx.strokeStyle = "#e2e8f0";
  ctx.lineWidth = 1;
  const buttonY = y + CARD_PADDING;
  ctx.strokeRect(CARD_MARGIN + CARD_PADDING, buttonY, 150, BUTTON_HEIGHT);

  // Draw button text
  ctx.font = "16px Arial";
  ctx.fillStyle = "#64748b";
  ctx.fillText(
    "Read More",
    CARD_MARGIN + CARD_PADDING + 35,
    buttonY + BUTTON_HEIGHT / 2 + 5
  );

  return buttonY; // Return the button's Y position for hit testing
}

export function init(texture, cardData, width = maxWidth) {
  const { title, description, fullDetails } = cardData;

  // Draw initial card
  const buttonY = drawCard(ctx, title, description);

  // Create popover for full details
  const popover = createPopover(fullDetails);

  // Create invisible button overlay
  const button = createButton("Read More", (e) => {
    popover.style.display = popover.style.display === "none" ? "block" : "none";
    popover.style.left = `${e.clientX}px`;
    popover.style.top = `${e.clientY}px`;

    // Close popover when clicking outside
    const closePopover = (evt) => {
      if (!popover.contains(evt.target) && evt.target !== button) {
        popover.style.display = "none";
        document.removeEventListener("click", closePopover);
      }
    };
    document.addEventListener("click", closePopover);
  });

  // Position button over the drawn button
  button.style.position = "fixed";
  button.style.opacity = "0";
  document.body.appendChild(button);

  // Update button position on scroll/resize
  const updateButtonPosition = () => {
    const rect = cardCanvas.getBoundingClientRect();
    button.style.left = `${rect.left + CARD_MARGIN + CARD_PADDING}px`;
    button.style.top = `${rect.top + buttonY}px`;
    button.style.width = "150px";
    button.style.height = `${BUTTON_HEIGHT}px`;
  };

  window.addEventListener("scroll", updateButtonPosition);
  window.addEventListener("resize", updateButtonPosition);
  updateButtonPosition();

  return texture({
    data: cardCanvas,
    min: "mipmap",
    mipmap: "nice",
    flipY: true,
  });
}

export function draw(regl) {
  return regl({
    frag: `
        precision mediump float;
        uniform sampler2D tex;
        varying vec2 uv;
    
        void main () {
          vec4 color = texture2D(tex, uv);
          gl_FragColor = color;
        }`,

    vert: `
        precision highp float;
        uniform mat4 proj, view, model;
        uniform float yScale;
        attribute vec2 pos;
        varying vec2 uv;
        
        void main () {
          uv = pos;
          vec4 mpos = model * vec4(pos, 0.001, 1);
          mpos.y *= yScale;
          gl_Position = proj * view * mpos;
        }`,

    attributes: {
      pos: [0, 0, 1, 0, 0, 1, 1, 1, 0, 1, 1, 0],
    },

    uniforms: {
      model: regl.prop("textmodel"),
      tex: regl.prop("text"),
    },

    count: 6,

    blend: {
      enable: true,
      func: {
        srcRGB: "src alpha",
        srcAlpha: "one minus src alpha",
        dstRGB: "one minus src alpha",
        dstAlpha: 1,
      },
      color: [0, 0, 0, 0],
    },
  });
}
