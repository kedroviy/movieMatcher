/**
 * Runs `adb -s <serial> reverse tcp:<port> tcp:<port>` for every connected device.
 * Required when several emulators/devices are attached: plain `adb reverse` fails with
 * "more than one device/emulator", so Metro never becomes reachable → "Unable to load script".
 *
 * Usage (from project root, Metro on default 8081):
 *   npm run android:reverse-metro
 *
 * Custom Metro port:
 *   set RCT_METRO_PORT=8088&& npm run android:reverse-metro
 */
const { execSync } = require('child_process');

const port = String(process.env.RCT_METRO_PORT || process.env.METRO_PORT || 8081);

function adbDeviceIds() {
    const out = execSync('adb devices', { encoding: 'utf8' });
    return out
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l && !l.startsWith('List'))
        .filter((l) => /\tdevice$/.test(l))
        .map((l) => l.split(/\s+/)[0]);
}

function main() {
    const ids = adbDeviceIds();
    if (ids.length === 0) {
        console.error('adb devices: no device in "device" state. Start an emulator or plug a phone.');
        process.exit(1);
    }
    for (const id of ids) {
        const cmd = `adb -s ${id} reverse tcp:${port} tcp:${port}`;
        console.log(cmd);
        execSync(cmd, { stdio: 'inherit' });
    }
    console.log(`OK: reverse tcp:${port} for ${ids.length} device(s).`);
}

main();
