"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { isPulseSourceAt, sendAsciiPulse } from "@/components/ui/asciiPulse";
import SpiderRig from "./SpiderRig";
import {
  ascend,
  clearPeek,
  createGaze,
  createMascot,
  descend,
  excite,
  fidget,
  hideAt,
  hop,
  peekIn,
  peekOut,
  position,
  resetPose,
  scuttle,
  startLife,
  startle,
  type Peek,
  type Point,
} from "./spiderMoves";

/*
 * Page contract:
 *   data-spider-scene                section the spider visits while it's in view
 *   data-spider-mode="patrol"        hop through the scene's perches in page order, looping
 *   data-spider-mode="peek"          hide behind the scene's [data-spider-peek] frame and peek over its edges near the corners
 *   data-spider-perch                element the spider can sit on (top edge)
 *   data-spider-align="0..1"         where along the top edge to sit (default 0.5)
 *   data-spider-on                   set by the mascot on the perch it's sitting on
 *   data-ascii-pulse                 landing (or tapping a foot) here sends a ripple through the ASCII grid
 */

const PERCH_SINK = 1;

export default function SpiderMascot() {
  const layerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = layerRef.current;
    const wrapper = wrapperRef.current;
    const thread = threadRef.current;
    if (!layer || !wrapper || !thread) return;

    const m = createMascot(wrapper, thread);
    resetPose(m);

    // Feet on a pulse source (the hero and CTA buttons) ripple the ASCII grid from that spot.
    m.onTouchdown = () => {
      const box = wrapper.getBoundingClientRect();
      const footX = box.left + box.width / 2;
      const footY = box.bottom + PERCH_SINK + 1;
      if (isPulseSourceAt(footX, footY)) sendAsciiPulse(footX, footY);
    };
    const stopLife = startLife(m);
    const gaze = createGaze(m);

    let generation = 0;
    let current: gsap.core.Timeline | null = null;
    let currentIsIdle = false;
    let activeScene: HTMLElement | null = null;
    let perch: HTMLElement | null = null;
    let align = 0.5;
    let visible = false;
    // While peeking: the frame being hidden behind, which corner, and whether the head is out.
    let peekFrame: HTMLElement | null = null;
    let peekCorner = 0;
    let peekShown = false;
    let peek: Peek | null = null;

    const alignOf = (el: HTMLElement) => Number(el.dataset.spiderAlign ?? 0.5);
    const perchesIn = (scene: HTMLElement) =>
      Array.from(scene.querySelectorAll<HTMLElement>("[data-spider-perch]"));

    const pointOn = (el: HTMLElement, at: number): Point => {
      const layerBox = layer.getBoundingClientRect();
      const box = el.getBoundingClientRect();
      return {
        x: box.left - layerBox.left + box.width * at - wrapper.offsetWidth / 2,
        y: box.top - layerBox.top - wrapper.offsetHeight + PERCH_SINK,
      };
    };

    const alignAt = (el: HTMLElement, x: number) => {
      const box = el.getBoundingClientRect();
      const left = box.left - layer.getBoundingClientRect().left;
      return (x + wrapper.offsetWidth / 2 - left) / box.width;
    };

    const sitOn = (el: HTMLElement | null, at = 0.5) => {
      perch?.removeAttribute("data-spider-on");
      perch = el;
      align = at;
      el?.setAttribute("data-spider-on", "");
    };

    const isBusy = () => Boolean(current?.isActive() && !currentIsIdle);

    // Idle actions (fidgets, shuffles, excited bounces) can be cut short by a poke.
    const play = (tl: gsap.core.Timeline, idleAction = false) => {
      current = tl;
      currentIsIdle = idleAction;
      return tl.then(() => undefined);
    };
    const wait = (seconds: number) =>
      new Promise<void>((resolve) => gsap.delayedCall(seconds, resolve));

    const interrupt = () => {
      generation += 1;
      current?.kill();
      current = null;
      // A peeking spider keeps its turned pose; resetting it would snap it out of the corner.
      if (!peek) resetPose(m);
      return generation;
    };

    // Peek spots clockwise from the top left: over the top edge, or upside down under the bottom one.
    const CORNERS = [
      { at: [0, 0], out: -1, rotation: 0 },
      { at: [1, 0], out: -1, rotation: 0 },
      { at: [1, 1], out: 1, rotation: 180 },
      { at: [0, 1], out: 1, rotation: 180 },
    ] as const;
    const CORNER_INSET = 56;

    const peekAt = (frame: HTMLElement, index: number): Peek => {
      const layerBox = layer.getBoundingClientRect();
      const box = frame.getBoundingClientRect();
      const { at, out, rotation } = CORNERS[index];
      const inset = at[0] === 0 ? CORNER_INSET : -CORNER_INSET;
      return {
        edge: { x: box.left - layerBox.left + box.width * at[0] + inset, y: box.top - layerBox.top + box.height * at[1] },
        out: { x: 0, y: out },
        rotation,
      };
    };

    // Clip the layer around the frame so whatever is behind it stays hidden.
    const clipAround = (frame: HTMLElement | null) => {
      if (!frame) {
        layer.style.clipPath = "";
        return;
      }
      const layerBox = layer.getBoundingClientRect();
      const box = frame.getBoundingClientRect();
      const [x1, y1] = [box.left - layerBox.left, box.top - layerBox.top];
      const [x2, y2] = [x1 + box.width, y1 + box.height];
      layer.style.clipPath = `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${x1}px ${y1}px, ${x2}px ${y1}px, ${x2}px ${y2}px, ${x1}px ${y2}px, ${x1}px ${y1}px)`;
    };

    const stopPeeking = () => {
      peek = null;
      peekFrame = null;
      peekShown = false;
      clipAround(null);
      clearPeek(m);
      visible = false;
    };

    const peekAround = async (run: number, frame: HTMLElement) => {
      peekFrame = frame;
      while (run === generation) {
        peekCorner = (peekCorner + 1 + Math.floor(gsap.utils.random(0, 3))) % CORNERS.length;
        peek = peekAt(frame, peekCorner);
        clipAround(frame);
        hideAt(m, peek);
        visible = true;
        await wait(gsap.utils.random(0.6, 1.4));
        if (run !== generation) return;
        peekShown = true;
        await play(peekOut(m, peek), true);
        if (run !== generation) return;
        await wait(gsap.utils.random(1.2, 2.4));
        if (run !== generation) return;
        await play(peekIn(m, peek));
        peekShown = false;
      }
    };

    const idle = async (run: number) => {
      while (run === generation && perch && !peek) {
        await wait(gsap.utils.random(1.8, 3.6));
        if (run !== generation || !perch || peek) return;
        if (Math.random() < 0.5) {
          await play(fidget(m), true);
        } else {
          align = gsap.utils.random(0.2, 0.8);
          await play(scuttle(m, pointOn(perch, align).x), true);
        }
      }
    };

    const patrol = async (run: number, scene: HTMLElement) => {
      while (run === generation) {
        await wait(gsap.utils.random(1.4, 2.4));
        if (run !== generation) return;
        const perches = perchesIn(scene);
        const next = perches[(perches.indexOf(perch as HTMLElement) + 1) % perches.length];
        if (!next || next === perch) return;
        const at = gsap.utils.random(0.25, 0.75);
        sitOn(null);
        await play(hop(m, pointOn(next, at)));
        if (run !== generation) return;
        sitOn(next, at);
      }
    };

    const carryOn = (run: number) => {
      const frame = activeScene?.querySelector<HTMLElement>("[data-spider-peek]");
      if (activeScene?.dataset.spiderMode === "peek" && frame) peekAround(run, frame);
      else if (activeScene?.dataset.spiderMode === "patrol") patrol(run, activeScene);
      else idle(run);
    };

    const enterScene = async (scene: HTMLElement) => {
      if (scene === activeScene) return;
      activeScene = scene;
      const run = interrupt();

      if (peek) {
        if (peekShown) await play(peekIn(m, peek, true));
        stopPeeking();
      } else if (visible) {
        await play(ascend(m));
        visible = false;
      }
      if (run !== generation) return;
      sitOn(null);

      if (scene.dataset.spiderMode === "peek") {
        carryOn(run);
        return;
      }

      const target = perchesIn(scene)[0];
      if (!target) return;
      const at = alignOf(target);
      const layerTop = layer.getBoundingClientRect().top;
      const fromY = Math.max(scene.getBoundingClientRect().top - layerTop, -layerTop);

      visible = true;
      await play(descend(m, fromY, pointOn(target, at)));
      if (run !== generation) return;
      sitOn(target, at);
      carryOn(run);
    };

    const onPoke = async () => {
      if (peek && peekShown && !isBusy()) {
        // Startled: duck back in, then try another corner.
        const run = interrupt();
        await play(peekIn(m, peek, true));
        peekShown = false;
        if (run === generation) carryOn(run);
        return;
      }
      if (!perch || isBusy()) return;
      const run = interrupt();
      const { x } = position(m);
      align = alignAt(perch, x);
      gsap.set(wrapper, { y: pointOn(perch, align).y });
      await play(startle(m));
      if (run === generation) carryOn(run);
    };

    const onPointerMove = (event: PointerEvent) => {
      const box = wrapper.getBoundingClientRect();
      gaze(
        (event.clientX - (box.left + box.width / 2)) / 250,
        (event.clientY - (box.top + box.height / 2)) / 250,
      );
    };

    const onPerchEnter = (event: PointerEvent) => {
      if (event.currentTarget === perch && !current?.isActive()) play(excite(m), true);
    };

    // Moves measure their targets when they start, so a layout change (a window resize, content above
    // growing, fonts arriving) can strand the spider. Rather than snapping it across the screen, it climbs
    // away and drops back in, just as it does when the reader scrolls to a section.
    const relayout = async () => {
      if (reducedMotion) {
        if (perch) gsap.set(wrapper, pointOn(perch, align));
        return;
      }
      const scene = activeScene;
      if (!scene) return;

      if (peek && peekFrame) {
        const frame = peekFrame;
        const run = interrupt();
        if (peekShown) await play(peekIn(m, peek, true));
        if (run !== generation) return;
        peekShown = false;
        clipAround(frame);
        carryOn(run);
        return;
      }

      // Still on its perch's top edge (fidgets and shuffles included): nothing moved under it.
      if (perch && (!current?.isActive() || currentIsIdle)) {
        const { x, y } = position(m);
        const along = alignAt(perch, x);
        if (Math.abs(pointOn(perch, 0).y - y) < 2 && along >= 0 && along <= 1) return;
      }

      activeScene = null;
      enterScene(scene);
    };

    // One relayout per burst of changes, and only when the page's size actually changed.
    let relayoutTimer = 0;
    let pageSize = "";
    const pageResize = new ResizeObserver(([entry]) => {
      const size = `${Math.round(entry.contentRect.width)}x${Math.round(entry.contentRect.height)}`;
      if (size === pageSize) return;
      const first = !pageSize;
      pageSize = size;
      if (first) return;
      window.clearTimeout(relayoutTimer);
      relayoutTimer = window.setTimeout(relayout, 150);
    });

    const perches = Array.from(document.querySelectorAll<HTMLElement>("[data-spider-perch]"));
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-spider-scene]"));
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // The scene under this line gets the spider. The line slides down as the page
    // bottoms out, so a short last section can still win.
    const focusLine = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const half = window.innerHeight / 2;
      const nearEnd = gsap.utils.clamp(0, 1, (window.scrollY - (maxScroll - half)) / half);
      return window.innerHeight * (0.5 + 0.3 * nearEnd);
    };

    // Sections between scenes leave the spider where it is; past the last scene (the footer),
    // the last scene keeps it, so the CTA still gets the spider at the very bottom of the page.
    const followScroll = () => {
      const line = focusLine();
      const scene =
        scenes.find((s) => {
          const box = s.getBoundingClientRect();
          return box.top <= line && box.bottom >= line;
        }) ?? (scenes.at(-1)!.getBoundingClientRect().bottom < line ? scenes.at(-1) : undefined);
      if (scene) enterScene(scene);
    };

    window.addEventListener("pointermove", onPointerMove);
    pageResize.observe(document.body);
    document.fonts.ready.then(relayout);
    m.svg.addEventListener("click", onPoke);
    perches.forEach((el) => el.addEventListener("pointerenter", onPerchEnter));

    if (reducedMotion && perches[0]) {
      const at = alignOf(perches[0]);
      gsap.set(wrapper, { ...pointOn(perches[0], at), autoAlpha: 1 });
      sitOn(perches[0], at);
    } else {
      window.addEventListener("scroll", followScroll, { passive: true });
      followScroll();
    }

    return () => {
      interrupt();
      stopPeeking();
      sitOn(null);
      stopLife();
      window.removeEventListener("scroll", followScroll);
      window.removeEventListener("pointermove", onPointerMove);
      pageResize.disconnect();
      window.clearTimeout(relayoutTimer);
      m.svg.removeEventListener("click", onPoke);
      perches.forEach((el) => el.removeEventListener("pointerenter", onPerchEnter));
    };
  }, []);

  return (
    <div ref={layerRef} aria-hidden="true" className="pointer-events-none absolute inset-0 z-40 overflow-hidden">
      <div ref={threadRef} className="invisible absolute top-0 left-0 h-px w-px origin-top bg-fg-primary/40" />
      <div ref={wrapperRef} className="invisible absolute top-0 left-0 text-fg-primary">
        <SpiderRig eyeColor="white" className="pointer-events-auto block h-auto w-11 cursor-pointer" />
      </div>
    </div>
  );
}
