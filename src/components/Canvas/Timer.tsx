import { useState, useEffect } from 'react';

const DEFAULT_TIME_MINUTES = 30;
const DEFAULT_TIME = DEFAULT_TIME_MINUTES * 60 * 1000; // 30 minutes in milliseconds

function Timer() {
    const [time, setTime] = useState(DEFAULT_TIME); // Current timer value
    const [initialTime, setInitialTime] = useState(DEFAULT_TIME); // Time displayed before start
    const [isRunning, setIsRunning] = useState(false);
    const [inputTimeMinutes, setInputTimeMinutes] = useState(DEFAULT_TIME_MINUTES);
    const [showInput, setShowInput] = useState(false);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (isRunning) {
            intervalId = setInterval(() => {
                setTime(prevTime => prevTime - 1000); // Decrement by 1 second intervals
            }, 1000); // Update every second
        }

        return () => clearInterval(intervalId);
    }, [isRunning]);

    const handleStart = () => {
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTime(initialTime); // Reset to the initially set time
    };

    const handleTimeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputTimeMinutes(Number(e.target.value));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
        if (e.key === 'Enter') {
            handleTimeSubmit();
        }
    };

    const handleTimeSubmit = () => {
        const newTimeMinutes = inputTimeMinutes;
        if (!isNaN(newTimeMinutes) && newTimeMinutes >= 0) {
            const newTimeMilliseconds = newTimeMinutes * 60 * 1000;
            setTime(newTimeMilliseconds);
            setInitialTime(newTimeMilliseconds); // Store the initial time
            setShowInput(false);
        }
    };

    // Format time to display, handling negative values
    const formatTime = (timeToFormat: number) => {
        const isNegative = timeToFormat < 0;
        const absTime = Math.abs(timeToFormat);

        const hours = Math.floor(absTime / (60 * 60 * 1000));
        const minutes = Math.floor((absTime / 60000) % 60);
        const seconds = Math.floor((absTime / 1000) % 60);

        let formattedTime = "";
        if (hours > 0) {
            formattedTime += `${hours.toString().padStart(2, '0')}:`;
        }
        formattedTime += `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return `${isNegative ? '-' : ''}${formattedTime}`;
    };

    return (
        <div className="flex items-center space-x-2 text-sm font-mono w-fit">
            {showInput ? (
                <>
                    <input
                        type="number"
                        value={inputTimeMinutes}
                        onChange={handleTimeInputChange}
                        className="w-20 px-1 text-center border border-gray-300 rounded"
                        min="0"
                    />
                    <span className="text-gray-500">min</span>
                    <button
                        onClick={handleTimeSubmit}
                        onKeyDown={handleKeyDown} 
                        className="text-green-600 hover:text-green-800"
                    >
                        <i className="fas fa-check mr-2"></i>
                    </button>
                </>
            ) : (
                <>
                    <div
                        className="text-xl font-mono cursor-pointer"
                        onClick={() => !isRunning && setShowInput(true)}
                        title="Click to set time (in minutes)"
                    >
                        {formatTime(time)}
                    </div>
                    <div className="flex space-x-1">
                        {!isRunning ? (
                            <button
                                onClick={handleStart}
                                className="text-green-600 hover:text-green-800"
                                aria-label="Start"
                            >
                                <i className="fas fa-play mr-2"></i>
                            </button>
                        ) : (
                            <button
                                onClick={handlePause}
                                className="text-red-600 hover:text-red-800"
                                aria-label="Stop"
                            >
                                <i className="fas fa-pause mr-2"></i>
                            </button>
                        )}
                        <button
                            onClick={handleReset}
                            className="text-blue-600 hover:text-blue-800"
                            aria-label="Reset"
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