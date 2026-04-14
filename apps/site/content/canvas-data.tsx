import { Folder, FolderOpen, NotebookPen } from "lucide-react";
import type { FileTile, FolderTile } from "../src/types/canvas";

export const canvasFiles: FileTile[] = [
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
		metadata: {
			title: "Canvas Tour",
			type: "guide",
		},
		content: {
			type: "markdown",
			data:
				"\n" +
				"# Canvas Tour\n" +
				"\n" +
				"This file demonstrates markdown rendering with headings, lists, and regular text.\n" +
				"\n" +
				"- Drag icons to rearrange items\n" +
				"- Double-click files to open panels\n" +
				"- Open folders to browse nested content\n" +
				"- Use keyboard shortcuts for navigation",
		},
	},
];

export const canvasFolders: FolderTile[] = [
	{
		id: "folder-author",
		type: "folder",
		title: "author",
		description: "Generated from content/author",
		x: 120,
		y: 120,
		width: 112,
		height: 112,
		icon: <Folder className="h-9 w-9 text-foreground" />,
		iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
		isOpen: false,
		panelVariant: "default",
		contents: [
			{
				id: "file-author-hikue-md",
				type: "file",
				title: "hikue.md",
				description: "Generated from content/author/hikue.md",
				x: 280,
				y: 120,
				width: 112,
				height: 112,
				icon: <NotebookPen className="h-8 w-8 text-foreground" />,
				fileExtension: "md",
				panelVariant: "editor",
				metadata: {
					name: "Hikue",
					bio: "Founding Member, Game Dev & Software Engineer at Postfix Studios.",
					avatar: "/images/avatar/hikue-avtr.webp",
					twitter: "https://x.com/hikue_kodes",
					github: "https://github.com/Hi-kue",
					linkedin: "https://www.linkedin.com/in/hikue/",
					website: "https://site.hikue.dev",
					status: "active",
				},
				content: {
					type: "markdown",
					data:
						"\n" +
						"# Hikue\n" +
						"\n" +
						"Founding Member, Game Dev & Software Engineer at Postfix Studios.\n" +
						"\n" +
						"## Socials\n" +
						"\n" +
						"- [Twitter](https://x.com/hikue_kodes)\n" +
						"- [GitHub](https://github.com/Hi-kue)\n" +
						"- [LinkedIn](https://www.linkedin.com/in/hikue/)\n" +
						"- [Website](https://site.hikue.dev)\n",
				},
			},
			{
				id: "file-author-template-md",
				type: "file",
				title: "template.md",
				description: "Generated from content/author/template.md",
				x: 460,
				y: 120,
				width: 112,
				height: 112,
				icon: <NotebookPen className="h-8 w-8 text-foreground" />,
				fileExtension: "md",
				panelVariant: "editor",
				metadata: {
					template: "author",
					fields: "name, bio, avatar, socials, status",
					status: "active",
				},
				content: {
					type: "markdown",
					data:
						"\n" +
						"# Author Template\n" +
						"\n" +
						"Use this template as a reference for creating author profiles.\n" +
						"\n" +
						"## Required Fields\n" +
						"\n" +
						'- **name** - The name of the author (e.g., "John Doe")\n' +
						"- **bio** - A short bio of the author, something short and simple\n" +
						"- **avatar** - A URL to the author's avatar image\n" +
						"- **socials** - Twitter handle, GitHub username, LinkedIn profile URL\n" +
						'- **status** - Can be "active" or "inactive"\n',
				},
			},
		],
	},
	{
		id: "folder-projects",
		type: "folder",
		title: "projects",
		description: "Generated from content/projects",
		x: 300,
		y: 120,
		width: 112,
		height: 112,
		icon: <Folder className="h-9 w-9 text-foreground" />,
		iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
		isOpen: false,
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
						panelVariant: "default",
						contents: [
							{
								id: "file-projects-album-one-notes-arrangement-md",
								type: "file",
								title: "arrangement.md",
								description:
									"Generated from content/projects/album-one/notes/arrangement.md",
								x: 600,
								y: 120,
								width: 112,
								height: 112,
								icon: <NotebookPen className="h-8 w-8 text-foreground" />,
								fileExtension: "md",
								panelVariant: "editor",
								metadata: {
									title: "Track Arrangement",
									type: "arrangement",
									project: "album-one",
								},
								content: {
									type: "markdown",
									data:
										"\n" +
										"# Track Arrangement\n" +
										"\n" +
										"| Section | Length | Status  |\n" +
										"|---------|--------|---------|\n" +
										"| Intro   | 00:24  | Done    |\n" +
										"| Verse   | 00:42  | Done    |\n" +
										"| Bridge  | 00:19  | Review  |\n" +
										"| Outro   | 00:28  | Pending |\n",
								},
							},
							{
								id: "file-projects-album-one-notes-session-notes-md",
								type: "file",
								title: "session-notes.md",
								description:
									"Generated from content/projects/album-one/notes/session-notes.md",
								x: 780,
								y: 120,
								width: 112,
								height: 112,
								icon: <NotebookPen className="h-8 w-8 text-foreground" />,
								fileExtension: "md",
								panelVariant: "editor",
								metadata: {
									title: "Session Notes",
									type: "production",
									project: "album-one",
								},
								content: {
									type: "markdown",
									data:
										"\n" +
										"# Session Notes\n" +
										"\n" +
										"## Production Checkpoint\n" +
										"\n" +
										"- Drum bus tightened\n" +
										"- Pad texture reduced\n" +
										"- Vocal ambience pending approval\n" +
										"\n" +
										"## Next Steps\n" +
										"\n" +
										"1. Review transitions\n" +
										"2. Finalize visual sync\n" +
										"3. Export stems\n",
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
						metadata: {
							title: "Album One",
							type: "project",
							status: "active",
						},
						content: {
							type: "markdown",
							data:
								"\n" +
								"# Album One\n" +
								"\n" +
								"This folder acts as an entry point for a richer nested content tree.\n" +
								"\n" +
								"## Goals\n" +
								"\n" +
								"- Test nested folder navigation\n" +
								"- Verify markdown rendering\n" +
								"- Confirm folders can contain both files and sub-folders\n",
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
						panelVariant: "default",
						contents: [
							{
								id: "file-projects-album-one-visuals-brief-md",
								type: "file",
								title: "brief.md",
								description:
									"Generated from content/projects/album-one/visuals/brief.md",
								x: 600,
								y: 120,
								width: 112,
								height: 112,
								icon: <NotebookPen className="h-8 w-8 text-foreground" />,
								fileExtension: "md",
								panelVariant: "editor",
								metadata: {
									title: "Visual Brief",
									type: "creative-brief",
									project: "album-one",
								},
								content: {
									type: "markdown",
									data:
										"\n" +
										"# Visual Brief\n" +
										"\n" +
										"Use warm neutrals, restrained chrome, and a quiet interface language.\n" +
										"\n" +
										"## Scenes\n" +
										"\n" +
										"- Transit platforms\n" +
										"- Garden paths\n" +
										"- Soft reflections\n",
								},
							},
							{
								id: "folder-projects-album-one-visuals-shots",
								type: "folder",
								title: "shots",
								description:
									"Generated from content/projects/album-one/visuals/shots",
								x: 780,
								y: 120,
								width: 112,
								height: 112,
								icon: <Folder className="h-9 w-9 text-foreground" />,
								iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
								isOpen: false,
								panelVariant: "default",
								contents: [
									{
										id: "folder-projects-album-one-visuals-shots-archive",
										type: "folder",
										title: "archive",
										description:
											"Generated from content/projects/album-one/visuals/shots/archive",
										x: 760,
										y: 120,
										width: 112,
										height: 112,
										icon: <Folder className="h-9 w-9 text-foreground" />,
										iconOpen: (
											<FolderOpen className="h-9 w-9 text-foreground" />
										),
										isOpen: false,
										panelVariant: "default",
										contents: [
											{
												id: "file-projects-album-one-visuals-shots-archive-shot-map-md",
												type: "file",
												title: "shot-map.md",
												description:
													"Generated from content/projects/album-one/visuals/shots/archive/shot-map.md",
												x: 920,
												y: 120,
												width: 112,
												height: 112,
												icon: (
													<NotebookPen className="h-8 w-8 text-foreground" />
												),
												fileExtension: "md",
												panelVariant: "editor",
												metadata: {
													scene: "garden",
													camera: "top-down",
													take: "4",
													lighting: "late-afternoon",
												},
												content: {
													type: "markdown",
													data:
														"\n" +
														"# Shot Map\n" +
														"\n" +
														"Visual reference for the garden scene shoot.\n" +
														"\n" +
														"- **Scene:** garden\n" +
														"- **Camera:** top-down\n" +
														"- **Take:** 4\n" +
														"- **Lighting:** late-afternoon\n",
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
		id: "folder-research",
		type: "folder",
		title: "research",
		description: "Generated from content/research",
		x: 480,
		y: 120,
		width: 112,
		height: 112,
		icon: <Folder className="h-9 w-9 text-foreground" />,
		iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
		isOpen: false,
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
				metadata: {
					title: "Research",
					type: "collection",
				},
				content: {
					type: "markdown",
					data: "\n# Research\n\nA collection of research materials, references, and notes.\n",
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
				panelVariant: "default",
				contents: [
					{
						id: "file-research-references-links-md",
						type: "file",
						title: "links.md",
						description: "Generated from content/research/references/links.md",
						x: 440,
						y: 120,
						width: 112,
						height: 112,
						icon: <NotebookPen className="h-8 w-8 text-foreground" />,
						fileExtension: "md",
						panelVariant: "editor",
						metadata: {
							title: "Reference Links",
							category: "research",
						},
						content: {
							type: "markdown",
							data:
								"\n" +
								"# Reference Links\n" +
								"\n" +
								"- [Figma](https://www.figma.com)\n" +
								"- [PostHog](https://www.posthog.com)\n" +
								"- [TanStack](https://www.tanstack.com)\n",
						},
					},
				],
			},
		],
	},
	{
		id: "folder-systems",
		type: "folder",
		title: "systems",
		description: "Generated from content/systems",
		x: 660,
		y: 120,
		width: 112,
		height: 112,
		icon: <Folder className="h-9 w-9 text-foreground" />,
		iconOpen: <FolderOpen className="h-9 w-9 text-foreground" />,
		isOpen: false,
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
				panelVariant: "default",
				contents: [
					{
						id: "file-systems-design-tokens-spacing-md",
						type: "file",
						title: "spacing.md",
						description:
							"Generated from content/systems/design-tokens/spacing.md",
						x: 440,
						y: 120,
						width: 112,
						height: 112,
						icon: <NotebookPen className="h-8 w-8 text-foreground" />,
						fileExtension: "md",
						panelVariant: "editor",
						metadata: {
							title: "Spacing Tokens",
							category: "design-tokens",
						},
						content: {
							type: "markdown",
							data:
								"\n" +
								"# Spacing Tokens\n" +
								"\n" +
								"| Token | Value    |\n" +
								"|-------|----------|\n" +
								"| xs    | 0.25rem  |\n" +
								"| sm    | 0.5rem   |\n" +
								"| md    | 1rem     |\n" +
								"| lg    | 1.5rem   |\n",
						},
					},
					{
						id: "file-systems-design-tokens-tokens-md",
						type: "file",
						title: "tokens.md",
						description:
							"Generated from content/systems/design-tokens/tokens.md",
						x: 620,
						y: 120,
						width: 112,
						height: 112,
						icon: <NotebookPen className="h-8 w-8 text-foreground" />,
						fileExtension: "md",
						panelVariant: "editor",
						metadata: {
							title: "Design Tokens",
							category: "design-tokens",
						},
						content: {
							type: "markdown",
							data:
								"\n" +
								"# Design Tokens\n" +
								"\n" +
								"## Colors\n" +
								"\n" +
								"| Token      | Value                    |\n" +
								"|------------|--------------------------|\n" +
								"| background | oklch(0.24 0.00 219.61)  |\n" +
								"| foreground | oklch(0.81 0.03 72.40)   |\n" +
								"| card       | oklch(0.28 0 0)          |\n" +
								"\n" +
								"## Radius\n" +
								"\n" +
								"| Token | Value |\n" +
								"|-------|-------|\n" +
								"| base  | 1rem  |\n",
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
				metadata: {
					title: "Systems",
					type: "collection",
				},
				content: {
					type: "markdown",
					data:
						"\n" +
						"# Systems\n" +
						"\n" +
						"This folder contains structured project files including design tokens and system configurations.\n",
				},
			},
		],
	},
];
