import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { CLAMP, SPRING_PUNCHY, tween } from "./lib/motion";
import { colors } from "./lib/theme";
import { CODEX_SCENES } from "./lib/timing";

const signals = [
  { label: "question", x: 98, y: 520, w: 360, rot: -8, color: colors.green },
  { label: "note", x: 568, y: 470, w: 290, rot: 7, color: colors.amber },
  { label: "angle", x: 166, y: 840, w: 300, rot: 6, color: colors.cyan },
  { label: "offer", x: 636, y: 890, w: 318, rot: -6, color: colors.green },
  { label: "story", x: 352, y: 1190, w: 340, rot: 4, color: colors.amber },
];

const steps = ["Capture", "Choose", "Make", "Ship", "Learn"];

const frameTween = (
  frame: number,
  start: number,
  end: number,
  output: [number, number],
) => interpolate(frame, [start, end], output, CLAMP);

const within = (frame: number, start: number, end: number) =>
  frameTween(frame, start, end, [0, 1]);

function Background() {
  const frame = useCurrentFrame();
  const sweep = frame * 0.2;
  const drift = frame * 0.03;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.ink, overflow: "hidden" }}>
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `linear-gradient(${colors.line} 1px, transparent 1px), linear-gradient(90deg, ${colors.line} 1px, transparent 1px)`,
          backgroundSize: "108px 108px",
          transform: `translate(${drift * 18}px, ${sweep % 108}px)`,
        }}
      />
      <div
        className="absolute h-[900px] w-[900px] rounded-full blur-[120px]"
        style={{
          left: -360 + drift * 60,
          top: 60,
          backgroundColor: `${colors.green}38`,
        }}
      />
      <div
        className="absolute h-[740px] w-[740px] rounded-full blur-[130px]"
        style={{
          right: -300,
          bottom: 150 + drift * 70,
          backgroundColor: `${colors.amber}24`,
        }}
      />
      <div
        className="absolute left-16 top-16 text-[34px] font-black tracking-[0px]"
        style={{ color: colors.green }}
      >
        MCH
      </div>
      <div
        className="absolute right-16 top-20 text-[24px] font-semibold uppercase tracking-[4px]"
        style={{ color: colors.muted }}
      >
        Studio
      </div>
      <div
        className="absolute left-0 top-0 h-full w-[10px]"
        style={{ backgroundColor: colors.green }}
      />
    </AbsoluteFill>
  );
}

function SceneText({
  kicker,
  line1,
  line2,
  progress,
  top = 230,
}: {
  kicker?: string;
  line1: string;
  line2?: string;
  progress: number;
  top?: number;
}) {
  const lift = interpolate(progress, [0, 1], [70, 0]);

  return (
    <div
      className="absolute left-16 right-16"
      style={{
        top,
        opacity: progress,
        transform: `translateY(${lift}px)`,
      }}
    >
      {kicker ? (
        <div
          className="mb-7 text-[36px] font-extrabold uppercase tracking-[5px]"
          style={{ color: colors.green }}
        >
          {kicker}
        </div>
      ) : null}
      <div
        className="text-[154px] font-black leading-[0.9] tracking-[0px]"
        style={{ color: colors.text }}
      >
        {line1}
        {line2 ? (
          <>
            <br />
            <span style={{ color: colors.amber }}>{line2}</span>
          </>
        ) : null}
      </div>
    </div>
  );
}

function SignalCard({
  signal,
  index,
}: {
  signal: (typeof signals)[number];
  index: number;
}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const enter = tween(
    frame,
    fps,
    0.08 + index * 0.06,
    0.9 + index * 0.05,
    [0, 1],
  );
  const exit = frameTween(frame, 86, 118, [1, 0]);
  const punch = spring({
    frame: frame - index * 3,
    fps,
    config: SPRING_PUNCHY,
  });

  return (
    <div
      className="absolute flex h-[132px] items-center justify-center border-[3px] text-[42px] font-black uppercase"
      style={{
        left: signal.x,
        top: signal.y,
        width: signal.w,
        color: colors.ink,
        borderColor: signal.color,
        backgroundColor: signal.color,
        opacity: enter * exit,
        transform: `translateY(${interpolate(enter, [0, 1], [160, 0])}px) rotate(${signal.rot}deg) scale(${interpolate(punch, [0, 1], [0.75, 1])})`,
        boxShadow: "0 34px 110px rgba(0,0,0,0.34)",
      }}
    >
      {signal.label}
    </div>
  );
}

