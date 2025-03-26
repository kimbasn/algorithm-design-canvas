import { SidebarTrigger } from '@/components/ui/sidebar'
import { useCanvasContext } from '@/context/CanvasContext'
import { ExportCanvas } from './ExportCanvas'
import { ImportCanvas } from '@/components/Canvas/ImportCanvas';
import { ModeToggle } from '../mode-toggle';

const Header = () => {
  const { currentCanvas } = useCanvasContext()

  return (
    <header className="flex items-center justify-between border-b p-4 h-14 flex-shrink-0">
      <div className="flex items-center">
        <SidebarTrigger className="-ml-1" />
        <a
          href={`${currentCanvas?.problemUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          {currentCanvas?.problemName}
        </a>
      </div>
      <ModeToggle />
      <div className="flex items-center space-x-2">
        <ImportCanvas />
        <ExportCanvas />
      </div>
    </header>
  )
}

export default Header