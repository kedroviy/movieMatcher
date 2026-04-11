import { useEffect } from 'react';
import { Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import SpInAppUpdates, {
    IAUInstallStatus,
    IAUUpdateKind,
    type AndroidInAppUpdateExtras,
    type NeedsUpdateResponse,
    type StartUpdateOptions,
    type StatusUpdateEvent,
} from 'sp-react-native-in-app-updates';

const inAppUpdates = new SpInAppUpdates(__DEV__);

/** Play returns `versionCode`; we compare it to the running app's `versionCode` (Android). */
function compareAndroidVersionCodes(storeVersion: string, currentVersion: string): -1 | 0 | 1 {
    const a = parseInt(storeVersion, 10);
    const b = parseInt(currentVersion, 10);
    if (!Number.isFinite(a) || !Number.isFinite(b)) {
        return 0;
    }
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
}

export const useInAppUpdate = () => {
    useEffect(() => {
        if (__DEV__) {
            return;
        }

        let removeFlexStatusListener: (() => void) | undefined;

        const run = async () => {
            try {
                const checkOptions =
                    Platform.OS === 'android'
                        ? {
                              curVersion: String(DeviceInfo.getBuildNumber()),
                              customVersionComparator: compareAndroidVersionCodes,
                          }
                        : undefined;

                const result: NeedsUpdateResponse = await inAppUpdates.checkNeedsUpdate(checkOptions);
                if (!result.shouldUpdate) {
                    return;
                }

                if (Platform.OS === 'android') {
                    const extras = result.other as AndroidInAppUpdateExtras;

                    if (extras.isImmediateUpdateAllowed) {
                        await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.IMMEDIATE });
                        return;
                    }

                    if (extras.isFlexibleUpdateAllowed) {
                        const onStatus = (event: StatusUpdateEvent) => {
                            if (event.status === IAUInstallStatus.DOWNLOADED) {
                                inAppUpdates.removeStatusUpdateListener(onStatus);
                                removeFlexStatusListener = undefined;
                                inAppUpdates.installUpdate();
                            }
                        };
                        inAppUpdates.addStatusUpdateListener(onStatus);
                        removeFlexStatusListener = () => inAppUpdates.removeStatusUpdateListener(onStatus);
                        await inAppUpdates.startUpdate({ updateType: IAUUpdateKind.FLEXIBLE });
                        return;
                    }

                    console.warn('[InAppUpdate] Store reports an update but neither immediate nor flexible is allowed.');
                    return;
                }

                const iosOptions: StartUpdateOptions = {
                    title: 'Доступно обновление',
                    message: 'Вышла новая версия приложения. Обновить?',
                    buttonUpgradeText: 'Обновить',
                    buttonCancelText: 'Позже',
                };
                await inAppUpdates.startUpdate(iosOptions);
            } catch (error) {
                console.warn('[InAppUpdate]', error);
            }
        };

        void run();

        return () => {
            removeFlexStatusListener?.();
        };
    }, []);
};
