import { ZeroPerl } from '@webdyne/webdyne-zeroperl-ts';

const perl = await ZeroPerl.create();
function registerRelease() {
    perl.registerFunction('release_resource', async (label) => {
        const name = label.toString();
        await new Promise(resolve => setTimeout(resolve, 20));
        console.log(`Released: ${name}`);
    });
}
try {
    registerRelease();
    const loaded = await perl.eval(`
        use strict;
        use warnings;
        package Resource;
        sub DESTROY { main::release_resource('object') }
        package main;
        sub make_resource { return bless({}, 'Resource') }
    `);
    if (!loaded.success) throw new Error(loaded.error);
    const resource = await perl.call('make_resource', [], 'scalar');
    try {
        const error = perl.getLastError();
        if (error) throw new Error(error);
        if (!resource) throw new Error('Missing resource');
    } finally {
        await resource?.dispose();
    }
    console.log('Object cleanup finished');
    // All owned wrappers must be disposed before reset. Calls stay serialized.
    await perl.reset();
    registerRelease();
    const result = await perl.eval(`
        use strict;
        use warnings;
        release_resource('after reset');
    `);
    if (!result.success) throw new Error(result.error);
} finally {
    await perl.dispose();
}
console.log('Interpreter cleanup finished');
