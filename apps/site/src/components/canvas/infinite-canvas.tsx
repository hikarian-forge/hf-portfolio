import { ChevronDown, ChevronUp, Hand, ZoomIn, ZoomOut } from "lucide-react"
import { useEffect, useMemo, useRef, useState } from "react"
import { CanvasGrid } from "@/components/canvas/canvas-grid"
import { FileTile as FileTileComponent } from "@/components/canvas/file-tile"
import { FolderTile as FolderTileComponent } from "@/components/canvas/folder-tile"
import { TilePanel } from "@/components/canvas/tile-panel"
import { useCanvasStore } from "@/store/canvasStore"
import type { CanvasItem, FileTile, FolderTile } from "@/types/canvas"

class InfiniteCanvasController {
  scale = 1
  offsetX = 0
  offsetY = 0

  toVirtualX(xReal: number) {
    return (xReal - this.offsetX) / this.scale
  }

  toVirtualY(yReal: number) {
    return (yReal - this.offsetY) / this.scale
  }

  zoomAtPoint(amount: number, screenX: number, screenY: number) {
    const previousScale = this.scale
    const nextScale = Math.min(2.4, Math.max(0.45, previousScale * amount))
    const worldX = (screenX - this.offsetX) / previousScale
    const worldY = (screenY - this.offsetY) / previousScale

    this.scale = nextScale
    this.offsetX = screenX - worldX * nextScale
    this.offsetY = screenY - worldY * nextScale
  }
}

type InteractionState =
  | { mode: "idle" }
  | { mode: "pan"; pointerX: number; pointerY: number; originX: number; originY: number }
  | { mode: "move-item"; pointerX: number; pointerY: number; itemId: string; originX: number; originY: number }

const ZOOM_STEP = 1.12
const keyboardShortcutGroups = [
  [
    ["Ctrl/Cmd +=", "Zoom in"],
    ["Ctrl/Cmd -", "Zoom out"],
    ["Ctrl/Cmd 0", "Reset viewport"],
  ],
  [
    ["Esc", "Close panel / clear selection"],
    ["Backspace", "Open parent folder"],
  ],
  [
    ["H / J / K / L", "Pan canvas left / down / up / right"],
    ["Mouse drag", "Pan or move items"],
  ],
]

