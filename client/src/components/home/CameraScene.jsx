import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useLayoutEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { knurledCylinder, lensCap, roundedBox } from './cameraGeometry';

/* ------------------------------------------------------------------ *
 * Direction. These are the knobs worth touching; nothing downstream
 * hard-codes them. See docs/hero-lumix-asset-prompt.md.
 * ------------------------------------------------------------------ */

/** Lumos red, sampled from the logo. The only saturated note in the frame. */
const ACCENT = '#c11e1e';

/**
 * Emissive panels baked into an environment map. These set every reflection on
 * the metal, which is most of what sells the shot — a film set rather than a
 * product-catalogue softbox.
 */
const STUDIO_LIGHTS = [
    { color: '#ffffff', intensity: 4.4, size: [7, 4.5], position: [-3.4, 3.6, 4.4] }, // key, high front-left
    { color: '#b9cde8', intensity: 1.7, size: [5, 3.2], position: [4.2, 1.1, -3.6] }, // cool rim, behind right
    { color: ACCENT, intensity: 2.0, size: [3.2, 2.2], position: [-3.0, -1.6, 2.2] }, // red kicker, low front-left
    { color: '#223044', intensity: 0.7, size: [12, 12], position: [0, -5, 0] }, // faint ground bounce
];

/** Resting three-quarter pose: front face plus the grip side both read. */
const BASE_ROTATION = { x: 0.18, y: 0.85 };
/** How far the body drifts around that pose, and how fast. */
const SWAY = { amount: 0.19, speed: 0.19 };
/** How much the body follows the cursor. */
const POINTER_STRENGTH = { x: 0.3, y: 0.17 };

const LENS_X = 0.02;
const LENS_Y = -0.02;

/* Framing. Reach is how far right the lens tip swings at scale 1 once sway and
 * cursor parallax are applied; span and centre describe the full silhouette. */
const BODY_REACH = 1.25;
const BODY_SPAN = 2.1;
const BODY_CENTRE = 0.23;
const MIN_EDGE_INSET = 0.35;
const MAX_SCALE_WIDE = 0.88;
const MAX_SCALE_NARROW = 0.78;

/* ------------------------------------------------------------------ */

function buildEnvironment(renderer) {
    const scene = new THREE.Scene();

    for (const light of STUDIO_LIGHTS) {
        const material = new THREE.MeshBasicMaterial({
            color: new THREE.Color(light.color).multiplyScalar(light.intensity),
            side: THREE.DoubleSide,
        });
        const panel = new THREE.Mesh(new THREE.PlaneGeometry(...light.size), material);
        panel.position.set(...light.position);
        panel.lookAt(0, 0, 0);
        scene.add(panel);
    }

    const generator = new THREE.PMREMGenerator(renderer);
    const target = generator.fromScene(scene, 0.02);
    generator.dispose();

    scene.traverse((object) => {
        if (object.isMesh) {
            object.geometry.dispose();
            object.material.dispose();
        }
    });

    return target;
}

/** Applies the baked studio environment to the scene. */
const StudioEnvironment = () => {
    const { gl, scene, invalidate } = useThree();

    useLayoutEffect(() => {
        const target = buildEnvironment(gl);
        const previous = scene.environment;
        scene.environment = target.texture;
        invalidate();

        return () => {
            scene.environment = previous;
            target.dispose();
        };
    }, [gl, scene, invalidate]);

    return null;
};

/**
 * The camera body. Front face points +Z, grip on -X, so the resting negative
 * Y-rotation turns the grip toward the viewer.
 */
