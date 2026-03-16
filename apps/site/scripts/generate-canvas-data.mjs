import fs from "node:fs/promises"
import path from "node:path"
import { inspect } from "node:util"

const workspaceRoot = path.resolve(process.cwd())
const contentRoot = path.join(workspaceRoot, "content")
const outputPath = path.join(contentRoot, "canvas-data.tsx")
const manifestPath = path.join(contentRoot, "_canvas", "items.json")

const widgetContentByExtension = {
  png: (relativePath) => ({ type: "image", url: `/${relativePath.replace(/\\/g, "/")}`, alt: path.basename(relativePath) }),
  jpg: (relativePath) => ({ type: "image", url: `/${relativePath.replace(/\\/g, "/")}`, alt: path.basename(relativePath) }),
  jpeg: (relativePath) => ({ type: "image", url: `/${relativePath.replace(/\\/g, "/")}`, alt: path.basename(relativePath) }),
  gif: (relativePath) => ({ type: "image", url: `/${relativePath.replace(/\\/g, "/")}`, alt: path.basename(relativePath) }),
  webp: (relativePath) => ({ type: "image", url: `/${relativePath.replace(/\\/g, "/")}`, alt: path.basename(relativePath) }),
  mp3: (relativePath) => ({ type: "audio", title: path.basename(relativePath), src: `/${relativePath.replace(/\\/g, "/")}` }),
  wav: (relativePath) => ({ type: "audio", title: path.basename(relativePath), src: `/${relativePath.replace(/\\/g, "/")}` }),
  mp4: (relativePath) => ({ type: "video", url: `/${relativePath.replace(/\\/g, "/")}` }),
  mov: (relativePath) => ({ type: "video", url: `/${relativePath.replace(/\\/g, "/")}` }),
}

const textExtensions = new Set(["md", "mdx", "txt", "json", "jsonc", "csv", "toml", "yaml", "yml"])

const iconForExtension = (extension) => {
  if (["png", "jpg", "jpeg", "gif", "webp"].includes(extension)) return "FileImage"
  if (["mp3", "wav"].includes(extension)) return "FileAudio2"
  if (["mp4", "mov"].includes(extension)) return "Film"
  if (["csv"].includes(extension)) return "FileSpreadsheet"
  if (["json", "jsonc", "toml", "yaml", "yml"].includes(extension)) return "FileJson"
  if (["md", "mdx"].includes(extension)) return "NotebookPen"
  return "FileText"
}

const iconImports = new Set([
  "BarChart3",
  "FileAudio2",
  "FileImage",
  "FileJson",
  "FileSpreadsheet",
  "FileText",
  "Film",
  "Folder",
  "FolderOpen",
  "LayoutGrid",
  "NotebookPen",
])

const widgetTypes = new Set(["image", "audio", "video", "embed"])

function slugify(input) {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")
}

async function walk(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true })
  const results = []

  for (const entry of entries) {
    if (entry.name === "canvas-data.tsx") continue
    if (entry.name === "_canvas") continue
    const fullPath = path.join(directory, entry.name)
    if (entry.isDirectory()) {
      results.push({ type: "directory", name: entry.name, path: fullPath, children: await walk(fullPath) })
    } else {
      results.push({ type: "file", name: entry.name, path: fullPath })
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name))
}

async function loadManifest() {
  try {
    const raw = await fs.readFile(manifestPath, "utf8")
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed.items) ? parsed.items : []
  } catch {
    return []
  }
}

async function readFileContent(fullPath, extension) {
  if (!textExtensions.has(extension)) {
    return null
  }

  return fs.readFile(fullPath, "utf8")
}

const createCoordinates = (depth, index, width = 112, height = 112, isWidget = false) => ({
  x: 120 + depth * 160 + (index % 4) * 180,
  y: 120 + Math.floor(index / 4) * (isWidget ? 220 : 160),
  width: isWidget ? Math.max(width, 320) : width,
  height: isWidget ? Math.max(height, 220) : height,
})

