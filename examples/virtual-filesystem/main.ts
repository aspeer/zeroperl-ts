import { readFile } from 'node:fs/promises';
import { MemoryFileSystem, ZeroPerl } from '@webdyne/webdyne-zeroperl-ts';

const fs = new MemoryFileSystem({ '/': '' });
fs.addFile('/report.pl', await readFile(new URL('./report.pl', import.meta.url), 'utf8'));
fs.addFile('/input.txt', await readFile(new URL('./input.txt', import.meta.url), 'utf8'));
const perl = await ZeroPerl.create({ fileSystem: fs });
try {
    const result = await perl.runFile('/report.pl', ['/input.txt', '/report.txt']);
    if (!result.success) throw new Error(result.error || `Perl exited with ${result.exitCode}`);
    const report = fs.lookup('/report.txt');
    if (!report || report.type !== 'file') throw new Error('Missing report');
    const text = report.content instanceof Blob
        ? await report.content.text()
        : new TextDecoder().decode(report.content);
    process.stdout.write(text);
} finally {
    await perl.dispose();
}
