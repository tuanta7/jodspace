import { ButtonProps } from './types.ts';

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
