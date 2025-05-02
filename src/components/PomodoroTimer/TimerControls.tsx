import Button from '../Button/Button.tsx';
import { PauseCircleIcon, PlayIcon } from '@heroicons/react/24/outline';
import { TimerControlsProps } from './types.ts';

export function TimerControls({ isRunning, onToggle, onAddTime }: TimerControlsProps) {
    return (
        <div className="flex flex-col justify-between gap-3">
            <Button className="btn btn-sm" onClick={onAddTime}>
                + 5 min
            </Button>
            <Button className="btn btn-sm" onClick={onToggle}>
                {isRunning ? <PauseCircleIcon className="w-4 h-4" /> : <PlayIcon className="w-4 h-4" />}
            </Button>
        </div>
    );
}
