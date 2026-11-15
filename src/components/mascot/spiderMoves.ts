import gsap from "gsap";

export interface Point {
  x: number;
  y: number;
}

export interface Mascot {
  wrapper: HTMLElement;
  svg: SVGSVGElement;
  thread: HTMLElement;
  body: SVGElement;
  eyes: SVGGElement;
  eyeballs: SVGElement[];
  legs: SVGGElement[];
  /** Called the moment the spider's feet (or one tapping foot) hit the surface below. */
  onTouchdown?: () => void;
}

type LegPose = "rest" | "splay" | "tuck";

// Positive angles curl a leg under the body, negative ones lift it outward.
const POSE_ANGLE: Record<LegPose, number> = { rest: 0, splay: -16, tuck: 12 };
// Where the silk meets the body, in px below the wrapper's top edge.
const ATTACH_Y = 6;
const HANG_ABOVE_PERCH = 40;
const CLIMB_HEIGHT = 160;

// Hanging physics. Gravity is tuned to screen scale, not real-world units.
const GRAVITY = 4000;
const SWING_DAMPING = 1.4;
const SILK_STIFFNESS = 200;
const SILK_DAMPING = 10;
const SILK_CATCH_BOUNCE = 120;
// Sideways sway when the silk catches, in px, so long and short threads read the same.
const SWING_AMPLITUDE = 22;
// Long threads swing as if they were this long; a true long pendulum looks sluggish on screen.
const MIN_SWING_RADIUS = 40;
const MAX_SWING_RADIUS = 220;
const SETTLE_TIME = 2;
const FALL_TIME = 0.24;
const MAX_STEP = 1 / 120;

const { clamp, random } = gsap.utils;

function part<T extends Element>(svg: SVGSVGElement, selector: string): T {
  const el = svg.querySelector<T>(selector);
  if (!el) throw new Error(`Spider rig is missing ${selector}`);
  return el;
}

export function createMascot(wrapper: HTMLElement, thread: HTMLElement): Mascot {
  const svg = wrapper.querySelector("svg");
  if (!svg) throw new Error("Spider rig svg not found");

  const legs = Array.from(svg.querySelectorAll<SVGGElement>("[data-leg]"));
  legs.forEach((leg) => gsap.set(leg, { svgOrigin: leg.dataset.origin }));
  gsap.set(svg, { transformOrigin: "50% 100%" });
  gsap.set(wrapper, { transformOrigin: `50% ${ATTACH_Y}px` });

  return {
    wrapper,
    svg,
    thread,
    body: part(svg, '[data-part="body"]'),
    eyes: part(svg, '[data-part="eyes"]'),
    eyeballs: Array.from(svg.querySelectorAll<SVGElement>('[data-part="eye"]')),
    legs,
  };
}

const sideOf = (leg: Element) => (leg.getAttribute("data-leg") === "right" ? 1 : -1);

export function position(m: Mascot): Point {
  return {
    x: gsap.getProperty(m.wrapper, "x") as number,
    y: gsap.getProperty(m.wrapper, "y") as number,
  };
}

export function poseLegs(m: Mascot, pose: LegPose, duration = 0.2, ease = "power2.out") {
  return gsap.to(m.legs, {
    rotation: (_i: number, leg: Element) => sideOf(leg) * POSE_ANGLE[pose],
    duration,
    ease,
    overwrite: "auto",
  });
}

export function resetPose(m: Mascot) {
  gsap.set(m.svg, { scaleX: 1, scaleY: 1, rotation: 0, transformOrigin: "50% 100%" });
  gsap.set(m.wrapper, { rotation: 0 });
  gsap.set(m.thread, { autoAlpha: 0, scaleY: 0, rotation: 0 });
  gsap.set(m.legs, { rotation: 0 });
}

interface Rope {
  pivot: Point;
  length: number;
  /** Radians from vertical; positive swings the spider to the right. */
  angle: number;
}

/** Places the silk from its pivot and hangs the spider off the end, tilted along it. */
function drawRope(m: Mascot, { pivot, length, angle }: Rope) {
  const degrees = (-angle * 180) / Math.PI;
  gsap.set(m.thread, { x: pivot.x, y: pivot.y, scaleY: Math.max(length, 0), rotation: degrees });
  gsap.set(m.wrapper, {
    x: pivot.x + length * Math.sin(angle) - m.wrapper.offsetWidth / 2,
    y: pivot.y + length * Math.cos(angle) - ATTACH_Y,
    rotation: degrees,
  });
}

/** Tucked legs that trail behind the swing. */
function dragLegs(m: Mascot, angularVelocity: number) {
  const drag = clamp(-14, 14, -angularVelocity * 10);
  gsap.set(m.legs, {
    rotation: (_i: number, leg: Element) => sideOf(leg) * POSE_ANGLE.tuck + drag,
  });
}

