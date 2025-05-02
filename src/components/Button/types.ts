import { ButtonHTMLAttributes } from 'react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: JSX.Element;
    isLoading?: boolean;
    children?: string | JSX.Element;
}
