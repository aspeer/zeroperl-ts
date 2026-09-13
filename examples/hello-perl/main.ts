import { ZeroPerl } from '@webdyne/webdyne-zeroperl-ts';

const perl = await ZeroPerl.create({
    stdout: data => process.stdout.write(data),
    stderr: data => process.stderr.write(data),
});
try {
    const result = await perl.eval('use strict; use warnings; print "Hello from Perl!\\n";');
    if (!result.success) throw new Error(result.error || `Perl exited with ${result.exitCode}`);
    perl.flush();
} finally {
    await perl.dispose();
}
