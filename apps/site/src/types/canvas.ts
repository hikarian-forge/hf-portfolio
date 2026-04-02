import type { ReactNode } from "react"

export type TileType = "file" | "folder"
export type TilePanelVariant = "default" | "minimal" | "expanded" | "editor"

export type MarkdownContent = {
  type: "markdown"
  data: string
}

export type FileContent = MarkdownContent

export interface BaseTile {
  id: string
  x: number
  y: number
  width: number
  height: number
  type: TileType
  icon: ReactNode
}

export interface FileTile extends BaseTile {
  type: "file"
  title: string
  content: FileContent
  fileExtension?: string
  description?: string
  panelVariant?: TilePanelVariant
  metadata?: Record<string, string>
}

export interface FolderTile extends BaseTile {
  type: "folder"
  title: string
  contents: FolderChild[]
  iconOpen?: ReactNode
  isOpen: boolean
  description?: string
  panelVariant?: TilePanelVariant
}

export type FolderChild = FileTile | FolderTile
export type CanvasItem = FileTile | FolderTile

export interface PanelBounds {
  x: number
  y: number
  width: number
  height: number
}

export interface OpenPanel extends PanelBounds {
  id: string
  sourceId: string
  sourceType: TileType
  title: string
  parentId?: string
  parentType?: TileType
  path: string[]
  depth: number
  variant: TilePanelVariant
  zIndex: number
  description?: string
  fileContent?: FileContent
  collectionContents?: FolderChild[]
  metadata?: Record<string, string>
  previousBounds?: PanelBounds & { variant: TilePanelVariant }
}
