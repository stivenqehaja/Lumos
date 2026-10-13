import * as THREE from 'three';

/**
 * Geometry helpers for the hero camera.
 *
 * The body is built from primitives rather than a downloaded model: no
 * properly-licensed Lumix S1II asset exists, and shipping a competitor's trade
 * dress on Lumos's own marketing page is a problem of its own. See
 * docs/hero-lumix-asset-prompt.md for the sourcing notes and the prompts to
 * commission a photoreal replacement.
 *
 * Scale is 1 unit = 100mm, so every number below maps to the published S1II
 * dimensions (148.9 x 110 x 96.7mm body, 51.6mm L-Mount).
 */

/**
 * A box with rounded corners in X/Y, extruded along Z with a bevelled edge.
 * Matches how a magnesium camera shell actually reads: rounded in the
 * front-view silhouette, softly chamfered front to back.
 */
export function roundedBox(width, height, depth, radius = 0.06, bevel = 0.018) {
    const r = Math.min(radius, width / 2 - 0.001, height / 2 - 0.001);
    const b = Math.min(bevel, depth / 2 - 0.001);
    const w = width / 2;
    const h = height / 2;

    const shape = new THREE.Shape();
    shape.moveTo(-w + r, -h);
    shape.lineTo(w - r, -h);
    shape.quadraticCurveTo(w, -h, w, -h + r);
    shape.lineTo(w, h - r);
    shape.quadraticCurveTo(w, h, w - r, h);
    shape.lineTo(-w + r, h);
    shape.quadraticCurveTo(-w, h, -w, h - r);
    shape.lineTo(-w, -h + r);
    shape.quadraticCurveTo(-w, -h, -w + r, -h);

    const core = depth - b * 2;
    const geometry = new THREE.ExtrudeGeometry(shape, {
        depth: core,
        bevelEnabled: b > 0,
        bevelThickness: b,
        bevelSize: b,
        bevelSegments: 2,
        curveSegments: 5,
    });
    geometry.translate(0, 0, -core / 2);
    geometry.computeVertexNormals();
    return geometry;
}

/**
 * A cylinder whose radius ripples around its circumference, so zoom rings and
 * dials catch the rim light the way knurled rubber and milled metal do.
 * Built on Y, like every three.js cylinder — lens parts rotate it onto Z.
 */
export function knurledCylinder(radius, height, ribs = 56, depth = 0.008) {
    const geometry = new THREE.CylinderGeometry(radius, radius, height, ribs * 2, 1);
    const position = geometry.attributes.position;

    for (let i = 0; i < position.count; i += 1) {
        const x = position.getX(i);
        const z = position.getZ(i);
        const r = Math.hypot(x, z);
        if (r < 1e-5) continue;

        const angle = Math.atan2(z, x);
        const rippled = r + Math.cos(angle * ribs) * depth;
        position.setX(i, Math.cos(angle) * rippled);
        position.setZ(i, Math.sin(angle) * rippled);
    }

    position.needsUpdate = true;
    geometry.computeVertexNormals();
    return geometry;
}

/** Shallow spherical cap for the recessed front element. Apex points +Z. */
export function lensCap(rimRadius, sphereRadius) {
    const theta = Math.asin(Math.min(rimRadius / sphereRadius, 1));
    const geometry = new THREE.SphereGeometry(sphereRadius, 56, 24, 0, Math.PI * 2, 0, theta);
    geometry.rotateX(Math.PI / 2);
    // Sit the apex at the origin so callers position by the glass surface.
    geometry.translate(0, 0, -sphereRadius);
    geometry.computeVertexNormals();
    return geometry;
}
