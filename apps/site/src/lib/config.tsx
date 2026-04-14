import {
	FileTextIcon,
	ToolCaseIcon,
	// NOTE: General Section Icons
	BookMarkedIcon,
	NewspaperIcon,
	UsersIcon,
	// NOTE: Games Section Icons
	Package2Icon,
	BadgeInfoIcon,
	BadgeHelpIcon,
	// NOTE: Resources Section Icons
	IdCardLanyardIcon,
	BadgeQuestionMarkIcon,
	HeartHandshakeIcon,
	CookieIcon,
	PresentationIcon,
	// NOTE: Socials Section Icons
	CalendarDaysIcon,
	GiftIcon,
} from "lucide-react";

import { Icons } from "./icons";

interface LabelGroup {
	text: string;
	icon: React.ReactNode;
}

interface SectionGroup {
	id: string;
	label: LabelGroup;
	title: string;
	description: string;
	content?: any;
	links?: {
		text: string;
		url: string;
		icon?: React.ReactNode;
	}[];
	visible?: boolean;
}

interface WorkGroup {
	id: string;
	logo: React.ReactNode,
	href: string;
	company: string;
	badges?: React.ReactNode[],
	role: {
		title: string;
		description?: string;
		location: string;
		locationType: "remote" | "on-site" | "hybrid";
		start: string;
		end?: string;
	}
}

interface EducationGroup {
	id: string;
	logo: React.ReactNode,
	href: string;
	school: string;
	degree: string;
	start: string;
	end?: string;
}

interface HackathonGroup {
	id: string;
	logo: React.ReactNode,
	href: string;
	badges?: React.ReactNode[],
	hackathon: {
		title: string;
		description?: string;
		location: string;
		start: string;
		end?: string;
	}
	links?: string[]
}

interface ResumeConfig {
	id: string;
	version?: number;
	name: string;
	initials?: string;
	location: string;
	description: string;
	summary?: string;
	urls?: {
		siteUrl: string;
		avatarUrl: string;
	}
	skills: string[];
	experience: WorkGroup[],
	education: EducationGroup[],
	hackathons: HackathonGroup[]
}

interface PageConfig {
	id: string;
	label: LabelGroup;
	title?: string;
	description?: string;
	sections: SectionGroup[];
	meta?: {
		author?: string;
		published?: string;
		modified?: string;
		canonicalUrl?: string;
	};
	seo?: {
		title?: string;
		description?: string;
		keywords?: string[];
		ogImage?: string;
		twitterCard?: string;
	};
}

interface SiteConfig {
	title: string;
	description: string;
	keywords?: string[];
	images?: string[];
	links?: {
		discord?: string;
		github?: string;
		instagram?: string;
		blueSky?: string;
		twitter?: string;
		youtube?: string;
		email?: string;
		linkedin?: string;
	};
	pages?: Record<string, PageConfig>;
	twitter: {
		site: string;
		creator: string;
		card: "summary" | "summary_large_image" | "app" | "player";
		images: string | string[];
	};
}

export const siteConfig: SiteConfig = {
	title: "Hikue's Portfolio",
	description: "",
	keywords: [],
	images: [],
	links: {
		discord: import.meta.env.VITE_HF_DISCORD_URL,
		github: import.meta.env.VITE_HF_GITHUB_URL,
		instagram: import.meta.env.VITE_HF_INSTAGRAM_URL,
		blueSky: import.meta.env.VITE_HF_BLUESKY_URL,
		twitter: import.meta.env.VITE_HF_TWITTER_URL,
		youtube: import.meta.env.VITE_HF_YOUTUBE_URL,
		email: import.meta.env.VITE_HF_EMAIL,
		linkedin: import.meta.env.VITE_HF_LINKEDIN_URL
	},
	pages: {},
	twitter: {
		site: "https://hikue.dev/",
		creator: "@hikue_kodes",
		card: "summary_large_image",
		images: [],
	},
};

export const headerConfig = {
	id: "",
	header: {
		links: [
			{
				icon: <></>,
				label: "",
				href: "",
				toggle: {
					title: "",
					inactiveTitle: "",
					active: false,
				},
			},
		],
	},
};

export const footerConfig = {
	id: "",
	title: "",
	footer: {
		content: {
			copyright: {
				text: `© ${new Date().getFullYear()} Hikue. All rights reserved.`,
			},
			links: [
				{
					id: 1,
					label: "Privacy Policy",
					to: "/resources/privacy-policy",
				},
				{
					id: 2,
					label: "Terms of Service",
					to: "/resources/terms-of-service",
				},
				{
					id: 3,
					label: "Cookie Policy",
					to: "/resources/cookie-policy",
				},
			], // TODO: Refactor links to proper links for Portfolio.
		},
		visible: true,
	},
};

export const portfolioConfig: PageConfig = {
	id: "",
	label: {
		text: "",
		icon: <></>,
	},
	title: "",
	description: "",
	sections: [],
	meta: {
		author: "",
		published: "",
		modified: "",
		canonicalUrl: ""
	},
	seo: {
		title: "",
		description: "",
		keywords: [],
		ogImage: "",
		twitterCard: "",
	}
};

export const resourceConfig: PageConfig = {
	id: "",
	label: {
		text: "",
		icon: <></>,
	},
	title: "",
	description: "",
	sections: [],
	meta: {
		author: "",
		published: "",
		modified: "",
		canonicalUrl: ""
	},
	seo: {
		title: "",
		description: "",
		keywords: [],
		ogImage: "",
		twitterCard: "",
	}
};

export const resumeConfig: ResumeConfig = {
	id: "",
	name: "Muhammad Bilal Khan",
	initials: "BK",
	location: "",
	description: "",
	summary: "",
	urls: {
		siteUrl: "https://hikue.dev/",
		avatarUrl: "assets/avatar.webp",
	},
	skills: [],
	experience: [],
	education: [],
	hackathons: []
}

export type {
	SectionGroup,
	PageConfig,
	SiteConfig,
	LabelGroup
};
