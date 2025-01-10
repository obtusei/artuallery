import reglConstructor from "regl";

export function initializeRegl(canvas) {
  // Initialize regl with the provided canvas
  const regl = reglConstructor({ canvas });

  // Define the triangle vertices
  const drawTriangle = regl({
    vert: `
        precision mediump float;
        attribute vec2 position;
        void main() {
            gl_Position = vec4(position, 0, 1);
        }
        `,
    frag: `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1, 0, 0, 1); // Red color
        }
        `,
    attributes: {
      position: [
        [-1, -1], // Bottom-left corner
        [1, -1], // Bottom-right corner
        [0, 1], // Top-center corner
      ],
    },
    count: 3, // Number of vertices
  });

  // Render the triangle
  regl.frame(() => {
    regl.clear({
      color: [0, 0, 0, 1], // Black background
      depth: 1,
    });
    drawTriangle();
  });
}
