/**
 * Runs `react-native run-android --no-packager` on each connected emulator one after another,
 * with a pause between launches so Metro can finish serving the JS bundle to the first client.
 * Without this pause, concurrent bundle loads can leave one emulator stuck on a white screen (RN bridge never gets "Creating BundleLoader").
 * The first Gradle `installDebug` targets one device only: `ANDROID_SERIAL` is set so adb does not push the APK to every emulator at once (that used to start two JS loads and white-screen one of them).
 * After the first device, the same debug APK is installed via `adb install -r` so Gradle is not run again (a second full `installDebug` often stalls at ~99% on Windows with multiple ABIs / daemon locks).
 *
 * When several emulators are connected, the first Gradle build intentionally omits `--active-arch-only` so `app-debug.apk`
 * contains all ABIs; otherwise the APK built for e.g. x86_64 cannot run on an arm64-v8a AVD (INSTALL_FAILED_NO_MATCHING_ABIS / instant crash).
 *
 * Usage:
 *   npm start
 *   npm run android:emulators-sequential
 *
 * Override device list (comma-separated adb serials):
 *   set ANDROID_DEVICE_SERIALS=emulator-5554,emulator-5556&& npm run android:emulators-sequential
 */
const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { setTimeout: delay } = require('timers/promises');

const ROOT = path.join(__dirname, '..');
const PAUSE_MS = Number(process.env.ANDROID_MULTI_EMU_PAUSE_MS || 15000);
/** When true, first `run-android` always uses `--active-arch-only` (faster; unsafe if you then adb install the same APK on another ABI). */
const FORCE_ACTIVE_ARCH_ONLY = process.env.ANDROID_FORCE_ACTIVE_ARCH_ONLY === '1';
const DEBUG_APK = path.join(ROOT, 'android', 'app', 'build', 'outputs', 'apk', 'debug', 'app-debug.apk');
const MAIN_ACTIVITY = 'com.moviematcher/.MainActivity';

function adbEmulators() {
    const out = execSync('adb devices', { encoding: 'utf8', cwd: ROOT });
    return out
        .split('\n')
        .map((l) => l.trim())
        .filter((l) => l.endsWith('device') && !l.startsWith('List'))
        .map((l) => l.split(/\s+/)[0])
        .filter((id) => id.startsWith('emulator-'));
}

async function main() {
    const fromEnv = process.env.ANDROID_DEVICE_SERIALS;
    const devices = fromEnv
        ? fromEnv.split(',').map((s) => s.trim()).filter(Boolean)
        : adbEmulators();

    if (devices.length === 0) {
        console.error('No emulators found (adb devices). Start AVDs or set ANDROID_DEVICE_SERIALS.');
        process.exit(1);
    }

    console.log(`Sequential android run for: ${devices.join(', ')} (pause ${PAUSE_MS} ms between launches)\n`);

    const reverseScript = path.join(__dirname, 'adb-reverse-metro-all.js');
    console.log('Applying adb reverse for Metro on all connected devices...\n');
    spawnSync(process.execPath, [reverseScript], { stdio: 'inherit', cwd: ROOT });

    const envForAdbSingleTarget = (serial) => ({ ...process.env, ANDROID_SERIAL: serial });

    const rnCli = path.join(ROOT, 'node_modules', 'react-native', 'cli.js');
    const useActiveArchOnlyFirst = () =>
        FORCE_ACTIVE_ARCH_ONLY || devices.length === 1;

    const runAndroidArgs = (serial, opts = {}) => {
        const activeArchOnly = opts.activeArchOnly !== false;
        const args = [rnCli, 'run-android', '--no-packager', '--deviceId', serial];
        if (activeArchOnly) {
            args.push('--active-arch-only');
        }
        return args;
    };

    for (let i = 0; i < devices.length; i++) {
        const serial = devices[i];
        const useFastInstall = i > 0 && fs.existsSync(DEBUG_APK);

        if (useFastInstall) {
            console.log(
                `\n--- ${i + 1}/${devices.length}: adb install -r (reuse APK from first build; avoids second Gradle hang at ~99%) ---\n`,
            );
            const ins = spawnSync('adb', ['-s', serial, 'install', '-r', DEBUG_APK], {
                stdio: 'inherit',
                cwd: ROOT,
                env: envForAdbSingleTarget(serial),
            });
            if (ins.status !== 0) {
                console.log(
                    '\nRetrying full react-native run-android for this device (without --active-arch-only so APK matches this AVD)...\n',
                );
                const r = spawnSync(process.execPath, runAndroidArgs(serial, { activeArchOnly: false }), {
                    stdio: 'inherit',
                    cwd: ROOT,
                    env: envForAdbSingleTarget(serial),
                });
                if (r.status !== 0) {
                    process.exit(r.status ?? 1);
                }
            } else {
                spawnSync('adb', ['-s', serial, 'shell', 'am', 'start', '-n', MAIN_ACTIVITY], {
                    stdio: 'inherit',
                    cwd: ROOT,
                    env: envForAdbSingleTarget(serial),
                });
            }
        } else {
            if (devices.length > 1 && i === 0) {
                console.log(
                    'Stopping app on other emulators so they do not compete for Metro during the first Gradle install.\n',
                );
                for (let j = 1; j < devices.length; j++) {
                    spawnSync('adb', ['-s', devices[j], 'shell', 'am', 'force-stop', 'com.moviematcher'], {
                        stdio: 'inherit',
                        cwd: ROOT,
                    });
                }
            }
            // Use --deviceId (not --device): RN CLI runOnSpecificDevice only reads deviceId.
            // ANDROID_SERIAL: Gradle installDebug otherwise pushes to every connected device and both launch → white screen on one.
            const archNote = useActiveArchOnlyFirst()
                ? '--active-arch-only (single device or ANDROID_FORCE_ACTIVE_ARCH_ONLY=1)'
                : 'full ABI APK (needed so the same app-debug.apk can install on every connected emulator)';
            console.log(`\n--- ${i + 1}/${devices.length}: --deviceId ${serial} (${archNote}; ANDROID_SERIAL=${serial}) ---\n`);
            const r = spawnSync(
                process.execPath,
                runAndroidArgs(serial, { activeArchOnly: useActiveArchOnlyFirst() }),
                {
                    stdio: 'inherit',
                    cwd: ROOT,
                    env: envForAdbSingleTarget(serial),
                },
            );
            if (r.status !== 0) {
                process.exit(r.status ?? 1);
            }
        }

        if (i < devices.length - 1) {
            console.log(`\nWaiting ${PAUSE_MS} ms before next device (Metro bundle)...\n`);
            await delay(PAUSE_MS);
        }
    }
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
