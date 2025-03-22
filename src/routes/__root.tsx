import { useEffect } from 'react'
import { Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import Header from '../components/Canvas/Header'
import CanvasSidebar from '@/components/Canvas/CanvasSidebar'
import { CanvasProvider, useCanvasContext } from '@/context/CanvasContext'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider } from '@/components/theme-provider'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <CanvasProvider>
        <SidebarProvider>
          <Root />
          <TanStackRouterDevtools />
        </SidebarProvider>
      </CanvasProvider>
    </ThemeProvider>
  ),
})


function Root() {
  const { canvases, createCanvas, getLastEditedCanvas, loading } = useCanvasContext();
  const navigate = useNavigate();

  useEffect(() => {
    const initializeCanvas = async () => {
      if (loading) return; // Wait for initial load to complete

      if (canvases.length === 0) {
        // If no canvases exist, create a new one
        const newCanvas = await createCanvas({
          problemName: 'Untitled Canvas',
          problemUrl: '',
        });
        navigate({ to: `/canvases/${newCanvas.canvasId}` });
      } else {
        // If canvases exist, get the last edited one
        const lastEditedCanvas = await getLastEditedCanvas();
        if (lastEditedCanvas) {
          navigate({ to: `/canvases/${lastEditedCanvas.canvasId}` });
        } else {
          // If no last edited canvas, use the first one
          navigate({ to: `/canvases/${canvases[0].canvasId}` });
        }
      }
    };

    initializeCanvas();
  }, [canvases, createCanvas, getLastEditedCanvas, navigate, loading]);

  return (
    <>
      <CanvasSidebar />
      <SidebarInset>
        <Header />
        <Outlet />
      </SidebarInset>
    </>
  )
}

