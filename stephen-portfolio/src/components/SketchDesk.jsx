import SketchArt, { SKETCH_COUNT } from "./sketchArt.jsx";
import useIsMobile from "../hooks/useIsMobile.js";
import "./sketch.css";

/**
 * The desk, scattered under the whole document. It scrolls with the page —
 * objects lying on the page, not a frame pinned to the viewport — so it is
 * absolutely positioned across the full height of .app-container, beneath
 * every section.
 *
 * Objects run right across the width rather than hiding in the gutters. What
 * keeps that readable is depth: the further an object sits from an edge, the
 * more content covers it, so it is drawn smaller and fainter, and the sections
 * above crop into it. That occlusion is the depth cue — a doodle disappearing
 * under the edge of a panel reads as 3D in a way a drop shadow alone never
 * manages.
 */

const COUNT = 32;

// The stride must stay coprime with the catalogue size, or the walk revisits a
// subset and the scatter starts to look stamped.
const STRIDE = SKETCH_COUNT % 5 === 0 ? 4 : 5;

// How far in from the nearest edge an object sits, 0 (hard against the edge)
// to 1 (out under the middle of the page). Raising the ramp to a power crowds
// most of them into the outer fifth while still sending a handful to the
// centre. Depth is measured from the *nearest* edge, not across the page, so
// that size and fade always agree with how buried an object actually is.
const depthOf = (i) => Math.pow(((i * 11) % COUNT) / COUNT, 1.7);

const DESK = Array.from({ length: COUNT }, (_, i) => {
    const depth = depthOf(i);           // 0 at the page edge, 1 at the centre
    // Anchored to whichever edge it belongs to, so a wide object at the right
    // margin can never overhang the layer's clip and lose half of itself.
    const edge = i % 2 === 0 ? "left" : "right";
    return {
        id: i,
        shape: i * STRIDE,
        edge,
        // Vertical jitter on a different period from everything else, so the
        // objects never settle into rows.
        top: 1.2 + i * 3.05 + ((i * 13) % 7) * 0.35,
        inset: 1 + depth * 46,
        // Distance reads as smaller and fainter. Both taper on the same
        // variable so size and value never disagree about how far away
        // something is.
        size: (52 + ((i * 5) % 4) * 15) * (1 - depth * 0.34),
        fade: 1 - depth * 0.44,
        tilt: ((i * 47) % 42) - 21,
        flip: i % 3 === 0,
        deep: depth > 0.35,
    };
});

export default function SketchDesk() {
    // sketch.css already hides the desk below 820px, but `display: none` only
    // skips the painting — the thirty-two wrappers and their SVG paths are
    // still built, styled and kept in the document. Phones are exactly where
    // that DOM is least affordable and least visible, so don't build it at
    // all. The CSS rule stays as the backstop for the resize gap.
    const isNarrow = useIsMobile(821);
    if (isNarrow) return null;

    return (
        <div className="sketch-desk" aria-hidden="true">
            {DESK.map(({ id, shape, edge, top, inset, size, fade, tilt, flip, deep }) => (
                <span
                    key={id}
                    className={`sketch-obj${deep ? " sketch-obj-deep" : ""}`}
                    style={{
                        top: `${top}%`,
                        [edge]: `${inset}%`,
                        width: `${Math.round(size)}px`,
                        opacity: fade,
                        "--r": `${tilt}deg`,
                        "--f": flip ? -1 : 1,
                    }}
                >
                    <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
                        <SketchArt index={shape} />
                    </svg>
                </span>
            ))}
        </div>
    );
}
