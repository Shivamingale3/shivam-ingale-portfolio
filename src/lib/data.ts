export const RESUME_DATA = {
  name: "Shivam Ingale",
  initials: "SI",
  location: "Nagpur, India",
  locationLink: "https://www.google.com/maps/place/Nagpur",
  about:
    "Full-stack Engineer experienced in building production-grade systems across React, Next.js, Node.js, and Spring Boot. Strong ownership mindset — handling architecture, implementation, and delivery end-to-end.",
  summary:
    "Full-stack Engineer experienced in building production-grade systems across React, Next.js, Node.js, and Spring Boot. Delivered cloud-ready solutions on AWS/GCP, optimized system performance, and shipped features used by real clients. Strong ownership mindset — handle architecture, implementation, and delivery end-to-end.",
  avatarUrl: "https://github.com/shivamingale.png",
  personalWebsiteUrl: "https://shiv.dev", // Placeholder
  contact: {
    email: "shivamingale3@gmail.com",
    tel: "+91-9325063591",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/shivamingale", // Infurred
        icon: "Github",
      },
      {
        name: "LinkedIn",
        url: "https://linkedin.com/in/shivamingale", // Infurred
        icon: "Linkedin",
      },
    ],
  },
  education: [
    {
      school: "D. Y. Patil Institute of Management & Research, Pune",
      degree: "Master of Computer Applications (MCA)",
      start: "2022",
      end: "2024",
      grade: "CGPA: 7.5",
    },
  ],
  work: [
    {
      company: "Leadows Technologies Pvt. Ltd",
      link: "https://leadows.com",
      badges: ["Remote", "Full-Time"],
      title: "Software Engineer",
      logo: "/leadows-logo.png",
      start: "Sept 2024",
      end: "Present",
      description:
        "Architected and built large-file (10GB+) direct upload pipeline to AWS S3 using React + AWS SDK, eliminating backend load and cutting transfer cost by ~30%. Developed solar analytics dashboard in Next.js (TypeScript + ShadCN), delivering real-time insights using OCR-extracted utility bill data. Engineered ERP modules (Asset Management, HR, Operations) with React + Spring Boot + PostgreSQL 17, automating internal workflows.",
    },
    {
      company: "Leadows Technologies Pvt. Ltd",
      link: "https://leadows.com",
      badges: ["Internship"],
      title: "Trainee Software Engineer",
      logo: "/leadows-logo.png",
      start: "Jul 2024",
      end: "Sept 2024",
      description:
        "Contributed to full-stack components across multiple client platforms. Built internal tools and APIs using React, Node.js, and Spring Boot. Strengthened fundamentals in clean code, Git workflows, and scalable backend patterns.",
    },
  ],
  skills: [
    "JavaScript",
    "TypeScript",
    "Java",
    "React.js",
    "Next.js",
    "Node.js",
    "Express.js",
    "Spring Boot",
    "PostgreSQL",
    "MongoDB",
    "MySQL",
    "AWS (S3, EC2, Amplify, Cognito)",
    "GCP",
    "Docker",
    "Linux",
  ],
  projects: [
    {
      title: "Ek-City – Social Media Platform",
      techStack: ["React", "Node.js", "PostgreSQL"],
      description:
        "Built a city-focused platform delivering real-time, verified updates from officials. Gained traction from local government groups in Nagpur.",
      link: {
        label: "github.com",
        href: "#",
      },
    },
    {
      title: "Category Management App",
      techStack: ["Flutter", "Firebase", "Java Spring Boot", "PostgreSQL"],
      description:
        "Developed a cross-platform organizer for documents, tasks, and media. Implemented end-to-end encryption for secure data handling.",
      link: {
        label: "github.com",
        href: "#",
      },
    },
    {
      title: "Biotech Analysis Platform",
      techStack: ["React", "Vite", "TypeScript", "AWS S3", "Cognito"],
      description:
        "Designed a system enabling direct multi-GB file uploads without backend involvement. Improved throughput and significantly reduced server costs.",
      link: {
        label: "github.com",
        href: "#",
      },
    },
    {
      title: "Solar Analytics Dashboard",
      techStack: ["Next.js", "TypeScript", "ShadCN"],
      description:
        "Created interactive dashboards for analyzing solar plant efficiency. Integrated OCR-based bill parsing to compute real-time insights.",
      link: {
        label: "github.com",
        href: "#",
      },
    },
  ],
} as const;
