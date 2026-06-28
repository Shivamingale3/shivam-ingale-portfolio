export const RESUME_DATA = {
  name: "Shivam Ingale",
  initials: "SI",
  location: "Nagpur, India",
  locationLink: "https://www.google.com/maps/place/Nagpur",
  about:
    "Full-stack Engineer experienced in building production-grade systems across React, Next.js, Node.js, and Spring Boot. Strong ownership mindset — handling architecture, implementation, and delivery end-to-end.",
  summary:
    "Full-stack Engineer experienced in building production-grade systems across React, Next.js, Node.js, and Spring Boot. Delivered cloud-ready solutions on AWS/GCP, optimized system performance, and shipped features used by real clients. Strong ownership mindset — handle architecture, implementation, and delivery end-to-end.",
  avatarUrl: "/profile.png",
  personalWebsiteUrl: "https://shivamingale.com",
  resumeUrl: "https://www.shivamingale.com/Shivam_Ashok_Ingale_SDE.pdf", // Placeholder
  contact: {
    email: "shivamingale3@gmail.com",
    tel: "+91-9325063591",
    social: [
      {
        name: "GitHub",
        url: "https://github.com/Shivamingale3", // Infurred
        icon: "Github",
      },
      {
        name: "LinkedIn",
        url: "https://www.linkedin.com/in/shivam-ingale/", // Infurred
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
      grade: "CGPA: 7.8",
    },
  ],
  work: [
    {
      company: "Leadows Technologies Pvt. Ltd",
      link: "https://leadows.com",
      badges: ["Full-Time"],
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
      title: "Cloudlet",
      logo: "/cloudlet.png",
      techStack: [
        "React 18",
        "Vite",
        "TypeScript",
        "Tailwind CSS",
        "Redux Toolkit",
        "Node.js",
        "JWT",
        "Multer",
        "Mongoose",
        "MongoDB",
      ],
      description:
        "Cloudlet is a powerful, secure, and modern cloud storage platform designed for individuals and teams who want full control over their data. With a beautiful glassmorphism-inspired UI and a robust S3-like backend, Cloudlet offers seamless file management, secure sharing, and detailed system observability.",
      link: {
        github: "https://github.com/Shivamingale3/cloudlet",
        web: "https://cloudlet.shivamingale.com",
      },
    },
    {
      title: "PiDex - Home Server Watchman",
      logo: "/pidex.png",
      techStack: ["Go", "Linux", "Telegram Bot API"],
      description:
        "PiDex keeps an eye on processes consuming your Raspberry Pi's RAM or CPU. Get notified instantly if a service starts hogging resources, helping you maintain server stability without constantly checking in.",
      link: {
        github: "https://github.com/Shivamingale3/pi_dex",
        web: "https://pidex.shivamingale.com",
      },
    },
    {
      title: "Dumpcron - Scheduled database backup daemon",
      logo: "/dumpcron.png",
      techStack: [
        "Go",
        "Linux",
        "PostgreSQL",
        "Docker",
        "MongoDB",
        "PostgreSQL",
        "MySQL",
      ],
      description:
        "Backs up PostgreSQL, MySQL, and MongoDB on a daily schedule. Streamed zstd compression. Zero runtime dependencies. Telegram alerts via PiDex.",
      link: {
        github: "https://github.com/Shivamingale3/dumpcron",
        web: "https://dumpcron.shivamingale.com",
      },
    },
    {
      title: "ProcPipe - Terminal Process Watcher",
      logo: "/procpipe.png",
      techStack: ["Go", "Telegram Bot API"],
      description:
        "Spawn any long-running command. ProcPipe watches it with zero polling and notifies you on Telegram when it completes or needs input.",
      link: {
        github: "https://github.com/Shivamingale3/procpipe",
        web: "https://procpipe.shivamingale.com",
      },
    },
    {
      title:
        "Silo Vault - A secure place to write whatever's in your mind that you'll forget later.",
      logo: "/silo-vault.png",
      techStack: ["Flutter", "Firebase", "AES Encryption"],
      description:
        "A zero-knowledge vault for passwords and private notes. Decrypted only on your device, never on our servers. AES-256 encryption ensures your data is secure, while Flutter provides a seamless experience.",
      link: {
        github: "https://github.com/Shivamingale3/silo-vault",
        web: "https://silovault.shivamingale.com",
      },
    },
    {
      title: "Cosmic Timer",
      logo: "/cosmic-timer.png",
      techStack: ["NextJs", "React Three Fiber", "TailwindCss"],
      description:
        "Cosmic Timer is not just a productivity tool; it's an immersive 3D experience. Watch as the solar system comes to life on your screen, with planets orbiting in real-time. Set your focus duration and let the majestic rotation of the cosmos guide your workflow. Built with modern web technologies, it features a fully interactive 3D solar system, realistic planet textures, and smooth camera controls.",
      link: {
        github: "https://github.com/Shivamingale3/Cosmic_Timer",
        web: "https://timer.shivamingale.com",
      },
    },
    {
      title: "UniClip-Clipboard Sync over WiFi",
      logo: "uniclip.png",
      techStack: ["Flutter", "UDP/TCP"],
      description:
        "Uniclip is a privacy-first, LAN-only clipboard synchronization tool designed for Android, Windows, and Linux. Seamlessly share text and images between your devices without sending data to the cloud.",
      link: {
        github: "https://github.com/Shivamingale3/uniclip",
        web: "https://uniclip.shivamingale.com",
      },
    },
    {
      title: "Ek-City – Social Media Platform",
      logo: "/ek-city.svg",
      techStack: ["React", "Node.js", "PostgreSQL"],
      description:
        "Built a city-focused platform delivering real-time, verified updates from officials. Gained traction from local government groups in Nagpur.",
      link: {
        github: "https://github.com/Shivamingale3/ekCity-frontend",
        web: "https://ekcity.dealintra.in/",
      },
    },
  ],
} as const;
