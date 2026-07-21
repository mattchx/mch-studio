import { Easing, interpolate } from "remotion";

export const CLAMP = {
  extrapolateLeft: "clamp" as const,
  extrapolateRight: "clamp" as const,
};

export const EASE = Easing.bezier(0.16, 1, 0.3, 1);

export const SPRING_PUNCHY = { mass: 0.5, stiffness: 200, damping: 18 };
export const SPRING_GLIDE = { mass: 1, stiffness: 80, damping: 14 };
export const SPRING_HEAVY = { mass: 1.5, stiffness: 60, damping: 20 };

export function tween(
  frame: number,
  fps: number,
  start: number,
  end: number,
  output: [number, number],
) {
  return interpolate(frame, [start * fps, end * fps], output, {
    ...CLAMP,
    easing: EASE,
  });
}
