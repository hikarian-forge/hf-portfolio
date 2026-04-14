import type { PointerEvent } from "react";
import { cn } from "@/lib/utils";
import type { FolderTile } from "@/types/canvas";

interface FolderTileProps {
	folder: FolderTile;
	isSelected: boolean;
	onPointerDown: (event: PointerEvent<HTMLButtonElement>) => void;
	onClick: () => void;
	onDoubleClick: () => void;
}

export function FolderTile({
	folder,
	isSelected,
	onPointerDown,
	onClick,
	onDoubleClick,
}: FolderTileProps) {
	return (
		<button
			type="button"
			className={cn(
				"group absolute flex w-[112px] cursor-grab flex-col items-center gap-2 rounded-xl px-2 py-3 text-center transition active:cursor-grabbing",
				isSelected
					? "text-foreground"
					: "text-muted-foreground hover:text-foreground",
			)}
			onClick={onClick}
			onDoubleClick={onDoubleClick}
			onPointerDown={onPointerDown}
			style={{ left: folder.x, top: folder.y }}
		>
			<span
				className={cn(
					"flex h-14 w-14 items-center justify-center text-foreground",
					isSelected && "scale-105",
				)}
			>
				{folder.isOpen ? (folder.iconOpen ?? folder.icon) : folder.icon}
			</span>
			<span className="w-full truncate text-[13px] font-medium leading-4 text-foreground">
				{folder.title}
			</span>
		</button>
	);
}
