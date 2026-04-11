/**
 * One command: start Metro (if not already on the port), wait until it listens,
 * then run the sequential multi-emulator Android flow (adb reverse + install/launch).
 *
 *   npm run android:dev-multi
 *
 * Every adb device (emulator + USB), same as android:dev-multi-all:
 *   npm run android:dev-multi-all
 *
 * If Metro was started here, it keeps running after installs; Ctrl+C stops Metro.
 * If Metro was already running, this process exits when Android steps finish.
 */
const { spawn } = require('child_process');
const net = require('net');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const RN_CLI = path.join(ROOT, 'node_modules', 'react-native', 'cli.js');
const SEQUENTIAL = path.join(__dirname, 'run-android-emulators-sequential.js');

const port = Number(process.env.RCT_METRO_PORT || process.env.METRO_PORT || 8081);
const waitMs = Number(process.env.ANDROID_DEV_MULTI_METRO_WAIT_MS || 120000);

let metroChild = null;
let androidStepsFinished = false;

function portOpen(host, p) {
    return new Promise((resolve) => {
        const s = net.createConnection({ host, port: p }, () => {
            s.end();
            resolve(true);
        });
        s.on('error', () => resolve(false));
    });
}

function waitForPort(p, timeoutMs) {
    const t0 = Date.now();
    return (async function poll() {
        if (await portOpen('127.0.0.1', p)) {
            return;
        }
        if (Date.now() - t0 > timeoutMs) {
            throw new Error(`Metro did not listen on ${p} within ${timeoutMs} ms`);
        }
        await new Promise((r) => setTimeout(r, 400));
        return poll();
    })();
}

function shutdown() {
    if (metroChild && !metroChild.killed) {
        metroChild.kill('SIGINT');
    }
    process.exit(130);
}

async function main() {
    if (process.argv.includes('--all-adb-devices')) {
        process.env.ANDROID_USE_ALL_ADB_DEVICES = '1';
    }

    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);

    const alreadyUp = await portOpen('127.0.0.1', port);

    if (alreadyUp) {
        console.log(`Metro already listening on ${port}; skipping "react-native start".\n`);
    } else {
        console.log(`Starting Metro on port ${port}...\n`);
        metroChild = spawn(process.execPath, [RN_CLI, 'start'], {
            cwd: ROOT,
            stdio: 'inherit',
            env: { ...process.env },
        });
        metroChild.on('error', (err) => {
            console.error(err);
            process.exit(1);
        });
        metroChild.on('exit', (code, signal) => {
            if (androidStepsFinished) {
                return;
            }
            if (signal === 'SIGINT') {
                process.exit(130);
            }
            console.error(`Metro exited unexpectedly (code ${code}).`);
            process.exit(code ?? 1);
        });

        await waitForPort(port, waitMs);
        await new Promise((r) => setTimeout(r, 800));
    }

    const seq = spawn(process.execPath, [SEQUENTIAL], {
        cwd: ROOT,
        stdio: 'inherit',
        env: { ...process.env },
    });
    const code = await new Promise((resolve) => {
        seq.on('exit', (c) => resolve(c ?? 1));
        seq.on('error', () => resolve(1));
    });

    androidStepsFinished = true;

    if (code !== 0) {
        if (metroChild) {
            metroChild.kill('SIGINT');
        }
        process.exit(code);
    }

    if (metroChild) {
        console.log('\n--- Готово: эмуляторы обновлены. Metro всё ещё работает; Ctrl+C — остановить Metro. ---\n');
        await new Promise(() => {});
    } else {
        console.log('\n--- Готово: эмуляторы обновлены (Metro был уже запущен отдельно). ---\n');
        process.exit(0);
    }
}

main().catch((e) => {
    console.error(e);
    if (metroChild) {
        metroChild.kill('SIGINT');
    }
    process.exit(1);
});
