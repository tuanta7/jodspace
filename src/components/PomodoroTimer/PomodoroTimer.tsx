import { useCallback, useEffect, useRef, useState } from 'react';
import { TimerDisplay } from './TimerDisplay.tsx';
import { TimerControls } from './TimerControls.tsx';
import { TimerSettingsPanel } from './TimerSettingsPanel.tsx';
import { TimerSettings, TimerState } from './types.ts';

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

    return (
        <div className="flex flex-col  rounded-xl p-4 gap-4">
            <progress
                className="progress"
                value={timerState.remainingSeconds}
                max={timerState.isBreaking ? settings.break * 60 : settings.focus * 60}
            />
            <div className="flex items-center justify-between gap-4">
                <div className="text-7xl font-semibold">
                    <TimerDisplay remainingSeconds={timerState.remainingSeconds} />
                </div>
                <TimerControls isRunning={timerState.isRunning} onToggle={handleCountdown} onAddTime={handleAddTime} />
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

export default PomodoroTimer;
