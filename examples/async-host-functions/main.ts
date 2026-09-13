import { ZeroPerl } from '@aspeer/zeroperl-ts';

const users = new Map([['alice', 'Alice Example']]);
const perl = await ZeroPerl.create({ stdout: data => process.stdout.write(data) });
try {
    perl.registerFunction('lookup_user', async (key) => {
        // Arguments are borrowed until this callback settles. Do not dispose
        // them or keep their wrappers for use after returning.
        const name = key.toString();
        await new Promise(resolve => setTimeout(resolve, 20));
        const user = users.get(name);
        if (!user) throw new Error(`Unknown user: ${name}`);
        // This owned return value transfers to Perl; do not dispose it here.
        return perl.createString(user);
    });
    const result = await perl.eval(`
        use strict;
        use warnings;
        $|=1;
        print(lookup_user('alice'), "\\n");
        eval { lookup_user('missing') };
        die("Expected lookup to fail") unless $@=~/Unknown user: missing/;
        print("Missing user handled\\n");
        print(lookup_user('alice'), "\\n");
    `);
    if (!result.success) throw new Error(result.error);
} finally {
    await perl.dispose();
}
