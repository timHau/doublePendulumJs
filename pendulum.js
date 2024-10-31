import * as d3 from "d3";

export class Pendulum {
  constructor(
    initAngles,
    initVelocities,
    idx,
    masses,
    lengths,
    g,
    maxTraceLength,
    damping,
    showPendulum,
    showTrace,
    dt,
    colorScheme
  ) {
    this.angles = initAngles || [0, 0];
    this.lengths = lengths || [200, 200];
    this.masses = masses || [1, 1];
    this.velocities = initVelocities || [0, 0];
    this.g = g || 9.81;
    this.dt = dt || 0.01;
    this.r = 5;
    this.trace = [];
    this.maxTraceLength = maxTraceLength || 100;
    this.damping = damping;
    this.showPendulum = showPendulum;
    this.showTrace = showTrace;
    this.idx = idx;
    this.strokeColor = "#bbb";
    this.colorScheme = colorScheme || "rainbow";
  }

  // Functions to calculate angular accelerations
  getAngle1Accel(a1, a2, a1_v, a2_v) {
    const [mass1, mass2] = this.masses;
    const [length1, length2] = this.lengths;
    const num1 = -this.g * (2 * mass1 + mass2) * Math.sin(a1);
    const num2 = -mass2 * this.g * Math.sin(a1 - 2 * a2);
    const num3 = -2 * Math.sin(a1 - a2) * mass2;
    const num4 =
      a2_v * a2_v * length2 + a1_v * a1_v * length1 * Math.cos(a1 - a2);
    const denom =
      length1 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * a1 - 2 * a2));
    return (num1 + num2 + num3 * num4) / denom;
  }

  getAngle2Accel(a1, a2, a1_v, a2_v) {
    const [mass1, mass2] = this.masses;
    const [length1, length2] = this.lengths;
    const num1 = 2 * Math.sin(a1 - a2);
    const num2 = a1_v * a1_v * length1 * (mass1 + mass2);
    const num3 = this.g * (mass1 + mass2) * Math.cos(a1);
    const num4 = a2_v * a2_v * length2 * mass2 * Math.cos(a1 - a2);
    const denom =
      length2 * (2 * mass1 + mass2 - mass2 * Math.cos(2 * a1 - 2 * a2));
    return (num1 * (num2 + num3 + num4)) / denom;
  }

  update() {
    const [angle1, angle2] = this.angles;
    const [angle1_v, angle2_v] = this.velocities;

    const [k1a1, k1a2] = this.velocities;
    const k1a1_v = this.getAngle1Accel(angle1, angle2, angle1_v, angle2_v);
    const k1a2_v = this.getAngle2Accel(angle1, angle2, angle1_v, angle2_v);

    const k2a1 = angle1_v + 0.5 * k1a1_v * this.dt;
    const k2a2 = angle2_v + 0.5 * k1a2_v * this.dt;
    const k2a1_v = this.getAngle1Accel(
      angle1 + 0.5 * k1a1 * this.dt,
      angle2 + 0.5 * k1a2 * this.dt,
      angle1_v + 0.5 * k1a1_v * this.dt,
      angle2_v + 0.5 * k1a2_v * this.dt
    );
    const k2a2_v = this.getAngle2Accel(
      angle1 + 0.5 * k1a1 * this.dt,
      angle2 + 0.5 * k1a2 * this.dt,
      angle1_v + 0.5 * k1a1_v * this.dt,
      angle2_v + 0.5 * k1a2_v * this.dt
    );

    const k3a1 = angle1_v + 0.5 * k2a1_v * this.dt;
    const k3a2 = angle2_v + 0.5 * k2a2_v * this.dt;
    const k3a1_v = this.getAngle1Accel(
      angle1 + 0.5 * k2a1 * this.dt,
      angle2 + 0.5 * k2a2 * this.dt,
      angle1_v + 0.5 * k2a1_v * this.dt,
      angle2_v + 0.5 * k2a2_v * this.dt
    );
    const k3a2_v = this.getAngle2Accel(
      angle1 + 0.5 * k2a1 * this.dt,
      angle2 + 0.5 * k2a2 * this.dt,
      angle1_v + 0.5 * k2a1_v * this.dt,
      angle2_v + 0.5 * k2a2_v * this.dt
    );

    const k4a1 = angle1_v + k3a1_v * this.dt;
    const k4a2 = angle2_v + k3a2_v * this.dt;
    const k4a1_v = this.getAngle1Accel(
      angle1 + k3a1 * this.dt,
      angle2 + k3a2 * this.dt,
      angle1_v + k3a1_v * this.dt,
      angle2_v + k3a2_v * this.dt
    );
    const k4a2_v = this.getAngle2Accel(
      angle1 + k3a1 * this.dt,
      angle2 + k3a2 * this.dt,
      angle1_v + k3a1_v * this.dt,
      angle2_v + k3a2_v * this.dt
    );

    // Update angles and angular velocities
    this.angles = [
      this.angles[0] + (this.dt / 6) * (k1a1 + 2 * k2a1 + 2 * k3a1 + k4a1),
      this.angles[1] + (this.dt / 6) * (k1a2 + 2 * k2a2 + 2 * k3a2 + k4a2),
    ];
    this.velocities = [
      this.velocities[0] +
        (this.dt / 6) * (k1a1_v + 2 * k2a1_v + 2 * k3a1_v + k4a1_v),
      this.velocities[1] +
        (this.dt / 6) * (k1a2_v + 2 * k2a2_v + 2 * k3a2_v + k4a2_v),
    ];

    if (this.damping) {
      this.velocities[0] *= 0.999;
      this.velocities[1] *= 0.999;
    }
  }

  getColorScale() {
    let scale;
    if (this.colorScheme === "rainbow") {
      scale = d3.scaleSequential(d3.interpolateRainbow);
    }
    if (this.colorScheme === "sinebow") {
      scale = d3.scaleSequential(d3.interpolateSinebow);
    }
    if (this.colorScheme === "cividis") {
      scale = d3.scaleSequential(d3.interpolateCividis);
    }
    if (this.colorScheme === "turbo") {
      scale = d3.scaleSequential(d3.interpolateTurbo);
    }
    if (this.colorScheme === "magma") {
      scale = d3.scaleSequential(d3.interpolateMagma);
    }
    if (this.colorScheme === "cool") {
      scale = d3.scaleSequential(d3.interpolateCool);
    }
    if (this.colorScheme === "viridis") {
      scale = d3.scaleSequential(d3.interpolateViridis);
    }
    scale = scale.domain([0, 1]);
    return scale;
  }

  draw(context, origin) {
    const scale = this.getColorScale();
    const fillColor = scale(this.idx);

    const [l1, l2] = this.lengths;
    let [theta1, theta2] = this.angles;
    const [x1, y1] = [
      origin[0] + l1 * Math.sin(theta1),
      origin[1] + l1 * Math.cos(theta1),
    ];
    const [x2, y2] = [x1 + l2 * Math.sin(theta2), y1 + l2 * Math.cos(theta2)];

    if (this.trace.length > this.maxTraceLength) {
      this.trace.splice(0, this.trace.length - this.maxTraceLength);
    }
    this.trace.push([x2, y2]);

    if (this.showTrace) {
      let [x_trace, y_trace] = this.trace[0];
      context.beginPath();
      context.moveTo(x_trace, y_trace);
      for (let i = 1; i < this.trace.length; i++) {
        const [xi_trace, yi_trace] = this.trace[i];
        context.lineTo(x_trace, y_trace);
        x_trace = xi_trace;
        y_trace = yi_trace;
      }
      context.strokeStyle = fillColor;
      context.stroke();
    }

    if (this.showPendulum) {
      context.strokeStyle = this.strokeColor;
      context.globalAlpha = 0.1;
      context.beginPath();
      context.moveTo(...origin);
      context.lineTo(x1, y1);
      context.stroke();

      context.beginPath();
      context.moveTo(x1, y1);
      context.lineTo(x2, y2);
      context.stroke();
      context.globalAlpha = 1;

      context.beginPath();
      context.fillStyle = this.strokeColor;
      context.arc(...origin, this.r / 2, 0, 2 * Math.PI);
      context.fill();

      context.beginPath();
      context.fillStyle = "rgba(120, 120, 120, 0.5)";
      context.arc(x1, y1, this.r, 0, 2 * Math.PI);
      context.fill();
    }

    context.beginPath();
    context.fillStyle = fillColor;
    context.arc(x2, y2, this.r, 0, 2 * Math.PI);
    context.fill();
  }

  deg2rad(angles) {
    return angles.map((angle) => angle * (Math.PI / 180));
  }
}
