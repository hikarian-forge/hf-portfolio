import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"
import { canvasFiles, canvasFolders, canvasGroups } from "../../content/canvas-data"
import type {
  CanvasItem,
  FileTile,
  FolderTile,
  GroupChild,
  GroupTile,
  OpenPanel,
  PanelBounds,
  TilePanelVariant,
} from "@/types/canvas"

type ViewportState = {
  scale: number
  offsetX: number
  offsetY: number
}

type ItemLayoutMap = Record<string, Partial<PanelBounds>>

type PersistedPanelState = {
  id: string
  sourceId: string
  variant: TilePanelVariant
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  path: string[]
  depth: number
  previousBounds?: PanelBounds & { variant: TilePanelVariant }
}

type CanvasPersistedState = {
  scale: number
  offsetX: number
  offsetY: number
  itemLayouts: ItemLayoutMap
  persistedPanels: PersistedPanelState[]
}

type ItemLocation = {
  item: CanvasItem
  path: string[]
  depth: number
  parentId?: string
  parentType?: "folder" | "group"
}

export interface CanvasState extends ViewportState {
  files: FileTile[]
  folders: FolderTile[]
  groups: GroupTile[]
  openPanels: OpenPanel[]
  selectedItemId: string | null
  activePanelId: string | null
  itemLayouts: ItemLayoutMap
  persistedPanels: PersistedPanelState[]
  setViewport: (viewport: Partial<ViewportState>) => void
  updateItemPosition: (itemId: string, x: number, y: number) => void
  selectItem: (id: string | null) => void
  openFile: (fileId: string, variant?: TilePanelVariant) => void
  openFolder: (folderId: string, variant?: TilePanelVariant) => void
  openGroup: (groupId: string, variant?: TilePanelVariant) => void
  closePanel: (panelId?: string) => void
  bringPanelToFront: (panelId: string) => void
  updatePanelPosition: (panelId: string, x: number, y: number) => void
  updatePanelBounds: (panelId: string, bounds: Partial<PanelBounds>) => void
  updatePanelVariant: (panelId: string, variant: TilePanelVariant) => void
  togglePanelExpanded: (panelId: string) => void
}

const viewportDefaults: ViewportState = {
  scale: 1,
  offsetX: 220,
  offsetY: 140,
}

const createPanelId = (sourceId: string) => `panel-${sourceId}`
const PANEL_SNAP_THRESHOLD = 18
const PANEL_DOCK_GAP = 16

const createPanelBounds = (index: number, variant: TilePanelVariant): PanelBounds => {
  const stagger = index * 28

  if (variant === "minimal") {
    return { x: 96 + stagger, y: 80 + stagger, width: 360, height: 280 }
  }

  if (variant === "expanded") {
    return { x: 48, y: 48, width: 980, height: 700 }
  }

  if (variant === "editor") {
    return { x: 90 + stagger, y: 72 + stagger, width: 760, height: 560 }
  }

  return { x: 90 + stagger, y: 72 + stagger, width: 520, height: 400 }
}

const updateGroupChildrenLayouts = (items: GroupChild[], layouts: ItemLayoutMap): GroupChild[] =>
  items.map((item) => {
    const layout = layouts[item.id]
    const nextItem = {
      ...item,
      ...(layout ?? {}),
    }

    if (nextItem.type !== "folder") {
      return nextItem
    }

    return {
      ...nextItem,
      contents: updateGroupChildrenLayouts(nextItem.contents, layouts),
    }
  })

const applyLayoutsToCanvasItems = (items: CanvasItem[], layouts: ItemLayoutMap): CanvasItem[] =>
  items.map((item) => {
    const layout = layouts[item.id]
    const nextItem = {
      ...item,
      ...(layout ?? {}),
    }

    if (nextItem.type === "file") {
      return nextItem
    }

    return {
      ...nextItem,
      contents: updateGroupChildrenLayouts(nextItem.contents, layouts),
    }
  })

