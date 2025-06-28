import { useCallback, useEffect, useRef, useState } from 'react';

import Button from './Button.tsx';
import { PauseCircleIcon, PlayIcon } from '@heroicons/react/24/outline';

function PomodoroTimer() {
    const intervalID = useRef<ReturnType<typeof setInterval>>();

    const [settings, setSettings] = useState<TimerSettings>({
        focus: 25,
        break: 5,
    });

    const [timerState, setTimerState] = useState<TimerState>({
        isRunning: false,
        isBreaking: false,
        remainingSeconds: 25 * 60,
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
                        return {
                            ...prev,
                            isBreaking: false,
                            remainingSeconds: settings.focus * 60,
                        };
                    }
                    return {
                        ...prev,
                        isBreaking: true,
                        remainingSeconds: settings.break * 60,
                    };
                }
                return {
                    ...prev,
                    remainingSeconds: prev.remainingSeconds - 1,
                };
            });
        }, 1000);
    }, [settings]);

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
        <div className="flex w-full flex-col gap-3 p-3">
            <progress
                className="progress"
                value={timerState.remainingSeconds}
                max={timerState.isBreaking ? settings.break * 60 : settings.focus * 60}
            />
            <div className="flex items-center justify-between gap-3 px-2">
                <div className="text-4xl font-semibold lg:text-5xl">{timeDisplay(timerState.remainingSeconds)}</div>
                <div className="flex justify-between gap-3">
                    <Button className="btn btn-sm" onClick={handleAddTime}>
                        + 5 min
                    </Button>
                    <Button className="btn btn-sm" onClick={handleCountdown}>
                        {timerState.isRunning ? (
                            <PauseCircleIcon className="h-4 w-4" />
                        ) : (
                            <PlayIcon className="h-4 w-4" />
                        )}
                    </Button>
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
    return (
        <div className="grid h-20 grid-cols-3 justify-center gap-3 rounded-xl p-3">
            <div className="flex h-20 flex-col items-center gap-1">
                <h2 className="text-sm font-semibold">Focus</h2>
                <input
                    type="number"
                    name="focus"
                    className="input input-bordered input-sm text-center"
                    value={settings.focus}
                    onChange={(e) => {
                        const m = Number(e.target.value);
                        onFocusChange(m);
                        onSettingsChange({
                            ...settings,
                            focus: m,
                        });
                    }}
                    min="1"
                    disabled={isRunning}
                />
            </div>
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-sm font-semibold">Break </h2>
                <input
                    type="number"
                    name="shortBreak"
                    className="input input-bordered input-sm text-center"
                    value={settings.break}
                    min="1"
                    disabled={isRunning}
                />
            </div>
            <div className="flex flex-col items-center gap-1">
                <h2 className="text-sm font-semibold">Loops</h2>
                <input
                    type="number"
                    name="loops"
                    className="input input-bordered input-sm align-center text-center"
                    value={4}
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
};

export default PomodoroTimer;
