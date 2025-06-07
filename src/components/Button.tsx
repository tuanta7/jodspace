import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: JSX.Element;
    isLoading?: boolean;
    children?: string | JSX.Element;
}

function Button({ isLoading, icon, children, ...rest }: ButtonProps) {
    const text = isLoading ? <span className="loading loading-dots loading-sm"></span> : children;
    return (
        <button {...rest}>
            {icon}
            <span>{text}</span>
        </button>
    );
}

export default Button;
