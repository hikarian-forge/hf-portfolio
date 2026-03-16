import { BarChart3, FileAudio2, FileImage, FileJson, FileSpreadsheet, FileText, Film, Folder, FolderOpen, LayoutGrid, NotebookPen } from "lucide-react"
import type { FileTile, FolderTile, GroupTile } from "../src/types/canvas"

const MetricsWidget = () => (
  <div className="grid h-full grid-cols-3 gap-3 text-sm text-foreground">
    {[
      ["Streams", "12.8k"],
      ["Saves", "1.4k"],
      ["Completion", "86%"],
    ].map(([label, value]) => (
      <div key={label} className="rounded-2xl border border-border bg-background p-3">
        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
        <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>
      </div>
    ))}
  </div>
)

export const canvasFiles: FileTile[] = [
  {
    id: "file-showcase-image",
    type: "file",
    title: "showcase-moodboard.png",
    description: "Pinned image widget for the canvas demo",
    x: 340,
    y: 120,
    width: 320,
    height: 240,
    icon: <FileImage className="h-8 w-8 text-foreground" />,
    fileExtension: "png",
    panelVariant: "default",
    isWidget: true,
    interactive: false,
    content: {
      type: 'image',
      url: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?auto=format&fit=crop&w=900&q=80',
      alt: 'Showcase moodboard'
    },
  },
  {
    id: "file-showcase-audio",
    type: "file",
    title: "night-drive.wav",
    description: "Pinned audio widget for the canvas demo",
    x: 720,
    y: 140,
    width: 320,
    height: 180,
    icon: <FileAudio2 className="h-8 w-8 text-foreground" />,
    fileExtension: "wav",
    panelVariant: "default",
    isWidget: true,
    interactive: false,
    content: {
      type: 'audio',
      title: 'night-drive.wav',
      artist: 'Hikarian Forge',
      src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
      coverUrl: undefined
    },
  },
  {
    id: "file-showcase-video",
    type: "file",
    title: "intro-clip.mp4",
    description: "Pinned video widget for the canvas demo",
    x: 1120,
    y: 120,
    width: 360,
    height: 220,
    icon: <Film className="h-8 w-8 text-foreground" />,
    fileExtension: "mp4",
    panelVariant: "default",
    isWidget: true,
    interactive: false,
    content: {
      type: 'video',
      url: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
      poster: undefined
    },
  },
  {
    id: "file-showcase-markdown",
    type: "file",
    title: "canvas-tour.md",
    description: "Markdown panel example",
    x: 160,
    y: 420,
    width: 112,
    height: 112,
    icon: <NotebookPen className="h-8 w-8 text-foreground" />,
    fileExtension: "md",
    panelVariant: "editor",
    isWidget: false,
    interactive: true,
    content: {
      type: 'markdown',
      data: '# Canvas Tour\n' +
        '\n' +
        'This file demonstrates markdown rendering with headings, lists, and regular text.\n' +
        '\n' +
        '- Drag icons\n' +
        '- Open folders\n' +
        '- Explore groups\n' +
        '- Inspect widgets'
    },
  },
  {
    id: "file-showcase-table",
    type: "file",
    title: "release-table.csv",
    description: "Table rendering example",
    x: 300,
    y: 420,
    width: 112,
    height: 112,
    icon: <NotebookPen className="h-8 w-8 text-foreground" />,
    fileExtension: "csv",
    panelVariant: "default",
    isWidget: false,
    interactive: true,
    content: {
      type: 'table',
      columns: [
        'Track',
        'Status',
        'Owner',
        'ETA'
      ],
      rows: [
        [
          'Night Drive',
          'Mixing',
          'Ari',
          '2d'
        ],
        [
          'Signal Bloom',
          'Review',
          'Mika',
          'Today'
        ],
        [
          'Afterglow',
          'Ready',
          'Jin',
          'Shipped'
        ]
      ],
      caption: 'Recent releases'
    },
  },
  {
    id: "file-showcase-embed",
    type: "file",
    title: "dashboard.embed",
    description: "Embed widget example",
    x: 520,
    y: 420,
    width: 360,
    height: 180,
    icon: <BarChart3 className="h-8 w-8 text-foreground" />,
    fileExtension: "embed",
    panelVariant: "default",
    isWidget: true,
    interactive: false,
    content: { type: "embed", component: MetricsWidget },
  },
  {
    id: "file-showcase-text",
    type: "file",
    title: "notes.txt",
    description: "Plain text preview",
    x: 960,
    y: 420,
    width: 112,
    height: 112,
    icon: <NotebookPen className="h-8 w-8 text-foreground" />,
    fileExtension: "txt",
    panelVariant: "default",
    isWidget: false,
    interactive: true,
    content: {
      type: 'text',
      data: 'This is a plain text file used to verify text rendering and panel behavior.'
    },
  },
  {
    id: "file-showcase-mixed",
    type: "file",
    title: "mixed-content.mix",
    description: "Mixed content blocks example",
    x: 1100,
    y: 420,
    width: 112,
    height: 112,
    icon: <NotebookPen className="h-8 w-8 text-foreground" />,
    fileExtension: "mix",
    panelVariant: "default",
    isWidget: false,
    interactive: true,
    content: {
      type: 'mixed',
      blocks: [
        {
          type: 'markdown',
          data: '## Mixed Content\nThis block mixes markdown with structured data.'
        },
        {
          type: 'table',
          columns: [
            'Type',
            'Status'
          ],
          rows: [
            [
              'Markdown',
              'Ready'
            ],
            [
              'Table',
              'Ready'
            ],
            [
              'Widgets',
              'Ready'
            ]
          ]
        }
      ]
    },
  }
]

