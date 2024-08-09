export type RecoveryPasswordType = {
    password: string,
    confirmPassword: string,
    isFormValidPassword: boolean,
    isFormValidConfirmPassword: boolean,
};

export type RecoveryPasswordActionType =
    | { type: 'SET_PASSWORD'; payload: string }
    | { type: 'SET_CONFIRM_PASSWORD'; payload: string };
