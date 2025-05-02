import { TimerDisplayProps } from './types.ts';

export function TimerDisplay({ remainingSeconds }: TimerDisplayProps) {
    const seconds = remainingSeconds % 60;
    const minutes = (remainingSeconds - seconds) / 60;
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
}
