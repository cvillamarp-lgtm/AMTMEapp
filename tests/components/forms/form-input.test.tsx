import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FormInput } from '@/components/forms/form-input';

describe('FormInput', () => {
  it('renders input field', () => {
    const { container } = render(<FormInput name="test" />);
    expect(container.querySelector('input[name="test"]')).toBeInTheDocument();
  });

  it('displays label when provided', () => {
    render(<FormInput label="Test Label" name="test" />);
    expect(screen.getByText('Test Label')).toBeInTheDocument();
  });

  it('accepts user input', async () => {
    const user = userEvent.setup();
    const { container } = render(<FormInput name="test" />);
    const input = container.querySelector('input[name="test"]') as HTMLInputElement;

    await user.type(input, 'test value');
    expect(input.value).toBe('test value');
  });
});
