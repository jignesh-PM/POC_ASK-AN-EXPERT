import type { MascotMood } from "@/app/lib/mascot";
import styles from "./Mascot.module.css";

/**
 * Ember: a little Morgan insulation block keeping a flame under control —
 * heat managed safely. Replace this file to restyle the character; moods are
 * driven by the `mood` prop and the CSS module.
 */
export default function MascotArt({ mood }: { mood: MascotMood }) {
  const happy = mood === "happy";
  return (
    <svg viewBox="0 0 120 140" className={styles.art} data-mood={mood} aria-hidden="true" focusable="false">
      <ellipse className={styles.shadow} cx="60" cy="133" rx="30" ry="4.5" />

      <g className={styles.figure}>
        {/* Flame on top: contained, flickering heat */}
        <g className={styles.flame}>
          <path className={styles.flameOuter} d="M60 4c7 10 15 17 13 28-1.6 8.6-24.4 8.6-26 0C45 21 53 14 60 4Z" />
          <path className={styles.flameInner} d="M60 18c3.6 5 7.4 8.6 6.4 14-.8 4.2-12 4.2-12.8 0-1-5.4 2.8-9 6.4-14Z" />
        </g>

        {/* Arms (behind the body) */}
        <path className={styles.limb} d="M26 86c-10-2-15-8-14-16" />
        <g className={styles.waveArm}>
          <path className={styles.limb} d="M94 86c10-2 15-8 14-16" />
          <circle className={styles.hand} cx="108" cy="68" r="5" />
        </g>
        <circle className={styles.hand} cx="12" cy="68" r="5" />

        {/* Body: a rounded insulation block with the brand band */}
        <rect className={styles.body} x="22" y="38" width="76" height="84" rx="22" />
        <rect className={styles.bodyShine} x="30" y="44" width="22" height="8" rx="4" />
        <rect className={styles.band} x="22" y="102" width="76" height="7" />

        {/* Face */}
        {happy ? (
          <g className={styles.happyEyes}>
            <path d="M39 72q7-8 14 0" />
            <path d="M67 72q7-8 14 0" />
          </g>
        ) : (
          <g className={styles.eyes}>
            <ellipse className={styles.eyeWhite} cx="46" cy="70" rx="8.5" ry="9.5" />
            <ellipse className={styles.eyeWhite} cx="74" cy="70" rx="8.5" ry="9.5" />
            <g className={styles.pupils}>
              <circle className={styles.pupil} cx="47" cy="71" r={mood === "oops" ? 3 : 4.2} />
              <circle className={styles.pupil} cx="75" cy="71" r={mood === "oops" ? 3 : 4.2} />
              <circle className={styles.glint} cx="48.6" cy="69" r="1.3" />
              <circle className={styles.glint} cx="76.6" cy="69" r="1.3" />
            </g>
          </g>
        )}
        <circle className={styles.cheek} cx="35" cy="86" r="4.5" />
        <circle className={styles.cheek} cx="85" cy="86" r="4.5" />
        {mood === "oops" ? <ellipse className={styles.mouthO} cx="60" cy="90" rx="4" ry="5" /> : <path className={styles.mouth} d={happy ? "M50 85q10 12 20 0" : "M52 86q8 7 16 0"} />}

        {/* Feet */}
        <rect className={styles.foot} x="34" y="119" width="18" height="9" rx="4.5" />
        <rect className={styles.foot} x="68" y="119" width="18" height="9" rx="4.5" />
      </g>

      {/* Mood props */}
      {mood === "think" && (
        <g className={styles.thought}>
          <circle cx="100" cy="30" r="3" />
          <circle cx="108" cy="20" r="4" />
          <circle cx="114" cy="8" r="5" />
        </g>
      )}
      {mood === "curious" && (
        <text className={styles.question} x="102" y="34">
          ?
        </text>
      )}
      {mood === "oops" && <path className={styles.sweat} d="M92 52c3 4 4.5 6.5 4.5 8.5a4.5 4.5 0 0 1-9 0c0-2 1.5-4.5 4.5-8.5Z" />}
      {happy && (
        <g className={styles.sparkles}>
          <path d="M12 28l2.4 5.6L20 36l-5.6 2.4L12 44l-2.4-5.6L4 36l5.6-2.4Z" />
          <path d="M106 22l1.8 4.2 4.2 1.8-4.2 1.8-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8Z" />
        </g>
      )}
    </svg>
  );
}
