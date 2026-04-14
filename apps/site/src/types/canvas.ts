import type { ReactNode } from "react";

type Tile = "file" | "folder";
type TileVariant = "default" | "minimal" | "expanded" | "editor";
type TileContent = {
	type: "markdown" | "json" | "txt";
	data: string;
};

interface BaseTile {
	id: string;
	x: number;
	y: number;
	width: number;
	height: number;
	type: Tile;
	icon: ReactNode;
}

interface FileTile extends BaseTile {
	type: "file";
	title: string;
	content: TileContent;
	fileExtension?: string;
	description?: string;
	panelVariant?: TileVariant;
	metadata?: Record<string, string>;
}

interface FolderTile extends BaseTile {
	type: "folder";
	title: string;
	contents: FolderChild[];
	iconOpen?: ReactNode;
	isOpen: boolean;
	description?: string;
	panelVariant?: TileVariant;
}

type FolderChild = FileTile | FolderTile;
type CanvasItem = FileTile | FolderTile;

interface PanelBounds {
	x: number;
	y: number;
	width: number;
	height: number;
}

interface OpenPanel extends PanelBounds {
	id: string;
	sourceId: string;
	sourceType: Tile;
	title: string;
	parentId?: string;
	parentType?: Tile;
	path: string[];
	depth: number;
	variant: TileVariant;
	zIndex: number;
	description?: string;
	TileContent?: TileContent;
	collectionContents?: FolderChild[];
	metadata?: Record<string, string>;
	previousBounds?: PanelBounds & { variant: TileVariant };
}

export {
	Tile,
	TileVariant,
	TileContent,
	BaseTile,
	FileTile,
	FolderTile,
	FolderChild,
	CanvasItem,
	OpenPanel,
	PanelBounds,
};
