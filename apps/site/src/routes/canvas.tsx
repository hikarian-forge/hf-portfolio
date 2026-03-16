import { createFileRoute } from "@tanstack/react-router"
import { InfiniteCanvas } from "@/components/canvas/infinite-canvas"

export const Route = createFileRoute("/canvas")({
  component: InfiniteCanvas,
})
