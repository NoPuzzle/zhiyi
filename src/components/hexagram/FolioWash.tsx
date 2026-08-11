import { withBasePath } from "../../lib/base-path";

export function FolioWash() {
  return (
    <picture className="hexagram-folio-wash">
      <source
        type="image/avif"
        srcSet={withBasePath("/atmospheres/line-reading-fold.avif")}
      />
      <img
        src={withBasePath("/atmospheres/line-reading-fold.webp")}
        alt=""
        width={1200}
        height={736}
        loading="eager"
        fetchPriority="high"
        decoding="async"
      />
    </picture>
  );
}
