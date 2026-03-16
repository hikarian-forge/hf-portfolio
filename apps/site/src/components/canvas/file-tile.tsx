import type { PointerEvent } from "react"
import { cn } from "@/lib/utils"
import type { FileTile } from "@/types/canvas"

interface FileTileProps {
  file: FileTile
  isSelected: boolean
  onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void
  onClick: () => void
  onDoubleClick: () => void
}

export function FileTile({ file, isSelected, onPointerDown, onClick, onDoubleClick }: FileTileProps) {
  return (
    <button
      type="button"
      className={cn(
        "group absolute flex cursor-grab flex-col items-center gap-2 rounded-xl px-2 py-2 text-center transition active:cursor-grabbing",
        isSelected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      onPointerDown={onPointerDown}
      style={{ left: file.x, top: file.y, width: file.width, minHeight: file.height }}
    >
      <span className={cn("flex h-14 w-14 items-center justify-center text-foreground", isSelected && "scale-105")}>
        {file.icon}
      </span>
      <span className="max-w-full truncate text-[13px] font-medium leading-4 text-foreground">{file.title}</span>
    </button>
  )
}
