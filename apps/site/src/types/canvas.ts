import type { ComponentType, ReactNode } from "react"

export type TileType = "file" | "folder" | "group"
export type TilePanelVariant = "default" | "minimal" | "expanded" | "editor"

export type TextContent = {
  type: "text"
  data: string
}

export type MarkdownContent = {
  type: "markdown"
  data: string
}

export type ImageContent = {
  type: "image"
  url: string
  alt?: string
}

export type VideoContent = {
  type: "video"
  url: string
  poster?: string
}

export type AudioContent = {
  type: "audio"
  title: string
  artist?: string
  src: string
  coverUrl?: string
  accent?: string
}

export type TableContent = {
  type: "table"
  columns: string[]
  rows: Array<Array<string | number>>
  caption?: string
}

export type EmbedContent = {
  type: "embed"
  component: ComponentType<Record<string, unknown>>
  props?: Record<string, unknown>
}

export type MixedContent = {
  type: "mixed"
  blocks: FileContent[]
}

export type FileContent =
  | TextContent
  | MarkdownContent
  | ImageContent
  | VideoContent
  | AudioContent
  | TableContent
  | EmbedContent
  | MixedContent

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
  isWidget?: boolean
  interactive?: boolean
}

export interface FolderTile extends BaseTile {
  type: "folder"
  title: string
  contents: GroupChild[]
  iconOpen?: ReactNode
  isOpen: boolean
  isArchived: boolean
  description?: string
  panelVariant?: TilePanelVariant
}

export interface GroupTile extends BaseTile {
  type: "group"
  title: string
  contents: GroupChild[]
  description?: string
  panelVariant?: TilePanelVariant
}

export type GroupChild = FileTile | FolderTile
export type CanvasItem = FileTile | FolderTile | GroupTile

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
  collectionContents?: GroupChild[]
  previousBounds?: PanelBounds & { variant: TilePanelVariant }
}
