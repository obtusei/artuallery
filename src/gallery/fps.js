"use strict";
// const mat4 = require("gl-mat4");
// const vec3 = require("gl-vec3");
// const lock = require("pointer-lock");
import mat4 from "gl-mat4";
import vec3 from "gl-vec3";
import lock from "pointer-lock";

const mouseSensibility = 0.002;
const touchSensibility = 0.008;
const rotationFilter = 0.95;
const limitAngle = Math.PI / 4;
const slowAngle = Math.PI / 6;
const durationToClick = 300;
const distToClick = 20;
const walkSpeed = 7;
const runSpeed = 12;
const walkStepLen = 3.6;
const runStepLen = 5;
const height = 2;
const stepHeight = 0.03;
const distToWalls = 0.5;
const viewingDist = 3;
const paintingSnapDist = 1.3;
const yLimitTouch = 5;
const touchDistLimit = 40;
const rayStep = 4;
const tpDuration = 1;

const sdLine = (p, a, b, tmp1, tmp2) => {
  const pa = vec3.sub(tmp1, p, a);
  const ba = vec3.sub(tmp2, b, a);
  const h = Math.max(Math.min(vec3.dot(pa, ba) / vec3.dot(ba, ba), 1), 0);
  return vec3.dist(pa, vec3.scale(ba, ba, h));
};

const planeProject = (org, dir, plane) => {
  const dist = -(vec3.dot(org, plane) - plane[3]) / vec3.dot(dir, plane);
  let intersection = vec3.scale([], dir, dist);
  vec3.add(intersection, intersection, org);
  return { dist, intersection };
};

const wallProject = (org, dir, a, b) => {
  // Calculate the vertical place passing through A and B
  const vx = a[0] - b[0],
    vz = a[1] - b[1];
  const nx = -vz,
    nz = vx;
  const wAB = a[0] * nx + a[1] * nz;
  // Project to the plane
  let { dist, intersection: i } = planeProject(org, dir, [nx, 0, nz, wAB]);
  // Verify it's between A and B
  const wA = a[0] * vx + a[1] * vz;
  const wB = b[0] * vx + b[1] * vz;
  const wI = i[0] * vx + i[2] * vz;
  if ((wI > wA) + (wI > wB) !== 1) dist = Infinity;
  //console.log(dist, i);
  return { a, b, dist, intersection: i };
};

const lerp = (x, a, b) => (1 - x) * a + x * b;

const easeInOutQuad = (x) =>
  x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;

