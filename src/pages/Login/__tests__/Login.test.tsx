import 'react-native';
import React from 'react';
import { LoginScreen } from '../Login';
import { useDispatch, useSelector } from 'react-redux';
import { it } from '@jest/globals';
import renderer from 'react-test-renderer';
import { TypedUseSelectorHook } from 'react-redux';
import { useTranslation } from 'react-i18next';

type MockDispatchFn = typeof useDispatch & jest.Mock;
type MockSelectorFn<TState = unknown> = TypedUseSelectorHook<TState> & jest.Mock;

const mockNavigation = {
    navigate: jest.fn(),
};

jest.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
    }),
}));

jest.mock('@react-navigation/native', () => ({
    useNavigation: () => mockNavigation,
}));

jest.mock('react-redux', () => ({
    useDispatch: jest.fn(() => jest.fn()),
    useSelector: jest.fn(),
}));

const mockDispatch: MockDispatchFn = useDispatch as any;
const mockSelector: MockSelectorFn = useSelector as any;

beforeEach(() => {
    jest.clearAllMocks();

    (mockDispatch as jest.Mock).mockReturnValue({
        loading: false,
        error: null,
        isAuthenticated: false,
        loadingApplication: false,
    });

    (mockSelector as jest.Mock).mockReturnValue(jest.fn());
});


describe('LoginScreen Component Testing', () => {
    it('LoginScreen renders correctly', () => {
        const tree = renderer.create(<LoginScreen />).toJSON();
        expect(tree).toMatchSnapshot();
    });
});