const findItemLocationInChildren = (
  items: GroupChild[],
  itemId: string,
  parentTitles: string[] = [],
  parentId?: string,
  parentType?: "folder" | "group",
  depth = 0,
): ItemLocation | null => {
  for (const item of items) {
    const nextPath = [...parentTitles, item.title]

    if (item.id === itemId) {
      return { item, path: nextPath, depth, parentId, parentType }
    }

    if (item.type === "folder" && depth < 5) {
      const nested = findItemLocationInChildren(item.contents, itemId, nextPath, item.id, "folder", depth + 1)
      if (nested) {
        return nested
      }
    }
  }

  return null
}

const findItemLocation = (items: CanvasItem[], itemId: string): ItemLocation | null => {
  for (const item of items) {
    const nextPath = [item.title]

    if (item.id === itemId) {
      return { item, path: nextPath, depth: 0 }
    }

    if (item.type !== "file") {
      const parentType = item.type === "folder" ? "folder" : "group"
      const nested = findItemLocationInChildren(item.contents, itemId, nextPath, item.id, parentType, 1)
      if (nested) {
        return nested
      }
    }
  }

  return null
}

const updateGroupChildren = (
  items: GroupChild[],
  itemId: string,
  updater: (item: CanvasItem) => CanvasItem,
): GroupChild[] =>
  items.map((item) => {
    if (item.id === itemId) {
      return updater(item) as GroupChild
    }

    if (item.type !== "folder") {
      return item
    }

    return {
      ...item,
      contents: updateGroupChildren(item.contents, itemId, updater),
    }
  })

const updateCanvasItems = (
  items: CanvasItem[],
  itemId: string,
  updater: (item: CanvasItem) => CanvasItem,
): CanvasItem[] =>
  items.map((item) => {
    if (item.id === itemId) {
      return updater(item)
    }

    if (item.type === "file") {
      return item
    }

    return {
      ...item,
      contents: updateGroupChildren(item.contents, itemId, updater),
    }
  })

const serializePanels = (panels: OpenPanel[]): PersistedPanelState[] =>
  panels.map((panel) => ({
    id: panel.id,
    sourceId: panel.sourceId,
    variant: panel.variant,
    x: panel.x,
    y: panel.y,
    width: panel.width,
    height: panel.height,
    zIndex: panel.zIndex,
    path: panel.path,
    depth: panel.depth,
    previousBounds: panel.previousBounds,
  }))

const buildPanelFromLocation = (
  location: ItemLocation,
  base: PersistedPanelState | null,
  index: number,
): OpenPanel => {
  const variant = base?.variant ?? location.item.panelVariant ?? "default"
  const bounds = base ?? { ...createPanelBounds(index, variant), zIndex: index + 1 }

  return {
    id: base?.id ?? createPanelId(location.item.id),
    sourceId: location.item.id,
    sourceType: location.item.type,
    title: location.item.title,
    parentId: location.parentId,
    parentType: location.parentType,
    description: location.item.description,
    path: base?.path.length ? base.path : location.path,
    depth: location.depth,
    variant,
    x: bounds.x,
    y: bounds.y,
    width: bounds.width,
    height: bounds.height,
    zIndex: bounds.zIndex,
    previousBounds: base?.previousBounds,
    ...(location.item.type === "file"
      ? { fileContent: location.item.content }
      : { collectionContents: location.item.contents }),
  }
}

const hydratePanels = (
  persistedPanels: PersistedPanelState[],
  files: FileTile[],
  folders: FolderTile[],
  groups: GroupTile[],
): OpenPanel[] => {
  const items = [...files, ...folders, ...groups]

  return persistedPanels
    .map((panel, index) => {
      const location = findItemLocation(items, panel.sourceId)
      if (!location) {
        return null
      }

      return buildPanelFromLocation(location, panel, index)
    })
    .filter((panel): panel is OpenPanel => panel !== null)
    .sort((left, right) => left.zIndex - right.zIndex)
}

const withPanelFocused = (panels: OpenPanel[], panelId: string): OpenPanel[] => {
  const currentMax = panels.reduce((max, panel) => Math.max(max, panel.zIndex), 0)
  return panels.map((panel) =>
    panel.id === panelId
      ? {
          ...panel,
          zIndex: currentMax + 1,
        }
      : panel,
  )
}

const snapValue = (value: number, targets: number[]) => {
  for (const target of targets) {
    if (Math.abs(value - target) <= PANEL_SNAP_THRESHOLD) {
      return target
    }
  }

  return value
}