function HookScene() {
  const frame = useCurrentFrame();
  const textIn = within(frame, 4, 26);
  const exit = frameTween(frame, 88, 112, [1, 0]);
  const wipe = within(frame, 82, 108);

  return (
    <AbsoluteFill style={{ opacity: exit }}>
      <SceneText
        kicker="the problem"
        line1="Ideas"
        line2="pile up"
        progress={textIn}
        top={170}
      />
      {signals.map((signal, index) => (
        <SignalCard key={signal.label} signal={signal} index={index} />
      ))}
      <div
        className="absolute bottom-[210px] left-16 h-[24px]"
        style={{
          width: interpolate(textIn, [0, 1], [0, 760]),
          backgroundColor: colors.green,
          opacity: textIn,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundColor: colors.text,
          opacity: interpolate(wipe, [0, 0.55, 1], [0, 0.95, 0]),
          transform: `translateX(${interpolate(wipe, [0, 1], [-1080, 0])}px)`,
        }}
      />
    </AbsoluteFill>
  );
}

function SelectScene() {
  const frame = useCurrentFrame();
  const show = within(
    frame,
    CODEX_SCENES.select.start,
    CODEX_SCENES.select.start + 24,
  );
  const focus = within(frame, 132, 186);
  const exit = frameTween(frame, 220, 248, [1, 0]);
  const gate = interpolate(focus, [0, 1], [520, 240]);

  return (
    <AbsoluteFill style={{ opacity: show * exit }}>
      <SceneText
        kicker="the move"
        line1="Pick"
        line2="one"
        progress={show}
        top={210}
      />
      <div
        className="absolute left-[132px] right-[132px] top-[710px] h-[570px] border-[4px]"
        style={{
          borderColor: colors.green,
          backgroundColor: `${colors.panel}cc`,
        }}
      />
      <div
        className="absolute left-[276px] top-[620px] h-[700px] w-[110px]"
        style={{
          backgroundColor: colors.ink,
          borderLeft: `4px solid ${colors.line}`,
          borderRight: `4px solid ${colors.line}`,
          transform: `skewX(-11deg) translateX(${gate * -0.28}px)`,
        }}
      />
      <div
        className="absolute right-[276px] top-[620px] h-[700px] w-[110px]"
        style={{
          backgroundColor: colors.ink,
          borderLeft: `4px solid ${colors.line}`,
          borderRight: `4px solid ${colors.line}`,
          transform: `skewX(11deg) translateX(${gate * 0.28}px)`,
        }}
      />
      {signals.map((signal, index) => {
        const travel = within(frame, 118 + index * 4, 178 + index * 4);
        const chosen = index === 2;
        const x = interpolate(
          travel,
          [0, 1],
          [signal.x, chosen ? 372 : 470 + index * 16],
        );
        const y = interpolate(
          travel,
          [0, 1],
          [signal.y + 120, chosen ? 920 : 1430 + index * 18],
        );

        return (
          <div
            key={signal.label}
            className="absolute flex h-[118px] items-center justify-center border-[3px] text-[34px] font-black uppercase"
            style={{
              left: x,
              top: y,
              width: chosen ? 340 : 250,
              color: chosen ? colors.ink : colors.muted,
              borderColor: chosen ? colors.amber : colors.line,
              backgroundColor: chosen ? colors.amber : colors.panel2,
              opacity: chosen ? 1 : interpolate(travel, [0.55, 1], [1, 0.18]),
              transform: `rotate(${interpolate(travel, [0, 1], [signal.rot, chosen ? 0 : 12])}deg) scale(${chosen ? interpolate(focus, [0, 1], [0.9, 1.08]) : 0.72})`,
            }}
          >
            {signal.label}
          </div>
        );
      })}
    </AbsoluteFill>
  );
}

