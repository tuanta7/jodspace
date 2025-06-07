import { useCallback, useEffect, useRef, useState } from 'react';

import Button from './Button.tsx';
import { PauseCircleIcon, PlayIcon, ClockIcon } from '@heroicons/react/24/outline';

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
        <div className="flex flex-col p-4 gap-4 rounded-xl">
            <progress
                className="progress"
                value={timerState.remainingSeconds}
                max={timerState.isBreaking ? settings.break * 60 : settings.focus * 60}
            />
            <div className="flex items-center justify-between gap-4">
                <div className="text-6xl font-semibold">{timeDisplay(timerState.remainingSeconds)}</div>
                <div className="flex flex-col justify-between gap-3">
                    <Button className="btn btn-sm" onClick={handleAddTime}>
                        + 5 min
                    </Button>
                    <Button className="btn btn-sm" onClick={handleCountdown}>
                        {timerState.isRunning ? (
                            <PauseCircleIcon className="w-4 h-4" />
                        ) : (
                            <PlayIcon className="w-4 h-4" />
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
        <div className="collapse bg-base-200">
            <input type="checkbox" />
            <div className="collapse-title flex items-center gap-2">
                <ClockIcon className="w-4 h-4" />
                <span className="text-sm font-semibold">Settings</span>
            </div>
            <div className="collapse-content flex flex-col gap-3">
                <div className="flex items-center justify-between gap-6">
                    <span className="font-semibold text-sm">Focus</span>
                    <div className="grid grid-cols-3 gap-3">
                        <MinutesSelector
                            setSelected={(val) => {
                                onSettingsChange({ ...settings, focus: val });
                                onFocusChange(val);
                            }}
                            minutes={[25, 30, 35]}
                            disabled={isRunning}
                            selected={settings.focus}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-between gap-6">
                    <span className="font-semibold text-sm">Break</span>
                    <div className="grid grid-cols-3 gap-3">
                        <MinutesSelector
                            setSelected={(val) => onSettingsChange({ ...settings, break: val })}
                            minutes={[5, 10, 15]}
                            disabled={isRunning}
                            selected={settings.break}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

function MinutesSelector({ setSelected, minutes, disabled, selected }: MinutesSelectorProps) {
    return minutes.map((m) => (
        <Button
            key={m}
            className={`btn btn-sm border border-neutral-700 w-16 ${
                m === selected ? 'bg-primary text-primary-content' : ''
            }`}
            onClick={() => setSelected(m)}
            disabled={disabled}
        >
            {m + ':00'}
        </Button>
    ));
}

type TimerState = {
    isRunning: boolean;
    isBreaking: boolean;
    remainingSeconds: number;
};

type MinutesSelectorProps = {
    setSelected: (selector: number) => void;
    minutes: number[];
    disabled: boolean;
    selected: number;
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
