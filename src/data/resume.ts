export type Language = {
  name: string;
  level: string;
};

export type Experience = {
  company: string;
  location: string;
  role: string;
  period: string;
  logo?: string;
  summary: string;
  highlights: string[];
  skills: string[];
};

export type Education = {
  degree: string;
  institution: string;
  period: string;
  location: string;
  logo?: string;
};

export type Project = {
  name: string;
  link?: string;
  status?: string;
  description: string;
  tech: string[];
};

export type Personal = {
  name: string;
  title: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  resumePdf?: string;
  avatar?: string;
};

export type Resume = {
  personal: Personal;
  profile: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
  personality: string[];
  interests: string[];
  projects: Project[];
};

export const resume: Resume = {
  personal: {
    name: "Magesh Kumar A T",
    title: "Software Quality Engineer",
    location: "Chennai, India",
    email: "maggi121123@gmail.com",
    phone: "+91 8220870722",
    linkedin: "https://www.linkedin.com/in/magesh-kumar-a-t-35782b184/",
    github: "https://github.com/maggimagesh",
    resumePdf: "https://drive.google.com/file/d/1LG-GHSFOq2665J42YXWrYd4n61K5UoAj/view?usp=sharing",
    avatar: "/logos/me.png"
  },
  profile: "Software Quality Engineer with 6 years of experience in web UI and API testing, specialising in Playwright (TypeScript), BDD (Cucumber), Java (Selenium), Jenkins, Postman and Rest Assured. Skilled at building robust, scalable automation frameworks using the Page Object Model (POM) to enhance efficiency and maintainability. Proficient in CI/CD integration, MySQL database testing, SDLC processes and diverse testing methodologies to reduce manual effort and improve coverage.",
  experience: [
    {
      company: "Nibav Lifts Pvt Ltd",
      location: "Chennai",
      role: "Software Quality Engineer (Team Lead)",
      period: "Jun 2024 - Present",
      logo: "/logos/nibav-logo.png",
      summary: "QA Team Lead, owning the test strategy and automation across multiple internal and customer-facing applications using Playwright (TypeScript) and API tools; driving quality outcomes, mentoring, cross-team coordination and on-time delivery.",
      highlights: [
        "SOS Web Application: Comprehensive testing of a safety system to assist customers during home-lift emergencies. Validated CRM-triggered SOS flows and ensured seamless issue resolution. Implemented Playwright TypeScript automation with the Page Object Model to streamline and enhance test efficiency.",
        "Factory Web Application: End-to-end testing for the manufacturing process-management system from order receipt to production and dispatch. Built Playwright TypeScript automation with POM for thorough, reliable regression coverage.",
        "Orders Web Application – Logistics Module: Detailed testing of logistics features to ensure accurate delivery of home-lift orders to customer locations. Validated data accuracy and timelines while leveraging Playwright TypeScript automation with POM for consistency.",
        "Sales Web Application: Ensured the reliability and functionality of the sales-management tool used for demos and discounts. Employed Playwright TypeScript automation with POM to optimise test processes and overall QA.",
        "HRIS Web Application: Automated the end-to-end candidate lifecycle in Playwright TypeScript, covering creation, allocation, onboarding/offboarding and letter generation. Performed API testing with Postman and database validation with MySQL to ensure data integrity across entities and mappings."
      ],
      skills: ["Playwright", "TypeScript", "Postman", "MySQL", "Bitbucket", "Jira", "AWS Pipeline"]
    },
    {
      company: "Infosys",
      location: "Chennai",
      role: "Software Test Engineer",
      period: "Nov 2019 - Jun 2024",
      logo: "/logos/infosys-logo.png",
      summary: "Worked on automation and manual testing across banking and e-commerce projects using Java, Selenium, Cucumber, TestNG and Postman. Built CI/CD with Jenkins and Maven, implemented data-driven tests and regression suites, and authored detailed test documentation.",
      highlights: [
        "Shaneco E-Com: Comprehensive e-commerce testing including customer journey flows (browsing, cart management, checkout, payment processing) and company-side order processing workflows. Implemented CI/CD with Jenkins, Git workflows, SQL database validation, Maven-based build and reporting, BDD with Cucumber, API testing with Postman/Rest Assured, and data-driven automated regression testing.",
        "Hellenic Bank: Manual testing of comprehensive banking application covering critical financial flows including account management, fund transfers (domestic/international), loan processing, credit card operations, payment processing, and regulatory compliance testing. Performed detailed requirements analysis, test planning and design, manual test case execution, defect identification and reporting, SQL for back-end validation, and comprehensive test documentation using Jira for test cases and defect tracking."
      ],
      skills: ["Java", "Selenium", "Cucumber", "TestNG", "Postman", "Rest Assured", "Maven", "Jenkins", "Git", "SQL", "Jira"]
    }
  ],
  education: [
    {
      degree: "B.E. Mechanical Engineering",
      institution: "Adhiyamaan College of Engineering",
      period: "2015 - 2019",
      location: "Hosur",
      logo: "/logos/adhiyamaan-logo.png"
    },
    {
      degree: "12th Grade",
      institution: "Sunbeam Matric Hr. Sec. School",
      period: "2014 - 2015",
      location: "Katpadi",
      logo: "/logos/sunbeam-logo.png"
    },
    {
      degree: "10th Grade",
      institution: "Saraswathi Vidhyalaya Matric Hr. Sec. School",
      period: "2012 - 2013",
      location: "Gudiyatham",
      logo: "/logos/saraswathi-logo.png"
    }
  ],
  skills: [
    "Playwright", "TypeScript", "Java", "Selenium", "Postman", "BDD Cucumber", "TestNG", "Bitbucket", "Jenkins", "Git", "MySQL", "AWS", "Jira"
  ],
  languages: [
    { name: "Tamil", level: "Native" },
    { name: "English", level: "B2" }
  ],
  personality: ["Meticulous", "Open-minded", "Goal-oriented", "Fast learner", "Team player"],
  interests: ["Movies", "Literature", "Art", "Travelling", "Cultural diversity"],
  projects: [
    {
      name: "AI Assisted Job Search Bot",
      link: "https://career-spider.vercel.app",
      status: "Live",
      description: "Career Spider helps discover and track roles with AI-assisted search and filtering.",
      tech: ["Next.js", "TypeScript", "TailwindCSS", "React JS"]
    },
    {
      name: "Angaadi – Automation Testing Practice Platform",
      link: "https://angaadi.vercel.app",
      status: "Under Development",
      description: "Angaadi is a demo e‑commerce website built for automation testers to practice and refine their testing skills. Inspired by real-world online store workflows, it includes features like product listings, advanced search, shopping cart management, checkout processes, and order tracking. Designed from tester feedback, it provides realistic scenarios for validating UI interactions, backend processes, and API calls. The platform is regularly updated to reflect modern e‑commerce challenges, making it ideal for end‑to‑end automation practice with tools such as Playwright, Selenium, and Cypress.",
      tech: ["Next.js", "TypeScript", "React", "Vite", "CSS"]
    }
  ]
};

export default resume;