async function mapFileNode(node, parentSegments = [], depth = 0, index = 0) {
  const extension = path.extname(node.name).slice(1).toLowerCase()
  const relativePath = path.relative(workspaceRoot, node.path)
  const rawContent = await readFileContent(node.path, extension)
  const isWidget = Boolean(widgetContentByExtension[extension])
  const coordinates = createCoordinates(depth, index, 112, 112, isWidget)

  let content
  if (widgetContentByExtension[extension]) {
    content = widgetContentByExtension[extension](relativePath)
  } else if (extension === "csv") {
    const rows = (rawContent ?? "")
      .split(/\r?\n/)
      .filter(Boolean)
      .map((line) => line.split(","))
    const columns = rows[0] ?? ["Column 1"]
    content = { type: "table", columns, rows: rows.slice(1), caption: node.name }
  } else if (extension === "md" || extension === "mdx") {
    content = { type: "markdown", data: rawContent ?? `# ${node.name}` }
  } else {
    content = { type: "text", data: rawContent ?? `Content unavailable for ${node.name}` }
  }

  return {
    id: `file-${[...parentSegments, slugify(node.name)].join("-")}`,
    type: "file",
    title: node.name,
    description: `Generated from content/${path.relative(contentRoot, node.path).replace(/\\/g, "/")}`,
    ...coordinates,
    icon: `<${iconForExtension(extension)} className=\"h-8 w-8 text-foreground\" />`,
    fileExtension: extension || undefined,
    panelVariant: extension === "md" || extension === "mdx" ? "editor" : "default",
    isWidget,
    interactive: !isWidget,
    content,
  }
}

function getManifestIcon(contentType) {
  if (contentType === "image") return "<FileImage className=\"h-8 w-8 text-foreground\" />"
  if (contentType === "audio") return "<FileAudio2 className=\"h-8 w-8 text-foreground\" />"
  if (contentType === "video") return "<Film className=\"h-8 w-8 text-foreground\" />"
  if (contentType === "embed") return "<BarChart3 className=\"h-8 w-8 text-foreground\" />"
  return "<NotebookPen className=\"h-8 w-8 text-foreground\" />"
}

function mapManifestItem(item, index = 0) {
  const contentType = item.contentType ?? "text"
  const isWidget = item.isWidget ?? widgetTypes.has(contentType)
  const coordinates = {
    x: item.x ?? 240 + index * 180,
    y: item.y ?? 100,
    width: item.width ?? (isWidget ? 320 : 112),
    height: item.height ?? (isWidget ? 220 : 112),
  }

  let content = null
  let contentExpression = undefined

  if (contentType === "image") {
    content = { type: "image", url: item.url, alt: item.alt ?? item.title }
  } else if (contentType === "audio") {
    content = { type: "audio", title: item.title, artist: item.artist, src: item.url, coverUrl: item.coverUrl }
  } else if (contentType === "video") {
    content = { type: "video", url: item.url, poster: item.poster }
  } else if (contentType === "embed") {
    contentExpression = '{ type: "embed", component: MetricsWidget }'
  } else if (contentType === "mixed") {
    content = { type: "mixed", blocks: item.blocks ?? [] }
  } else if (contentType === "table") {
    content = { type: "table", columns: item.columns ?? [], rows: item.rows ?? [], caption: item.caption ?? item.title }
  } else if (contentType === "markdown") {
    content = { type: "markdown", data: item.data ?? `# ${item.title}` }
  } else {
    content = { type: "text", data: item.data ?? item.description ?? item.title }
  }

  return {
    id: item.id ?? `file-manifest-${slugify(item.title ?? `item-${index}`)}`,
    type: "file",
    title: item.title ?? `item-${index}`,
    description: item.description,
    ...coordinates,
    icon: getManifestIcon(contentType),
    fileExtension: item.fileExtension ?? (contentType === "embed" ? "embed" : undefined),
    panelVariant: item.panelVariant ?? (contentType === "markdown" ? "editor" : "default"),
    isWidget,
    interactive: item.interactive ?? !isWidget,
    ...(contentExpression ? { contentExpression } : { content }),
  }
}

async function mapFolderContents(children, parentSegments, depth) {
  const contents = []
  for (const [childIndex, child] of children.entries()) {
    if (child.type === "directory") {
      contents.push(await mapFolderNode(child, parentSegments, depth, childIndex))
    } else {
      contents.push(await mapFileNode(child, parentSegments, depth, childIndex))
    }
  }
  return contents
}

