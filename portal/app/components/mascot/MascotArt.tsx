import type { MascotMood } from "@/app/lib/mascot";
import styles from "./Mascot.module.css";

/**
 * Ember — a calm, stocky little Morgan engineer dressed for the factory floor:
 * white hard hat, safety glasses, navy Morgan work jacket and safety boots.
 * Original character in Morgan colours. Replace this file to restyle it;
 * moods are driven by the `mood` prop and the CSS module.
 */
export default function MascotArt({ mood }: { mood: MascotMood }) {
  const happy = mood === "happy";
  const oops = mood === "oops";
  const wave = mood === "wave";
  const curious = mood === "curious";

  return (
    <svg viewBox="0 0 120 140" className={styles.art} data-mood={mood} aria-hidden="true" focusable="false">
      <ellipse className={styles.shadow} cx="60" cy="134" rx="32" ry="4.5" />

      <g className={styles.figure}>
        {/* Safety boots */}
        <rect className={styles.foot} x="34" y="121" width="23" height="11" rx="5" />
        <rect className={styles.foot} x="63" y="121" width="23" height="11" rx="5" />
        <rect className={styles.toeCap} x="34" y="128" width="23" height="4" rx="2" />
        <rect className={styles.toeCap} x="63" y="128" width="23" height="4" rx="2" />

        {/* Arms: relaxed by the sides; the right one waves in the wave mood */}
        <path className={styles.sleeve} d="M27 92c-7 5-10 12-10 19" />
        <circle className={styles.hand} cx="17" cy="113" r="5.5" />
        <g className={styles.waveArm}>
          {wave ? (
            <>
              <path className={styles.sleeve} d="M93 92c8-4 13-11 14-20" />
              <circle className={styles.hand} cx="107" cy="70" r="5.5" />
            </>
          ) : (
            <>
              <path className={styles.sleeve} d="M93 92c7 5 10 12 10 19" />
              <circle className={styles.hand} cx="103" cy="113" r="5.5" />
            </>
          )}
        </g>

        {/* Work trousers */}
        <path className={styles.pants} d="M28 104h64v16a4 4 0 0 1-4 4H64l-4-12-4 12H32a4 4 0 0 1-4-4Z" />

        {/* Navy Morgan work jacket */}
        <path className={styles.jacket} d="M24 92a12 12 0 0 1 12-12h48a12 12 0 0 1 12 12v15H24Z" />
        <path className={styles.zip} d="M60 86v21" />
        <path className={styles.collar} d="M46 80l14 7-6 6-10-11ZM74 80l-14 7 6 6 10-11Z" />
        {/* Morgan logo (white) on the chest */}
        <image className={styles.logo} href="/morgan-logo.png" x="64.5" y="88.5" width="23" height="6.7" preserveAspectRatio="xMidYMid meet" />
        {/* Reflective cuff band */}
        <rect className={styles.hem} x="24" y="103" width="72" height="4" />

        {/* Head */}
        <g className={styles.head}>
          <rect className={styles.headBlock} x="20" y="30" width="80" height="54" rx="15" />

          {/* White hard hat */}
          <path className={styles.hat} d="M25 40a35 29 0 0 1 70 0Z" />
          <rect className={styles.hatRidge} x="55" y="12" width="10" height="27" rx="4" />
          <path className={styles.hatShine} d="M34 30a26 22 0 0 1 14-13" />
          <rect className={styles.hat} x="15" y="36" width="90" height="7" rx="3.5" />

          {/* Brows: gentle arcs (one lifts when curious) */}
          <path className={curious ? `${styles.brow} ${styles.browUp}` : styles.brow} d="M36 49q8-4 16 0" />
          <path className={styles.brow} d="M68 49q8-4 16 0" />

          {/* Eyes */}
          {happy ? (
            <g className={styles.happyEyes}>
              <path d="M37 62q7-7 14 0" />
              <path d="M69 62q7-7 14 0" />
            </g>
          ) : (
            <g className={styles.eyes}>
              <ellipse className={styles.eyeWhite} cx="44" cy="61" rx="7" ry={oops ? 7 : 6} />
              <ellipse className={styles.eyeWhite} cx="76" cy="61" rx="7" ry={oops ? 7 : 6} />
              <g className={styles.pupils}>
                <circle className={styles.pupil} cx="44.5" cy="62" r={oops ? 2.6 : 3.4} />
                <circle className={styles.pupil} cx="76.5" cy="62" r={oops ? 2.6 : 3.4} />
                <circle className={styles.glint} cx="45.7" cy="60.7" r="1.1" />
                <circle className={styles.glint} cx="77.7" cy="60.7" r="1.1" />
              </g>
              {/* Relaxed upper lids give the calm, half-closed look */}
              {!oops && (
                <g className={styles.lids}>
                  <path d="M37 58q7-4.5 14 0v-4h-14Z" />
                  <path d="M69 58q7-4.5 14 0v-4h-14Z" />
                </g>
              )}
            </g>
          )}

          {/* Safety glasses */}
          <g className={styles.glasses}>
            <path className={styles.temple} d="M33 58H21M87 58h12" />
            <rect className={styles.lens} x="33" y="52" width="22" height="18" rx="6" />
            <rect className={styles.lens} x="65" y="52" width="22" height="18" rx="6" />
            <path className={styles.temple} d="M55 59q5-3 10 0" />
            <path className={styles.lensGlare} d="M37 56l5-2M69 56l5-2" />
          </g>

          <circle className={styles.cheek} cx="31" cy="74" r="4" />
          <circle className={styles.cheek} cx="89" cy="74" r="4" />
          {oops ? <ellipse className={styles.mouthO} cx="60" cy="76" rx="3.5" ry="4" /> : <path className={styles.mouth} d={happy ? "M51 73q9 8 18 0" : "M53 75q7 4.5 14 0"} />}
        </g>
      </g>

      {/* Mood props */}
      {mood === "think" && (
        <g className={styles.thought}>
          <circle cx="100" cy="30" r="3" />
          <circle cx="107" cy="20" r="4" />
          <circle cx="113" cy="8" r="5" />
        </g>
      )}
      {curious && (
        <text className={styles.question} x="104" y="32">
          ?
        </text>
      )}
      {oops && <path className={styles.sweat} d="M100 46c3 4 4.5 6.5 4.5 8.5a4.5 4.5 0 0 1-9 0c0-2 1.5-4.5 4.5-8.5Z" />}
      {happy && (
        <g className={styles.sparkles}>
          <path d="M8 26l2.4 5.6L16 34l-5.6 2.4L8 42l-2.4-5.6L0 34l5.6-2.4Z" />
          <path d="M110 40l1.8 4.2 4.2 1.8-4.2 1.8-1.8 4.2-1.8-4.2-4.2-1.8 4.2-1.8Z" />
        </g>
      )}
    </svg>
  );
}
