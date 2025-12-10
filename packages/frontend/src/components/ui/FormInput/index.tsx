import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

export interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  // label?: string;
  // 09-12-2025(Y)
  label?: React.ReactNode;
  error?: string;
  helperText?: string;
}

const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    // const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    // 09-12-2025(Y)
    const inputId =
      id ||
      (typeof label === "string"
        ? label.toLowerCase().replace(/\s+/g, "-")
        : undefined);

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-700"
          >
            {label}
          </label>
        )}

        <input
          id={inputId}
          ref={ref}
          className={cn(
            'block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm',
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500',
            className
          )}
          {...props}
        />

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {helperText && !error && (
          <p className="text-sm text-gray-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