const CameraBody = () => {
    const parts = useMemo(() => {
        const geometries = {
            shell: roundedBox(1.489, 0.88, 0.6, 0.09),
            hump: roundedBox(0.46, 0.24, 0.44, 0.07),
            eyecup: roundedBox(0.32, 0.22, 0.12, 0.05, 0.03),
            grip: roundedBox(0.28, 0.84, 0.54, 0.13),
            thumbRest: roundedBox(0.22, 0.3, 0.1, 0.06, 0.03),
            hotShoe: roundedBox(0.24, 0.045, 0.19, 0.014, 0.01),
            topLcd: roundedBox(0.3, 0.02, 0.18, 0.016, 0.008),
            rearLcd: roundedBox(0.82, 0.58, 0.025, 0.022, 0.01),
            badge: roundedBox(0.17, 0.036, 0.014, 0.008, 0.005),
            lug: roundedBox(0.07, 0.07, 0.05, 0.02, 0.012),
            vent: roundedBox(0.012, 0.13, 0.18, 0.005, 0.004),

            mountRing: new THREE.CylinderGeometry(0.3, 0.3, 0.06, 64),
            barrelBase: new THREE.CylinderGeometry(0.325, 0.325, 0.1, 64),
            zoomRing: knurledCylinder(0.345, 0.26, 60, 0.009),
            midCollar: new THREE.CylinderGeometry(0.325, 0.325, 0.05, 64),
            focusRing: knurledCylinder(0.335, 0.16, 88, 0.006),
            accentRing: new THREE.CylinderGeometry(0.342, 0.342, 0.03, 64),
            // The front rings are open-ended: a solid cap here would cover the
            // opening with a bright metal disc instead of showing the glass.
            frontBarrel: new THREE.CylinderGeometry(0.305, 0.325, 0.12, 64, 1, true),
            filterRing: new THREE.CylinderGeometry(0.305, 0.305, 0.035, 64, 1, true),
            innerBarrel: new THREE.CylinderGeometry(0.288, 0.288, 0.18, 48, 1, true),
            glass: lensCap(0.285, 0.62),

            modeDial: knurledCylinder(0.115, 0.06, 40, 0.007),
            commandDial: knurledCylinder(0.09, 0.05, 32, 0.006),
            shutter: new THREE.CylinderGeometry(0.055, 0.055, 0.035, 32),
            recordButton: new THREE.CylinderGeometry(0.038, 0.038, 0.03, 24),
            smallButton: new THREE.CylinderGeometry(0.03, 0.03, 0.022, 20),
        };

        const materials = {
            magnesium: new THREE.MeshStandardMaterial({
                color: '#1c1d20',
                roughness: 0.52,
                metalness: 0.62,
                envMapIntensity: 1,
                side: THREE.DoubleSide,
            }),
            rubber: new THREE.MeshStandardMaterial({
                color: '#101113',
                roughness: 0.88,
                metalness: 0.05,
                envMapIntensity: 0.5,
            }),
            aluminium: new THREE.MeshStandardMaterial({
                color: '#c2c6cc',
                roughness: 0.22,
                metalness: 1,
                envMapIntensity: 1.35,
                side: THREE.DoubleSide,
            }),
            darkGlass: new THREE.MeshPhysicalMaterial({
                color: '#05060a',
                roughness: 0.08,
                metalness: 0,
                clearcoat: 1,
                clearcoatRoughness: 0.04,
                envMapIntensity: 1.2,
            }),
            screen: new THREE.MeshStandardMaterial({
                color: '#05070c',
                roughness: 0.06,
                metalness: 0.1,
                emissive: '#0a1424',
                emissiveIntensity: 0.6,
                envMapIntensity: 1,
            }),
            accent: new THREE.MeshStandardMaterial({
                color: ACCENT,
                roughness: 0.34,
                metalness: 0.4,
                emissive: ACCENT,
                emissiveIntensity: 0.32,
                envMapIntensity: 1,
            }),
            // The front element: near-black, with coating iridescence that only
            // shows at grazing angles.
            lensGlass: new THREE.MeshPhysicalMaterial({
                color: '#03040a',
                roughness: 0.04,
                metalness: 0.2,
                clearcoat: 1,
                clearcoatRoughness: 0.03,
                iridescence: 0.3,
                iridescenceIOR: 1.8,
                iridescenceThicknessRange: [180, 520],
                envMapIntensity: 0.35,
            }),
            cavity: new THREE.MeshStandardMaterial({
                color: '#050507',
                roughness: 0.95,
                metalness: 0,
                side: THREE.BackSide,
                envMapIntensity: 0.2,
            }),
        };

        return { geometries, materials };
    }, []);

    useEffect(
        () => () => {
            Object.values(parts.geometries).forEach((geometry) => geometry.dispose());
            Object.values(parts.materials).forEach((material) => material.dispose());
        },
        [parts]
    );

    const { geometries: g, materials: m } = parts;
    const onZ = [Math.PI / 2, 0, 0]; // lay a Y-axis cylinder along the lens axis

    return (
        <group>
            {/* Shell, viewfinder, grip */}
            <mesh geometry={g.shell} material={m.magnesium} />
            <mesh geometry={g.hump} material={m.magnesium} position={[0.02, 0.53, -0.04]} />
            <mesh geometry={g.eyecup} material={m.rubber} position={[0.02, 0.54, -0.32]} />
            <mesh geometry={g.grip} material={m.rubber} position={[-0.615, 0, 0.3]} />
            <mesh geometry={g.thumbRest} material={m.rubber} position={[-0.56, 0.18, -0.34]} />
            <mesh geometry={g.lug} material={m.aluminium} position={[-0.74, 0.4, -0.06]} />
            <mesh geometry={g.lug} material={m.aluminium} position={[0.74, 0.4, -0.06]} />

            {/* Side cooling vents — the S1II is actively cooled */}
            {[-0.06, 0.02, 0.1, 0.18].map((z) => (
                <mesh key={z} geometry={g.vent} material={m.cavity} position={[0.745, -0.12, z]} />
            ))}

            {/* Top plate */}
            <mesh geometry={g.hotShoe} material={m.aluminium} position={[0.02, 0.702, -0.04]} />
            <mesh geometry={g.topLcd} material={m.darkGlass} position={[0.44, 0.452, 0.12]} />
            <mesh geometry={g.modeDial} material={m.aluminium} position={[0.5, 0.47, -0.14]} />
            <mesh geometry={g.commandDial} material={m.magnesium} position={[0.26, 0.465, -0.2]} />
            <mesh
                geometry={g.shutter}
                material={m.aluminium}
                position={[-0.6, 0.468, 0.2]}
                rotation={[0.14, 0, 0]}
            />
            <mesh geometry={g.recordButton} material={m.accent} position={[-0.4, 0.462, 0.08]} />

            {/* Rear: screen and controls */}
            <mesh geometry={g.rearLcd} material={m.screen} position={[0.06, -0.02, -0.316]} />
            {[0.2, 0.08, -0.04].map((y) => (
                <mesh
                    key={y}
                    geometry={g.smallButton}
                    material={m.magnesium}
                    position={[0.63, y, -0.315]}
                    rotation={onZ}
                />
            ))}

            {/* Brand mark, in Lumos red rather than anyone else's wordmark */}
            <mesh geometry={g.badge} material={m.accent} position={[0.5, 0.3, 0.306]} />

            {/* Lens: stepped barrel out to the recessed front element */}
            <group position={[LENS_X, LENS_Y, 0]}>
                <mesh geometry={g.mountRing} material={m.aluminium} position={[0, 0, 0.33]} rotation={onZ} />
                <mesh geometry={g.barrelBase} material={m.magnesium} position={[0, 0, 0.41]} rotation={onZ} />
                <mesh geometry={g.zoomRing} material={m.rubber} position={[0, 0, 0.59]} rotation={onZ} />
                <mesh geometry={g.midCollar} material={m.magnesium} position={[0, 0, 0.745]} rotation={onZ} />
                <mesh geometry={g.focusRing} material={m.rubber} position={[0, 0, 0.85]} rotation={onZ} />
                <mesh geometry={g.accentRing} material={m.accent} position={[0, 0, 0.945]} rotation={onZ} />
                <mesh geometry={g.frontBarrel} material={m.magnesium} position={[0, 0, 1.02]} rotation={onZ} />
                <mesh geometry={g.filterRing} material={m.aluminium} position={[0, 0, 1.095]} rotation={onZ} />
                <mesh geometry={g.innerBarrel} material={m.cavity} position={[0, 0, 1.01]} rotation={onZ} />
                <mesh geometry={g.glass} material={m.lensGlass} position={[0, 0, 1.088]} />
            </group>
        </group>
    );
};

