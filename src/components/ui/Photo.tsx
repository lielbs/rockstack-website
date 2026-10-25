import type { Photo as PhotoData } from "@/content/types";
import { asset } from "@/lib/asset";

type Props = {
  photo: PhotoData;
  sizes: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
  /** Override the frame ratio (width / height); the image is cropped to fill it. */
  frameRatio?: number;
};

/** A prepared duotone photograph from public/media with a responsive srcset. */
export function Photo({ photo, sizes, className = "", imgClassName = "", priority = false, frameRatio }: Props) {
  const largest = photo.widths.at(-1) ?? 1600;
  const srcSet = photo.widths.map((w) => `${asset(`/media/${photo.id}-${w}.webp`)} ${w}w`).join(", ");
  return (
    <div className={`photo-frame relative overflow-hidden bg-basalt ${className}`} style={{ aspectRatio: frameRatio ?? photo.ratio }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- static export: no image optimizer */}
      <img
        src={asset(`/media/${photo.id}-${photo.widths[1] ?? largest}.webp`)}
        srcSet={srcSet}
        sizes={sizes}
        width={largest}
        height={Math.round(largest / photo.ratio)}
        alt={photo.alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        className={`absolute inset-0 size-full object-cover ${imgClassName}`}
      />
    </div>
  );
}