async function mapFolderNode(node, parentSegments = [], depth = 0, index = 0) {
  const segments = [...parentSegments, slugify(node.name)]
  const coordinates = createCoordinates(depth, index)

  return {
    id: `folder-${segments.join("-")}`,
    type: "folder",
    title: node.name,
    description: `Generated from content/${path.relative(contentRoot, node.path).replace(/\\/g, "/")}`,
    ...coordinates,
    icon: "<Folder className=\"h-9 w-9 text-foreground\" />",
    iconOpen: "<FolderOpen className=\"h-9 w-9 text-foreground\" />",
    isOpen: false,
    isArchived: false,
    panelVariant: "default",
    contents: await mapFolderContents(node.children, segments, depth + 1),
  }
}

async function mapRootNode(node, index = 0) {
  const segment = slugify(node.name)

  if (node.type === "directory") {
    const coordinates = createCoordinates(0, index)
    return {
      id: `group-${segment}`,
      type: "group",
      title: node.name,
      description: `Generated from content/${path.relative(contentRoot, node.path).replace(/\\/g, "/")}`,
      ...coordinates,
      icon: "<LayoutGrid className=\"h-9 w-9 text-foreground\" />",
      panelVariant: "default",
      contents: await mapFolderContents(node.children, [segment], 1),
    }
  }

  return mapFileNode(node, [], 0, index)
}

function formatValue(value, indent) {
  const pad = " ".repeat(indent)

  if (typeof value === "string") {
    return JSON.stringify(value)
  }

  if (Array.isArray(value) || typeof value === "object") {
    return inspect(value, {
      depth: Infinity,
      compact: false,
      breakLength: 80,
      sorted: false,
    }).replace(/\n/g, `\n${pad}`)
  }

  return JSON.stringify(value)
}

function stringifyNode(node, indent = 2) {
  const pad = " ".repeat(indent)
  const lines = ["{"]

  for (const [key, value] of Object.entries(node)) {
    if (key === "contents") {
      lines.push(`${pad}${key}: [`)
      for (const child of value) {
        lines.push(`${pad}  ${stringifyNode(child, indent + 2)},`)
      }
      lines.push(`${pad}],`)
      continue
    }

    if (key === "icon" || key === "iconOpen") {
      lines.push(`${pad}${key}: ${value},`)
      continue
    }

    if (key === "contentExpression") {
      lines.push(`${pad}content: ${value},`)
      continue
    }

    if (key === "content") {
      lines.push(`${pad}${key}: ${formatValue(value, indent)},`)
      continue
    }

    if (value === undefined) continue
    lines.push(`${pad}${key}: ${formatValue(value, indent)},`)
  }

  lines.push(`${" ".repeat(Math.max(indent - 2, 0))}}`)
  return lines.join("\n")
}

async function main() {
  const tree = await walk(contentRoot)
  const manifestItems = await loadManifest()
  const mapped = []

  for (const [index, entry] of tree.entries()) {
    mapped.push(await mapRootNode(entry, index))
  }

  const manifestMapped = manifestItems.map((item, index) => mapManifestItem(item, index))

  const files = [...manifestMapped, ...mapped.filter((item) => item.type === "file")]
  const groups = mapped.filter((item) => item.type === "group")

  const output = `import { ${Array.from(iconImports).sort().join(", ")} } from "lucide-react"\nimport type { FileTile, FolderTile, GroupTile } from "../src/types/canvas"\n\nconst MetricsWidget = () => (\n  <div className="grid h-full grid-cols-3 gap-3 text-sm text-foreground">\n    {[\n      ["Streams", "12.8k"],\n      ["Saves", "1.4k"],\n      ["Completion", "86%"],\n    ].map(([label, value]) => (\n      <div key={label} className="rounded-2xl border border-border bg-background p-3">\n        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</p>\n        <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>\n      </div>\n    ))}\n  </div>\n)\n\nexport const canvasFiles: FileTile[] = [\n${files.map((item) => `  ${stringifyNode(item, 4)}`).join(",\n")}\n]\n\nexport const canvasFolders: FolderTile[] = []\n\nexport const canvasGroups: GroupTile[] = [\n${groups.map((item) => `  ${stringifyNode(item, 4)}`).join(",\n")}\n]\n`

  await fs.writeFile(outputPath, output, "utf8")
  console.log(`Generated ${path.relative(workspaceRoot, outputPath)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