export function blink(m: Mascot) {
  return gsap.to(m.eyeballs, {
    scaleY: 0.1,
    transformOrigin: "50% 50%",
    duration: 0.07,
    yoyo: true,
    repeat: 1,
  });
}

/** Breathing and blinking that run for the mascot's whole life. Returns a stop function. */
export function startLife(m: Mascot) {
  const breathe = gsap.to(m.body, {
    scaleX: 0.98,
    scaleY: 1.04,
    transformOrigin: "50% 100%",
    duration: 1.6,
    ease: "sine.inOut",
    yoyo: true,
    repeat: -1,
  });

  let nextBlink: gsap.core.Tween;
  const scheduleBlink = () => {
    nextBlink = gsap.delayedCall(random(1.8, 4.5), () => {
      blink(m);
      scheduleBlink();
    });
  };
  scheduleBlink();

  return () => {
    breathe.kill();
    nextBlink.kill();
  };
}

/** Eyes follow a direction; dx and dy are roughly -1..1. */
export function createGaze(m: Mascot) {
  const toX = gsap.quickTo(m.eyes, "x", { duration: 0.35, ease: "power3.out" });
  const toY = gsap.quickTo(m.eyes, "y", { duration: 0.35, ease: "power3.out" });
  return (dx: number, dy: number) => {
    toX(clamp(-1, 1, dx) * 0.9);
    toY(clamp(-1, 1, dy) * 0.7);
  };
}

function land(m: Mascot) {
  return gsap
    .timeline()
    .call(() => m.onTouchdown?.())
    .to(m.svg, { scaleX: 1.14, scaleY: 0.8, duration: 0.07, ease: "power2.in" })
    .to(m.svg, { scaleX: 1, scaleY: 1, duration: 0.5, ease: "elastic.out(1, 0.4)" })
    .add(poseLegs(m, "rest", 0.45, "elastic.out(1, 0.5)"), 0);
}

export function hop(m: Mascot, to: Point) {
  const from = position(m);
  const dx = to.x - from.x;
  const distance = Math.hypot(dx, to.y - from.y);
  const duration = clamp(0.32, 0.8, 0.3 + distance / 1500);
  const half = duration / 2;
  const peak = Math.min(from.y, to.y) - Math.min(160, 28 + distance * 0.3);

  return gsap
    .timeline()
    .to(m.svg, { scaleX: 1.15, scaleY: 0.78, duration: 0.1, ease: "power2.out" })
    .addLabel("air")
    .add(poseLegs(m, "splay", 0.15), "air")
    .to(m.wrapper, { x: to.x, duration, ease: "none" }, "air")
    .to(m.wrapper, { y: peak, duration: half, ease: "power2.out" }, "air")
    .to(m.wrapper, { y: to.y, duration: half, ease: "power2.in" }, `air+=${half}`)
    .to(m.svg, { scaleX: 0.92, scaleY: 1.1, rotation: Math.sign(dx) * 10, duration: half }, "air")
    .to(m.svg, { rotation: 0, duration: half, ease: "power2.in" }, `air+=${half}`)
    .add(land(m), `air+=${duration}`);
}

/**
 * Lowers on springy silk from fromY while swinging as a damped pendulum, bobs as the
 * silk catches, then lets go and drops onto `to`.
 */
