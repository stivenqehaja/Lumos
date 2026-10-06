# Hero asset brief — Lumix S1II 3D centerpiece

Reference material for the `hero-lumix-3d` hero section. Keep this file with the
component: it records why the hero ships procedural geometry instead of a
downloaded model, and holds the prompts to commission or generate a photoreal
replacement later.

## Why there is no model file in this repo

The hero renders the camera as **procedural Three.js geometry** — boxes,
extruded rounded profiles and lathed cylinders built at runtime in
`client/src/components/home/CameraScene.jsx`. No `.glb`, `.fbx` or texture set
is downloaded or committed.

That was a sourcing decision, not a shortcut. A survey of the usual libraries
turned up no S1II asset that can legally ship on a commercial studio site:

| Source | What exists for the S1II | Blocker |
| --- | --- | --- |
| Sketchfab | Nothing for the S1II. Nearest are older bodies — an S1H rig (CC-BY), a GF7, an S5 | Wrong camera; CC-BY needs visible attribution in the hero |
| TurboSquid / CGTrader | Generic "Lumix" bodies, mostly paid | Royalty-free licences restrict redistribution inside a web bundle; still wrong body |
| Free3D / 3DModels.org | Older compacts and a "Lumix smart camera" | Wrong camera; licence provenance unclear |
| Panasonic | No public CAD or glTF release | — |

Two problems ruled the whole category out. First, every one of those assets
reproduces Panasonic **trade dress** — the LUMIX wordmark, the badge layout, the
exact body contour. Putting a competitor-branded product at the centre of
Lumos's own marketing page is a trademark question, not a licensing one, and it
also advertises Panasonic rather than Lumos. Second, a photoreal GLB with 4K PBR
textures runs 8–40 MB; the procedural body costs roughly 3 KB of geometry code
and renders sharp at any resolution.

So the geometry is **an original mirrorless body built to the S1II's real
proportions** — unmistakably the right class of instrument, carrying Lumos's own
red rather than someone else's badge.

### Proportions the geometry is built from

Published S1II figures, used as the dimensional source of truth:

- Body: **148.9 × 110 × 96.7 mm** (W × H × D) → modelled at 1 unit = 100 mm
- Weight 800 g, magnesium alloy, dust/splash/freeze resistant
- **Leica L-Mount** (51.6 mm inner diameter)
- Centre OLED EVF hump; deep right-hand grip; top status LCD
- 3.0" vari-angle rear touchscreen, kept on the optical axis
- Red record button on the top plate

The one deliberate departure: the lens accent ring is Lumos red `#c11e1e`,
sampled from the logo, where Panasonic uses a plain machined ring. It is the
brightest element in the frame and the reason the shot reads as Lumos.

## Prompt A — commission or generate a photoreal 3D model

Use this if the hero is ever upgraded to a real asset. Hand it to a 3D artist,
or to an image-to-3D / text-to-3D service.

> Model a full-frame mirrorless cinema camera body, SLR-style, in the spirit of
> a professional L-Mount hybrid stills/video body — original design, no
> real-world manufacturer's branding, badges or wordmarks.
>
> **Body.** 149 × 110 × 97 mm. Boxy magnesium-alloy shell, lightly textured
> matte charcoal (#1b1c1e) with a fine-grain bead-blast finish; 8 mm corner
> radii and a soft 2 mm bevel along every edge. Centred electronic-viewfinder
> hump rising 22 mm above the top plate, with a square rubber eyecup at the
> rear. Deep rubberised grip on the camera's right, protruding 34 mm forward,
> with a moulded finger channel and a thumb rest at the rear.
>
> **Top plate.** Knurled mode dial on the right; a shutter release canted
> forward on the grip shoulder; a small bright-red record button beside it; a
> monochrome status LCD inset under dark glass on the left; a machined
> aluminium hot shoe centred on the viewfinder hump; two knurled command dials.
>
> **Rear.** 3.0-inch vari-angle touchscreen on a two-axis hinge, under glass
> with an anti-reflective coating, screen off and near-black. Joystick, a
> four-way pad, and a vertical column of unlit buttons to its right.
>
> **Lens.** 24–70 mm f/2.8 standard zoom, fixed to the mount. Stepped barrel:
> machined silver bayonet ring at the body, a wide fluted-rubber zoom ring, a
> narrower fluted focus ring, then a **crimson anodised accent ring (#c11e1e)**
> at the front, and a machined silver filter ring at the tip. Front element
> deeply recessed, multi-coated, reading near-black with a faint violet-to-teal
> iridescent sheen at grazing angles.
>
> **Materials.** Three distinct surfaces that must not be conflated: matte
> magnesium (roughness 0.55, metalness 0.65), matte vulcanised rubber on grip
> and barrel rings (roughness 0.9, metalness 0.0), and polished aluminium on
> mount, hot shoe and filter ring (roughness 0.25, metalness 1.0).
>
> **Deliverable.** `.glb`, glTF 2.0, Y-up, metres, origin at the body's
> geometric centre, lens pointing +Z. Real-time budget: under 80k triangles,
> 2K PBR texture set (albedo / normal / roughness / metalness / AO) packed
> ORM, KTX2-compressed, Draco-compressed geometry, total under 4 MB. Clean
> quad topology, no n-gons, non-overlapping UVs, one material per surface
> family.

## Prompt B — hero still image / render

For an `<img>` poster, an OG card, or the no-WebGL fallback. Matches the live
scene's lighting so the swap is invisible.

> Studio product photograph of a professional full-frame mirrorless cinema
> camera with a 24–70 mm f/2.8 zoom, unbranded, floating in a pure black void.
> Three-quarter front view from slightly below the lens axis, camera angled
> about 30° to the left so both the front face and the grip side read.
>
> Lighting is a film set, not a catalogue: one large soft key high and
> front-left raking across the top plate, a cool blue-white rim from behind
> right picking out the body's top edge and the lens barrel's silhouette, and a
> low crimson kicker (#c11e1e) from the front-left that catches the grip's
> rubber texture and throws a red glint along the mount ring. Deep falloff —
> the bottom of the body sinks into black. Crimson accent ring on the lens is
> the brightest saturated note in the frame.
>
> Shot on an 85 mm equivalent at f/4, shallow but not soft — the front element
> and accent ring are critically sharp. Subtle anamorphic flare off the rim
> light. Fine grain. No reflections of a studio, no visible background, no
> surface under the camera beyond a soft contact shadow directly below it.
> Colour graded cool-neutral with crushed blacks. 2400 × 1600, PNG with alpha.

## Prompt C — tuning the live scene

To re-direct the shot without touching geometry, the knobs are at the top of
`CameraScene.jsx`:

- `STUDIO_LIGHTS` — the three emissive panels baked into the environment map;
  their colour, intensity and placement set every reflection on the metal.
- `BASE_ROTATION` / `SWAY` — the resting three-quarter pose and how far the
  body drifts around it.
- `POINTER_STRENGTH` — how much the body follows the cursor.
- `ACCENT` — the one brand colour, consumed by both the lens ring and the
  record button.

Each is a plain object or constant; nothing downstream hard-codes these values.
