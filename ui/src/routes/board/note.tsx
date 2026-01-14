import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/board/note')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/board/note"!</div>
}
