"strict mode";

const textHeight = 32;
const textCanvas = document.createElement("canvas");
textCanvas.style.backgroundColor = "rgba(0,0,0,0)";
const maxWidth = (textCanvas.width = textCanvas.height = 1024);
const ctx = textCanvas.getContext("2d");
ctx.mozImageSmoothingEnabled = false;
ctx.webkitImageSmoothingEnabled = false;
ctx.font = textHeight + "px Verdana";
ctx.textBaseline = "bottom";
ctx.fillStyle = "#aaa";

// from https://delphic.me.uk/tutorials/webgl-text
function createMultilineText(ctx, textToWrite, maxWidth, text) {
  var currentText = textToWrite;
  var futureText;
  var subWidth = 0;
  var maxLineWidth = 0;

  var wordArray = textToWrite.split(" ");
  var wordsInCurrent, wordArrayLength;
  wordsInCurrent = wordArrayLength = wordArray.length;

  while (ctx.measureText(currentText).width > maxWidth && wordsInCurrent > 1) {
    wordsInCurrent--;
    currentText = futureText = "";
    for (var i = 0; i < wordArrayLength; i++) {
      if (i < wordsInCurrent) {
        currentText += wordArray[i];
        if (i + 1 < wordsInCurrent) currentText += " ";
      } else {
        futureText += wordArray[i];
        if (i + 1 < wordArrayLength) futureText += " ";
      }
    }
  }
  text.push(currentText);
  maxLineWidth = ctx.measureText(currentText).width;

  if (futureText) {
    subWidth = createMultilineText(ctx, futureText, maxWidth, text);
    if (subWidth > maxLineWidth) {
      maxLineWidth = subWidth;
    }
  }

  return maxLineWidth;
}

module.exports = {
  init(texture, textToWrite, paintingWidth = maxWidth) {
    var text = [];
    createMultilineText(
      ctx,
      textToWrite,
      Math.min(paintingWidth * maxWidth, maxWidth),
      text
    );

    ctx.clearRect(0, 0, textCanvas.width, textCanvas.height);
    for (var i = 0; i < text.length; i++) {
      ctx.fillText(
        text[i],
        0,
        textCanvas.height - (Math.max(text.length, 3) - i) * textHeight
      );
    }

    // Store the text for use in click handling
    this.currentText = textToWrite;

    return texture({
      data: textCanvas,
      min: "mipmap",
      mipmap: "nice",
      flipY: true,
    });
  },
  draw(regl) {
    const drawCommand = regl({
      frag: `
            precision mediump float;
            uniform sampler2D tex;
            varying vec2 uv;
        
            void main () {
                float c = texture2D(tex, uv).r;
                gl_FragColor = vec4(0,0,0, c);
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

    // Add click handler to canvas
    regl._gl.canvas.addEventListener("click", (event) => {
      // Get click coordinates relative to canvas
      const rect = event.target.getBoundingClientRect();
      const x = event.clientX - rect.left;
      const y = event.clientY - rect.top;

      // Check if click is within text bounds
      // This is a simple check - you might need to adjust based on your specific needs
      if (x >= 0 && x <= rect.width && y >= 0 && y <= rect.height) {
        // alert("Text clicked: I love " + this.currentText);
      }
    });

    return drawCommand;
  },
};