export function InfiniteCanvas() {
  const animationFrameRef = useRef<number | null>(null)
  const controllerRef = useRef(new InfiniteCanvasController())
  const targetRef = useRef({ scale: 1, offsetX: 0, offsetY: 0 })
  const interactionRef = useRef<InteractionState>({ mode: "idle" })
  const [viewportSize, setViewportSize] = useState({ width: 1280, height: 720 })
  const [showCanvasInfo, setShowCanvasInfo] = useState(true)
  const [showKeybinds, setShowKeybinds] = useState(true)

  const scale = useCanvasStore((state) => state.scale)
  const offsetX = useCanvasStore((state) => state.offsetX)
  const offsetY = useCanvasStore((state) => state.offsetY)
  const files = useCanvasStore((state) => state.files)
  const folders = useCanvasStore((state) => state.folders)
  const openPanels = useCanvasStore((state) => state.openPanels)
  const activePanelId = useCanvasStore((state) => state.activePanelId)
  const selectedItemId = useCanvasStore((state) => state.selectedItemId)
  const setViewport = useCanvasStore((state) => state.setViewport)
  const updateItemPosition = useCanvasStore((state) => state.updateItemPosition)
  const selectItem = useCanvasStore((state) => state.selectItem)
  const openFile = useCanvasStore((state) => state.openFile)
  const openFolder = useCanvasStore((state) => state.openFolder)
  const closePanel = useCanvasStore((state) => state.closePanel)

  useEffect(() => {
    controllerRef.current.scale = scale
    controllerRef.current.offsetX = offsetX
    controllerRef.current.offsetY = offsetY
    targetRef.current = { scale, offsetX, offsetY }
  }, [offsetX, offsetY, scale])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const syncViewportSize = () => {
      setViewportSize({ width: window.innerWidth, height: window.innerHeight })
    }

    syncViewportSize()
    window.addEventListener("resize", syncViewportSize)

    return () => {
      window.removeEventListener("resize", syncViewportSize)
    }
  }, [])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const animate = () => {
      const controller = controllerRef.current
      const target = targetRef.current
      const smoothing = 0.18

      controller.scale += (target.scale - controller.scale) * smoothing
      controller.offsetX += (target.offsetX - controller.offsetX) * smoothing
      controller.offsetY += (target.offsetY - controller.offsetY) * smoothing

      const scaleSettled = Math.abs(target.scale - controller.scale) < 0.001
      const xSettled = Math.abs(target.offsetX - controller.offsetX) < 0.4
      const ySettled = Math.abs(target.offsetY - controller.offsetY) < 0.4

      if (scaleSettled && xSettled && ySettled) {
        controller.scale = target.scale
        controller.offsetX = target.offsetX
        controller.offsetY = target.offsetY
      }

      setViewport({
        scale: controller.scale,
        offsetX: controller.offsetX,
        offsetY: controller.offsetY,
      })

      animationFrameRef.current = window.requestAnimationFrame(animate)
    }

    animationFrameRef.current = window.requestAnimationFrame(animate)

    return () => {
      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [setViewport])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handlePointerMove = (event: PointerEvent) => {
      const interaction = interactionRef.current

      if (interaction.mode === "pan") {
        targetRef.current = {
          ...targetRef.current,
          offsetX: interaction.originX + (event.clientX - interaction.pointerX),
          offsetY: interaction.originY + (event.clientY - interaction.pointerY),
        }
        return
      }

      if (interaction.mode === "move-item") {
        const deltaX = (event.clientX - interaction.pointerX) / controllerRef.current.scale
        const deltaY = (event.clientY - interaction.pointerY) / controllerRef.current.scale
        updateItemPosition(interaction.itemId, interaction.originX + deltaX, interaction.originY + deltaY)
      }
    }

    const handlePointerUp = () => {
      interactionRef.current = { mode: "idle" }
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", handlePointerUp)

    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [updateItemPosition])

  useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const activeTag = (document.activeElement as HTMLElement | null)?.tagName
      if (activeTag === "INPUT" || activeTag === "TEXTAREA") {
        return
      }

      const centerX = viewportSize.width / 2
      const centerY = viewportSize.height / 2

      if ((event.metaKey || event.ctrlKey) && event.key === "=") {
        event.preventDefault()
        controllerRef.current.scale = scale
        controllerRef.current.offsetX = offsetX
        controllerRef.current.offsetY = offsetY
        controllerRef.current.zoomAtPoint(ZOOM_STEP, centerX, centerY)
        targetRef.current = {
          scale: controllerRef.current.scale,
          offsetX: controllerRef.current.offsetX,
          offsetY: controllerRef.current.offsetY,
        }
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key === "-") {
        event.preventDefault()
        controllerRef.current.scale = scale
        controllerRef.current.offsetX = offsetX
        controllerRef.current.offsetY = offsetY
        controllerRef.current.zoomAtPoint(1 / ZOOM_STEP, centerX, centerY)
        targetRef.current = {
          scale: controllerRef.current.scale,
          offsetX: controllerRef.current.offsetX,
          offsetY: controllerRef.current.offsetY,
        }
        return
      }

      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "0") {
        event.preventDefault()
        targetRef.current = { scale: 1, offsetX: 220, offsetY: 140 }
        return
      }

      if (event.key === "Escape") {
        closePanel()
        selectItem(null)
        return
      }

      if (event.key === "Backspace") {
        const activePanel = openPanels.find((panel) => panel.id === activePanelId)
        if (activePanel?.parentId) {
          event.preventDefault()
          openFolder(activePanel.parentId)
        }
        return
      }

      if (event.key.toLowerCase() === "h") {
        targetRef.current = {
          ...targetRef.current,
          offsetX: targetRef.current.offsetX + 80,
        }
      }

      if (event.key.toLowerCase() === "l") {
        targetRef.current = {
          ...targetRef.current,
          offsetX: targetRef.current.offsetX - 80,
        }
      }

      if (event.key.toLowerCase() === "k") {
        targetRef.current = {
          ...targetRef.current,
          offsetY: targetRef.current.offsetY + 80,
        }
      }

      if (event.key.toLowerCase() === "j") {
        targetRef.current = {
          ...targetRef.current,
          offsetY: targetRef.current.offsetY - 80,
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [activePanelId, closePanel, offsetX, offsetY, openFolder, openPanels, scale, selectItem, viewportSize.height, viewportSize.width])

  const items = useMemo<CanvasItem[]>(() => [...files, ...folders], [files, folders])

  const beginItemMove = (item: CanvasItem, clientX: number, clientY: number) => {
    interactionRef.current = {
      mode: "move-item",
      pointerX: clientX,
      pointerY: clientY,
      itemId: item.id,
      originX: item.x,
      originY: item.y,
    }
  }

  const centerX = Math.round(controllerRef.current.toVirtualX(viewportSize.width / 2))
  const centerY = Math.round(controllerRef.current.toVirtualY(viewportSize.height / 2))

  return (
    <main className="relative h-screen overflow-hidden bg-background text-foreground">
      <CanvasGrid />

      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex items-start justify-between p-5">
        <div className="pointer-events-auto flex max-w-[420px] flex-col gap-3">
          <div className="rounded-[18px] border border-border bg-card shadow-sm">
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              onClick={() => setShowCanvasInfo((value) => !value)}
              type="button"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <Hand className="h-3.5 w-3.5" /> Canvas
              </div>
              {showCanvasInfo ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {showCanvasInfo ? (
              <div className="px-4 pb-3 text-sm text-foreground">
                <div className="flex items-center gap-2">
                  <span>{Math.round(scale * 100)}%</span>
                  <span className="text-muted-foreground">/</span>
                  <span>{centerX}, {centerY}</span>
                </div>
              </div>
            ) : null}
          </div>

          <div className="rounded-[18px] border border-border bg-card shadow-sm">
            <button
              className="flex w-full items-center justify-between px-4 py-3 text-left"
              onClick={() => setShowKeybinds((value) => !value)}
              type="button"
            >
              <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Common Controls</p>
              {showKeybinds ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
            </button>
            {showKeybinds ? (
              <div className="px-4 pb-4">
                <div className="space-y-3">
                  {keyboardShortcutGroups.map((group, groupIndex) => (
                    <div className="space-y-2" key={`group-${groupIndex}`}>
                      {group.map(([keys, description]) => (
                        <div className="flex items-start justify-between gap-4 text-sm" key={keys}>
                          <span className="rounded-md bg-background px-2 py-1 font-mono text-xs text-foreground">{keys}</span>
                          <span className="text-right text-muted-foreground">{description}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <div className="pointer-events-auto flex items-center gap-2 rounded-[18px] border border-border bg-card p-2 shadow-sm">
          <button
            className="rounded-xl border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground"
            onClick={() => {
              const centerX = viewportSize.width / 2
              const centerY = viewportSize.height / 2
              controllerRef.current.scale = scale
              controllerRef.current.offsetX = offsetX
              controllerRef.current.offsetY = offsetY
              controllerRef.current.zoomAtPoint(1.12, centerX, centerY)
              targetRef.current = {
                scale: controllerRef.current.scale,
                offsetX: controllerRef.current.offsetX,
                offsetY: controllerRef.current.offsetY,
              }
            }}
            type="button"
          >
            <ZoomIn className="h-4 w-4" />
          </button>
          <button
            className="rounded-xl border border-border bg-background p-2 text-muted-foreground transition hover:text-foreground"
            onClick={() => {
              const centerX = viewportSize.width / 2
              const centerY = viewportSize.height / 2
              controllerRef.current.scale = scale
              controllerRef.current.offsetX = offsetX
              controllerRef.current.offsetY = offsetY
              controllerRef.current.zoomAtPoint(0.88, centerX, centerY)
              targetRef.current = {
                scale: controllerRef.current.scale,
                offsetX: controllerRef.current.offsetX,
                offsetY: controllerRef.current.offsetY,
              }
            }}
            type="button"
          >
            <ZoomOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        className="absolute inset-0 overflow-hidden"
        onDoubleClick={() => selectItem(null)}
        onPointerDown={(event) => {
          if (event.target !== event.currentTarget) {
            return
          }

          interactionRef.current = {
            mode: "pan",
            pointerX: event.clientX,
            pointerY: event.clientY,
            originX: targetRef.current.offsetX,
            originY: targetRef.current.offsetY,
          }
          selectItem(null)
        }}
        onWheel={(event) => {
          event.preventDefault()

          if (event.ctrlKey || event.metaKey) {
            controllerRef.current.scale = targetRef.current.scale
            controllerRef.current.offsetX = targetRef.current.offsetX
            controllerRef.current.offsetY = targetRef.current.offsetY
            controllerRef.current.zoomAtPoint(event.deltaY < 0 ? 1.08 : 0.92, event.clientX, event.clientY)
            targetRef.current = {
              scale: controllerRef.current.scale,
              offsetX: controllerRef.current.offsetX,
              offsetY: controllerRef.current.offsetY,
            }
            return
          }

          targetRef.current = {
            ...targetRef.current,
            offsetX: targetRef.current.offsetX - event.deltaX,
            offsetY: targetRef.current.offsetY - event.deltaY,
          }
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left will-change-transform"
          style={{
            transform: `translate3d(${offsetX}px, ${offsetY}px, 0) scale(${scale})`,
            width: 1,
            height: 1,
          }}
        >
          {files.map((item) => (
            <FileTileComponent
              file={item as FileTile}
              isSelected={selectedItemId === item.id}
              key={item.id}
              onClick={() => selectItem(item.id)}
              onDoubleClick={() => openFile(item.id)}
              onPointerDown={(event) => {
                event.stopPropagation()
                selectItem(item.id)
                beginItemMove(item, event.clientX, event.clientY)
              }}
            />
          ))}

          {folders.map((item) => (
            <FolderTileComponent
              folder={item as FolderTile}
              isSelected={selectedItemId === item.id}
              key={item.id}
              onClick={() => selectItem(item.id)}
              onDoubleClick={() => openFolder(item.id)}
              onPointerDown={(event) => {
                event.stopPropagation()
                selectItem(item.id)
                beginItemMove(item, event.clientX, event.clientY)
              }}
            />
          ))}
        </div>

        <div className="pointer-events-none absolute inset-0 z-20">
          {openPanels.map((panel) => (
            <TilePanel isActive={panel.id === activePanelId} key={panel.id} panel={panel} />
          ))}
        </div>
      </div>
    </main>
  )
}
