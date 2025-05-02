import Button from '../Button/Button.tsx';
import { MinutesSelectorProps } from './types.ts';

export function MinutesSelector({ setSelected, minutes, disabled, selected }: MinutesSelectorProps) {
    return minutes.map((m) => (
        <Button
            key={m}
            className={`btn btn-sm border border-secondary w-16 ${
                m === selected ? 'bg-secondary text-secondary-content' : ''
            }`}
            onClick={() => setSelected(m)}
            disabled={disabled}
        >
            {m + ':00'}
        </Button>
    ));
}
