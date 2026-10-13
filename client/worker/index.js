// Serves /videos/* with HTTP byte-range support. Static assets on their own answer
// every request with a full 200, and iOS Safari refuses to play <video> unless the
// server honours `Range` with 206 Partial Content. Everything else is served
// straight from static assets without running this script (see run_worker_first).

const RANGE = /^bytes=(\d*)-(\d*)$/;

export default {
    async fetch(request, env) {
        const response = await env.ASSETS.fetch(request);
        const range = request.headers.get('Range');

        if (response.status !== 200 || !range) {
            const headers = new Headers(response.headers);
            headers.set('Accept-Ranges', 'bytes');
            return new Response(response.body, { status: response.status, headers });
        }

        const match = RANGE.exec(range.trim());
        if (!match || (match[1] === '' && match[2] === '')) return response;

        const body = await response.arrayBuffer();
        const size = body.byteLength;
        let start;
        let end;
        if (match[1] === '') {
            // Suffix range: the last N bytes.
            start = Math.max(size - Number(match[2]), 0);
            end = size - 1;
        } else {
            start = Number(match[1]);
            end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
        }

        const headers = new Headers(response.headers);
        headers.set('Accept-Ranges', 'bytes');
        if (start >= size || start > end) {
            headers.set('Content-Range', `bytes */${size}`);
            headers.delete('Content-Length');
            return new Response(null, { status: 416, headers });
        }

        headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
        headers.set('Content-Length', String(end - start + 1));
        return new Response(body.slice(start, end + 1), { status: 206, headers });
    },
};
