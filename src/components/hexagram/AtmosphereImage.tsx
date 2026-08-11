import { withBasePath } from "@/lib/base-path";

type AtmosphereImageProps = {
  className: string;
  priority?: boolean;
  trigramId: string;
};

export function AtmosphereImage({
  className,
  priority = false,
  trigramId,
}: AtmosphereImageProps) {
  const source = (width: 640 | 1024, extension: "avif" | "webp") =>
    withBasePath(`/atmospheres/${trigramId}-${width}.${extension}`);

  return (
    <picture className="absolute inset-0 block">
      <source
        type="image/avif"
        srcSet={`${source(640, "avif")} 640w, ${source(1024, "avif")} 1024w`}
        sizes="100vw"
      />
      <source
        type="image/webp"
        srcSet={`${source(640, "webp")} 640w, ${source(1024, "webp")} 1024w`}
        sizes="100vw"
      />
      <img
        src={withBasePath(`/atmospheres/${trigramId}.jpg`)}
        alt=""
        width={1024}
        height={1536}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`absolute inset-0 size-full object-cover ${className}`}
      />
    </picture>
  );
}
