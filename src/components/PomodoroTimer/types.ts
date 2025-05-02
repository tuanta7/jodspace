export type TimerSettings = {
    focus: number;
    break: number;
};

export type TimerState = {
    isRunning: boolean;
    isBreaking: boolean;
    remainingSeconds: number;
};

export type MinutesSelectorProps = {
    setSelected: (selector: number) => void;
    minutes: number[];
    disabled: boolean;
    selected: number;
};

export type TimerSettingsPanelProps = {
    settings: TimerSettings;
    onSettingsChange: (settings: TimerSettings) => void;
    isRunning: boolean;
    onFocusChange: (minutes: number) => void;
};

export type TimerControlsProps = {
    isRunning: boolean;
    onToggle: () => void;
    onAddTime: () => void;
};

export type TimerDisplayProps = {
    remainingSeconds: number;
};
