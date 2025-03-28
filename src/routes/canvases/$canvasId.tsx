import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useCanvasContext } from '@/context/CanvasContext'
import Canvas from '@/components/Canvas/Canvas'

export const Route = createFileRoute('/canvases/$canvasId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { canvasId } = Route.useParams()
  const { getCanvas, getLastEditedCanvas, createCanvas } = useCanvasContext()
  const navigate = useNavigate()

  useEffect(() => {
    const checkCanvas = async () => {
      const canvas = await getCanvas(canvasId)
      if (!canvas) {
        // If canvas doesn't exist, handle like root route
        const lastEditedCanvas = await getLastEditedCanvas()
        if (lastEditedCanvas) {
          navigate({ to: `/canvases/${lastEditedCanvas.canvasId}` })
        } else {
          const newCanvas = await createCanvas({
            problemName: 'New Canvas',
            problemUrl: ''
          })
          navigate({ to: `/canvases/${newCanvas.canvasId}` })
        }
      }
    }

    checkCanvas()
  }, [canvasId])

  return <Canvas />
}
