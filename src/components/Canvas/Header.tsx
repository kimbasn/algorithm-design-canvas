import { SidebarTrigger } from '@/components/ui/sidebar'
import { useCanvasContext } from '@/context/CanvasContext'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '../ui/button'
import { Clock, Pause, RotateCcw, Play } from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

const Header = () => {
  const { currentCanvas } = useCanvasContext()
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRunning) {
      interval = setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTime(0);
    setIsRunning(false);
  };

  return (
    <header className="flex items-center justify-between border-b p-4 h-14">
      <div className="flex items-center">
        <SidebarTrigger className="-ml-1" />
        <a
          href={`${currentCanvas?.problemUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          {currentCanvas?.problemName || 'Untitled Problem'}
        </a>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-gray-900 dark:text-gray-100">
            {formatTime(time)}
          </span>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTimer}
            className={cn(
              "h-8 w-8",
              "hover:bg-gray-200/50 dark:hover:bg-gray-600/50",
              isRunning ? "text-blue-500 dark:text-blue-400" : "text-gray-500 dark:text-gray-400",
              "transition-colors duration-200"
            )}
          >
            {isRunning ? (
              <Pause className="h-4 w-4" />
            ) : (
              <Play className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={resetTimer}
            className={cn(
              "h-8 w-8",
              "hover:bg-gray-200/50 dark:hover:bg-gray-600/50",
              "text-gray-500 dark:text-gray-400",
              "transition-colors duration-200"
            )}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
        <ModeToggle />
      </div>

      <div className="flex items-center space-x-2">
        <Button className='bg-slate-700 text-white border-2 cursor-pointer'>
          <i className="fas fa-share-alt mr-2"></i> Share
        </Button>
        <Button className="bg-blue-500 text-white border-2 cursor-pointer">
          <i className="fas fa-save mr-2"></i> Export
        </Button>
      </div>
    </header>
  )
}

export default Header