import {
  AbsoluteFill,
  interpolate,
  Series,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, SPRING_PUNCHY } from "./lib/motion";
import { colors } from "./lib/theme";

const FONT = "Inter, Arial, Helvetica, sans-serif";

const within = (frame: number, start: number, end: number) =>
  interpolate(frame, [start, end], [0, 1], CLAMP);

const SCENE = {
  provocation: 90,
  reality: 105,
  pivot: 135,
  system: 180,
  output: 120,
  signature: 120,
};

const SCENE_START = {
  provocation: 0,
  reality: 90,
  pivot: 195,
  system: 330,
  output: 510,
  signature: 630,
};

const BAR_LEFT = 60;
const BAR_WIDTH = 960;
const BAR_Y = 1480;
const BAR_H = 22;

function BackgroundChrome() {
  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink }}>
      <div
        style={{
          position: "absolute",
          left: 64,
          top: 64,
          fontSize: 34,
          fontWeight: 900,
          color: colors.green,
          letterSpacing: 0,
        }}
      >
        MCH
      </div>
    </AbsoluteFill>
  );
}

function RhythmBar() {
  const frame = useCurrentFrame();

  let fillX = BAR_LEFT;
  let fillW = 0;
  let fillColor: string = colors.green;
  let fillOpacity = 0.7;
  let glow = false;

  if (frame < SCENE_START.reality) {
    const noise = Math.sin(frame * 0.6) * 0.5 + 0.5;
    fillW = BAR_WIDTH * (0.3 + noise * 0.7);
    fillOpacity = 0.4;
  } else if (frame < SCENE_START.pivot) {
    const local = frame - SCENE_START.reality;
    const t = within(local, 0, 25);
    const startW = BAR_WIDTH * 0.3;
    const targetW = 80;
    const targetX = (1080 - targetW) / 2;
    fillW = interpolate(t, [0, 1], [startW, targetW], CLAMP);
    fillX = interpolate(t, [0, 1], [BAR_LEFT, targetX], CLAMP);
    fillOpacity = 0.7;
  } else if (frame < SCENE_START.system) {
    fillW = BAR_WIDTH;
    fillOpacity = 0.15;
    fillColor = colors.line;
    const pulseFrame = SCENE_START.pivot + 95;
    const dist = Math.abs(frame - pulseFrame);
    if (dist < 12) {
      fillOpacity = 0.15 + (1 - dist / 12) * 0.65;
      fillColor = colors.amber;
    }
  } else if (frame < SCENE_START.output) {
    const t = within(frame, SCENE_START.system + 30, SCENE_START.system + 150);
    fillW = BAR_WIDTH * t;
    fillOpacity = 1;
    glow = true;
  } else if (frame < SCENE_START.signature) {
    fillW = BAR_WIDTH;
    fillOpacity = 1;
    glow = true;
  } else {
    const pulse = Math.sin(frame * 0.22) * 0.5 + 0.5;
    fillW = BAR_WIDTH;
    fillOpacity = 0.85 + pulse * 0.15;
    glow = true;
  }

  return (
    <>
      <div
        style={{
          position: "absolute",
          left: BAR_LEFT,
          top: BAR_Y,
          width: BAR_WIDTH,
          height: BAR_H,
          backgroundColor: colors.line,
          opacity: 0.3,
        }}
      />
      {fillW > 0 ? (
        <div
          style={{
            position: "absolute",
            left: fillX,
            top: BAR_Y,
            width: fillW,
            height: BAR_H,
            backgroundColor: fillColor,
            opacity: fillOpacity,
            boxShadow: glow ? `0 0 32px ${fillColor}88` : undefined,
          }}
        />
      ) : null}
      {frame >= SCENE_START.output && frame < SCENE_START.signature
        ? [0.25, 0.5, 0.75, 1].map((p, i) => {
            const litFrame = SCENE_START.output + 12 + i * 18;
            const lit = frame >= litFrame;
            return (
              <div
                key={p}
                style={{
                  position: "absolute",
                  left: BAR_LEFT + BAR_WIDTH * p - 5,
                  top: BAR_Y - 18,
                  width: 10,
                  height: BAR_H + 36,
                  backgroundColor: lit ? colors.amber : colors.line,
                  opacity: lit ? 1 : 0.6,
                }}
              />
            );
          })
        : null}
      {frame >= SCENE_START.signature
        ? [0.25, 0.5, 0.75, 1].map((p) => {
            const beat = Math.sin(frame * 0.22) * 0.5 + 0.5;
            const scale = 1 + beat * 0.4;
            return (
              <div
                key={p}
                style={{
                  position: "absolute",
                  left: BAR_LEFT + BAR_WIDTH * p - 5,
                  top: BAR_Y - 18,
                  width: 10,
                  height: BAR_H + 36,
                  backgroundColor: colors.green,
                  transform: `scaleY(${scale})`,
                  transformOrigin: "center",
                }}
              />
            );
          })
        : null}
    </>
  );
}

