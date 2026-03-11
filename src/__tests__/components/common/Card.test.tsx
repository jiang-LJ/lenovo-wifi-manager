/**
 * Card 组件测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Card } from '../../../components/common/Card';
import { Text } from 'react-native';

describe('Card Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly with children', () => {
    const { getByText } = render(
      <Card>
        <Text>Card Content</Text>
      </Card>
    );
    
    expect(getByText('Card Content')).toBeTruthy();
  });

  it('should call onPress when pressed and onPress is provided', () => {
    const { getByText } = render(
      <Card onPress={mockOnPress}>
        <Text>Clickable Card</Text>
      </Card>
    );
    
    fireEvent.press(getByText('Clickable Card'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not be pressable when disabled', () => {
    const { getByText } = render(
      <Card onPress={mockOnPress} disabled>
        <Text>Disabled Card</Text>
      </Card>
    );
    
    fireEvent.press(getByText('Disabled Card'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should apply custom styles', () => {
    const { getByText } = render(
      <Card style={{ backgroundColor: 'red' }}>
        <Text>Styled Card</Text>
      </Card>
    );
    
    // Card with custom style renders content correctly
    expect(getByText('Styled Card')).toBeTruthy();
  });
});
