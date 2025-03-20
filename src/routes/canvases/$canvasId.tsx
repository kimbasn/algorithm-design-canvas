import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/canvases/$canvasId')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/canvases/$canvasId"!</div>
}
