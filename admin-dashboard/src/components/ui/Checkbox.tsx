import { InputHTMLAttributes, forwardRef } from 'react';
import { clsx } from 'clsx';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> { }

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                type="checkbox"
                className={clsx(
                    'h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Checkbox.displayName = 'Checkbox';

export { Checkbox };
