"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import SpiderRig from "./SpiderRig";
import {
  ascend,
  createGaze,
  createMascot,
  descend,
  excite,
  fidget,
  hop,
  position,
  resetPose,
  scuttle,
  startLife,
  startle,
  type Point,
} from "./spiderMoves";

/*
 * Page contract:
 *   data-spider-scene                section the spider visits while it's in view
 *   data-spider-mode="patrol"        hop through the scene's perches in page order, looping
 *   data-spider-perch                element the spider can sit on (top edge)
 *   data-spider-align="0..1"         where along the top edge to sit (default 0.5)
 *   data-spider-on                   set by the mascot on the perch it's sitting on
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
    const stopLife = startLife(m);
    const gaze = createGaze(m);

    let generation = 0;
    let current: gsap.core.Timeline | null = null;
    let currentIsIdle = false;
    let activeScene: HTMLElement | null = null;
    let perch: HTMLElement | null = null;
    let align = 0.5;
    let visible = false;

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
      resetPose(m);
      return generation;
    };

    const idle = async (run: number) => {
      while (run === generation && perch) {
        await wait(gsap.utils.random(1.8, 3.6));
        if (run !== generation || !perch) return;
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
      if (activeScene?.dataset.spiderMode === "patrol") patrol(run, activeScene);
      else idle(run);
    };

    const enterScene = async (scene: HTMLElement) => {
      if (scene === activeScene) return;
      activeScene = scene;
      const run = interrupt();

      if (visible) {
        await play(ascend(m));
        visible = false;
      }
      if (run !== generation) return;
      sitOn(null);

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

    const settle = () => {
      if (perch && !current?.isActive()) gsap.set(wrapper, pointOn(perch, align));
    };

    const perches = Array.from(document.querySelectorAll<HTMLElement>("[data-spider-perch]"));
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-spider-scene]"));

    // The scene under this line gets the spider. The line slides down as the page
    // bottoms out, so a short last section can still win.
    const focusLine = () => {
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      const half = window.innerHeight / 2;
      const nearEnd = gsap.utils.clamp(0, 1, (window.scrollY - (maxScroll - half)) / half);
      return window.innerHeight * (0.5 + 0.3 * nearEnd);
    };

    const followScroll = () => {
      const line = focusLine();
      const scene = scenes.find((s) => {
        const box = s.getBoundingClientRect();
        return box.top <= line && box.bottom >= line;
      });
      if (scene) enterScene(scene);
    };

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("resize", settle);
    document.fonts.ready.then(settle);
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
      sitOn(null);
      stopLife();
      window.removeEventListener("scroll", followScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", settle);
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
