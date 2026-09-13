import { ZeroPerl } from '@aspeer/zeroperl-ts';
import wasmModule from '@aspeer/zeroperl-ts/zeroperl.wasm';

export default {
    async fetch(request) {
        const url = new URL(request.url);
        if (url.pathname !== '/') return new Response('Not found', { status: 404 });
        if (request.method !== 'GET') return new Response('Method not allowed', {
            status: 405, headers: { Allow: 'GET' },
        });
        const name = url.searchParams.get('name') || 'World';
        if (name.length > 100) return new Response('Name is too long', { status: 400 });
        try {
            // Share the compiled module, but keep the interpreter request-local.
            const perl = await ZeroPerl.create({ wasmModule });
            try {
                const loaded = await perl.eval(`
                    use strict;
                    use warnings;
                    sub greet {
                        my ($name)=@_;
                        return "Hello, $name!";
                    }
                `);
                if (!loaded.success) throw new Error(loaded.error);
                // Pass input as data rather than inserting it into Perl source.
                const argument = perl.createString(name);
                try {
                    const result = await perl.call('greet', [argument], 'scalar');
                    try {
                        const error = perl.getLastError();
                        if (error) throw new Error(error);
                        if (!result) throw new Error('Missing greeting');
                        return Response.json({ greeting: result.toString() });
                    } finally {
                        await result?.dispose();
                    }
                } finally {
                    await argument.dispose();
                }
            } finally {
                // Request completion includes any asynchronous Perl cleanup.
                await perl.dispose();
            }
        } catch (error) {
            console.error(JSON.stringify({ message: 'Perl request failed', error: String(error) }));
            return Response.json({ error: 'Perl request failed' }, { status: 500 });
        }
    },
};
