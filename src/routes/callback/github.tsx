import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/callback/github')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/callback/github"!</div>
}
