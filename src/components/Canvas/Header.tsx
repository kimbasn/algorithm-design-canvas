import { SidebarTrigger } from '@/components/ui/sidebar'
import { useCanvasContext } from '@/context/CanvasContext'
import { ModeToggle } from '@/components/mode-toggle'


const Header = () => {
  const { currentCanvas } = useCanvasContext()

  return (
    <header className="flex h-16 shrink-0 items-center border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex flex-1 items-center justify-between">
        <h1 className="text-lg font-medium text-gray-600 hidden md:block">
          The Algorithm Design Canvas
        </h1>
        <ModeToggle />
        <a
          href='#'
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:text-blue-700"
        >
          {currentCanvas?.problemName || 'Untitled Problem'}
        </a>
      </div>
    </header>
  )
}

export default Header