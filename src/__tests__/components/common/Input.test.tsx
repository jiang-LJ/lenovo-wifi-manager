/**
 * Input 组件测试
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../../../components/common/Input';

describe('Input Component', () => {
  const mockOnChangeText = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    expect(getByPlaceholderText('Enter text')).toBeTruthy();
  });

  it('should render with label', () => {
    const { getByText } = render(
      <Input
        label="Username"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    expect(getByText('Username')).toBeTruthy();
  });

  it('should call onChangeText when text changes', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Enter text"
        value=""
        onChangeText={mockOnChangeText}
      />
    );
    
    fireEvent.changeText(getByPlaceholderText('Enter text'), 'new text');
    expect(mockOnChangeText).toHaveBeenCalledWith('new text');
  });

  it('should show error message when error prop is provided', () => {
    const { getByText } = render(
      <Input
        value=""
        onChangeText={mockOnChangeText}
        error="This field is required"
      />
    );
    
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('should render secure text input', () => {
    const { getByPlaceholderText } = render(
      <Input
        placeholder="Password"
        value="secret"
        onChangeText={mockOnChangeText}
        secureTextEntry
      />
    );
    
    const input = getByPlaceholderText('Password');
    expect(input.props.secureTextEntry).toBe(true);
  });
});
