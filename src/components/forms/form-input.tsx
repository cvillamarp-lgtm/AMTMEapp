'use client';

import { forwardRef } from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  helperText?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, required, helperText, className = '', id, ...props }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <label htmlFor={inputId} className="text-sm font-semibold text-amtme-navy">
            {label}
            {required && <span className="text-amtme-red ml-1">*</span>}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`w-full rounded-lg border border-black/[0.08] bg-white px-3.5 py-2.5 text-sm text-amtme-navy placeholder:text-amtme-gray-400 outline-none transition-all duration-200 focus:border-amtme-navy/15 focus:ring-2 focus:ring-amtme-yellow/20 focus:shadow-soft disabled:opacity-50 disabled:bg-black/[0.03] ${
            error ? 'border-amtme-red/40 focus:ring-amtme-red/20' : ''
          } ${className}`}
          {...props}
        />
        {error && <p className="text-sm font-medium text-amtme-red">{error}</p>}
        {helperText && <p className="text-sm text-amtme-gray-500">{helperText}</p>}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
