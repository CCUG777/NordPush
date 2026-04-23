/**
 * Twitter-Card image — identisch zum Open-Graph-Image.
 *
 * Next.js kann die `runtime`/`size`/`alt`-Konfig bei Re-Exports nicht statisch
 * auflösen, darum wird hier das Default-Export-Handler-Modul inline neu
 * gerendert. Die JSX-Komponente selbst kommt aus dem OG-Image.
 */
import OpenGraphImage, {
  alt as ogAlt,
  size as ogSize,
  contentType as ogContentType,
} from "./opengraph-image";

export const alt = ogAlt;
export const size = ogSize;
export const contentType = ogContentType;
export const runtime = "edge";
export default OpenGraphImage;