const easeOutCubic = (t) => 1 - (1 - t) * (1 - t) * (1 - t);

/**
 * Drives the body: an intro that swings it into its resting pose, a slow sway,
 * cursor parallax, and a drift back and down as the hero scrolls away.
 */
const AnimatedCamera = ({ scrollRef, reducedMotion }) => {
    const group = useRef(null);
    const start = useRef(0);
    const pointer = useRef({ x: 0, y: 0 });
    const { size, viewport, invalidate } = useThree();

    // Below this width the copy sits under the camera, so the body centres and
    // lifts instead of sitting off to one side.
    const narrow = size.width < 900;

    // Framing is derived from the visible world width rather than fixed, so the
    // lens never runs off the edge on a narrow or short window. The reach
    // figures are the body's worst-case extents at scale 1, sway and cursor
    // parallax included.
    const layout = useMemo(() => {
        const half = viewport.width / 2;

        if (narrow) {
            const scale = Math.min(MAX_SCALE_NARROW, (viewport.width * 0.92) / BODY_SPAN);
            return { x: -BODY_CENTRE * scale, y: 0.68, scale };
        }

        const scale = Math.min(MAX_SCALE_WIDE, (half - MIN_EDGE_INSET) / BODY_REACH);
        return { x: Math.min(0.72, half - BODY_REACH * scale), y: 0.02, scale };
    }, [narrow, viewport.width]);

    useLayoutEffect(() => {
        if (!group.current) return;
        start.current = 0;
        group.current.position.set(layout.x, layout.y, 0);
        group.current.rotation.set(BASE_ROTATION.x, BASE_ROTATION.y, 0);
        group.current.scale.setScalar(layout.scale);
        invalidate();
    }, [layout, invalidate]);

    useFrame((state, delta) => {
        const node = group.current;
        if (!node) return;

        if (!start.current) start.current = state.clock.elapsedTime;
        const elapsed = state.clock.elapsedTime - start.current;
        const scroll = scrollRef.current ?? 0;

        if (reducedMotion) {
            node.position.set(layout.x, layout.y - scroll * 0.5, 0);
            node.rotation.set(BASE_ROTATION.x + scroll * 0.28, BASE_ROTATION.y, 0);
            node.scale.setScalar(layout.scale);
            return;
        }

        const intro = easeOutCubic(Math.min(elapsed / 1.5, 1));

        // Damped cursor follow, so the body eases rather than snapping.
        const damp = 1 - Math.exp(-4 * Math.min(delta, 0.1));
        pointer.current.x += (state.pointer.x - pointer.current.x) * damp;
        pointer.current.y += (state.pointer.y - pointer.current.y) * damp;

        const sway = Math.sin(elapsed * SWAY.speed) * SWAY.amount;
        const restY = BASE_ROTATION.y + sway + pointer.current.x * POINTER_STRENGTH.x;

        node.rotation.y = THREE.MathUtils.lerp(BASE_ROTATION.y + 1.0, restY, intro);
        node.rotation.x =
            BASE_ROTATION.x - pointer.current.y * POINTER_STRENGTH.y + scroll * 0.28;
        node.rotation.z = Math.sin(elapsed * 0.37) * 0.018 * intro;

        node.position.x = layout.x;
        node.position.y = layout.y + Math.sin(elapsed * 0.55) * 0.028 * intro - scroll * 0.5;
        node.scale.setScalar(layout.scale * THREE.MathUtils.lerp(0.84, 1, intro));
    });

    return (
        <group ref={group}>
            <CameraBody />
        </group>
    );
};

