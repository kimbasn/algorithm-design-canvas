import { useEffect } from 'react'
import { Outlet, createRootRoute, useNavigate } from '@tanstack/react-router'
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from "@vercel/speed-insights/react"

import Header from '../components/Canvas/Header'
import CanvasSidebar from '@/components/Canvas/CanvasSidebar'
import { CanvasProvider, useCanvasContext } from '@/context/CanvasContext'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { ThemeProvider, useTheme } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme='system' storageKey='vite-ui-theme'>
      <CanvasProvider>
        <SidebarProvider>
          <Root />
          {/* <TanStackRouterDevtools /> */}
          <Toaster />
          <Analytics />
          <SpeedInsights />
        </SidebarProvider>
      </CanvasProvider>
    </ThemeProvider>
  ),
})

function Root() {
  const { canvases, createCanvas, getLastEditedCanvas, loading } = useCanvasContext();
  const navigate = useNavigate();
  const { theme } = useTheme();

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

