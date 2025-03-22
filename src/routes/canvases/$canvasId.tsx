import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/canvases/$canvasId')({
  component: RouteComponent,
})

function RouteComponent() {
  const { canvasId } = Route.useParams()

  return (
    <div>
      Hello from {canvasId}!
    </div>)
}
