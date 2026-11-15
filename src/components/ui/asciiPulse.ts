/** Asks every ASCII grid on screen to send a ripple out from a point in the viewport. */

export const ASCII_PULSE_EVENT = "ascii:pulse";

export interface AsciiPulseDetail {
  clientX: number;
  clientY: number;
}

export function sendAsciiPulse(clientX: number, clientY: number) {
  document.dispatchEvent(new CustomEvent<AsciiPulseDetail>(ASCII_PULSE_EVENT, { detail: { clientX, clientY } }));
}

/** Whether a viewport point sits on an element that sends pulses ([data-ascii-pulse]). */
export function isPulseSourceAt(clientX: number, clientY: number) {
  return document.elementsFromPoint(clientX, clientY).some((el) => el.closest("[data-ascii-pulse]"));
}
