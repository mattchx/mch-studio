import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

// ============ THEME ============
const BG = "#0e0f11";
const PANEL = "#1a1c20";
const BORDER = "#2f3338";
const BORDER_LIGHT = "#3a3f45";
const ACCENT = "#6dba7a";
const ACCENT_DIM = "#3d6a44";
const HIGHLIGHT = "#f4c14d";
const HIGHLIGHT_BG = "#3a3015";
const FG = "#f0f0f0";
const MUTED = "#8a8d92";
const SUBTLE = "#5b5e63";

// ============ PHASES (30 fps, 900 frames = 30s) ============
const P = {
  scatterEnd: 90, // 0–3s: cards pour in
  sortEnd: 300, // 3–10s: cards sort into lanes
  rhythmEnd: 540, // 10–18s: weekly rhythm fills
  postEnd: 750, // 18–25s: idea becomes post
  outroEnd: 900, // 25–30s: tagline outro
};

// ============ LAYOUT ============
const W = 1080;
const LANE_W = 180;
const LANE_GUTTER = 14;

// ============ DATA ============
type Idea = {
  id: string;
  text: string;
  laneIdx: number;
  laneSlot: number;
  scatter: { x: number; y: number; rot: number };
  isHero?: boolean;
};

const LANES = [
  { id: "capture", label: "CAPTURE" },
  { id: "decide", label: "DECIDE" },
  { id: "draft", label: "DRAFT" },
  { id: "publish", label: "PUBLISH" },
  { id: "learn", label: "LEARN" },
];

const IDEAS: Idea[] = [
  { id: "q1", text: "“Why aren’t my ads working?”", laneIdx: 0, laneSlot: 0, scatter: { x: 60, y: 470, rot: -8 } },
  { id: "q2", text: "before / after story", laneIdx: 0, laneSlot: 1, scatter: { x: 470, y: 410, rot: 6 } },
  { id: "d1", text: "spring promo angle", laneIdx: 1, laneSlot: 0, scatter: { x: 720, y: 540, rot: -12 } },
  { id: "d2", text: "FAQ: pricing", laneIdx: 1, laneSlot: 1, scatter: { x: 220, y: 650, rot: 10 } },
  { id: "dr1", text: "newsletter draft", laneIdx: 2, laneSlot: 0, scatter: { x: 540, y: 740, rot: -5 } },
  { id: "dr2", text: "service explainer", laneIdx: 2, laneSlot: 1, scatter: { x: 90, y: 870, rot: 4 }, isHero: true },
  { id: "p1", text: "offer card", laneIdx: 3, laneSlot: 0, scatter: { x: 700, y: 830, rot: 9 } },
  { id: "l1", text: "client testimonial", laneIdx: 4, laneSlot: 0, scatter: { x: 320, y: 1080, rot: -7 } },
  { id: "l2", text: "last week metrics", laneIdx: 4, laneSlot: 1, scatter: { x: 600, y: 1140, rot: 8 } },
];

const LANES_TOTAL = LANES.length * LANE_W + (LANES.length - 1) * LANE_GUTTER;
const LANES_LEFT = (W - LANES_TOTAL) / 2;
const LANE_TOP = 660;
const LANE_HEADER_H = 86;
const CARD_LANE = { w: 156, h: 100 };
const CARD_SCATTER = { w: 280, h: 130 };
const LANE_HEIGHT = LANE_HEADER_H + 14 + 2 * CARD_LANE.h + 12 + 14;

function laneX(idx: number) {
  return LANES_LEFT + idx * (LANE_W + LANE_GUTTER);
}
function laneCardX(idx: number) {
  return laneX(idx) + (LANE_W - CARD_LANE.w) / 2;
}
function laneCardY(slot: number) {
  return LANE_TOP + LANE_HEADER_H + 14 + slot * (CARD_LANE.h + 12);
}

// ============ HELPERS ============
function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}
function easeInOut(t: number) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}
function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// ============ HOOK COPY (top headline per phase) ============
const HOOKS = [
  { text: "9 ideas this week.", start: 6, end: 90 },
  { text: "Sort them into a system.", start: 110, end: 290 },
  { text: "Run them on a weekly rhythm.", start: 320, end: 530 },
  { text: "Ship one finished asset.", start: 560, end: 740 },
];

// ============ COMPONENTS ============

