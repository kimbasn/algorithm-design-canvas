import { useState, useEffect } from 'react';

const DEFAULT_TIME_MINUTES = 30;
const DEFAULT_TIME = DEFAULT_TIME_MINUTES * 60 * 1000;

function Timer() {
    const [time, setTime] = useState(DEFAULT_TIME);
    const [initialTime, setInitialTime] = useState(DEFAULT_TIME);
    const [isRunning, setIsRunning] = useState(false);
    const [showInput, setShowInput] = useState(false);
    const [inputTime, setInputTime] = useState('00:30:00'); // HH:MM:SS format

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isRunning) {
            intervalId = setInterval(() => {
                setTime(prevTime => prevTime - 1000);
            }, 1000);
        }

        return () => clearInterval(intervalId);
    }, [isRunning]);

    const handleStart = () => setIsRunning(true);
    const handlePause = () => setIsRunning(false);
    const handleReset = () => {
        setIsRunning(false);
        setTime(initialTime);
    };

    const parseTimeInput = (str: string): number => {
        const parts = str.split(':').map(part => Number(part.trim()));

        if (parts.some(isNaN)) return NaN;

        let hours = 0, minutes = 0, seconds = 0;

        if (parts.length === 3) {
            [hours, minutes, seconds] = parts;
        } else if (parts.length === 2) {
            [minutes, seconds] = parts;
        } else if (parts.length === 1) {
            [seconds] = parts;
        }

        return ((hours * 3600) + (minutes * 60) + seconds) * 1000;
    };

    const handleTimeSubmit = () => {
        const newTimeMilliseconds = parseTimeInput(inputTime);
        if (!isNaN(newTimeMilliseconds) && newTimeMilliseconds >= 0) {
            setTime(newTimeMilliseconds);
            setInitialTime(newTimeMilliseconds);
            setShowInput(false);
        }
    };

    const formatTime = (ms: number) => {
        const isNegative = ms < 0;
        const absTime = Math.abs(ms);

        const hours = Math.floor(absTime / 3600000);
        const minutes = Math.floor((absTime % 3600000) / 60000);
        const seconds = Math.floor((absTime % 60000) / 1000);

        const parts = [
            hours > 0 ? hours.toString().padStart(2, '0') : null,
            minutes.toString().padStart(2, '0'),
            seconds.toString().padStart(2, '0')
        ].filter(Boolean);

        return `${isNegative ? '-' : ''}${parts.join(':')}`;
    };

    return (
        <div className="flex items-center space-x-2 text-sm font-mono w-fit">
            {showInput ? (
                <>
                    <input
                        type="text"
                        value={inputTime}
                        onChange={e => setInputTime(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleTimeSubmit()}
                        className="w-32 px-1 text-center border border-gray-300 rounded"
                        placeholder="hh:mm:ss or mm:ss"
                    />
                    <button
                        onClick={handleTimeSubmit}
                        className="text-green-600 hover:text-green-800"
                    >
                        <i className="fas fa-check mr-1"></i>
                    </button>
                </>
            ) : (
                <>
                    <div
                        className="text-xl font-mono cursor-pointer"
                        onClick={() => !isRunning && setShowInput(true)}
                        title="Click to set time"
                    >
                        {formatTime(time)}
                    </div>
                    <div className="flex space-x-1">
                        {!isRunning ? (
                            <button
                                onClick={handleStart}
                                className="text-green-600 hover:text-green-800"
                            >
                                <i className="fas fa-play mr-2"></i>
                            </button>
                        ) : (
                            <button
                                onClick={handlePause}
                                className="text-red-600 hover:text-red-800"
                            >
                                <i className="fas fa-pause mr-2"></i>
                            </button>
                        )}
                        <button
                            onClick={handleReset}
                            className="text-blue-600 hover:text-blue-800"
                        >
                            <i className="fas fa-stop mr-2"></i>
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Timer;