export const canvasFolders: FolderTile[] = []

export const canvasGroups: GroupTile[] = [
  {
    id: "group-author",
    type: "group",
    title: "author",
    description: "Generated from content/author",
    x: 120,
    y: 120,
    width: 112,
    height: 112,
    icon: <LayoutGrid className="h-9 w-9 text-foreground" />,
    panelVariant: "default",
    contents: [
      {
      id: "file-author-hikue-json",
      type: "file",
      title: "hikue.json",
      description: "Generated from content/author/hikue.json",
      x: 280,
      y: 120,
      width: 112,
      height: 112,
      icon: <FileJson className="h-8 w-8 text-foreground" />,
      fileExtension: "json",
      panelVariant: "default",
      isWidget: false,
      interactive: true,
      content: {
        type: 'text',
        data: '{\r\n' +
          '  "name": "Hikue",\r\n' +
          '  "bio": "Founding Member, Game Dev & Software Engineer at Postfix Studios.",\r\n' +
          '  "avatar": "/images/avatar/hikue-avtr.webp",\r\n' +
          '  "socials": {\r\n' +
          '    "twitter": "https://x.com/hikue_kodes",\r\n' +
          '    "github": "https://github.com/Hi-kue",\r\n' +
          '    "linkedin": "https://www.linkedin.com/in/hikue/",\r\n' +
          '    "website": "https://site.hikue.dev"\r\n' +
          '  },\r\n' +
          '  "status": "active"\r\n' +
          '}\r\n'
      },
    },
      {
      id: "file-author-template-jsonc",
      type: "file",
      title: "template.jsonc",
      description: "Generated from content/author/template.jsonc",
      x: 460,
      y: 120,
      width: 112,
      height: 112,
      icon: <FileJson className="h-8 w-8 text-foreground" />,
      fileExtension: "jsonc",
      panelVariant: "default",
      isWidget: false,
      interactive: true,
      content: {
        type: 'text',
        data: '{\r\n' +
          '  "name": "", // NOTE: The name of the author (e.g., "John Doe").\r\n' +
          '  "bio": "", // NOTE: A short bio of the author, something short and simple.\r\n' +
          `  "avatar": "", // NOTE: A URL to the author's avatar image.\r\n` +
          '  "socials": {\r\n' +
          `    "twitter": "", // NOTE: The author's Twitter handle (e.g., "johndoe").\r\n` +
          `    "github": "", // NOTE: The author's GitHub username (e.g., "johndoe").\r\n` +
          `    "linkedin": "" // NOTE: The author's LinkedIn profile URL.\r\n` +
          '  },\r\n' +
          '  "status": "active" // NOTE: The status of the author, can be "active" or "inactive".\r\n' +
          '}\r\n'
      },
    },
    ],
  },
  {
    id: "group-projects",
    type: "group",
    title: "projects",
    description: "Generated from content/projects",
    x: 300,
    y: 120,
    width: 112,
    height: 112,
    icon: <LayoutGrid className="h-9 w-9 text-foreground" />,
    panelVariant: "default",
    contents: [
      {
      id: "folder-projects-album-one",
      type: "folder",
      title: "album-one",
      description: "Generated from content/projects/album-one",
      x: 280,
      y: 120,
      width: 112,
      height: 112,
      icon: <Folder className="h-9 w-9 text-foreground" />,
      iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
      isOpen: false,
      isArchived: false,
      panelVariant: "default",
      contents: [
        {
        id: "folder-projects-album-one-notes",
        type: "folder",
        title: "notes",
        description: "Generated from content/projects/album-one/notes",
        x: 440,
        y: 120,
        width: 112,
        height: 112,
        icon: <Folder className="h-9 w-9 text-foreground" />,
        iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
        isOpen: false,
        isArchived: false,
        panelVariant: "default",
        contents: [
          {
          id: "file-projects-album-one-notes-arrangement-csv",
          type: "file",
          title: "arrangement.csv",
          description: "Generated from content/projects/album-one/notes/arrangement.csv",
          x: 600,
          y: 120,
          width: 112,
          height: 112,
          icon: <FileSpreadsheet className="h-8 w-8 text-foreground" />,
          fileExtension: "csv",
          panelVariant: "default",
          isWidget: false,
          interactive: true,
          content: {
            type: 'table',
            columns: [
              'Section',
              'Length',
              'Status'
            ],
            rows: [
              [
                'Intro',
                '00:24',
                'Done'
              ],
              [
                'Verse',
                '00:42',
                'Done'
              ],
              [
                'Bridge',
                '00:19',
                'Review'
              ],
              [
                'Outro',
                '00:28',
                'Pending'
              ]
            ],
            caption: 'arrangement.csv'
          },
        },
          {
          id: "file-projects-album-one-notes-session-notes-md",
          type: "file",
          title: "session-notes.md",
          description: "Generated from content/projects/album-one/notes/session-notes.md",
          x: 780,
          y: 120,
          width: 112,
          height: 112,
          icon: <NotebookPen className="h-8 w-8 text-foreground" />,
          fileExtension: "md",
          panelVariant: "editor",
          isWidget: false,
          interactive: true,
          content: {
            type: 'markdown',
            data: '# Session Notes\n' +
              '\n' +
              '## Production Checkpoint\n' +
              '\n' +
              '- Drum bus tightened\n' +
              '- Pad texture reduced\n' +
              '- Vocal ambience pending approval\n' +
              '\n' +
              '## Next Steps\n' +
              '\n' +
              '1. Review transitions\n' +
              '2. Finalize visual sync\n' +
              '3. Export stems\n'
          },
        },
        ],
      },
        {
        id: "file-projects-album-one-readme-md",
        type: "file",
        title: "README.md",
        description: "Generated from content/projects/album-one/README.md",
        x: 620,
        y: 120,
        width: 112,
        height: 112,
        icon: <NotebookPen className="h-8 w-8 text-foreground" />,
        fileExtension: "md",
        panelVariant: "editor",
        isWidget: false,
        interactive: true,
        content: {
          type: 'markdown',
          data: '# Album One\n' +
            '\n' +
            'This folder acts as a group entry point for a richer nested content tree.\n' +
            '\n' +
            '## Goals\n' +
            '\n' +
            '- Test nested folder navigation\n' +
            '- Verify markdown rendering\n' +
            '- Confirm groups can contain both files and folders\n'
        },
      },
        {
        id: "folder-projects-album-one-visuals",
        type: "folder",
        title: "visuals",
        description: "Generated from content/projects/album-one/visuals",
        x: 800,
        y: 120,
        width: 112,
        height: 112,
        icon: <Folder className="h-9 w-9 text-foreground" />,
        iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
        isOpen: false,
        isArchived: false,
        panelVariant: "default",
        contents: [
          {
          id: "file-projects-album-one-visuals-brief-md",
          type: "file",
          title: "brief.md",
          description: "Generated from content/projects/album-one/visuals/brief.md",
          x: 600,
          y: 120,
          width: 112,
          height: 112,
          icon: <NotebookPen className="h-8 w-8 text-foreground" />,
          fileExtension: "md",
          panelVariant: "editor",
          isWidget: false,
          interactive: true,
          content: {
            type: 'markdown',
            data: '# Visual Brief\n' +
              '\n' +
              'Use warm neutrals, restrained chrome, and a quiet interface language.\n' +
              '\n' +
              '## Scenes\n' +
              '\n' +
              '- Transit platforms\n' +
              '- Garden paths\n' +
              '- Soft reflections\n'
          },
        },
          {
          id: "folder-projects-album-one-visuals-shots",
          type: "folder",
          title: "shots",
          description: "Generated from content/projects/album-one/visuals/shots",
          x: 780,
          y: 120,
          width: 112,
          height: 112,
          icon: <Folder className="h-9 w-9 text-foreground" />,
          iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
          isOpen: false,
          isArchived: false,
          panelVariant: "default",
          contents: [
            {
            id: "folder-projects-album-one-visuals-shots-archive",
            type: "folder",
            title: "archive",
            description: "Generated from content/projects/album-one/visuals/shots/archive",
            x: 760,
            y: 120,
            width: 112,
            height: 112,
            icon: <Folder className="h-9 w-9 text-foreground" />,
            iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
            isOpen: false,
            isArchived: false,
            panelVariant: "default",
            contents: [
              {
              id: "file-projects-album-one-visuals-shots-archive-shot-map-json",
              type: "file",
              title: "shot-map.json",
              description: "Generated from content/projects/album-one/visuals/shots/archive/shot-map.json",
              x: 920,
              y: 120,
              width: 112,
              height: 112,
              icon: <FileJson className="h-8 w-8 text-foreground" />,
              fileExtension: "json",
              panelVariant: "default",
              isWidget: false,
              interactive: true,
              content: {
                type: 'text',
                data: '{\n' +
                  '  "scene": "garden",\n' +
                  '  "camera": "top-down",\n' +
                  '  "take": 4,\n' +
                  '  "lighting": "late-afternoon"\n' +
                  '}\n'
              },
            },
            ],
          },
          ],
        },
        ],
      },
      ],
    },
    ],
  },
  {
    id: "group-research",
    type: "group",
    title: "research",
    description: "Generated from content/research",
    x: 480,
    y: 120,
    width: 112,
    height: 112,
    icon: <LayoutGrid className="h-9 w-9 text-foreground" />,
    panelVariant: "default",
    contents: [
      {
      id: "file-research-readme-md",
      type: "file",
      title: "README.md",
      description: "Generated from content/research/README.md",
      x: 280,
      y: 120,
      width: 112,
      height: 112,
      icon: <NotebookPen className="h-8 w-8 text-foreground" />,
      fileExtension: "md",
      panelVariant: "editor",
      isWidget: false,
      interactive: true,
      content: {
        type: 'markdown',
        data: '# Research\n' +
          '\n' +
          'Used to verify another top-level group tile with nested folders and plain text files.\n'
      },
    },
      {
      id: "folder-research-references",
      type: "folder",
      title: "references",
      description: "Generated from content/research/references",
      x: 460,
      y: 120,
      width: 112,
      height: 112,
      icon: <Folder className="h-9 w-9 text-foreground" />,
      iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
      isOpen: false,
      isArchived: false,
      panelVariant: "default",
      contents: [
        {
        id: "file-research-references-links-txt",
        type: "file",
        title: "links.txt",
        description: "Generated from content/research/references/links.txt",
        x: 440,
        y: 120,
        width: 112,
        height: 112,
        icon: <FileText className="h-8 w-8 text-foreground" />,
        fileExtension: "txt",
        panelVariant: "default",
        isWidget: false,
        interactive: true,
        content: {
          type: 'text',
          data: 'https://www.figma.com\nhttps://www.posthog.com\nhttps://www.tanstack.com\n'
        },
      },
      ],
    },
    ],
  },
  {
    id: "group-systems",
    type: "group",
    title: "systems",
    description: "Generated from content/systems",
    x: 660,
    y: 120,
    width: 112,
    height: 112,
    icon: <LayoutGrid className="h-9 w-9 text-foreground" />,
    panelVariant: "default",
    contents: [
      {
      id: "folder-systems-design-tokens",
      type: "folder",
      title: "design-tokens",
      description: "Generated from content/systems/design-tokens",
      x: 280,
      y: 120,
      width: 112,
      height: 112,
      icon: <Folder className="h-9 w-9 text-foreground" />,
      iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
      isOpen: false,
      isArchived: false,
      panelVariant: "default",
      contents: [
        {
        id: "file-systems-design-tokens-spacing-toml",
        type: "file",
        title: "spacing.toml",
        description: "Generated from content/systems/design-tokens/spacing.toml",
        x: 440,
        y: 120,
        width: 112,
        height: 112,
        icon: <FileJson className="h-8 w-8 text-foreground" />,
        fileExtension: "toml",
        panelVariant: "default",
        isWidget: false,
        interactive: true,
        content: {
          type: 'text',
          data: '[space]\nxs = "0.25rem"\nsm = "0.5rem"\nmd = "1rem"\nlg = "1.5rem"\n'
        },
      },
        {
        id: "file-systems-design-tokens-tokens-json",
        type: "file",
        title: "tokens.json",
        description: "Generated from content/systems/design-tokens/tokens.json",
        x: 620,
        y: 120,
        width: 112,
        height: 112,
        icon: <FileJson className="h-8 w-8 text-foreground" />,
        fileExtension: "json",
        panelVariant: "default",
        isWidget: false,
        interactive: true,
        content: {
          type: 'text',
          data: '{\n' +
            '  "color": {\n' +
            '    "background": "oklch(0.24 0.00 219.61)",\n' +
            '    "foreground": "oklch(0.81 0.03 72.40)",\n' +
            '    "card": "oklch(0.28 0 0)"\n' +
            '  },\n' +
            '  "radius": {\n' +
            '    "base": "1rem"\n' +
            '  }\n' +
            '}\n'
        },
      },
      ],
    },
      {
      id: "file-systems-readme-md",
      type: "file",
      title: "README.md",
      description: "Generated from content/systems/README.md",
      x: 460,
      y: 120,
      width: 112,
      height: 112,
      icon: <NotebookPen className="h-8 w-8 text-foreground" />,
      fileExtension: "md",
      panelVariant: "editor",
      isWidget: false,
      interactive: true,
      content: {
        type: 'markdown',
        data: '# Systems\n' +
          '\n' +
          'This group contains structured project files that help test non-media content.\n'
      },
    },
    ],
  }
]
