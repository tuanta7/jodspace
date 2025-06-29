import { useCallback, useEffect, useRef, useState } from 'react';
import { PauseCircleIcon, PlayIcon } from '@heroicons/react/24/outline';

function PomodoroTimer() {
    const intervalID = useRef<ReturnType<typeof setInterval>>();

    const [settings, setSettings] = useState<TimerSettings>({
        focus: 25,
        break: 5,
        loops: 4,
    });

    const [timerState, setTimerState] = useState<TimerState>({
        isRunning: false,
        isBreaking: false,
        remainingSeconds: 25 * 60,
        currentLoop: 1,
        totalLoops: 4,
    });

    const clearTimer = useCallback(() => {
        if (intervalID.current) {
            clearInterval(intervalID.current);
            intervalID.current = undefined;
        }

        setTimerState((prev) => ({
            ...prev,
            isRunning: false,
            isBreaking: false,
            currentLoop: 1,
        }));
    }, []);

    useEffect(() => {
        return () => clearTimer();
    }, [clearTimer]);

    const startTimer = useCallback(() => {
        setTimerState((prev) => ({ ...prev, isRunning: true }));

        intervalID.current = setInterval(() => {
            setTimerState((prev) => {
                if (prev.remainingSeconds <= 0) {
                    if (prev.isBreaking) {
                        // Break finished, start next focus session
                        const nextLoop = prev.currentLoop + 1;
                        if (nextLoop > settings.loops) {
                            // All loops completed, stop timer
                            clearTimer();
                            return {
                                ...prev,
                                isRunning: false,
                                isBreaking: false,
                                remainingSeconds: settings.focus * 60,
                                currentLoop: 1,
                            };
                        }
                        return {
                            ...prev,
                            isBreaking: false,
                            remainingSeconds: settings.focus * 60,
                            currentLoop: nextLoop,
                        };
                    } else {
                        // Focus session finished, start break
                        return {
                            ...prev,
                            isBreaking: true,
                            remainingSeconds: settings.break * 60,
                        };
                    }
                }
                return {
                    ...prev,
                    remainingSeconds: prev.remainingSeconds - 1,
                };
            });
        }, 1000);
    }, [settings, clearTimer]);

    const handleCountdown = useCallback(() => {
        if (timerState.isRunning) {
            clearTimer();
        } else {
            startTimer();
        }
    }, [timerState.isRunning, startTimer, clearTimer]);

    const handleAddTime = useCallback(() => {
        setTimerState((prev) => ({
            ...prev,
            remainingSeconds: prev.remainingSeconds + 300,
        }));
    }, []);

    const handleFocusChange = useCallback((minutes: number) => {
        setTimerState((prev) => ({
            ...prev,
            remainingSeconds: minutes * 60,
        }));
    }, []);

    const timeDisplay = (remainingSeconds: number) => {
        const seconds = remainingSeconds % 60;
        const minutes = (remainingSeconds - seconds) / 60;
        return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
    };

    return (
        <div className="flex w-full min-w-fit flex-col gap-2">
            <div className="px-3">
                <progress
                    className="progress"
                    value={timerState.remainingSeconds}
                    max={timerState.isBreaking ? settings.break * 60 : settings.focus * 60}
                />
            </div>
            <div className="mx-3 flex items-center justify-between gap-2 px-1">
                <div className="flex flex-col">
                    <div className="mb-2 text-5xl font-semibold">{timeDisplay(timerState.remainingSeconds)}</div>
                    <div className="text-sm text-gray-500">
                        {timerState.isBreaking ? 'Break' : 'Focus'} - Loop {timerState.currentLoop}/{settings.loops}
                    </div>
                </div>
                <div className="flex justify-between gap-1">
                    <button className="btn btn-sm" onClick={handleAddTime}>
                        + 5 min
                    </button>
                    <button className="btn btn-sm" onClick={handleCountdown}>
                        {timerState.isRunning ? (
                            <PauseCircleIcon className="h-4 w-4" />
                        ) : (
                            <PlayIcon className="h-4 w-4" />
                        )}
                    </button>
                </div>
            </div>
            <TimerSettingsPanel
                settings={settings}
                onSettingsChange={setSettings}
                isRunning={timerState.isRunning}
                onFocusChange={handleFocusChange}
            />
        </div>
    );
}

function TimerSettingsPanel({ settings, onSettingsChange, isRunning, onFocusChange }: TimerSettingsPanelProps) {
    const handleFocusChange = (value: number) => {
        onFocusChange(value);
        onSettingsChange({
            ...settings,
            focus: value,
        });
    };

    const handleBreakChange = (value: number) => {
        onSettingsChange({
            ...settings,
            break: value,
        });
    };

    const handleLoopsChange = (value: number) => {
        onSettingsChange({
            ...settings,
            loops: value,
        });
    };

    return (
        <div className="grid h-20 grid-cols-3 justify-center gap-3 rounded-xl p-3">
            <div className="flex h-20 flex-col items-center gap-1">
                <h2 className="text-sm font-semibold">Focus</h2>
                <input
                    type="number"
                    name="focus"
                    className="input input-bordered input-sm text-center font-medium"
                    value={settings.focus}
                    onChange={(e) => handleFocusChange(Number(e.target.value))}
                    min="1"
                    disabled={isRunning}
                />
            </div>
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-sm font-semibold">Break</h2>
                <input
                    type="number"
                    name="break"
                    className="input input-bordered input-sm text-center font-medium"
                    value={settings.break}
                    onChange={(e) => handleBreakChange(Number(e.target.value))}
                    min="1"
                    disabled={isRunning}
                />
            </div>
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-sm font-semibold">Loops</h2>
                <input
                    type="number"
                    name="loops"
                    className="input input-bordered input-sm align-center text-center font-medium"
                    value={settings.loops}
                    onChange={(e) => handleLoopsChange(Number(e.target.value))}
                    min="1"
                    disabled={isRunning}
                />
            </div>
        </div>
    );
}

type TimerState = {
    isRunning: boolean;
    isBreaking: boolean;
    remainingSeconds: number;
    currentLoop: number;
    totalLoops: number;
};

type TimerSettingsPanelProps = {
    settings: TimerSettings;
    onSettingsChange: (settings: TimerSettings) => void;
    isRunning: boolean;
    onFocusChange: (minutes: number) => void;
};

type TimerSettings = {
    focus: number;
    break: number;
    loops: number;
};

export default PomodoroTimer;
