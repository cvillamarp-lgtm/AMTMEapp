import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from '../form-input';

describe('FormInput', () => {
  it('renders input field', () => {
    const { container } = render(<FormInput name="test" data-testid="test-input" />);
    expect(container.querySelector('input[name="test"]')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<FormInput label="Test Label" name="test" data-testid="test-input" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('shows required indicator when required is true', () => {
    render(
      <FormInput label="Required Field" required={true} name="test" data-testid="test-input" />
    );
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  it('displays error message when error is provided', () => {
    render(
      <FormInput label="Test" error="This field is required" name="test" data-testid="test-input" />
    );
    expect(screen.getByText('This field is required')).toBeInTheDocument();
  });

  it('displays helper text when provided', () => {
    render(
      <FormInput
        label="Test"
        helperText="This is helper text"
        name="test"
        data-testid="test-input"
      />
    );
    expect(screen.getByText('This is helper text')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    const { container } = render(<FormInput name="test" data-testid="test-input" />);
    const input = container.querySelector('input[name="test"]') as HTMLInputElement;

    await user.type(input, 'test value');
    expect(input.value).toBe('test value');
  });
});