function fps({ getGridSegments, getGridParts }, fovY) {
  var mouse = [0, (Math.PI * 3) / 4];
  var fmouse = [0, (Math.PI * 3) / 4];
  var dir = [0, 0, 0];
  var pos = [2, height, 2];
  var forward = [0.707, 0, 0.707],
    up = [0, 1, 0];
  var force = [0, 0, 0];
  var walkTime = 0.5;
  var view = mat4.identity([]);
  var proj = mat4.identity([]);
  var run = false;
  var startPos = [0, 0, 0];
  var endPos = [0, 0, 0];
  var tpProgress = 1;

  const orientCamera = (dx, dy, sensibility) => {
    dx = Math.max(Math.min(dx, 100), -100);
    dy = Math.max(Math.min(dy, 100), -100);
    let smooth = 1;
    if (Math.abs(mouse[0]) > slowAngle && Math.sign(mouse[0]) == Math.sign(dy))
      smooth = (limitAngle - Math.abs(mouse[0])) / (limitAngle - slowAngle);
    mouse[0] += smooth * dy * sensibility;
    mouse[1] += dx * sensibility;
  };

  function mouseDrag() {
    let dragging = false;
    let previousMousePosition = { x: 0, y: 0 };

    window.addEventListener("mousedown", (e) => {
      dragging = true;
      previousMousePosition = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener("mouseup", () => {
      dragging = false;
    });

    window.addEventListener("mousemove", (e) => {
      if (dragging) {
        const dx = e.clientX - previousMousePosition.x;
        const dy = e.clientY - previousMousePosition.y;
        orientCamera(dx, dy, mouseSensibility);
        previousMousePosition = { x: e.clientX, y: e.clientY };
      }
    });
  }

  let canvas = document.querySelector("canvas");

  function enablePointerLock() {
    canvas.requestPointerLock =
      canvas.requestPointerLock ||
      canvas.mozRequestPointerLock ||
      canvas.webkitRequestPointerLock;
    canvas.requestPointerLock();
  }

  function pointerLockChange() {
    if (
      document.pointerLockElement === canvas ||
      document.mozPointerLockElement === canvas ||
      document.webkitPointerLockElement === canvas
    ) {
      document.addEventListener("mousemove", updateCamera, false);
    } else {
      document.removeEventListener("mousemove", updateCamera, false);
    }
  }

  function updateCamera(e) {
    const dx = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
    const dy = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
    orientCamera(dx, dy, mouseSensibility);
  }

  document.addEventListener("pointerlockchange", pointerLockChange, false);
  document.addEventListener("mozpointerlockchange", pointerLockChange, false);
  document.addEventListener(
    "webkitpointerlockchange",
    pointerLockChange,
    false
  );

  canvas.addEventListener("click", enablePointerLock, false);

  // Mouse input
  mouseDrag();

  // Touch input
  let firstTouch = false;
  let lastTouch = false;
  let touchTimestamp = 0;
  const handleTouch = (e) => {
    e.preventDefault();
    let isMouseEvent =
      e.type === "mousedown" || e.type === "mousemove" || e.type === "mouseup";
    let isTouchEvent =
      e.type === "touchstart" ||
      e.type === "touchmove" ||
      e.type === "touchend";

    const getPosition = (e) => {
      if (isTouchEvent) {
        return e.touches[0];
      } else if (isMouseEvent) {
        return { pageX: e.clientX, pageY: e.clientY };
      }
    };
    if (e.type === "touchstart" || e.type === "mousedown") {
      firstTouch = lastTouch = getPosition(e);
      touchTimestamp = e.timeStamp;
    } else if (e.type === "touchend" || e.type === "mouseup") {
      const d = Math.hypot(
        firstTouch.pageX - lastTouch.pageX,
        firstTouch.pageY - lastTouch.pageY
      );
      if (e.timeStamp - touchTimestamp < durationToClick && d < distToClick) {
        let tmp = [],
          tmp1 = [],
          tmp2 = [];
        let touchDir = [
          -1 + (2 * lastTouch.pageX) / window.innerWidth,
          1 - (2 * lastTouch.pageY) / window.innerHeight,
          0,
        ];
        vec3.transformMat4(touchDir, touchDir, mat4.invert(tmp, proj));
        vec3.transformMat4(touchDir, touchDir, mat4.invert(tmp, view));
        vec3.sub(touchDir, touchDir, pos);
        vec3.normalize(touchDir, touchDir);
        let { intersection: floorPos, dist: floorDist } = planeProject(
          pos,
          touchDir,
          [0, 1, 0, 0]
        );
        let { dist: ceilingDist } = planeProject(pos, touchDir, [
          0,
          1,
          0,
          yLimitTouch,
        ]);
        let [x, , z] = pos;
        let [dx, , dz] = touchDir;
        dx /= Math.hypot(dx, dz);
        dz /= Math.hypot(dx, dz);
        let walls = getGridSegments(x, z);
        for (let i = 0; i < touchDistLimit / rayStep; i++) {
          x += dx * rayStep;
          z += dz * rayStep;
          walls = [...walls, ...getGridSegments(x, z)];
        }
        let intersections = [...new Set(walls)]
          .map(([a, b]) => wallProject(pos, touchDir, a, b))
          .filter(
            ({ dist }) =>
              dist > 0 &&
              dist < Math.max(floorDist, ceilingDist) &&
              dist < touchDistLimit
          );
        intersections.sort((a, b) => a.dist - b.dist);
        if (intersections.length !== 0) {
          let {
            intersection: [xpos, , zpos],
          } = intersections[0];
          const nearParts = getGridParts(xpos, zpos);
          for (const [a, b] of nearParts) {
            const midX = (a[0] + b[0]) / 2;
            const midZ = (a[1] + b[1]) / 2;
            if (Math.hypot(xpos - midX, zpos - midZ) < paintingSnapDist) {
              xpos = midX;
              zpos = midZ;
              break;
            }
          }
          vec3.copy(startPos, pos);
          vec3.set(endPos, xpos, pos[1], zpos);
        } else if (floorDist > 0) {
          vec3.copy(startPos, pos);
          vec3.set(endPos, floorPos[0], pos[1], floorPos[2]);
        } else {
          return;
        }
        let collisions = getGridSegments(endPos[0], endPos[2])
          .map(([[ax, ay], [bx, by]]) => [
            [ax, height, ay],
            [bx, height, by],
          ])
          .map(([a, b]) => ({ a, b, dist: sdLine(endPos, a, b, tmp1, tmp2) }))
          .filter(({ dist }) => dist < viewingDist);
        collisions.sort((a, b) => a.dist - b.dist);
        if (collisions.length !== 0) {
          for (let { a, b } of collisions) {
            const distance = viewingDist - sdLine(endPos, a, b, tmp1, tmp2);
            if (distance < 0) continue;
            const delta = vec3.sub(tmp1, b, a).reverse();
            delta[0] = -delta[0];
            vec3.normalize(delta, delta);
            vec3.scale(delta, delta, distance);
            vec3.add(endPos, endPos, delta);
          }
        }
        tpProgress = 0;
      }
      firstTouch = lastTouch = false;
    } else if (
      (e.type === "touchmove" || e.type === "mousemove") &&
      lastTouch
    ) {
      orientCamera(
        getPosition(e).pageX - lastTouch.pageX,
        getPosition(e).pageY - lastTouch.pageY,
        touchSensibility
      );
      lastTouch = getPosition(e);
    }
  };
  canvas.addEventListener("touchstart", handleTouch, { passive: false });
  canvas.addEventListener("touchmove", handleTouch, { passive: false });
  canvas.addEventListener("touchend", handleTouch, { passive: false });
  canvas.addEventListener("mousedown", handleTouch, { passive: false });
  canvas.addEventListener("mousemove", handleTouch, { passive: false });
  canvas.addEventListener("mouseup", handleTouch, { passive: false });

  // Keyboard input
  var keys = {};
  const handleKey = (e) => {
    if (e.defaultPrevented || e.ctrlKey || e.altKey || e.metaKey) return;
    keys[e.code] = e.type === "keydown";
    run = e.shiftKey;
    const left = keys["KeyA"] || keys["ArrowLeft"] ? 1 : 0;
    const right = keys["KeyD"] || keys["ArrowRight"] ? 1 : 0;
    const up = keys["KeyW"] || keys["ArrowUp"] ? 1 : 0;
    const down = keys["KeyS"] || keys["ArrowDown"] ? 1 : 0;
    dir = [right - left, 0, down - up];
    e.preventDefault();
  };
  window.addEventListener("keydown", handleKey);
  window.addEventListener("keyup", handleKey);

  // First person scope
  var lastTime = 0;
  return {
    pos,
    fmouse,
    forward,
    up,
    view: () => view,
    proj: () => {
      mat4.perspective(
        proj,
        fovY(),
        window.innerWidth / window.innerHeight,
        0.1,
        100
      );
      return proj;
    },
    tick: ({ time }) => {
      const dt = time - lastTime;
      lastTime = time;
      let tmp1 = [0, 0, 0],
        tmp2 = [];
      vec3.set(forward, 1, 0, 0);
      vec3.set(up, 0, 1, 0);
      vec3.rotateY(force, dir, tmp1, -mouse[1]);
      vec3.rotateY(forward, forward, tmp1, -mouse[1]);
      vec3.rotateX(forward, forward, tmp1, -mouse[0]);
      vec3.rotateX(up, up, tmp1, -mouse[0]);
      vec3.normalize(force, force);
      const speed = run ? runSpeed : walkSpeed;
      vec3.scale(force, force, speed * dt);
      pos[1] = height;
      const newPos = vec3.add([], pos, force);
      const collisions = getGridSegments(newPos[0], newPos[2])
        .map(([[ax, ay], [bx, by]]) => [
          [ax, height, ay],
          [bx, height, by],
        ])
        .filter(([a, b]) => sdLine(newPos, a, b, tmp1, tmp2) < distToWalls);
      if (collisions.length !== 0) {
        for (let [a, b] of collisions) {
          const distance = distToWalls - sdLine(newPos, a, b, tmp1, tmp2);
          const delta = vec3.sub(tmp1, b, a).reverse();
          delta[0] = -delta[0];
          vec3.normalize(delta, delta);
          vec3.scale(delta, delta, distance);
          vec3.add(force, force, delta);
        }
      }
      const d = vec3.len(force);
      if (d === 0 && walkTime !== 0.25) {
        walkTime = (Math.abs(((walkTime + 0.5) % 1) - 0.5) - 0.25) * 0.8 + 0.25;
        if ((walkTime + 0.01) % 0.25 < 0.02) walkTime = 0.25;
      }
      const lastWalkTime = walkTime;
      walkTime += d / (run ? runStepLen : walkStepLen);
      pos[1] = height + stepHeight * Math.cos(2 * Math.PI * walkTime);
      vec3.add(pos, pos, force);
      if (tpProgress < 1) {
        tpProgress += dt / tpDuration;
        tpProgress = Math.min(tpProgress, 1);
        const t = easeInOutQuad(tpProgress);
        vec3.set(
          pos,
          lerp(t, startPos[0], endPos[0]),
          pos[1],
          lerp(t, startPos[2], endPos[2])
        );
      }
      fmouse[0] = rotationFilter * mouse[0] + (1 - rotationFilter) * fmouse[0];
      fmouse[1] = rotationFilter * mouse[1] + (1 - rotationFilter) * fmouse[1];
      mat4.identity(view);
      mat4.rotateX(view, view, fmouse[0]);
      mat4.rotateY(view, view, fmouse[1]);
      mat4.translate(view, view, vec3.scale(tmp1, pos, -1));
      return;
    },
  };
}

export default fps;
