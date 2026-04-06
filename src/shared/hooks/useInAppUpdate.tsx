import { useEffect } from "react";
import { Platform } from "react-native";
import SpInAppUpdates, {
    NeedsUpdateResponse,
    IAUUpdateKind,
    StartUpdateOptions,
} from 'sp-react-native-in-app-updates';

const inAppUpdates = new SpInAppUpdates(
    __DEV__
);

export const useInAppUpdate = () => {
    useEffect(() => {
        inAppUpdates.checkNeedsUpdate({ curVersion: '0.0.3' }).then((result: NeedsUpdateResponse) => {
            if (result.shouldUpdate) {
                let updateOptions: StartUpdateOptions = {};
                if (Platform.OS === 'android') {
                    updateOptions = {
                        updateType: IAUUpdateKind.FLEXIBLE,
                    };
                }

                inAppUpdates.startUpdate(updateOptions);
            }
        }).catch(error => console.log(error));
    })
};
