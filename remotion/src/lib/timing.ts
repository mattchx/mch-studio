export const CODEX_TOTAL_FRAMES = 750;

export const CODEX_SCENES = {
  hook: { start: 0, end: 105 },
  select: { start: 90, end: 240 },
  system: { start: 210, end: 420 },
  asset: { start: 390, end: 600 },
  cadence: { start: 570, end: 750 },
};

export const CARD_PHASES = {
  arriveStart: 0.2,
  arriveStartStagger: 0.12,
  arriveEnd: 2.0,
  arriveEndStagger: 0.08,
  sortStart: 3.2,
  sortStartStagger: 0.18,
  sortEnd: 5.0,
  sortEndStagger: 0.2,
  fadeInStartFrame: 0,
  fadeInEndFrame: 10,
  fadeOutStart: 18.5,
  fadeOutEnd: 20,
};

export const RAIL_PHASES = {
  revealStart: 4.2,
  revealEnd: 5.5,
  fillStart: 6.0,
  fillEnd: 13.8,
  nodeFillStart: 6,
  nodeFillEnd: 6.7,
  nodeStagger: 1.3,
};

export const HERO_PHASES = {
  exitStart: 3.0,
  exitEnd: 4.0,
};

export const TRANSFORMATION_PHASES = {
  showStart: 10,
  showEnd: 11.2,
  transformStart: 13.2,
  transformEnd: 16.2,
  settleStart: 16.2,
  settleEnd: 18.2,
};

export const FINAL_LOCKUP_PHASES = {
  revealStart: 20.5,
  revealEnd: 22.5,
};
