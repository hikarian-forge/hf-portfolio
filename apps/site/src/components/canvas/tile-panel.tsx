import { GripHorizontal, Maximize2, Minimize2, X } from "lucide-react"
import { useEffect, useMemo, useRef } from "react"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { cn } from "@/lib/utils"
import { useCanvasStore } from "@/store/canvasStore"
import type { FileContent, FolderChild, OpenPanel } from "@/types/canvas"

interface TilePanelProps {
  panel: OpenPanel
  isActive: boolean
}

const panelVariantClassName: Record<OpenPanel["variant"], string> = {
  default: "rounded-[20px] border-border bg-card",
  minimal: "rounded-[16px] border-border bg-card",
  expanded: "rounded-[24px] border-border bg-card",
  editor: "rounded-[24px] border-border bg-card",
}

const resizeHandleClasses = {
  bottomRight: "-bottom-1 -right-1 h-4 w-4 cursor-se-resize",
  right: "right-0 top-1/2 h-12 w-2 -translate-y-1/2 cursor-e-resize",
  bottom: "bottom-0 left-1/2 h-2 w-12 -translate-x-1/2 cursor-s-resize",
} as const

function MetadataRenderer({ metadata }: { metadata: Record<string, string> }) {
  const entries = Object.entries(metadata)
  if (entries.length === 0) return null

  return (
    <div className="mb-4 rounded-xl border border-border bg-background">
      <div className="border-b border-border px-4 py-2.5">
        <p className="text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">Metadata</p>
      </div>
      <div className="divide-y divide-border">
        {entries.map(([key, value]) => (
          <div className="flex min-h-[36px] items-center gap-4 px-4 py-2" key={key}>
            <span className="min-w-[100px] shrink-0 text-xs font-medium text-muted-foreground">{key}</span>
            <span className="text-sm text-foreground">{value}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function FileContentRenderer({ content }: { content: FileContent }) {
  return (
    <article className="prose prose-invert no-scrollbar h-full max-w-none overflow-auto prose-headings:font-medium prose-p:text-foreground prose-strong:text-foreground prose-li:text-foreground prose-code:text-foreground prose-th:text-foreground prose-td:text-foreground">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content.data}</ReactMarkdown>
    </article>
  )
}

function CollectionContentRenderer({ items, depth }: { items: FolderChild[]; depth: number }) {
  const openFile = useCanvasStore((state) => state.openFile)
  const openFolder = useCanvasStore((state) => state.openFolder)

  if (items.length === 0) {
    return (
      <div className="flex h-full min-h-56 flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-background px-6 text-center">
        <p className="text-lg font-medium text-foreground">Nothing available yet</p>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">
          This folder is empty right now or still under construction.
        </p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
      {items.map((item) => (
        <button
          className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-4 text-center transition hover:border-foreground/20 hover:text-foreground"
          key={item.id}
          onClick={() => {
            if (item.type === "folder") {
              if (depth < 5) {
                openFolder(item.id)
              }
              return
            }

            openFile(item.id)
          }}
          type="button"
        >
          <div className="flex h-12 w-12 items-center justify-center text-foreground">
            {item.type === "folder" ? item.iconOpen ?? item.icon : item.icon}
          </div>
          <div className="min-w-0 w-full">
            <p className="truncate text-[13px] font-medium text-foreground">{item.title}</p>
            <p className="mt-0.5 text-[11px] text-muted-foreground">
              {item.type === "folder" ? `Folder ${Math.min(depth + 1, 5)}/5` : item.fileExtension ?? item.type}
            </p>
          </div>
        </button>
      ))}
    </div>
  )
}

export function TilePanel({ panel, isActive }: TilePanelProps) {
  const closePanel = useCanvasStore((state) => state.closePanel)
  const bringPanelToFront = useCanvasStore((state) => state.bringPanelToFront)
  const updatePanelPosition = useCanvasStore((state) => state.updatePanelPosition)
  const updatePanelBounds = useCanvasStore((state) => state.updatePanelBounds)
  const togglePanelExpanded = useCanvasStore((state) => state.togglePanelExpanded)

  const draggingRef = useRef<{
    originX: number
    originY: number
    startX: number
    startY: number
  } | null>(null)

  const resizingRef = useRef<{
    mode: keyof typeof resizeHandleClasses
    originX: number
    originY: number
    startWidth: number
    startHeight: number
  } | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      if (draggingRef.current) {
        const deltaX = event.clientX - draggingRef.current.originX
        const deltaY = event.clientY - draggingRef.current.originY
        updatePanelPosition(panel.id, draggingRef.current.startX + deltaX, draggingRef.current.startY + deltaY)
      }

      if (resizingRef.current) {
        const deltaX = event.clientX - resizingRef.current.originX
        const deltaY = event.clientY - resizingRef.current.originY

        if (resizingRef.current.mode === "right") {
          updatePanelBounds(panel.id, { width: Math.max(320, resizingRef.current.startWidth + deltaX) })
          return
        }

        if (resizingRef.current.mode === "bottom") {
          updatePanelBounds(panel.id, { height: Math.max(220, resizingRef.current.startHeight + deltaY) })
          return
        }

        updatePanelBounds(panel.id, {
          width: Math.max(320, resizingRef.current.startWidth + deltaX),
          height: Math.max(220, resizingRef.current.startHeight + deltaY),
        })
      }
    }

    const handlePointerUp = () => {
      draggingRef.current = null
      resizingRef.current = null
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [panel.id, updatePanelBounds, updatePanelPosition])

  const panelStyle = useMemo(
    () => ({ left: panel.x, top: panel.y, width: panel.width, height: panel.height, zIndex: panel.zIndex }),
    [panel.height, panel.width, panel.x, panel.y, panel.zIndex],
  )

  const headerHeight = 80

  return (
    <section
      className={cn(
        "pointer-events-auto absolute flex flex-col overflow-hidden border shadow-lg",
        panelVariantClassName[panel.variant],
        isActive && "ring-1 ring-ring",
      )}
      onMouseDown={() => bringPanelToFront(panel.id)}
      style={panelStyle}
    >
      <header
        className="flex shrink-0 cursor-grab items-center justify-between border-b border-border px-4 py-3 active:cursor-grabbing"
        onPointerDown={(event) => {
          draggingRef.current = {
            originX: event.clientX,
            originY: event.clientY,
            startX: panel.x,
            startY: panel.y,
          }
        }}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
            <GripHorizontal className="h-3.5 w-3.5" />
            <span>{panel.sourceType}</span>
            {panel.depth > 0 ? <span>{panel.depth}/5</span> : null}
          </div>
          <h2 className="mt-1 truncate text-base font-medium text-foreground">{panel.title}</h2>
          <p className="mt-0.5 truncate text-xs text-muted-foreground">/{panel.path.join("/")}</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="rounded-full border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground" onClick={() => togglePanelExpanded(panel.id)} type="button">
            {panel.variant === "expanded" ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </button>
          <button className="rounded-full border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground" onClick={() => closePanel(panel.id)} type="button">
            <X className="h-4 w-4" />
          </button>
        </div>
      </header>

      <div className="no-scrollbar flex-1 overflow-auto bg-card p-4">
        {panel.description ? <p className="mb-4 text-sm text-muted-foreground">{panel.description}</p> : null}
        {panel.metadata ? <MetadataRenderer metadata={panel.metadata} /> : null}
        {panel.fileContent ? <FileContentRenderer content={panel.fileContent} /> : null}
        {panel.collectionContents ? <CollectionContentRenderer depth={panel.depth} items={panel.collectionContents} /> : null}
      </div>

      {Object.entries(resizeHandleClasses).map(([mode, className]) => (
        <button
          aria-label={`Resize panel ${mode}`}
          className={cn("absolute rounded-full bg-transparent", className)}
          key={mode}
          onPointerDown={(event) => {
            event.stopPropagation()
            resizingRef.current = {
              mode: mode as keyof typeof resizeHandleClasses,
              originX: event.clientX,
              originY: event.clientY,
              startWidth: panel.width,
              startHeight: panel.height,
            }
          }}
          type="button"
        />
      ))}
    </section>
  )
}
