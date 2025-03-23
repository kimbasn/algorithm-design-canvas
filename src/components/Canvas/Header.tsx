import { SidebarTrigger } from '@/components/ui/sidebar'
import { useCanvasContext } from '@/context/CanvasContext'
import { ModeToggle } from '@/components/mode-toggle'
import { Button } from '../ui/button'


const Header = () => {
  const { currentCanvas } = useCanvasContext()

  return (
  //   .top - bar {
  //   height: 60px;
  //   background - color: white;
  //   border - bottom: 1px solid #e5e7eb;
  //   display: flex;
  //   align - items: center;
  //   padding: 0 20px;
  //   justify - content: space - between;
  // }
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
      <div>
        <ModeToggle />
      </div>

      <div className="flex items-center space-x-2">
        <Button className='bg-slate-700 text-white border-2 cursor-pointer'>
          <i className="fas fa-share-alt mr-2"></i> Share
        </Button>
        <Button className="bg-blue-500 text-white border-2 cursor-pointer">
          <i className="fas fa-save mr-2"></i> Save
        </Button>
      </div>
    </header>
  )
}

export default Header