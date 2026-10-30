
// CSS selects the theme variant before hydration; all six-frame walk strips
// retain their original cell proportions from art/sprites/manifest.json.
export const NARRATOR_ART = {
  day: '/art/sprites/narrator-day-v2.webp',
  night: '/art/sprites/narrator-neon-v2.webp',
};

export function NarratorSprite({ className = '', walking = false, walkCycle = false, decorative = false }: {
  className?: string;
  walking?: boolean;
  walkCycle?: boolean;
  decorative?: boolean;
}) {
  return <div className={`narrator-sprite ${className} ${walking ? 'narrator-walking' : ''}`} role={decorative ? undefined : "img"} aria-label={decorative ? undefined : "An illustrated Shubz with her orange notebook"}>
    <img className="narrator-day narrator-standing" src={NARRATOR_ART.day} alt="" width="387" height="1024"/>
    <img className="narrator-night narrator-standing" src={NARRATOR_ART.night} alt="" aria-hidden="true" width="388" height="1024"/>
    {walkCycle && <span className="narrator-walk narrator-day" aria-hidden="true"/>}
    {walkCycle && <span className="narrator-walk narrator-night" aria-hidden="true"/>}
  </div>;
}
