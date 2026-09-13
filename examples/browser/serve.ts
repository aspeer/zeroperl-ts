// Serve only the demo and the two generated runtime assets, on loopback.
const routes = new Map([
    ['/', ['./index.html', 'text/html; charset=utf-8']],
    ['/main.js', ['./main.js', 'text/javascript; charset=utf-8']],
    ['/bridge.js', ['../../dist/esm/index.js', 'text/javascript; charset=utf-8']],
    ['/zeroperl.wasm', ['../../dist/esm/zeroperl.wasm', 'application/wasm']],
]);
for (const [path] of routes.values()) {
    if (!await Bun.file(new URL(path!, import.meta.url)).exists()) {
        throw new Error('Missing demo/build asset. Run npm run build from the repository root.');
    }
}
const server = Bun.serve({
    hostname: '127.0.0.1',
    port: 8788,
    fetch(request) {
        const route = routes.get(new URL(request.url).pathname);
        if (!route) return new Response('Not found', { status: 404 });
        const [path, type] = route;
        return new Response(Bun.file(new URL(path!, import.meta.url)), {
            headers: { 'Content-Type': type!, 'Cache-Control': 'no-store' },
        });
    },
});
console.log(`Open ${server.url} (Ctrl-C to stop)`);