function SystemScene() {
  const frame = useCurrentFrame();
  const reveal = within(
    frame,
    CODEX_SCENES.system.start,
    CODEX_SCENES.system.start + 28,
  );
  const fill = within(frame, 258, 386);
  const exit = frameTween(frame, 392, 424, [1, 0]);
  const railLeft = 138;
  const railTop = 860;
  const railWidth = 804;

  return (
    <AbsoluteFill style={{ opacity: reveal * exit }}>
      <SceneText
        kicker="the system"
        line1="Make it"
        line2="move"
        progress={reveal}
        top={190}
      />
      <div
        className="absolute h-[22px]"
        style={{
          left: railLeft,
          top: railTop,
          width: railWidth,
          backgroundColor: colors.line,
        }}
      />
      <div
        className="absolute h-[22px]"
        style={{
          left: railLeft,
          top: railTop,
          width: railWidth * fill,
          backgroundColor: colors.green,
          boxShadow: `0 0 46px ${colors.green}66`,
        }}
      />
      {steps.map((step, index) => {
        const stepProgress = within(frame, 250 + index * 26, 282 + index * 26);
        const left = railLeft + index * (railWidth / 4);

        return (
          <div
            key={step}
            className="absolute"
            style={{ left: left - 78, top: railTop - 92 }}
          >
            <div
              className="flex h-[170px] w-[156px] items-center justify-center border-[4px] text-[64px] font-black"
              style={{
                color: stepProgress > 0.8 ? colors.ink : colors.text,
                borderColor: stepProgress > 0.5 ? colors.green : colors.line,
                backgroundColor:
                  stepProgress > 0.8 ? colors.green : colors.panel,
                transform: `scale(${interpolate(stepProgress, [0, 1], [0.76, 1])})`,
              }}
            >
              {index + 1}
            </div>
            <div
              className="mt-7 text-center text-[34px] font-black"
              style={{ color: stepProgress > 0.5 ? colors.text : colors.muted }}
            >
              {step}
            </div>
          </div>
        );
      })}
      <div
        className="absolute left-[354px] top-[1260px] h-[138px] w-[372px] border-[4px]"
        style={{
          borderColor: colors.amber,
          backgroundColor: colors.amber,
          transform: `translateX(${interpolate(fill, [0, 1], [-420, 420])}px)`,
          opacity: frameTween(frame, 318, 396, [0, 1]),
        }}
      />
    </AbsoluteFill>
  );
}