const getSnappedPanelPosition = (
  panels: OpenPanel[],
  movingPanelId: string,
  x: number,
  y: number,
): { x: number; y: number } => {
  const movingPanel = panels.find((panel) => panel.id === movingPanelId)
  if (!movingPanel) {
    return { x, y }
  }

  const verticalTargets = [48]
  const horizontalTargets = [48]

  for (const panel of panels) {
    if (panel.id === movingPanelId) continue

    verticalTargets.push(panel.x)
    verticalTargets.push(panel.x + panel.width + PANEL_DOCK_GAP)
    verticalTargets.push(panel.x - movingPanel.width - PANEL_DOCK_GAP)
    horizontalTargets.push(panel.y)
    horizontalTargets.push(panel.y + panel.height + PANEL_DOCK_GAP)
    horizontalTargets.push(panel.y - movingPanel.height - PANEL_DOCK_GAP)
  }

  return {
    x: snapValue(x, verticalTargets),
    y: snapValue(y, horizontalTargets),
  }
}

const openPanelForLocation = (
  location: ItemLocation,
  existingPanels: OpenPanel[],
  variant?: TilePanelVariant,
): OpenPanel[] => {
  const panelId = createPanelId(location.item.id)
  const existing = existingPanels.find((panel) => panel.id === panelId)

  if (existing) {
    return withPanelFocused(
      existingPanels.map((panel) =>
        panel.id === panelId
          ? {
              ...panel,
              parentId: location.parentId,
              parentType: location.parentType,
              path: location.path,
              depth: location.depth,
              ...(location.item.type === "file"
                ? { fileContent: location.item.content, collectionContents: undefined }
                : { collectionContents: location.item.contents, fileContent: undefined }),
            }
          : panel,
      ),
      panelId,
    )
  }

  return [...existingPanels, buildPanelFromLocation({ ...location, item: { ...location.item, panelVariant: variant ?? location.item.panelVariant } }, null, existingPanels.length)]
}

const initialFiles = applyLayoutsToCanvasItems(canvasFiles, {}) as FileTile[]
const initialFolders = applyLayoutsToCanvasItems(canvasFolders, {}) as FolderTile[]
const initialGroups = applyLayoutsToCanvasItems(canvasGroups, {}) as GroupTile[]

