import 'react-native';
import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { LoginAuth } from '../components/login-auth';
import { useDispatch, useSelector } from 'react-redux';
import { it } from '@jest/globals';
import renderer from 'react-test-renderer';
import { TypedUseSelectorHook } from 'react-redux';

type MockDispatchFn = typeof useDispatch & jest.Mock;
type MockSelectorFn<TState = unknown> = TypedUseSelectorHook<TState> & jest.Mock;

const mockNavigation = {
  navigate: jest.fn(),
};

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


describe('LoginAuth Component Testing', () => {
  it('renders correctly', () => {
    renderer.create(<LoginAuth />);
  });

  it('show loader when check authentication', () => {
    mockSelector.mockReturnValue({
      loading: true,
      error: null,
      isAuthenticated: false,
      loadingApplication: true,
    });
  });

  it('disables submit button with invalid email and password', () => {
    const { getByText, getByPlaceholderText } = render(<LoginAuth />);

    const emailInput = getByPlaceholderText('Введите ваш email');
    const passwordInput = getByPlaceholderText('Введите ваш пароль');
    fireEvent.changeText(emailInput, 'invalid');
    fireEvent.changeText(passwordInput, '123');

  });

  it('enables submit button with valid email and password', () => {
    const { getByText, getByPlaceholderText } = render(<LoginAuth />);

    const emailInput = getByPlaceholderText('Введите ваш email');
    const passwordInput = getByPlaceholderText('Введите ваш пароль');
    fireEvent.changeText(emailInput, 'test@mail.com');
    fireEvent.changeText(passwordInput, 'password123');
  });
});