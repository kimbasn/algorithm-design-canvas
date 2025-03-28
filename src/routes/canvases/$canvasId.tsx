import { createFileRoute } from '@tanstack/react-router'

import Canvas from '@/components/Canvas/Canvas'


export const Route = createFileRoute('/canvases/$canvasId')({
  component: RouteComponent,
})

function RouteComponent() {

  return (
    <Canvas />
  )
}
