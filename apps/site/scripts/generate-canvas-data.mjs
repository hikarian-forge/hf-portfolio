import fs from "node:fs/promises"
import path from "node:path"
import { inspect } from "node:util"

const workspaceRoot = path.resolve(process.cwd())
const contentRoot = path.join(workspaceRoot, "content")
const outputPath = path.join(contentRoot, "canvas-data.tsx")
const manifestPath = path.join(contentRoot, "_canvas", "items.json")

const mdExtensions = new Set(["md", "mdx"])

const iconImports = new Set(["Folder", "FolderOpen", "NotebookPen"])

function slugify(input) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match) {
    return { metadata: null, body: raw }
  }

  const metadata = {}
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(":")
    if (idx === -1) continue
    const key = line.slice(0, idx).trim()
    const value = line.slice(idx + 1).trim()
    if (key) {
      metadata[key] = value
    }
  }

  const body = raw.slice(match[0].length).replace(/^\r?\n/, "")
  return { metadata: Object.keys(metadata).length > 0 ? metadata : null, body }
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
      const ext = path.extname(entry.name).slice(1).toLowerCase()
      if (mdExtensions.has(ext)) {
        results.push({ type: "file", name: entry.name, path: fullPath })
      }
    }
  }

  return results.sort((a, b) => a.name.localeCompare(b.name))
}

function pruneEmptyDirs(nodes) {
  const pruned = []
  for (const node of nodes) {
    if (node.type === "directory") {
      const children = pruneEmptyDirs(node.children)
      if (children.length > 0) {
        pruned.push({ ...node, children })
      }
    } else {
      pruned.push(node)
    }
  }
  return pruned
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

const createCoordinates = (depth, index, width = 112, height = 112) => ({
  x: 120 + depth * 160 + (index % 4) * 180,
  y: 120 + Math.floor(index / 4) * 160,
  width,
  height,
})

async function mapFileNode(node, parentSegments = [], depth = 0, index = 0) {
  const extension = path.extname(node.name).slice(1).toLowerCase()
  const rawContent = await fs.readFile(node.path, "utf8")
  const coordinates = createCoordinates(depth, index)
  const { metadata, body } = parseFrontmatter(rawContent)

  return {
    id: `file-${[...parentSegments, slugify(node.name)].join("-")}`,
    type: "file",
    title: node.name,
    description: `Generated from content/${path.relative(contentRoot, node.path).replace(/\\/g, "/")}`,
    ...coordinates,
    icon: `<NotebookPen className="h-8 w-8 text-foreground" />`,
    fileExtension: extension || undefined,
    panelVariant: "editor",
    ...(metadata ? { metadata } : {}),
    content: { type: "markdown", data: body },
  }
}

function mapManifestItem(item, index = 0) {
  const data = item.data ?? `# ${item.title}`
  const { metadata, body } = parseFrontmatter(data)

  return {
    id: item.id ?? `file-manifest-${slugify(item.title ?? `item-${index}`)}`,
    type: "file",
    title: item.title ?? `item-${index}`,
    description: item.description,
    x: item.x ?? 240 + index * 180,
    y: item.y ?? 100,
    width: item.width ?? 112,
    height: item.height ?? 112,
    icon: `<NotebookPen className="h-8 w-8 text-foreground" />`,
    fileExtension: item.fileExtension ?? "md",
    panelVariant: item.panelVariant ?? "editor",
    ...(metadata ? { metadata } : {}),
    content: { type: "markdown", data: body },
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
    icon: `<Folder className="h-9 w-9 text-foreground" />`,
    iconOpen: `<FolderOpen className="h-9 w-9 text-foreground" />`,
    isOpen: false,
    panelVariant: "default",
    contents: await mapFolderContents(node.children, segments, depth + 1),
  }
}

async function mapRootNode(node, index = 0) {
  if (node.type === "directory") {
    return mapFolderNode(node, [], 0, index)
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

    if (key === "content") {
      lines.push(`${pad}${key}: ${formatValue(value, indent)},`)
      continue
    }

    if (key === "metadata") {
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
  const rawTree = await walk(contentRoot)
  const tree = pruneEmptyDirs(rawTree)
  const manifestItems = await loadManifest()
  const mapped = []

  for (const [index, entry] of tree.entries()) {
    mapped.push(await mapRootNode(entry, index))
  }

  const manifestMapped = manifestItems
    .filter((item) => item.contentType === "markdown" || !item.contentType)
    .map((item, index) => mapManifestItem(item, index))

  const files = [...manifestMapped, ...mapped.filter((item) => item.type === "file")]
  const folders = mapped.filter((item) => item.type === "folder")

  const output = `import { Folder, FolderOpen, NotebookPen } from "lucide-react"\nimport type { FileTile, FolderTile } from "../src/types/canvas"\n\nexport const canvasFiles: FileTile[] = [\n${files.map((item) => `  ${stringifyNode(item, 4)}`).join(",\n")}\n]\n\nexport const canvasFolders: FolderTile[] = [\n${folders.map((item) => `  ${stringifyNode(item, 4)}`).join(",\n")}\n]\n`

  await fs.writeFile(outputPath, output, "utf8")
  console.log(`Generated ${path.relative(workspaceRoot, outputPath)}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