export const useCanvasStore = create<CanvasState>()(
  persist(
    (set, get) => ({
      ...viewportDefaults,
      files: initialFiles,
      folders: initialFolders,
      groups: initialGroups,
      openPanels: [],
      selectedItemId: null,
      activePanelId: null,
      itemLayouts: {},
      persistedPanels: [],
      setViewport: (viewport) => set((state) => ({ ...state, ...viewport })),
      updateItemPosition: (itemId, x, y) =>
        set((state) => {
          const itemLayouts = {
            ...state.itemLayouts,
            [itemId]: {
              ...(state.itemLayouts[itemId] ?? {}),
              x,
              y,
            },
          }

          return {
            itemLayouts,
            files: updateCanvasItems(state.files, itemId, (item) => ({ ...item, x, y })) as FileTile[],
            folders: updateCanvasItems(state.folders, itemId, (item) => ({ ...item, x, y })) as FolderTile[],
            groups: updateCanvasItems(state.groups, itemId, (item) => ({ ...item, x, y })) as GroupTile[],
          }
        }),
      selectItem: (id) => set({ selectedItemId: id }),
      openFile: (fileId, variant) => {
        const location = findItemLocation([...get().files, ...get().folders, ...get().groups], fileId)
        if (!location || location.item.type !== "file") {
          return
        }

        set((state) => {
          const openPanels = openPanelForLocation(location, state.openPanels, variant)
          return {
            openPanels,
            persistedPanels: serializePanels(openPanels),
            activePanelId: createPanelId(location.item.id),
            selectedItemId: location.item.id,
          }
        })
      },
      openFolder: (folderId, variant) => {
        const location = findItemLocation([...get().files, ...get().folders, ...get().groups], folderId)
        if (!location || location.item.type !== "folder" || location.depth > 5) {
          return
        }

        set((state) => {
          const openPanels = openPanelForLocation(location, state.openPanels, variant)
          return {
            openPanels,
            persistedPanels: serializePanels(openPanels),
            activePanelId: createPanelId(location.item.id),
            selectedItemId: location.item.id,
          }
        })
      },
      openGroup: (groupId, variant) => {
        const location = findItemLocation([...get().files, ...get().folders, ...get().groups], groupId)
        if (!location || location.item.type !== "group") {
          return
        }

        set((state) => {
          const openPanels = openPanelForLocation(location, state.openPanels, variant)
          return {
            openPanels,
            persistedPanels: serializePanels(openPanels),
            activePanelId: createPanelId(location.item.id),
            selectedItemId: location.item.id,
          }
        })
      },
      closePanel: (panelId) =>
        set((state) => {
          const targetPanelId = panelId ?? state.activePanelId
          const openPanels = state.openPanels.filter((panel) => panel.id !== targetPanelId)
          return {
            openPanels,
            persistedPanels: serializePanels(openPanels),
            activePanelId: openPanels.at(-1)?.id ?? null,
          }
        }),
      bringPanelToFront: (panelId) =>
        set((state) => {
          const openPanels = withPanelFocused(state.openPanels, panelId)
          return {
            openPanels,
            persistedPanels: serializePanels(openPanels),
            activePanelId: panelId,
          }
        }),
      updatePanelPosition: (panelId, x, y) =>
        set((state) => {
          const snapped = getSnappedPanelPosition(state.openPanels, panelId, x, y)
          const openPanels = state.openPanels.map((panel) =>
            panel.id === panelId ? { ...panel, x: snapped.x, y: snapped.y } : panel,
          )
          return {
            openPanels,
            persistedPanels: serializePanels(openPanels),
          }
        }),
      updatePanelBounds: (panelId, bounds) =>
        set((state) => {
          const openPanels = state.openPanels.map((panel) =>
            panel.id === panelId ? { ...panel, ...bounds } : panel,
          )
          return {
            openPanels,
            persistedPanels: serializePanels(openPanels),
          }
        }),
      updatePanelVariant: (panelId, variant) =>
        set((state) => {
          const openPanels = state.openPanels.map((panel) => (panel.id === panelId ? { ...panel, variant } : panel))
          return {
            openPanels,
            persistedPanels: serializePanels(openPanels),
          }
        }),
      togglePanelExpanded: (panelId) =>
        set((state) => {
          const openPanels = state.openPanels.map((panel) => {
            if (panel.id !== panelId) {
              return panel
            }

            if (panel.variant === "expanded" && panel.previousBounds) {
              const { previousBounds, ...rest } = panel
              return {
                ...rest,
                ...previousBounds,
                variant: previousBounds.variant,
              }
            }

            return {
              ...panel,
              previousBounds: {
                x: panel.x,
                y: panel.y,
                width: panel.width,
                height: panel.height,
                variant: panel.variant,
              },
              x: 48,
              y: 48,
              width: 980,
              height: 700,
              variant: "expanded",
            }
          })

          return {
            openPanels,
            persistedPanels: serializePanels(openPanels),
            activePanelId: panelId,
          }
        }),
    }),
    {
      name: "hf-canvas-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (state): CanvasPersistedState => ({
        scale: state.scale,
        offsetX: state.offsetX,
        offsetY: state.offsetY,
        itemLayouts: state.itemLayouts,
        persistedPanels: state.persistedPanels,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<CanvasPersistedState>
        const itemLayouts = persisted.itemLayouts ?? {}
        const files = applyLayoutsToCanvasItems(canvasFiles, itemLayouts) as FileTile[]
        const folders = applyLayoutsToCanvasItems(canvasFolders, itemLayouts) as FolderTile[]
        const groups = applyLayoutsToCanvasItems(canvasGroups, itemLayouts) as GroupTile[]
        const persistedPanels = persisted.persistedPanels ?? []
        const openPanels = hydratePanels(persistedPanels, files, folders, groups)

        return {
          ...currentState,
          ...persisted,
          files,
          folders,
          groups,
          itemLayouts,
          persistedPanels,
          openPanels,
          activePanelId: openPanels.at(-1)?.id ?? null,
        }
      },
    },
  ),
)
