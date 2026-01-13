import type { ButtonHTMLAttributes, ReactNode } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: JSX.Element;
    isLoading?: boolean;
    variant?: 'default' | 'primary' | 'soft';
    children?: ReactNode;
}

function Button({ isLoading, icon, children, variant = 'default', className = '', ...rest }: ButtonProps) {
    const variantClass = variant === 'primary'
        ? 'sketch-btn-primary'
        : variant === 'soft'
        ? 'sketch-btn-soft'
        : '';

    return (
        <button
            {...rest}
            className={`sketch-btn ${variantClass} ${className}`}
            disabled={isLoading || rest.disabled}
        >
            {icon}
            <span>{isLoading ? '⏳ Loading...' : children}</span>
        </button>
    );
}

export default Button;
