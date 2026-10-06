import * as THREE from 'three';

/**
 * Procedural surface maps for the hero camera.
 *
 * A real camera body is never uniformly rough: magnesium is bead-blasted,
 * grips are pebbled rubber, machined rings carry a fine brushed grain. Flat
 * roughness is most of what makes a render read as CG, so every material here
 * gets a bump and roughness map. All generated at runtime — no image assets.
 */

function surface(size) {
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    return canvas;
}

/** Value noise: random cells smoothed up to full size, so it reads as grain
 *  rather than per-pixel static that aliases into mush at distance. */
function noiseLayer(size, cell, contrast) {
    const small = surface(Math.max(2, Math.round(size / cell)));
    const context = small.getContext('2d');
    const image = context.createImageData(small.width, small.height);

    for (let i = 0; i < image.data.length; i += 4) {
        const value = 128 + (Math.random() - 0.5) * 255 * contrast;
        image.data[i] = value;
        image.data[i + 1] = value;
        image.data[i + 2] = value;
        image.data[i + 3] = 255;
    }
    context.putImageData(image, 0, 0);

    const full = surface(size);
    const ctx = full.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(small, 0, 0, size, size);
    return full;
}

/*
 * Note on levels: these double as roughnessMap, and a roughnessMap
 * MULTIPLIES the material roughness. So every map sits near white and varies
 * downward slightly — a mid-grey map would halve roughness and turn the
 * magnesium into a mirror. Bump only reads gradients, so the high base costs
 * it nothing.
 */
function finish(canvas, repeatX, repeatY) {
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(repeatX, repeatY);
    texture.anisotropy = 8;
    return texture;
}

/** Bead-blasted magnesium: two octaves of fine grain. */
export function grainTexture(size = 512, repeat = 3) {
    const canvas = surface(size);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ededed';
    ctx.fillRect(0, 0, size, size);

    ctx.globalAlpha = 0.3;
    ctx.drawImage(noiseLayer(size, 2, 0.34), 0, 0);
    ctx.globalAlpha = 0.16;
    ctx.drawImage(noiseLayer(size, 9, 0.5), 0, 0);
    ctx.globalAlpha = 1;

    return finish(canvas, repeat, repeat);
}

/** Pebbled grip rubber: a staggered field of raised dots. */
export function stippleTexture(size = 512, repeat = 6) {
    const canvas = surface(size);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#c4c4c4';
    ctx.fillRect(0, 0, size, size);

    const gap = 11;
    const radius = 3.4;
    for (let y = 0; y <= size; y += gap) {
        const offset = ((y / gap) % 2) * (gap / 2);
        for (let x = -gap; x <= size + gap; x += gap) {
            const jitter = (Math.random() - 0.5) * 0.9;
            const gradient = ctx.createRadialGradient(
                x + offset, y, 0,
                x + offset, y, radius
            );
            gradient.addColorStop(0, '#ffffff');
            gradient.addColorStop(1, '#c4c4c4');
            ctx.fillStyle = gradient;
            ctx.beginPath();
            ctx.arc(x + offset + jitter, y + jitter, radius, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    ctx.globalAlpha = 0.12;
    ctx.drawImage(noiseLayer(size, 3, 0.5), 0, 0);
    ctx.globalAlpha = 1;

    return finish(canvas, repeat, repeat);
}

/** Machined aluminium: fine circumferential brush marks. */
export function brushedTexture(size = 512, repeatX = 4, repeatY = 1) {
    const canvas = surface(size);
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#dcdcdc';
    ctx.fillRect(0, 0, size, size);

    for (let i = 0; i < size * 2.5; i += 1) {
        const y = Math.random() * size;
        const alpha = Math.random() * 0.17;
        ctx.strokeStyle =
            Math.random() > 0.5 ? `rgba(255,255,255,${alpha})` : `rgba(0,0,0,${alpha})`;
        ctx.lineWidth = Math.random() * 1.5 + 0.3;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(size, y + (Math.random() - 0.5) * 2);
        ctx.stroke();
    }

    return finish(canvas, repeatX, repeatY);
}
