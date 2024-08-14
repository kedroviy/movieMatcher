import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SimpleButton } from '../simple-button';

describe('SimpleButton Component', () => {
    const mockOnPress = jest.fn();

    const defaultProps = {
        title: 'Click Me',
        color: '#FF5733',
        titleColor: '#FFFFFF',
        buttonWidth: 200 as const,
        onHandlePress: mockOnPress,
    };

    afterEach(() => {
        mockOnPress.mockClear();
    });

    it('renders correctly with default props', () => {
        const { getByText } = render(<SimpleButton {...defaultProps} />);

        const buttonText = getByText('Click Me');

        expect(buttonText).toBeTruthy();
        expect(buttonText.props.style.color).toBe('#FFFFFF');
    });

    it('calls the onHandlePress function when pressed', () => {
        const { getByTestId } = render(<SimpleButton {...defaultProps} />);

        const button = getByTestId('simple-button');

        fireEvent.press(button);

        expect(mockOnPress).toHaveBeenCalledTimes(1);
    });

    it('does not call onHandlePress when disabled', () => {
        const { getByTestId } = render(<SimpleButton {...defaultProps} disabled={true} />);

        const button = getByTestId('simple-button');

        fireEvent.press(button);

        expect(mockOnPress).not.toHaveBeenCalled();
    });
});
