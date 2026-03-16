import type { PointerEvent } from "react"
import { cn } from "@/lib/utils"
import type { FileTile } from "@/types/canvas"

interface CanvasWidgetProps {
  file: FileTile
  isSelected: boolean
  onClick: () => void
  onPointerDown: (event: PointerEvent<HTMLElement>) => void
}

export function CanvasWidget({ file, isSelected, onClick, onPointerDown }: CanvasWidgetProps) {
  switch (file.content.type) {
    case "image":
      return (
        <article
          className={cn(
            "absolute overflow-hidden rounded-[18px] border border-border bg-card shadow-sm",
            isSelected && "ring-1 ring-ring",
          )}
          onClick={onClick}
          onPointerDown={onPointerDown}
          style={{ left: file.x, top: file.y, width: file.width, height: file.height }}
        >
          <img alt={file.content.alt ?? file.title} className="h-full w-full object-cover" src={file.content.url} />
        </article>
      )
    case "video":
      return (
        <article
          className={cn(
            "absolute overflow-hidden rounded-[18px] border border-border bg-card shadow-sm",
            isSelected && "ring-1 ring-ring",
          )}
          onClick={onClick}
          onPointerDown={onPointerDown}
          style={{ left: file.x, top: file.y, width: file.width, height: file.height }}
        >
          <video className="h-full w-full object-cover" controls muted src={file.content.url} />
        </article>
      )
    case "audio":
      return (
        <article
          className={cn(
            "absolute rounded-[18px] border border-border bg-card p-4 shadow-sm",
            isSelected && "ring-1 ring-ring",
          )}
          onClick={onClick}
          onPointerDown={onPointerDown}
          style={{ left: file.x, top: file.y, width: file.width, minHeight: file.height }}
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border bg-background text-lg text-foreground">♪</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-foreground">{file.content.title}</p>
              <p className="truncate text-xs text-muted-foreground">{file.content.artist ?? file.title}</p>
            </div>
          </div>
          <audio className="w-full" controls src={file.content.src} />
        </article>
      )
    case "embed": {
      const Component = file.content.component
      return (
        <article
          className={cn(
            "absolute rounded-[18px] border border-border bg-card p-4 shadow-sm",
            isSelected && "ring-1 ring-ring",
          )}
          onClick={onClick}
          onPointerDown={onPointerDown}
          style={{ left: file.x, top: file.y, width: file.width, minHeight: file.height }}
        >
          <Component {...(file.content.props ?? {})} />
        </article>
      )
    }
    default:
      return null
  }
}