function AssetScene() {
  const frame = useCurrentFrame();
  const reveal = within(
    frame,
    CODEX_SCENES.asset.start,
    CODEX_SCENES.asset.start + 30,
  );
  const build = within(frame, 436, 534);
  const exit = frameTween(frame, 574, 606, [1, 0]);

  return (
    <AbsoluteFill style={{ opacity: reveal * exit }}>
      <SceneText
        kicker="the output"
        line1="One"
        line2="asset"
        progress={reveal}
        top={160}
      />
      <div
        className="absolute left-[126px] top-[600px] h-[880px] w-[828px] overflow-hidden border-[5px]"
        style={{
          borderColor: colors.text,
          backgroundColor: colors.text,
          color: colors.ink,
          transform: `translateY(${interpolate(reveal, [0, 1], [120, 0])}px) scale(${interpolate(build, [0, 1], [0.92, 1])})`,
          boxShadow: "0 42px 150px rgba(0,0,0,0.45)",
        }}
      >
        <div
          className="absolute left-0 top-0 h-[22px]"
          style={{ width: `${build * 100}%`, backgroundColor: colors.green }}
        />
        <div className="absolute left-12 top-14 text-[36px] font-black">
          MCH Projects
        </div>
        <div
          className="absolute right-12 top-16 h-[28px] w-[160px]"
          style={{ backgroundColor: colors.green }}
        />
        <div className="absolute left-12 top-[190px] right-12 text-[92px] font-black leading-[0.96] tracking-[0px]">
          Publish the useful one.
        </div>
        <div
          className="absolute left-12 top-[520px] h-[150px] w-[150px]"
          style={{
            backgroundColor: colors.amber,
            transform: `scale(${interpolate(build, [0.15, 0.45], [0, 1], CLAMP)})`,
          }}
        />
        <div className="absolute left-[240px] top-[524px] flex flex-col gap-5">
          {[0, 1, 2].map((line) => (
            <div
              key={line}
              className="h-[26px]"
              style={{
                width: [440, 330, 500][line],
                backgroundColor: line === 0 ? colors.ink : "#c5c8c2",
                transform: `scaleX(${interpolate(build, [0.28 + line * 0.12, 0.52 + line * 0.12], [0, 1], CLAMP)})`,
                transformOrigin: "left",
              }}
            />
          ))}
        </div>
        <div
          className="absolute bottom-12 left-12 right-12 h-[92px] border-[4px]"
          style={{ borderColor: colors.ink }}
        >
          <div
            className="h-full"
            style={{
              width: `${interpolate(build, [0.55, 1], [0, 100], CLAMP)}%`,
              backgroundColor: colors.green,
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
}

function CadenceScene() {
  const frame = useCurrentFrame();
  const reveal = within(
    frame,
    CODEX_SCENES.cadence.start,
    CODEX_SCENES.cadence.start + 34,
  );
  const loop = within(frame, 612, 704);
  const pulse = Math.sin(frame * 0.18) * 0.5 + 0.5;

  return (
    <AbsoluteFill style={{ opacity: reveal }}>
      <SceneText
        kicker="the promise"
        line1="Ship"
        line2="weekly"
        progress={reveal}
        top={210}
      />
      <div
        className="absolute left-[160px] top-[735px] h-[760px] w-[760px] rounded-full border-[8px]"
        style={{
          borderColor: colors.line,
          transform: `scale(${interpolate(reveal, [0, 1], [0.78, 1])})`,
        }}
      />
      <div
        className="absolute left-[160px] top-[735px] h-[760px] w-[760px] rounded-full border-[22px]"
        style={{
          borderColor: colors.green,
          clipPath: `inset(0 ${interpolate(loop, [0, 1], [100, 0])}% 0 0)`,
          opacity: 0.9,
          transform: `rotate(-40deg) scale(${1 + pulse * 0.015})`,
        }}
      />
      {[0, 1, 2, 3].map((dot) => {
        const angle = -90 + dot * 90;
        const lit = loop > dot / 4;
        const radius = 380;
        const left = 540 + Math.cos((angle * Math.PI) / 180) * radius;
        const top = 1115 + Math.sin((angle * Math.PI) / 180) * radius;

        return (
          <div
            key={dot}
            className="absolute h-[86px] w-[86px] rounded-full border-[5px]"
            style={{
              left: left - 43,
              top: top - 43,
              borderColor: lit ? colors.amber : colors.line,
              backgroundColor: lit ? colors.amber : colors.panel,
              transform: `scale(${lit ? 1.1 : 0.84})`,
            }}
          />
        );
      })}
      <div
        className="absolute bottom-[210px] left-16 right-16 text-center text-[44px] font-extrabold uppercase tracking-[6px]"
        style={{
          color: colors.green,
          opacity: frameTween(frame, 690, 730, [0, 1]),
        }}
      >
        MCH Studio
      </div>
    </AbsoluteFill>
  );
}

function TransitionBand() {
  const frame = useCurrentFrame();
  const bands = [
    { start: 100, color: colors.text },
    { start: 232, color: colors.green },
    { start: 412, color: colors.amber },
    { start: 590, color: colors.text },
  ];

  return (
    <>
      {bands.map((band) => {
        const p = within(frame, band.start, band.start + 24);
        return (
          <div
            key={band.start}
            className="absolute inset-y-0 w-full"
            style={{
              left: 0,
              backgroundColor: band.color,
              opacity: interpolate(p, [0, 0.5, 1], [0, 0.9, 0]),
              transform: `translateX(${interpolate(p, [0, 1], [-1080, 1080])}px) skewX(-10deg)`,
            }}
          />
        );
      })}
    </>
  );
}

export const MarketingProductionRhythmCodex = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Inter, Arial, Helvetica, sans-serif" }}>
      <Background />
      <HookScene />
      <SelectScene />
      <SystemScene />
      <AssetScene />
      <CadenceScene />
      <TransitionBand />
    </AbsoluteFill>
  );
};
