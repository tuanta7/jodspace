import { ClockIcon } from '@heroicons/react/24/outline';
import { MinutesSelector } from './MinutesSelector.tsx';
import { TimerSettingsPanelProps } from './types.ts';

export function TimerSettingsPanel({ settings, onSettingsChange, isRunning, onFocusChange }: TimerSettingsPanelProps) {
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
