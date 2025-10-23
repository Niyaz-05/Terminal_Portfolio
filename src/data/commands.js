// Centralized content and configuration for the terminal

export const ABOUT = "Hi, I'm Niyaz Khan — a full-stack developer who loves turning ideas into code. Passionate about front-end creativity and back-end logic. Always exploring new technologies.";

export const SKILLS = {
  Frontend: ['React', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript'],
  Backend: ['Java', 'Spring Boot', 'REST APIs'],
  Database: ['PostgreSQL', 'MySQL'],
  Tools: ['Git', 'Docker', 'VS Code', 'Postman']
}

export const PROJECTS = [
  {
    title: 'Hospital Management System',
    description: 'Role-based management of patients, appointments, billing. Java + Spring Boot.',
    github: 'https://github.com/niyazkhan/hospital-management',
    live: null,
  },
  {
    title: 'ShelfVerse 3D Bookstore',
    description: 'Immersive 3D product browsing. React + Three.js.',
    github: 'https://github.com/niyazkhan/shelfverse-3d',
    live: 'https://shelfverse.example.com',
  },
  {
    title: 'POP & PVC Catalog Website',
    description: 'Responsive product catalog. React + Tailwind.',
    github: 'https://github.com/niyazkhan/pop-pvc-catalog',
    live: null,
  },
]

export const SOCIALS = {
  github: 'https://github.com/Niyaz-05',
  linkedin: 'https://www.linkedin.com/in/niyaz-khan-ok/',
  instagram: 'https://www.instagram.com/niyaz_khan05/',
  email: 'savagebaba00@gmail.com',
  phone: '7499178303',
}

export const QUOTES = [
  { text: 'First, solve the problem. Then, write the code.', author: 'John Johnson' },
  { text: 'Simplicity is the soul of efficiency.', author: 'Austin Freeman' },
  { text: 'Programs must be written for people to read.', author: 'Harold Abelson' },
  { text: 'Make it work, make it right, make it fast.', author: 'Kent Beck' },
  { text: 'Talk is cheap. Show me the code.', author: 'Linus Torvalds' },
]

export function randomQuote() {
  const i = Math.floor(Math.random() * QUOTES.length)
  return QUOTES[i]
}

export const EXPERIENCE = [
  { role: 'Full-Stack Developer', company: 'Acme Tech', period: '2023 – Present', details: 'Building React frontends and Java/Spring Boot backends.' },
  { role: 'Software Intern', company: 'DevWorks', period: '2022 – 2023', details: 'Contributed to REST APIs and UI components.' },
]

export const EDUCATION = [
  { degree: 'B.Tech in Computer Science', institute: 'XYZ University', period: '2019 – 2023' },
]