export function descend(m: Mascot, fromY: number, to: Point) {
  const pivot = { x: to.x + m.wrapper.offsetWidth / 2, y: fromY };
  const hangLength = Math.max(0, to.y - HANG_ABOVE_PERCH + ATTACH_Y - fromY);
  const reelTime = 0.5 + hangLength / 700;
  const reel = gsap.parseEase("power1.out");
  const direction = Math.random() < 0.5 ? -1 : 1;
  const swing = { angle: direction * 0.04, velocity: 0, length: 0, stretch: 0 };
  let clock = 0;
  let caught = false;
  const radiusFor = (length: number) => clamp(MIN_SWING_RADIUS, MAX_SWING_RADIUS, length);

  const simulate = (elapsed: number) => {
    while (clock < elapsed) {
      const dt = Math.min(MAX_STEP, elapsed - clock);
      clock += dt;

      if (!caught && clock >= reelTime) {
        caught = true;
        const angularAmplitude = SWING_AMPLITUDE / Math.max(hangLength, MIN_SWING_RADIUS);
        swing.stretch += SILK_CATCH_BOUNCE;
        swing.velocity += direction * angularAmplitude * Math.sqrt(GRAVITY / radiusFor(hangLength));
      }

      const target = hangLength * reel(Math.min(clock / reelTime, 1));
      swing.stretch += (SILK_STIFFNESS * (target - swing.length) - SILK_DAMPING * swing.stretch) * dt;
      swing.length = Math.max(0, swing.length + swing.stretch * dt);

      // Pendulum with a changing length: lengthening the silk bleeds off swing, like a real drop.
      const radius = radiusFor(swing.length);
      const angularAcceleration =
        -(GRAVITY / radius) * Math.sin(swing.angle) -
        SWING_DAMPING * swing.velocity -
        ((2 * swing.stretch) / radius) * swing.velocity;
      swing.velocity += angularAcceleration * dt;
      swing.angle += swing.velocity * dt;
    }
    drawRope(m, { pivot, length: swing.length, angle: swing.angle });
    dragLegs(m, swing.velocity);
  };

  const hang = gsap.to(
    {},
    {
      duration: reelTime + SETTLE_TIME,
      ease: "none",
      onStart: () => simulate(0),
      onUpdate: () => simulate(hang.time()),
    },
  );

  return gsap
    .timeline()
    .set([m.wrapper, m.thread], { autoAlpha: 1 })
    .add(hang)
    .addLabel("release")
    .to(m.thread, { scaleY: 0, duration: 0.3, ease: "power3.out" }, "release")
    .to(m.wrapper, { x: to.x, rotation: 0, duration: FALL_TIME, ease: "power1.out" }, "release")
    .to(m.wrapper, { y: to.y, duration: FALL_TIME, ease: "power2.in" }, "release")
    .add(poseLegs(m, "splay", 0.15), "release")
    .add(land(m), `release+=${FALL_TIME}`);
}

/** Shoots silk straight up and climbs it out of view. */
export function ascend(m: Mascot) {
  const start = position(m);
  const anchor = { x: start.x + m.wrapper.offsetWidth / 2, y: start.y + ATTACH_Y };
  const silk = { top: anchor.y, bottom: anchor.y };
  const draw = () =>
    drawRope(m, { pivot: { x: anchor.x, y: silk.top }, length: silk.bottom - silk.top, angle: 0 });

  return gsap
    .timeline()
    .set(m.thread, { autoAlpha: 1 })
    .set(m.wrapper, { rotation: 0 })
    .to(silk, { top: anchor.y - CLIMB_HEIGHT, duration: 0.18, ease: "power2.out", onUpdate: draw })
    .add(poseLegs(m, "tuck", 0.15))
    .to(silk, { bottom: anchor.y - CLIMB_HEIGHT, duration: 0.45, ease: "power2.in", onUpdate: draw })
    .to(m.wrapper, { autoAlpha: 0, duration: 0.45, ease: "power2.in" }, "<")
    .set(m.thread, { autoAlpha: 0 });
}

/** Walks sideways along a ledge with an alternating-tripod gait. */
export function scuttle(m: Mascot, toX: number) {
  const distance = Math.abs(toX - position(m).x);
  const duration = clamp(0.25, 0.9, distance / 120);
  const stepDuration = 0.07;
  const tripodA = m.legs.filter((leg) => leg.dataset.tripod === "a");
  const tripodB = m.legs.filter((leg) => leg.dataset.tripod === "b");
  const swing = (angle: number) => (_i: number, leg: Element) => sideOf(leg) * angle;

  const gait = gsap
    .timeline({
      repeat: Math.ceil(duration / (stepDuration * 2)) - 1,
      defaults: { duration: stepDuration, ease: "sine.inOut", overwrite: "auto" },
    })
    .to(tripodA, { rotation: swing(12) })
    .to(tripodB, { rotation: swing(-12) }, "<")
    .to(tripodA, { rotation: swing(-12) })
    .to(tripodB, { rotation: swing(12) }, "<");

  return gsap
    .timeline()
    .add(gait, 0)
    .to(m.wrapper, { x: toX, duration, ease: "power1.inOut" }, 0)
    .add(poseLegs(m, "rest", 0.2));
}

/** A spot on a frame's edge the spider hides behind, and which way is out. */
export interface Peek {
  edge: Point;
  /** Unit vector pointing away from the frame. */
  out: Point;
  /** Turns the spider's head along `out`: 0 over a top edge, 180 under a bottom one. */
  rotation: number;
}

// Body-centre distance past the edge: peeking shows the eyes and the knees hooked over it.
const PEEK_OUT = 2;
const PEEK_HIDDEN = -18;

/** Where the wrapper goes so the body centre sits `distance` along the peek line. */
function peekPlacement(m: Mascot, { edge, out }: Peek, distance: number) {
  const origin = m.wrapper.dataset.peekOrigin!.split(" ").map(Number);
  return {
    x: edge.x + out.x * distance - origin[0],
    y: edge.y + out.y * distance - origin[1],
  };
}

