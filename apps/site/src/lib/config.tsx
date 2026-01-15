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
    url: string;
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
        steam?: string;
        linkedin?: string;
    }
    pages?: Record<string, PageConfig>;
    twitter: {
        site: string;
        creator: string;
        card: "summary" | "summary_large_image" | "app" | "player";
        images: string | string[];
    }
}

export const siteConfig: SiteConfig = {};
export const headerConfig = {};
export const footerConfig = {};
export const portfolioConfig: PageConfig = {};
export const resourceConfig: PageConfig = {};

export type { SectionGroup, PageConfig, SiteConfig, LabelGroup };
