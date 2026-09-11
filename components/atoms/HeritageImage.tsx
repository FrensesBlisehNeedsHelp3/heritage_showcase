import Image from "next/image";

interface HeritageImageProps {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
  className?: string;
}

/**
 * HeritageImage (atom)
 * ---------------------------------------------------------------
 * Thin wrapper around next/image with the defaults every photo on this
 * site needs: fills its parent, crops with object-cover, and — because
 * "lightning fast on 3G/4G" is a hard requirement — always ships
 * responsive `sizes` so the browser never downloads a desktop-sized
 * image on a phone.
 *
 * Usage:
 *   <div className="relative h-64">
 *     <HeritageImage src="/images/hundred-islands.jpg" alt="..." />
 *   </div>
 */
export default function HeritageImage({
  src,
  alt,
  priority = false,
  sizes = "(min-width: 1024px) 33vw, 100vw",
  className = "",
}: HeritageImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={`object-cover ${className}`}
    />
  );
}