/** Hides the spider behind an edge, turned to face out over it. */
export function hideAt(m: Mascot, peek: Peek) {
  resetPose(m);
  // Pivot on the body, not the silk attachment point, so flipping under a bottom edge stays put.
  const wrapperBox = m.wrapper.getBoundingClientRect();
  const bodyBox = m.body.getBoundingClientRect();
  const originX = bodyBox.left + bodyBox.width / 2 - wrapperBox.left;
  const originY = bodyBox.top + bodyBox.height / 2 - wrapperBox.top;
  m.wrapper.dataset.peekOrigin = `${originX} ${originY}`;
  gsap.set(m.wrapper, {
    transformOrigin: `${originX}px ${originY}px`,
    rotation: peek.rotation,
    ...peekPlacement(m, peek, PEEK_HIDDEN),
    autoAlpha: 1,
  });
  gsap.set(m.legs, { rotation: (_i: number, leg: Element) => sideOf(leg) * POSE_ANGLE.tuck });
}

/** Holds a peek pose after a resize. */
export function placePeek(m: Mascot, peek: Peek, shown: boolean) {
  gsap.set(m.wrapper, { rotation: peek.rotation, ...peekPlacement(m, peek, shown ? PEEK_OUT : PEEK_HIDDEN) });
}

/** Creeps up, hooks its legs over the edge and has a look around. */
export function peekOut(m: Mascot, peek: Peek) {
  const tilt = random(8, 14) * (Math.random() < 0.5 ? -1 : 1);
  return gsap
    .timeline()
    .to(m.wrapper, { ...peekPlacement(m, peek, PEEK_OUT - 5), duration: 0.5, ease: "power1.inOut" })
    .to(m.wrapper, { ...peekPlacement(m, peek, PEEK_OUT), duration: 0.35, ease: "back.out(2.5)" }, ">0.35")
    .add(poseLegs(m, "splay", 0.3, "back.out(2)"), "<")
    .add(blink(m), ">0.4")
    .to(m.svg, { rotation: tilt, duration: 0.35, ease: "power2.inOut" }, ">0.5")
    .to(m.svg, { rotation: -tilt * 0.6, duration: 0.45, ease: "power2.inOut" }, ">0.8")
    .to(m.svg, { rotation: 0, duration: 0.3, ease: "power2.out" }, ">0.6");
}

/** Ducks back behind the edge; quick when startled. */
export function peekIn(m: Mascot, peek: Peek, quick = false) {
  return gsap
    .timeline()
    .to(m.svg, { rotation: 0, duration: 0.1 })
    .add(poseLegs(m, "tuck", 0.12), 0)
    .to(
      m.wrapper,
      { ...peekPlacement(m, peek, PEEK_HIDDEN), duration: quick ? 0.16 : 0.45, ease: quick ? "power3.in" : "power2.in" },
      0,
    );
}

/** Steps out of peeking for good: back to the silk-hanging pivot, out of sight. */
export function clearPeek(m: Mascot) {
  delete m.wrapper.dataset.peekOrigin;
  gsap.set(m.wrapper, { autoAlpha: 0, transformOrigin: `50% ${ATTACH_Y}px` });
  resetPose(m);
}

/** One leg taps the air. */
export function fidget(m: Mascot) {
  const leg = m.legs[Math.floor(random(0, m.legs.length))];
  return gsap
    .timeline()
    .to(leg, { rotation: sideOf(leg) * -20, duration: 0.12, ease: "power2.out", overwrite: "auto" })
    .to(leg, { rotation: 0, duration: 0.4, ease: "elastic.out(1, 0.5)" })
    // The elastic drop reaches the surface almost at once; that's the tap.
    .call(() => m.onTouchdown?.(), [], "<0.05");
}

/** Little excited bounces in place. */
export function excite(m: Mascot) {
  return gsap
    .timeline()
    .add(poseLegs(m, "splay", 0.1))
    .to(m.wrapper, { y: "-=12", duration: 0.14, ease: "power2.out", yoyo: true, repeat: 3 })
    .add(land(m));
}

/** Startled: jumps, flips, lands. */
export function startle(m: Mascot) {
  return gsap
    .timeline()
    .to(m.svg, { scaleX: 1.15, scaleY: 0.75, duration: 0.08 })
    .add(poseLegs(m, "splay", 0.1), "<")
    .addLabel("up")
    .to(m.wrapper, { y: "-=56", duration: 0.32, ease: "power2.out" }, "up")
    .to(
      m.svg,
      { rotation: 360, scaleX: 1, scaleY: 1, transformOrigin: "50% 50%", duration: 0.62, ease: "power2.inOut" },
      "up",
    )
    .to(m.wrapper, { y: "+=56", duration: 0.3, ease: "power2.in" }, "up+=0.32")
    .set(m.svg, { rotation: 0, transformOrigin: "50% 100%" }, "up+=0.62")
    .add(land(m), "up+=0.62");
}
