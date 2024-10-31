import { pendulums, isRunning } from "./controls.js";

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
