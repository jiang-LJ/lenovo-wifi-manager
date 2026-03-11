/**
 * Button 组件测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../../../components/common/Button';

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('should call onPress when pressed', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('should not call onPress when disabled', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} disabled />
    );
    
    fireEvent.press(getByText('Test Button'));
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('should show loading indicator when loading', () => {
    const { queryByText } = render(
      <Button title="Test Button" onPress={mockOnPress} loading />
    );
    
    // When loading, button text should not be visible (replaced by ActivityIndicator)
    expect(queryByText('Test Button')).toBeNull();
  });

  it('should apply different variants', () => {
    const variants: Array<'primary' | 'secondary' | 'outline' | 'danger'> = [
      'primary',
      'secondary',
      'outline',
      'danger',
    ];

    variants.forEach(variant => {
      const { getByText } = render(
        <Button
          title={variant}
          onPress={mockOnPress}
          variant={variant}
        />
      );
      
      expect(getByText(variant)).toBeTruthy();
    });
  });

  it('should apply different sizes', () => {
    const sizes: Array<'small' | 'medium' | 'large'> = ['small', 'medium', 'large'];

    sizes.forEach(size => {
      const { getByText } = render(
        <Button title={size} onPress={mockOnPress} size={size} />
      );
      
      expect(getByText(size)).toBeTruthy();
    });
  });
});
