import { Pendulum } from "./pendulum.js";

let isRunning = false;
const start = document.querySelector("#start");
start.addEventListener("click", () => {
  if (!isRunning) {
    isRunning = true;
    start.innerHTML = "Stop";
    simulate();
  } else {
    isRunning = false;
    start.innerHTML = "Start";
  }
});

const hide = document.querySelector("#hide");
const controls = document.querySelector("#controls");
hide.addEventListener("click", () => {
  if (controls.style.display === "none") {
    controls.style.display = "block";
  } else {
    controls.style.display = "none";
    hide.innerHTML = "🟢";
  }
});
hide.addEventListener("mouseover", () => {
  if (controls.style.display === "none") {
    hide.innerHTML = "🟢";
  } else {
    hide.innerHTML = "🔴";
  }
});
hide.addEventListener("mouseout", () => {
  hide.innerHTML = "⚪️";
});

const deg2rad = (angle) => angle * (Math.PI / 180);

function initPendulums(
  N,
  initVelocity,
  mass,
  length,
  gravity,
  maxTraceLength,
  damping,
  showPendulum,
  showTrace,
  dt,
  colorScheme,
  angles
) {
  const [theta1, theta2] = angles;
  const pendulums = [];
  for (let i = 0; i < N; ++i) {
    const pendulum = new Pendulum(
      [deg2rad(theta1 + i / 1000), deg2rad(theta2 - i / 1000)],
      [initVelocity, initVelocity],
      i / N,
      [mass, mass],
      [length, length],
      gravity,
      maxTraceLength,
      damping,
      showPendulum,
      showTrace,
      dt,
      colorScheme
    );
    pendulums.push(pendulum);
  }
  return pendulums;
}

let initVelocity = 0.3;
let N = 160;
let mass = 1;
let length = 200;
let gravity = 9.81;
let maxTraceLength = 100;
let damping = false;
let showPendulum = true;
let showTrace = true;
let dt = 0.02;
let colorScheme = "rainbow";
let angles = [90, -20];
const resetPendulum = () =>
  initPendulums(
    N,
    initVelocity,
    mass,
    length,
    gravity,
    maxTraceLength,
    damping,
    showPendulum,
    showTrace,
    dt,
    colorScheme,
    angles
  );
let pendulums = resetPendulum();

const theta1Slider = document.querySelector("#theta1");
theta1Slider.addEventListener("input", () => {
  angles[0] = parseInt(theta1Slider.value);
  document.querySelector("#theta1Value").innerHTML = angles[0];
  pendulums = resetPendulum();
});

const theta2Slider = document.querySelector("#theta2");
theta2Slider.addEventListener("input", () => {
  angles[1] = parseInt(theta2Slider.value);
  document.querySelector("#theta2Value").innerHTML = angles[1];
  pendulums = resetPendulum();
});

const colorSchemeSelect = document.querySelector("#colorScheme");
colorSchemeSelect.addEventListener("change", () => {
  colorScheme = colorSchemeSelect.value;
  for (let i = 0; i < N; ++i) {
    pendulums[i].colorScheme = colorScheme;
  }
});

const timeSlider = document.querySelector("#time");
timeSlider.addEventListener("input", () => {
  dt = parseFloat(timeSlider.value);
  document.querySelector("#timeValue").innerHTML = dt;
  for (let i = 0; i < N; ++i) {
    pendulums[i].dt = dt;
  }
});

const showPendulumCheckbox = document.querySelector("#showPendulum");
showPendulumCheckbox.addEventListener("change", () => {
  showPendulum = showPendulumCheckbox.checked;
  for (let i = 0; i < N; ++i) {
    pendulums[i].showPendulum = showPendulum;
  }
});

const showTraceCheckbox = document.querySelector("#showTrace");
showTraceCheckbox.addEventListener("change", () => {
  showTrace = showTraceCheckbox.checked;
  for (let i = 0; i < N; ++i) {
    pendulums[i].showTrace = showTrace;
  }
});

const dampingCheckbox = document.querySelector("#damping");
dampingCheckbox.addEventListener("change", () => {
  damping = dampingCheckbox.checked;
  for (let i = 0; i < N; ++i) {
    pendulums[i].damping = damping;
  }
});

const traceLengthSlider = document.querySelector("#traceLength");
traceLengthSlider.addEventListener("input", () => {
  maxTraceLength = parseInt(traceLengthSlider.value);
  document.querySelector("#traceLengthValue").innerHTML = maxTraceLength;
  for (let i = 0; i < N; ++i) {
    pendulums[i].maxTraceLength = maxTraceLength;
  }
});

const gravitySlider = document.querySelector("#gravity");
gravitySlider.addEventListener("input", () => {
  gravity = parseFloat(gravitySlider.value);
  document.querySelector("#gravityValue").innerHTML = gravity;
  for (let i = 0; i < N; ++i) {
    pendulums[i].gravity = gravity;
  }
});

const lengthSlider = document.querySelector("#length");
lengthSlider.addEventListener("input", () => {
  length = parseInt(lengthSlider.value);
  document.querySelector("#lengthValue").innerHTML = length;
  for (let i = 0; i < N; ++i) {
    pendulums[i].lengths = [length, length];
  }
});

const massSlider = document.querySelector("#mass");
massSlider.addEventListener("input", () => {
  mass = parseFloat(massSlider.value);
  document.querySelector("#massValue").innerHTML = mass;
  for (let i = 0; i < N; ++i) {
    pendulums[i].masses = [mass, mass];
  }
});

const velSlider = document.querySelector("#velocity");
velSlider.addEventListener("input", () => {
  initVelocity = parseFloat(velSlider.value);
  document.querySelector("#velValue").innerHTML = initVelocity;
  for (let i = 0; i < N; ++i) {
    pendulums[i].velocities = [initVelocity, initVelocity];
  }
});

const numSlider = document.querySelector("#N");
numSlider.addEventListener("input", () => {
  N = parseInt(numSlider.value);
  document.querySelector("#numValue").innerHTML = N;
  if (N > pendulums.length) {
    for (let i = pendulums.length; i < N; ++i) {
      const pendulum = new Pendulum(
        [deg2rad(90 + i / 1000), deg2rad(-20 - i / 1000)],
        [initVelocity, initVelocity],
        i / N,
        [mass, mass],
        [length, length],
        gravity,
        maxTraceLength,
        damping,
        showPendulum,
        showTrace,
        dt
      );
      pendulums.push(pendulum);
    }
  } else {
    pendulums = pendulums.slice(0, N);
  }
});

const restart = document.querySelector("#restart");
restart.addEventListener("click", () => {
  pendulums = resetPendulum();
});

const canvas = document.querySelector("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const context = canvas.getContext("2d");
context.lineWidth = 3;

let origin = [canvas.width / 2, canvas.height / 2 - 100];

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  origin = [canvas.width / 2, canvas.height / 2 - 100];
  pendulums = resetPendulum();
});

let t = 0;
export function simulate() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  for (const pendulum of pendulums) {
    if (isRunning) {
      pendulum.update();
    }
    pendulum.draw(context, origin);
  }

  window.requestAnimationFrame(simulate);
  t++;
}