/**
 * The hero's WebGL layer. Lazy-loaded by LumixHero so three.js never blocks
 * first paint, and parked with frameloop="never" whenever the hero is off
 * screen — this page also runs three autoplaying videos further down.
 */
const CameraScene = ({ scrollRef, reducedMotion = false, active = true }) => (
    <Canvas
        dpr={[1, 1.75]}
        frameloop={reducedMotion ? 'demand' : active ? 'always' : 'never'}
        camera={{ position: [0, 0.12, 5.3], fov: 26, near: 0.1, far: 50 }}
        gl={{ antialias: true, powerPreference: 'high-performance', alpha: true }}
        onCreated={({ gl }) => {
            gl.toneMapping = THREE.ACESFilmicToneMapping;
            gl.toneMappingExposure = 1.3;
        }}
    >
        <StudioEnvironment />

        <ambientLight intensity={0.34} />
        <directionalLight position={[-3.4, 3.6, 4.4]} intensity={3.1} />
        <directionalLight position={[4.2, 1, -3.6]} intensity={1.15} color="#b9cde8" />
        <pointLight position={[-2.1, -1, 1.6]} intensity={2.6} distance={6} decay={2} color={ACCENT} />

        <AnimatedCamera scrollRef={scrollRef} reducedMotion={reducedMotion} />
    </Canvas>
);

export default CameraScene;