function BackgroundGrid() {
  return (
    <AbsoluteFill>
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(${BORDER}66 1px, transparent 1px), linear-gradient(90deg, ${BORDER}66 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
          opacity: 0.5,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse at 50% 45%, transparent 0%, ${BG} 75%)`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(circle at 18% 12%, ${ACCENT}22, transparent 32%), radial-gradient(circle at 88% 92%, ${HIGHLIGHT}14, transparent 30%)`,
        }}
      />
    </AbsoluteFill>
  );
}

function HookText({ frame }: { frame: number }) {
  const active = HOOKS.find((h) => frame >= h.start && frame <= h.end);
  if (!active) return null;
  const localF = frame - active.start;
  const total = active.end - active.start;
  const inOp = interpolate(localF, [0, 14], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outOp = interpolate(localF, [total - 18, total], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(inOp, outOp);
  const y = interpolate(inOp, [0, 1], [-12, 0]);
  return (
    <div
      style={{
        position: "absolute",
        top: 200,
        left: 60,
        right: 60,
        textAlign: "center",
        color: FG,
        fontSize: 60,
        fontWeight: 800,
        letterSpacing: -1,
        opacity,
        transform: `translateY(${y}px)`,
      }}
    >
      <span
        style={{
          paddingBottom: 10,
          borderBottom: `5px solid ${ACCENT}`,
        }}
      >
        {active.text}
      </span>
    </div>
  );
}

function HeaderEyebrow({ frame }: { frame: number }) {
  const opacity = interpolate(frame, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  // hide during outro
  const fade = interpolate(frame, [P.postEnd - 20, P.postEnd + 20], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  return (
    <div
      style={{
        position: "absolute",
        top: 110,
        left: 0,
        right: 0,
        textAlign: "center",
        opacity: opacity * fade,
        color: ACCENT,
        fontSize: 28,
        fontWeight: 700,
        letterSpacing: 8,
      }}
    >
      MCH&nbsp;PROJECTS · MARKETING OS
    </div>
  );
}

function IdeaCardLayer({ frame, fps }: { frame: number; fps: number }) {
  return (
    <>
      {IDEAS.map((idea, idx) => (
        <IdeaCard key={idea.id} idea={idea} idx={idx} frame={frame} fps={fps} />
      ))}
    </>
  );
}

function IdeaCard({ idea, idx, frame, fps }: { idea: Idea; idx: number; frame: number; fps: number }) {
  // Hero rides the rail separately after sort phase, so hide its lane copy then.
  const enterDelay = 4 + idx * 5;
  const enterSpring = spring({
    frame: frame - enterDelay,
    fps,
    config: { damping: 14, stiffness: 110, mass: 0.8 },
  });

  // Sort animation timing
  const sortStagger = idx * 7;
  const sortStart = P.scatterEnd + sortStagger;
  const sortDur = 70;
  const sortRaw = interpolate(frame, [sortStart, sortStart + sortDur], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const sortT = easeInOut(sortRaw);

  // Targets
  const targetX = laneCardX(idea.laneIdx);
  const targetY = laneCardY(idea.laneSlot);

  // Scatter pos with subtle jiggle while loose
  const jiggle = Math.sin((frame + idx * 11) * 0.13) * 1.6 * (1 - sortT);
  const scatterRot = idea.scatter.rot + jiggle;

  // Pre-entrance offset (cards drop from above)
  const preOffset = (1 - enterSpring) * -460;

  const x = lerp(idea.scatter.x, targetX, sortT);
  const y = lerp(idea.scatter.y + preOffset, targetY, sortT);
  const rot = lerp(scatterRot, 0, sortT);
  const w = lerp(CARD_SCATTER.w, CARD_LANE.w, sortT);
  const h = lerp(CARD_SCATTER.h, CARD_LANE.h, sortT);
  const fontSize = lerp(28, 18, sortT);

  // Visibility
  let opacity = enterSpring;

  if (frame >= P.sortEnd) {
    if (idea.isHero) {
      // hero leaves the lane to ride the rail
      const heroFade = interpolate(frame, [P.sortEnd - 5, P.sortEnd + 18], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      opacity = heroFade;
    } else {
      const fadeOut = interpolate(frame, [P.sortEnd, P.sortEnd + 30], [1, 0], {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      });
      opacity = fadeOut;
    }
  }

  if (opacity <= 0) return null;
  if (frame < enterDelay - 2) return null;

  const isHeroStyling = idea.isHero && sortT > 0.6;

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `rotate(${rot}deg)`,
        transformOrigin: "center",
        backgroundColor: isHeroStyling ? HIGHLIGHT_BG : PANEL,
        border: `1px solid ${isHeroStyling ? HIGHLIGHT : BORDER_LIGHT}`,
        borderLeft: `4px solid ${isHeroStyling ? HIGHLIGHT : ACCENT_DIM}`,
        borderRadius: 8,
        padding: lerp(18, 12, sortT),
        color: FG,
        fontSize,
        lineHeight: 1.25,
        boxShadow: `0 ${lerp(18, 4, sortT)}px ${lerp(40, 12, sortT)}px rgba(0,0,0,0.45)`,
        opacity,
        display: "flex",
        alignItems: "center",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <span style={{ fontWeight: 500 }}>{idea.text}</span>
    </div>
  );
}

function LanesLayer({ frame }: { frame: number }) {
  const appear = interpolate(frame, [80, 130], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const fade = interpolate(frame, [285, 320], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(appear, fade);
  if (opacity <= 0) return null;

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {LANES.map((lane, i) => {
        const stagger = interpolate(frame, [80 + i * 6, 130 + i * 6], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        });
        const ty = (1 - stagger) * 24;
        return (
          <div
            key={lane.id}
            style={{
              position: "absolute",
              left: laneX(i),
              top: LANE_TOP,
              width: LANE_W,
              height: LANE_HEIGHT,
              backgroundColor: PANEL,
              border: `1px solid ${BORDER}`,
              borderTop: `3px solid ${ACCENT_DIM}`,
              borderRadius: 10,
              transform: `translateY(${ty}px)`,
              opacity: stagger,
              boxShadow: "0 6px 22px rgba(0,0,0,0.35)",
            }}
          >
            <div
              style={{
                padding: "22px 12px",
                color: ACCENT,
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: 2.4,
                textAlign: "center",
                fontFamily: "Arial, Helvetica, sans-serif",
                borderBottom: `1px dashed ${BORDER_LIGHT}`,
              }}
            >
              {String(i + 1).padStart(2, "0")} · {lane.label}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function RhythmLayer({ frame }: { frame: number }) {
  const inO = interpolate(frame, [295, 345], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const outO = interpolate(frame, [515, 545], [1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  const opacity = Math.min(inO, outO);
  if (opacity <= 0) return null;

  const trackY = 1100;
  const trackLeft = 110;
  const trackRight = 970;
  const trackW = trackRight - trackLeft;

  const NODES = [
    { day: "MON", label: "CAPTURE" },
    { day: "TUE", label: "DECIDE" },
    { day: "WED", label: "DRAFT" },
    { day: "THU", label: "PUBLISH" },
    { day: "FRI", label: "LEARN" },
  ];

  // hero rides the rail 345–510
  const railProgress = interpolate(frame, [350, 510], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // hero exit at end of rail (510–540)
  const heroFade = interpolate(frame, [510, 540], [1, 0], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  const heroX = trackLeft + railProgress * trackW;

  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      {/* week label */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: 920,
          textAlign: "center",
          color: MUTED,
          letterSpacing: 6,
          fontSize: 24,
          fontWeight: 700,
        }}
      >
        ONE WEEK
      </div>

      {/* base track */}
      <div
        style={{
          position: "absolute",
          left: trackLeft,
          top: trackY,
          width: trackW,
          height: 6,
          backgroundColor: BORDER,
          borderRadius: 3,
        }}
      />
      {/* progress fill */}
      <div
        style={{
          position: "absolute",
          left: trackLeft,
          top: trackY,
          width: railProgress * trackW,
          height: 6,
          background: `linear-gradient(90deg, ${ACCENT_DIM}, ${ACCENT})`,
          borderRadius: 3,
          boxShadow: `0 0 18px ${ACCENT}99`,
        }}
      />

      {/* nodes */}
      {NODES.map((n, i) => {
        const nodeT = i / (NODES.length - 1);
        const passed = railProgress >= nodeT - 0.015;
        const cx = trackLeft + nodeT * trackW;
        const popT = clamp((railProgress - nodeT) * 8 + 0.5, 0, 1);
        const scale = passed ? 1 + 0.18 * Math.sin(popT * Math.PI) : 1;
        return (
          <div key={n.label}>
            {/* day */}
            <div
              style={{
                position: "absolute",
                left: cx - 80,
                top: trackY - 76,
                width: 160,
                textAlign: "center",
                color: passed ? ACCENT : SUBTLE,
                fontSize: 22,
                letterSpacing: 3,
                fontWeight: 700,
              }}
            >
              {n.day}
            </div>
            {/* node circle */}
            <div
              style={{
                position: "absolute",
                left: cx - 32,
                top: trackY - 29,
                width: 64,
                height: 64,
                borderRadius: 9999,
                backgroundColor: passed ? ACCENT : PANEL,
                border: `3px solid ${passed ? ACCENT : BORDER_LIGHT}`,
                color: passed ? BG : MUTED,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 26,
                fontWeight: 800,
                boxShadow: passed ? `0 0 18px ${ACCENT}88` : "none",
                transform: `scale(${scale})`,
                fontFamily: "Arial, Helvetica, sans-serif",
              }}
            >
              {passed ? "✓" : i + 1}
            </div>
            {/* label */}
            <div
              style={{
                position: "absolute",
                left: cx - 80,
                top: trackY + 60,
                width: 160,
                textAlign: "center",
                color: passed ? FG : MUTED,
                fontSize: 22,
                letterSpacing: 1.5,
                fontWeight: 700,
              }}
            >
              {n.label}
            </div>
          </div>
        );
      })}

      {/* hero card riding the rail */}
      <div
        style={{
          position: "absolute",
          left: heroX - 90,
          top: trackY - 165,
          width: 180,
          height: 100,
          backgroundColor: HIGHLIGHT_BG,
          border: `1px solid ${HIGHLIGHT}`,
          borderLeft: `4px solid ${HIGHLIGHT}`,
          borderRadius: 8,
          padding: 14,
          color: FG,
          fontSize: 22,
          lineHeight: 1.25,
          fontWeight: 600,
          boxShadow: `0 0 28px ${HIGHLIGHT}66, 0 12px 24px rgba(0,0,0,0.4)`,
          display: "flex",
          alignItems: "center",
          opacity: heroFade,
          fontFamily: "Arial, Helvetica, sans-serif",
        }}
      >
        service explainer
        {/* connector arrow tail */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            bottom: -22,
            width: 0,
            height: 0,
            transform: "translateX(-50%)",
            borderLeft: "10px solid transparent",
            borderRight: "10px solid transparent",
            borderTop: `12px solid ${HIGHLIGHT}`,
          }}
        />
      </div>
    </div>
  );
}

function PostMockup({ frame, fps }: { frame: number; fps: number }) {
  if (frame < 525) return null;

  const enter = spring({
    frame: frame - 540,
    fps,
    config: { damping: 16, stiffness: 90, mass: 0.9 },
  });

  // outro: shrink to upper area at 760+
  const outroT = interpolate(frame, [760, 820], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  // big centered: x=60, y=460, w=960, h=860
  // outro: x=170, y=290, w=740, h=640
  const centerX = 60;
  const centerY = 460;
  const centerW = 960;
  const centerH = 860;
  const smallX = 170;
  const smallY = 280;
  const smallW = 740;
  const smallH = 660;

  const x = lerp(centerX, smallX, easeInOut(outroT));
  const y = lerp(centerY, smallY, easeInOut(outroT));
  const w = lerp(centerW, smallW, easeInOut(outroT));
  const h = lerp(centerH, smallH, easeInOut(outroT));

  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w,
        height: h,
        backgroundColor: PANEL,
        border: `1px solid ${BORDER_LIGHT}`,
        borderRadius: 14,
        padding: 32,
        opacity: enter,
        transform: `scale(${0.85 + 0.15 * enter})`,
        transformOrigin: "center top",
        boxShadow: "0 24px 60px rgba(0,0,0,0.55)",
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <div
          style={{
            width: 76,
            height: 76,
            borderRadius: 9999,
            background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DIM})`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: BG,
            fontSize: 40,
            fontWeight: 800,
          }}
        >
          M
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 30, fontWeight: 800, color: FG }}>MCH Projects</div>
          <div style={{ fontSize: 22, color: MUTED }}>Marketing systems for service businesses</div>
          <div style={{ fontSize: 18, color: SUBTLE, marginTop: 2, letterSpacing: 0.5 }}>
            Just now · Public
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ marginTop: 26, fontSize: 28, lineHeight: 1.45, color: FG }}>
        <div>
          Most small businesses don’t have a marketing problem because they lack ideas.
        </div>
        <div style={{ marginTop: 14 }}>
          They have one because useful ideas never make it all the way to{" "}
          <span style={{ color: ACCENT, fontWeight: 700 }}>published</span>.
        </div>
        <div style={{ marginTop: 18, color: MUTED, fontSize: 24 }}>
          One useful idea. One finished asset. Every week.
        </div>
      </div>

      {/* Reaction bar */}
      <div
        style={{
          position: "absolute",
          left: 32,
          right: 32,
          bottom: 28,
          paddingTop: 16,
          borderTop: `1px solid ${BORDER_LIGHT}`,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ReactionCounter frame={frame} />
        <div
          style={{
            display: "flex",
            gap: 28,
            color: MUTED,
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 0.5,
          }}
        >
          <span>Like</span>
          <span>Comment</span>
          <span>Repost</span>
          <span>Send</span>
        </div>
      </div>
    </div>
  );
}

function ReactionCounter({ frame }: { frame: number }) {
  const start = 595;
  const end = 760;
  const target = 247;
  const count = Math.floor(
    interpolate(frame, [start, end], [0, target], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }),
  );
  const pulse = 1 + 0.06 * Math.sin((frame - start) * 0.6);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 9999,
          backgroundColor: ACCENT,
          color: BG,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 20,
          fontWeight: 800,
          transform: `scale(${pulse})`,
        }}
      >
        ♥
      </div>
      <span style={{ color: ACCENT, fontWeight: 800, fontSize: 26 }}>
        {count} reactions
      </span>
    </div>
  );
}

function TaglineLayer({ frame, fps }: { frame: number; fps: number }) {
  if (frame < 760) return null;

  const lines = [
    { text: "One idea.", start: 770 },
    { text: "One finished asset.", start: 815 },
    { text: "Every week.", start: 855 },
  ];

  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        top: 1080,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 18,
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      {lines.map((l, i) => {
        const enter = spring({
          frame: frame - l.start,
          fps,
          config: { damping: 14, stiffness: 110, mass: 0.7 },
        });
        const ty = (1 - enter) * 28;
        return (
          <div
            key={i}
            style={{
              opacity: enter,
              transform: `translateY(${ty}px)`,
              fontSize: i === 1 ? 86 : 80,
              fontWeight: 900,
              color: i === 1 ? ACCENT : FG,
              letterSpacing: -1.5,
              lineHeight: 1.05,
              textAlign: "center",
            }}
          >
            {l.text}
          </div>
        );
      })}
    </div>
  );
}

function Branding({ frame }: { frame: number }) {
  const opacity = interpolate(frame, [0, 18], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return (
    <div
      style={{
        position: "absolute",
        bottom: 60,
        left: 0,
        right: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 14,
        opacity,
        fontFamily: "Arial, Helvetica, sans-serif",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          background: `linear-gradient(135deg, ${ACCENT}, ${ACCENT_DIM})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: BG,
          fontWeight: 800,
          fontSize: 24,
        }}
      >
        M
      </div>
      <div style={{ color: MUTED, fontSize: 28, fontWeight: 700, letterSpacing: 0.6 }}>
        MCH Projects
      </div>
    </div>
  );
}

function ProgressTicker({ frame, totalFrames }: { frame: number; totalFrames: number }) {
  const pct = clamp(frame / totalFrames, 0, 1);
  return (
    <div
      style={{
        position: "absolute",
        left: 60,
        right: 60,
        bottom: 130,
        height: 4,
        backgroundColor: BORDER,
        borderRadius: 2,
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${pct * 100}%`,
          background: `linear-gradient(90deg, ${ACCENT_DIM}, ${ACCENT})`,
          borderRadius: 2,
        }}
      />
    </div>
  );
}

// ============ ROOT COMPONENT ============

export type ScenePayload = {
  id: string;
  startFrame: number;
  durationFrames: number;
  caption: string;
  voiceover: string;
  visualPrompt: string;
};

export type MarketingProductionRhythmProps = {
  title?: string;
  sourceIdea?: string;
  scenes?: ScenePayload[];
};

export const MarketingProductionRhythm: React.FC<MarketingProductionRhythmProps> = () => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: BG,
        color: FG,
        fontFamily: "Arial, Helvetica, sans-serif",
        overflow: "hidden",
      }}
    >
      <BackgroundGrid />
      <HeaderEyebrow frame={frame} />
      <HookText frame={frame} />
      <LanesLayer frame={frame} />
      <IdeaCardLayer frame={frame} fps={fps} />
      <RhythmLayer frame={frame} />
      <PostMockup frame={frame} fps={fps} />
      <TaglineLayer frame={frame} fps={fps} />
      <ProgressTicker frame={frame} totalFrames={durationInFrames} />
      <Branding frame={frame} />
    </AbsoluteFill>
  );
};
