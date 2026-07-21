import "./index.css";
import { Composition } from "remotion";
import { MarketingProductionRhythm } from "./Composition";
import { MarketingProductionRhythmCodex } from "./CodexMotionConcept";
import { MarketingProductionRhythmAlt } from "./MarketingProductionRhythmAlt";
import { marketingProductionRhythmPayload } from "./payload";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="MarketingProductionRhythm"
        component={MarketingProductionRhythm}
        durationInFrames={900}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={marketingProductionRhythmPayload}
      />
      <Composition
        id="MarketingProductionRhythmCodex"
        component={MarketingProductionRhythmCodex}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
      <Composition
        id="MarketingProductionRhythmAlt"
        component={MarketingProductionRhythmAlt}
        durationInFrames={750}
        fps={30}
        width={1080}
        height={1920}
      />
    </>
  );
};