function Provocation() {
  const frame = useCurrentFrame();
  const kickerIn = within(frame, 5, 25);

  let count = 0;
  if (frame < 30) {
    count = interpolate(frame, [0, 30], [0, 47], CLAMP);
  } else if (frame < 55) {
    count = interpolate(frame, [30, 55], [47, 168], CLAMP);
  } else if (frame < 80) {
    count = interpolate(frame, [55, 80], [168, 312], CLAMP);
  } else {
    count = 312;
  }
  count = Math.round(count);

  const exit = within(frame, 78, 90);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 720,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 240,
          fontWeight: 900,
          color: colors.text,
          letterSpacing: -10,
          fontVariantNumeric: "tabular-nums",
          opacity: 1 - exit,
          transform: `translateY(${exit * -40}px)`,
        }}
      >
        {count}
      </div>
      <div
        style={{
          position: "absolute",
          top: 1080,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 44,
          fontWeight: 700,
          color: colors.muted,
          letterSpacing: 5,
          textTransform: "uppercase",
          opacity: kickerIn * (1 - exit),
          transform: `translateY(${(1 - kickerIn) * 30}px)`,
        }}
      >
        Ideas this month
      </div>
    </AbsoluteFill>
  );
}

function Reality() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const punch = spring({ frame, fps, config: SPRING_PUNCHY });
  const scale = interpolate(punch, [0, 1], [0.4, 1]);
  const kickerIn = within(frame, 18, 36);
  const exit = within(frame, 90, 105);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 660,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 320,
          fontWeight: 900,
          color: colors.text,
          letterSpacing: -10,
          transform: `scale(${scale * (1 - exit * 0.3)}) translateY(${exit * -160}px)`,
          opacity: 1 - exit,
        }}
      >
        1
      </div>
      <div
        style={{
          position: "absolute",
          top: 1140,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 44,
          fontWeight: 700,
          color: colors.amber,
          letterSpacing: 5,
          textTransform: "uppercase",
          opacity: kickerIn * (1 - exit),
        }}
      >
        Published
      </div>
    </AbsoluteFill>
  );
}

function Pivot() {
  const frame = useCurrentFrame();

  const line1Reveal = within(frame, 0, 30);
  const line1Exit = within(frame, 55, 70);

  const line2Reveal = within(frame, 75, 105);
  const line2Exit = within(frame, 125, 135);

  return (
    <AbsoluteFill>
      {line1Exit < 1 ? (
        <div
          style={{
            position: "absolute",
            top: 680,
            left: 80,
            right: 80,
            fontSize: 200,
            fontWeight: 900,
            color: colors.text,
            letterSpacing: -8,
            lineHeight: 0.95,
            clipPath: `inset(0 ${(1 - line1Reveal) * 100}% 0 0)`,
            opacity: 1 - line1Exit,
            transform: `translateX(${line1Exit * -120}px)`,
          }}
        >
          It&apos;s not
          <br />
          the ideas.
        </div>
      ) : null}
      {line2Reveal > 0 ? (
        <div
          style={{
            position: "absolute",
            top: 680,
            left: 80,
            right: 80,
            fontSize: 200,
            fontWeight: 900,
            color: colors.text,
            letterSpacing: -8,
            lineHeight: 0.95,
            clipPath: `inset(0 ${(1 - line2Reveal) * 100}% 0 0)`,
            opacity: 1 - line2Exit,
          }}
        >
          It&apos;s the
          <br />
          <span style={{ color: colors.amber }}>rhythm.</span>
        </div>
      ) : null}
    </AbsoluteFill>
  );
}

