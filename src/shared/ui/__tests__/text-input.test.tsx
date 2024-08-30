import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { SimpleInput } from '../text-input';

describe('SimpleInput', () => {
    it('should render correctly with a label and placeholder', () => {
        const { getByText, getByPlaceholderText } = render(
            <SimpleInput
                label="Test Label"
                onChangeText={() => {}}
                value=""
                placeholder="Test Placeholder"
            />
        );

        expect(getByText('Test Label')).toBeTruthy();
        expect(getByPlaceholderText('Test Placeholder')).toBeTruthy();
    });

    it('should update value when text changes', () => {
        const mockOnChangeText = jest.fn();
        const { getByPlaceholderText } = render(
            <SimpleInput
                onChangeText={mockOnChangeText}
                value=""
                placeholder="Test Placeholder"
            />
        );

        fireEvent.changeText(getByPlaceholderText('Test Placeholder'), 'new text');
        expect(mockOnChangeText).toHaveBeenCalledWith('new text');
    });

    it('should display error message when input is invalid', () => {
        const { getByText } = render(
            <SimpleInput
                onChangeText={() => {}}
                value=""
                placeholder="Test Placeholder"
                textError="This is an error"
            />
        );

        expect(getByText('This is an error')).toBeTruthy();
    });

    it('should call onValidationChange with false when input is invalid', () => {
        const mockOnValidationChange = jest.fn();
        render(
            <SimpleInput
                onChangeText={() => {}}
                value=""
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(mockOnValidationChange).toHaveBeenCalledWith(false);
    });

    it('should call onValidationChange with true when input is valid', () => {
        const mockOnValidationChange = jest.fn();
        render(
            <SimpleInput
                onChangeText={() => {}}
                value="Valid input"
                onValidationChange={mockOnValidationChange}
            />
        );

        expect(mockOnValidationChange).toHaveBeenCalledWith(true);
    });

    it('should change border style when focused and blurred', () => {
        const { getByPlaceholderText } = render(
            <SimpleInput
                onChangeText={() => {}}
                value=""
                placeholder="Test Placeholder"
            />
        );

        const input = getByPlaceholderText('Test Placeholder');

        // Проверка фокусировки
        fireEvent(input, 'focus');
        expect(input.props.style).toContainEqual(expect.objectContaining({ borderColor: '#F9F9F9' }));

        // Проверка снятия фокуса
        fireEvent(input, 'blur');
        expect(input.props.style).not.toContainEqual(expect.objectContaining({ borderColor: '#F9F9F9' }));
    });
});
