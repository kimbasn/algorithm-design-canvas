import { useEffect, useRef } from 'react'
import { Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"

import Header from '../components/Canvas/Header'
import CanvasSidebar from '@/components/Canvas/CanvasSidebar'
import { CanvasProvider, useCanvasContext } from '@/context/CanvasContext'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider, useTheme } from '@/components/theme-provider'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <CanvasProvider>
        <SidebarProvider>
          <TooltipProvider>
            <Root />
            {/* <TanStackRouterDevtools /> */}
            <Toaster />
            <Analytics />
            <SpeedInsights />
          </TooltipProvider>
        </SidebarProvider>
      </CanvasProvider>
    </ThemeProvider>
  ),
})

function Root() {
  const { canvases, currentCanvas, createCanvas, getLastEditedCanvas, loading } = useCanvasContext();
  const navigate = useNavigate();
  const { theme } = useTheme();
  const initialized = useRef(false);

  // Handle initial load and empty state
  useEffect(() => {
    const initializeCanvas = async () => {
      if (loading || initialized.current) return;
      initialized.current = true;

      const lastEditedCanvas = await getLastEditedCanvas();
      if (lastEditedCanvas) {
        navigate({ to: `/canvases/${lastEditedCanvas.canvasId}` });
      } else if (canvases.length === 0) {
        const newCanvas = await createCanvas({
          problemName: 'New Canvas',
          problemUrl: ''
        });
        navigate({ to: `/canvases/${newCanvas.canvasId}` });
      }
    };

    initializeCanvas();
  }, [loading]);

  // Handle navigation when current canvas changes
  useEffect(() => {
    if (!loading && initialized.current) {
      if (!currentCanvas && canvases.length > 0) {
        // If current canvas is cleared but we have canvases, navigate to the last edited
        getLastEditedCanvas().then(lastEdited => {
          if (lastEdited) {
            navigate({ to: `/canvases/${lastEdited.canvasId}` });
          }
        });
      } else if (!currentCanvas && canvases.length === 0) {
        // If no canvases exist, create a new one
        createCanvas({
          problemName: 'New Canvas',
          problemUrl: ''
        }).then(newCanvas => {
          navigate({ to: `/canvases/${newCanvas.canvasId}` });
        });
      }
    }
  }, [currentCanvas, canvases.length, loading]);

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches ? "dark" : "light"
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      <CanvasSidebar />
      <SidebarInset className="flex flex-col flex-1 overflow-hidden">
        <Header />
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </div>
  )
}

