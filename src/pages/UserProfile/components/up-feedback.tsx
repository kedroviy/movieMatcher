import { FC, useCallback, useEffect, useState } from 'react';
import { Alert, Dimensions, StyleSheet, View } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';

import { RootStackParamList } from 'app/constants';
import { AppDispatch, RootState } from 'redux/configure-store';
import { fetchMyFeedback, submitFeedback } from 'redux/feedbackSlice';
import { AppConstants, Loader } from 'shared';

import { FeedbackForm, FeedbackThankYou } from './feedback';

type Props = StackScreenProps<RootStackParamList, 'UserProfileFeedback'>;

export const UserProfileFeedback: FC<Props> = ({ navigation }) => {
    const { t } = useTranslation();
    const dispatch = useDispatch<AppDispatch>();
    const windowWidth = Dimensions.get('window').width;
    const buttonWidth = windowWidth - 32;

    const { checkLoading, submitLoading, hasExistingFeedback, submitSuccess } = useSelector(
        (state: RootState) => state.feedbackSlice,
    );

    const [text, setText] = useState(AppConstants.EMPTY_VALUE);
    const [showTextError, setShowTextError] = useState(false);

    useEffect(() => {
        const checkTask = dispatch(fetchMyFeedback());
        return () => {
            checkTask.abort();
        };
    }, [dispatch]);

    const handleBack = useCallback(() => {
        navigation.goBack();
    }, [navigation]);

    const handleSubmit = useCallback(async () => {
        if (!text.trim()) {
            setShowTextError(true);
            return;
        }

        setShowTextError(false);
        const submitTask = dispatch(submitFeedback(text.trim()));
        const result = await submitTask;

        if (submitFeedback.rejected.match(result) && result.payload !== 'ABORTED') {
            const message =
                result.payload === 'UNAUTHORIZED'
                    ? t('acc_settings.feedback_form.authRequired')
                    : t('acc_settings.feedback_form.networkError');
            Alert.alert(t('auth.errors.alert_title'), message);
        }
    }, [dispatch, t, text]);

    if (checkLoading) {
        return (
            <View style={[styles.container, { width: windowWidth }]}>
                <Loader />
            </View>
        );
    }

    if (hasExistingFeedback) {
        const message = submitSuccess
            ? t('acc_settings.feedback_form.success_message')
            : t('acc_settings.feedback_form.already_sent');

        return (
            <View style={[styles.container, { width: windowWidth }]}>
                <FeedbackThankYou
                    message={message}
                    backLabel={t('acc_settings.feedback_form.back')}
                    onBack={handleBack}
                    buttonWidth={buttonWidth}
                />
            </View>
        );
    }

    return (
        <View style={[styles.container, { width: windowWidth }]}>
            <FeedbackForm
                description={t('acc_settings.feedback_form.description')}
                submitLabel={t('acc_settings.feedback_form.submit')}
                textError={t('acc_settings.feedback_form.textError')}
                value={text}
                onChangeText={setText}
                onSubmit={handleSubmit}
                inputDisabled={submitLoading}
                submitDisabled={!text.trim() || submitLoading}
                buttonWidth={buttonWidth}
                showTextError={showTextError}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
