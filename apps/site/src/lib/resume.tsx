import { Icons } from "../components/icons";
import { CodeIcon, HomeIcon, NotebookIcon, PencilLine } from "lucide-react";

export const DATA = {
  name: "Muhammad Bilal Khan",
  initials: "BK",
  url: "https://bilalkhan.dev",
  location: "Mississauga, ON, Canada",
  locationLink: "https://www.google.com/maps/place/Mississauga,+ON/@43.5772076,-79.6594949,11z/data=!3m1!4b1!4m6!3m5!1s0x882b469fe76b05b7:0x3146cbed75966db!8m2!3d43.5852972!4d-79.6449838!16zL20vMDE1NGd4?entry=ttu",
  description:
    "Aspiring SWE with a passion for becoming an entrepreneur. I love building products that can help people in their daily lives. ",
  summary:
    "I'm an aspiring SWE looking to make a difference in the tech industry. I have always wanted to build and scale a SaaS business, and I have taken the first step towards that goal with a few projects and internships currently striving in. Currently, I am studying at [Centennial College](/#eduction) and look forward to bridging my education with a Bachelors in Computer Science at [Guelph University](https://www.uoguelph.ca/).",
  avatarUrl: "/assets/hikue-logo.png",
  skills: [
    "Python",
    "Go",
    "Java",
    "TypeScript",
    "React.js",
    "Next.js",
    "MERN",
    "BETH",
    "GOTTH",
    "Hono 🦄",
    "TailwindCSS",
    "PostgresSQL",
    "MongoDB",
    "Firebase 🔥",
    "SupaBase",
    "Drizzle & DrizzleKit",
    "Prisma",
    "MySQL",
    "Oracle",
    "Docker",
    "Azure",
    "Communication",
    "Teamwork",
    "Problem Solving",
    "Leadership",
    "Time Management",
  ],
  navbar: [
    { href: "/", icon: HomeIcon, label: "Home" },
    { href: "/blog", icon: NotebookIcon, label: "Blog" },
    { href: "#", icon: CodeIcon, label: "Projects" },
    { href: "#", icon: PencilLine, label: "Notes" },
  ],
  contact: {
    email: "hikue.primary@gmail.com",
    tel: "+1 289-885-7475",
    social: {
      GitHub: {
        name: "GitHub",
        url: "https://github.com/Hi-kue",
        icon: Icons.github,

        navbar: true,
      },
      LinkedIn: {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/hikue/",
        icon: Icons.linkedin,

        navbar: true,
      },
      X: {
        name: "X",
        url: "/url",
        icon: Icons.x,

        navbar: true,
      },
      Youtube: {
        name: "Youtube",
        url: "https://www.youtube.com/channel/UCTYitAYZfKA5-hcdYzhjlPQ",
        icon: Icons.youtube,
        navbar: true,
      },
      email: {
        name: "Send Email",
        url: "hikue.primary@gmail.com",
        icon: Icons.email,
        navbar: false,
      },
    },
  },

  work: [
    {
      company: "Digi Pulse Web Solutions",
      href: "https://digipulse.ca/",
      badges: [],
      location: "Remote",
      title: "Software Developer Intern @ Digi Pulse Web Solutions",
      logoUrl: "/assets/digipulse-web.png", // TODO: Change Logo
      start: "April 2024",
      end: "Present",
      description: 
        "Spearheaded the development and maintenance of critical backend systems within a collaborative environment to scale company infrastructure, and analyzed existing processes to identify optimization opportunities, with proper documentation.",
    },
    {
      company: "HeadStarter AI",
      badges: [],
      href: "https://headstarter.co/",
      location: "Remote",
      title: "SWE Fellow @ HeadStarter AI",
      logoUrl: "/assets/headstarter-ai.jpg",
      start: "July 2024",
      end: "September 2024",
      description:
        "Intensive 7-week fellowship working on 5 AI projects, and one final project with a goal of hitting 1,000 users/waitlist or $1000 in revenue (Track A Requirements).",
    },
    {
      company: "Grow Intern",
      href: "https://growintern.com/",
      badges: [],
      location: "Remote",
      title: "Java Developer Intern @ GrowIntern Inc.",
      logoUrl: "/assets/growintern-logo.jpeg",
      start: "August 2024",
      end: "September 2024",
      description:
        "Not much of an internship, more of an apprenticeship where I spearheaded the development of     BumbleBank Banking Application using NextJs and Spring Boot, and AstorQuiz Application using JavaFx and FXML, and designing intuitive user interfaces, implementing congestion and load balancing techniques for data flow control.",
    },
  ],
  education: [
    {
      school: "University of Guelph",
      href: "https://www.uoguelph.ca/",
      degree: "Bachelors of Computer Science (BSc)",
      logoUrl: "/assets/guelph-university.jpg",
      start: "2026",
      end: "2028",
    },
    {
      school: "Centennial College",
      href: "https://www.centennialcollege.ca/",
      degree: "Software Engineering Technology (Advanced Diploma)",
      logoUrl: "/assets/centennial-crest.png",
      start: "2023",
      end: "Present",
    },
    {
      school: "Erindale Secondary School (ESS)",
      href: "https://erindale.peelschools.org/",
      degree: "OSSD (Ontario Secondary School Diploma)",
      logoUrl: "/assets/ess.png",
      start: "2018",
      end: "2022",
    },
  ],
  projects: [
    {
      // Github Org: OpenceJav
      title: "OpenceJav Org",
      href: "https://github.com/openceJav",
      dates: "Jan 2024 - Feb 2024",
      active: true,
      description:
        "Collection of resume worthy projects and learning activities, including SaaS projects, open-source contributions, and more with students from various Universities and Colleges within Ontario.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Source",
          href: "https://github.com/openceJav",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/atmos_A.jpg",
      video: "",
    },
    {
      // Github Org: AgoraEDU
      title: "AgoraEDU",
      href: "https://github.com/AgoraEDU",
      dates: "June 2023 - Present",
      active: true,
      description:
        "Agora, a in house SW company, tailoring to the needs of students and lifelong learners powered by adaptive products, leveraging the latest technologies in the market with a primary focus on AI driven learning.",
      technologies: [
        "Next.js",
        "Typescript",
        "SupaBase",
        "Prisma",
        "TailwindCSS",
        "Stripe",
        "Shadcn UI",
        "Aceternity UI",
        "Magic UI",
      ],
      links: [
        {
          type: "Website (Coming Soon)",
          href: "/url", // TODO: Website URL for AgoraEDU
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/atmos_B.jpg",
      video: "",
    },
    {
      title: "C5 Club Website",
      href: "/url",
      dates: "August 2024 - Present",
      active: true,
      description:
        "Developing a full-stack website for the C5 Club at Centennial College, leveraging the latest technologies to provide a seamless experience for club members.",
      technologies: [
        "BETH Stack",
        "Elysia",
        "Turso",
        "Bun",
        "TailwindCSS",
        "TypeScript",
        "Drizzle",
        "Shadcn/UI",
        "Magic UI",
        "Docker"
      ],
      links: [
        {
          type: "Website",
          href: "/",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "/https://github.com/Centennial-College-Computer-Coding-Club/C5-Website-V2BETH",
          icon: <Icons.github className="size-3" />,
        },
      ],
      image: "/atmos_C.jpg",
      video: "",
    },
    {
      title: "SBATGuardian",
      href: "/url",
      dates: "July 2024 - Present",
      active: true,
      description:
        "SBAT (Small Business Analysis Tool) Guardian is a tool that helps small business owners to analyze their business and make data-driven decisions, coupled with cybersecurity in mind, with cron-jobs for automated backups.",
      technologies: [
        "Next.js",
        "Typescript",
        "PostgreSQL",
        "Prisma",
        "TailwindCSS",
        "Shadcn UI",
        "Magic UI",
        "Stripe",
        "Cloudflare Workers",
      ],
      links: [
        {
          type: "Website",
          href: "https://automatic.chat",
          icon: <Icons.globe className="size-3" />,
        },
        {
          type: "Source",
          href: "https://github.com/SBATGuardian/SBAT-SaaS",
          icon: <Icons.github className="size-3" />,
        }
      ],
      image: "/atmos_D.jpg",
      video: "",
    },
  ],
  hackathons: [
    {
      title: "TerraHacks",
      dates: "August 1st - August 4th, 2024",
      location: "Toronto, Ontario",
      description:
        "First ever hackathon I went to, one of the best experiences I have had. Learned a lot about how hackathons work, introductions to hackathons and what to expect from them from the mentors and judges.",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSX0r6CNpUNrW9XdR-c3cmY1bzihCbKrLOtiQ&s",
      mlh: "https://s3.amazonaws.com/logged-assets/trust-badge/2019/mlh-trust-badge-2019-white.svg",
      links: [],
    },
    {
      title: "HeadStarter AI | Hiring Hackathon",
      dates: "August 16th - 18th",
      location: "Remote, Worldwide",
      description: "Second hackathon hosted by HeadStarter AI, this hackathon was focused on getting the best talent hired from their fellowship program. The hackathon consisted of 7 companies, all of which were looking to hire the best talent, and each company would have their own objectives and what they were looking for in a candidate. I learned a lot about how companies look for talent, and even created by own scraper for this hackathon.",
      image: "https://media.licdn.com/dms/image/v2/D4E0BAQGJ5j3fUqrp5Q/company-logo_200_200/company-logo_200_200/0/1708200043507/theheadstarter_logo?e=1732147200&v=beta&t=4TOvvfNXmbu8nawZFgTkaV86ORc8HaAJ9CEcssohgl4",
      mlh: "",
      links: [],
    }
  ],
} as const;
