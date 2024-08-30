import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Color } from 'styles/colors';
import { RadioButton } from '../radio-button';

describe('RadioButton', () => {
    it('should render correctly with default props', () => {
        const { getByTestId } = render(
            <RadioButton containerSize={20} selected={false} onChange={jest.fn()} />
        );

        const container = getByTestId('radio-container');
        const button = getByTestId('radio-button');

        expect(container.props.style).toMatchObject({
            width: 20,
            height: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: Color.WHITE,
        });

        expect(button.props.style).toMatchObject({
            width: 10,
            height: 10,
            borderRadius: 10,
            backgroundColor: 'transparent',
        });
    });

    it('should render as selected when selected is true', () => {
        const { getByTestId } = render(
            <RadioButton containerSize={20} selected={true} onChange={jest.fn()} />
        );

        const button = getByTestId('radio-button');

        expect(button.props.style).toMatchObject({
            backgroundColor: Color.WHITE,
        });
    });

    it('should call onChange when pressed', () => {
        const onChangeMock = jest.fn();
        const { getByTestId } = render(
            <RadioButton containerSize={20} selected={false} onChange={onChangeMock} />
        );

        const button = getByTestId('radio-button');
        fireEvent.press(button);

        expect(onChangeMock).toHaveBeenCalledTimes(1);
    });
});
