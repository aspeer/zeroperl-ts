import { ZeroPerl } from '@aspeer/zeroperl-ts';

const button = document.querySelector('#run');
const code = document.querySelector('#code');
const output = document.querySelector('#output');
const status = document.querySelector('#status');
let running = false;
button.addEventListener('click', async () => {
    if (running) return;
    running = true;
    button.disabled = true;
    output.textContent = '';
    status.textContent = 'Running…';
    const stdout = new TextDecoder();
    const stderr = new TextDecoder();
    const append = decoder => data => {
        output.textContent += typeof data === 'string' ? data : decoder.decode(data, { stream: true });
    };
    try {
        const perl = await ZeroPerl.create({
            fetch: () => fetch('/zeroperl.wasm'),
            stdout: append(stdout),
            stderr: append(stderr),
        });
        try {
            const result = await perl.eval(code.value);
            perl.flush();
            if (!result.success) throw new Error(result.error || `Perl exited with ${result.exitCode}`);
        } finally {
            await perl.dispose();
        }
        status.textContent = 'Finished';
    } catch (error) {
        status.textContent = 'Failed';
        output.textContent += `\n${error instanceof Error ? error.message : String(error)}\n`;
    } finally {
        output.textContent += stdout.decode() + stderr.decode();
        running = false;
        button.disabled = false;
    }
});
