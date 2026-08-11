import type { CSSProperties } from "react";
import {
  getAtmosphereTuning,
  type AtmosphereLayerTuning,
  type AtmosphereTuning,
} from "./atmosphere-config";
import { AtmosphereImage } from "./AtmosphereImage";

type HexagramAtmosphereProps = {
  lowerTrigramId: string;
  upperTrigramId: string;
  variant?: "split" | "folio";
};

type AtmosphereLayerStyle = CSSProperties & {
  "--atmosphere-contrast": number;
  "--atmosphere-object-position": string;
  "--atmosphere-opacity": number;
};

function atmosphereLayerStyle(
  tuning: AtmosphereTuning,
  layer: AtmosphereLayerTuning,
): AtmosphereLayerStyle {
  return {
    "--atmosphere-contrast": tuning.contrast,
    "--atmosphere-object-position": layer.objectPosition,
    "--atmosphere-opacity": layer.opacity,
  };
}

export function HexagramAtmosphere({
  lowerTrigramId,
  upperTrigramId,
  variant = "split",
}: HexagramAtmosphereProps) {
  const upperAtmosphere = getAtmosphereTuning(upperTrigramId);
  const lowerAtmosphere = getAtmosphereTuning(lowerTrigramId);

  return (
    <div
      className={`hexagram-atmosphere hexagram-atmosphere-${variant} absolute inset-0 -z-10 overflow-hidden`}
    >
      <div
        className="hexagram-atmosphere-layer hexagram-atmosphere-lower"
        data-trigram={lowerTrigramId}
        style={atmosphereLayerStyle(lowerAtmosphere, lowerAtmosphere.lower)}
      >
        <AtmosphereImage
          trigramId={lowerTrigramId}
          priority
          className="hexagram-atmosphere-image hexagram-atmosphere-lower-image"
        />
      </div>
      <div
        className="hexagram-atmosphere-layer hexagram-atmosphere-upper"
        data-trigram={upperTrigramId}
        style={atmosphereLayerStyle(upperAtmosphere, upperAtmosphere.upper)}
      >
        <AtmosphereImage
          trigramId={upperTrigramId}
          className="hexagram-atmosphere-image hexagram-atmosphere-upper-image"
        />
      </div>
    </div>
  );
}