function System() {
  const frame = useCurrentFrame();

  const heroIn = within(frame, 0, 30);
  const heroExit = within(frame, 70, 92);

  const ticks = [
    { word: "PICK", frame: 60 },
    { word: "MAKE", frame: 90 },
    { word: "SHIP", frame: 120 },
    { word: "LEARN", frame: 150 },
  ];

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 600,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 220,
          fontWeight: 900,
          color: colors.text,
          letterSpacing: -8,
          opacity: heroIn * (1 - heroExit),
          transform: `translateY(${(1 - heroIn) * 60 + heroExit * -80}px)`,
        }}
      >
        THE LOOP
      </div>
      {ticks.map((tick, i) => {
        const t = within(frame, tick.frame, tick.frame + 12);
        if (t === 0) return null;
        const x = BAR_LEFT + BAR_WIDTH * (0.25 + i * 0.25 - 0.125);
        return (
          <div
            key={tick.word}
            style={{
              position: "absolute",
              top: BAR_Y - 110,
              left: x - 120,
              width: 240,
              textAlign: "center",
              fontSize: 56,
              fontWeight: 900,
              color: colors.text,
              letterSpacing: 2,
              opacity: t,
              transform: `translateY(${(1 - t) * 26}px) scale(${interpolate(t, [0, 1], [0.85, 1])})`,
            }}
          >
            {tick.word}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

function Output() {
  const frame = useCurrentFrame();

  const frameIn = within(frame, 0, 30);
  const copyIn = within(frame, 30, 70);
  const kickerIn = within(frame, 60, 84);
  const phoneExit = within(frame, 100, 120);

  const phoneW = 600;
  const phoneH = 1067;
  const phoneX = (1080 - phoneW) / 2;
  const phoneY = 360;

  const phoneScale =
    interpolate(frameIn, [0, 1], [0.85, 1]) * (1 - phoneExit * 0.96);
  const phoneTx = phoneExit * 480;
  const phoneTy = phoneExit * 486;

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          left: phoneX,
          top: phoneY,
          width: phoneW,
          height: phoneH,
          border: `4px solid ${colors.text}`,
          borderRadius: 32,
          opacity: frameIn * (1 - within(frame, 116, 120)),
          transform: `translate(${phoneTx}px, ${phoneTy}px) scale(${phoneScale})`,
          transformOrigin: "right bottom",
        }}
      >
        <div
          style={{
            position: "absolute",
            left: 32,
            right: 32,
            top: 220,
            fontSize: 72,
            fontWeight: 900,
            color: colors.text,
            letterSpacing: -3,
            lineHeight: 0.96,
            clipPath: `inset(0 ${(1 - copyIn) * 100}% 0 0)`,
          }}
        >
          Publish
          <br />
          the useful
          <br />
          one.
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          right: 80,
          top: 1340,
          fontSize: 44,
          fontWeight: 900,
          color: colors.amber,
          letterSpacing: 5,
          textTransform: "uppercase",
          opacity: kickerIn * (1 - phoneExit),
          transform: `translateY(${(1 - kickerIn) * 16}px)`,
        }}
      >
        1 / week
      </div>
    </AbsoluteFill>
  );
}

function Signature() {
  const frame = useCurrentFrame();

  const lockupIn = within(frame, 0, 30);
  const subIn = within(frame, 22, 50);

  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          top: 760,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 180,
          fontWeight: 900,
          color: colors.text,
          letterSpacing: -6,
          opacity: lockupIn,
          transform: `translateY(${(1 - lockupIn) * 40}px)`,
        }}
      >
        MCH STUDIO
      </div>
      <div
        style={{
          position: "absolute",
          top: 1000,
          left: 0,
          right: 0,
          textAlign: "center",
          fontSize: 56,
          fontWeight: 700,
          color: colors.green,
          letterSpacing: 4,
          textTransform: "uppercase",
          opacity: subIn,
          transform: `translateY(${(1 - subIn) * 24}px)`,
        }}
      >
        weekly · useful · shipped
      </div>
    </AbsoluteFill>
  );
}

function CreamWipe() {
  const frame = useCurrentFrame();
  const wipe = within(frame, 310, 340);
  if (wipe === 0 || wipe === 1) return null;

  const x = interpolate(wipe, [0, 1], [-1200, 1200]);

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: -40,
        width: 1280,
        height: 2000,
        backgroundColor: colors.text,
        transform: `skewX(-8deg)`,
      }}
    />
  );
}

export const MarketingProductionRhythmAlt = () => {
  return (
    <AbsoluteFill style={{ fontFamily: FONT, overflow: "hidden" }}>
      <BackgroundChrome />
      <Series>
        <Series.Sequence durationInFrames={SCENE.provocation}>
          <Provocation />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE.reality}>
          <Reality />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE.pivot}>
          <Pivot />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE.system}>
          <System />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE.output}>
          <Output />
        </Series.Sequence>
        <Series.Sequence durationInFrames={SCENE.signature}>
          <Signature />
        </Series.Sequence>
      </Series>
      <RhythmBar />
      <CreamWipe />
    </AbsoluteFill>
  );
};
