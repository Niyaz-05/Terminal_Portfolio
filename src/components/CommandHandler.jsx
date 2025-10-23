// Command handling logic for the terminal
import { ABOUT, SKILLS, PROJECTS, SOCIALS, randomQuote, EXPERIENCE, EDUCATION } from '../data/commands.js'

export const COMMANDS = [
  'help', 'about', 'skills', 'projects', 'contact', 'social', 'github', 'email', 'phone', 'resume',
  'experience', 'education', 'open', 'details', 'copy',
  'theme', 'quote', 'matrix', 'niyaz', 'clear'
]

export function getSuggestions(partial) {
  if (!partial) return COMMANDS
  const p = partial.toLowerCase()
  return COMMANDS.filter(c => c.startsWith(p))
}

export function getResponse(command) {
  const raw = command.trim()
  const tokens = raw.toLowerCase().split(/\s+/).filter(Boolean)
  const base = tokens[0] || ''
  const args = tokens.slice(1)

  const DESCS = {
    help: 'Show this help menu',
    about: 'Who I am',
    skills: 'Tech stack',
    projects: 'Selected work (with links)',
    contact: 'How to reach me',
    social: 'All social links',
    github: 'GitHub profile link',
    email: 'Email link',
    phone: 'Phone link',
    resume: 'Resume download link',
    experience: 'Work history',
    education: 'Education',
    open: 'Open a listed item by number (e.g., open 2)',
    details: 'Show details for a listed item (e.g., details 2)',
    copy: 'Copy data to clipboard (e.g., copy email)',
    theme: 'Toggle/set theme (theme | theme set neon|dark)',
    quote: 'Random inspirational quote',
    matrix: 'Toggle/enable/disable matrix rain',
    clear: 'Clear the screen',
    niyaz: 'Signature message',
  }

  switch (base) {
    case 'help':
      if (args[0]) {
        const k = args[0]
        if (DESCS[k]) return [`${k} - ${DESCS[k]}`]
        return [`No help available for: ${args[0]}`]
      }
      return [
        'Available commands:',
        ...Object.keys(DESCS).map(k => `  ${k.padEnd(10)} - ${DESCS[k]}`)
      ]
    case 'about':
      return [ABOUT]
    case 'skills':
      return [
        `Frontend: ${SKILLS.Frontend.join(', ')}`,
        `Backend: ${SKILLS.Backend.join(', ')}`,
        `Database: ${SKILLS.Database.join(', ')}`,
        `Tools: ${SKILLS.Tools.join(', ')}`,
      ]
    case 'projects':
      return PROJECTS.flatMap((p, idx) => {
        const out = [`${idx + 1}) ${p.title} — ${p.description}`]
        if (p.github) out.push(`   GitHub: ${p.github}`)
        if (p.live) out.push(`   Live: ${p.live}`)
        return out
      })
    case 'experience':
      return EXPERIENCE.map((e, i) => `${i + 1}) ${e.role} @ ${e.company} — ${e.period}`)
    case 'education':
      return EDUCATION.map((e, i) => `${i + 1}) ${e.degree} — ${e.institute} (${e.period})`)
    case 'contact':
      return [
        `Email: mailto:${SOCIALS.email}`,
        SOCIALS.phone ? `Phone: tel:${SOCIALS.phone}` : null,
        `LinkedIn: ${SOCIALS.linkedin}`,
        `GitHub: ${SOCIALS.github}`,
        `Instagram: ${SOCIALS.instagram}`,
      ].filter(Boolean)
    case 'social':
      return [
        `GitHub: ${SOCIALS.github}`,
        `LinkedIn: ${SOCIALS.linkedin}`,
        `Instagram: ${SOCIALS.instagram}`,
        `Email: mailto:${SOCIALS.email}`,
        SOCIALS.phone ? `Phone: tel:${SOCIALS.phone}` : null,
      ].filter(Boolean)
    case 'github':
      return [`GitHub: ${SOCIALS.github}`]
    case 'linkedin':
      return [`LinkedIn: ${SOCIALS.linkedin}`]
    case 'instagram':
      return [`Instagram: ${SOCIALS.instagram}`]
    case 'email':
      return [`Email: mailto:${SOCIALS.email}`]
    case 'phone':
      return [SOCIALS.phone ? `Phone: tel:${SOCIALS.phone}` : 'Phone not set']
    case 'resume':
      return ['Resume: /resume.pdf']
    case 'quote': {
      const q = randomQuote()
      return [q.text, `- ${q.author}`]
    }
    case 'theme': {
      if (args[0] === 'set' && args[1]) {
        const mode = args[1]
        if (['neon', 'dark', 'light'].includes(mode)) return [`__THEME_SET__:${mode}`]
        return ["Usage: theme set <neon|dark|light>"]
      }
      return ['__THEME_TOGGLE__']
    }
    case 'matrix': {
      if (args[0] === 'on') return ['__MATRIX_ON__']
      if (args[0] === 'off' || args[0] === 'stop') return ['__MATRIX_OFF__']
      return ['__MATRIX_TOGGLE__']
    }
    case 'open': {
      const n = parseInt(args[0], 10)
      if (Number.isFinite(n)) return [`__OPEN__:${n}`]
      return ["Usage: open <number>"]
    }
    case 'details': {
      const n = parseInt(args[0], 10)
      if (Number.isFinite(n)) return [`__DETAILS__:${n}`]
      return ["Usage: details <number>"]
    }
    case 'copy': {
      if (args[0] === 'email') return ['__COPY__:email']
      if (args[0] === 'phone') return ['__COPY__:phone']
      return ["Usage: copy email | copy phone"]
    }
    case 'niyaz':
      return ["👋 Hey! I’m Niyaz — thanks for exploring my portfolio."]
    case 'clear':
      return ['__CLEAR__']
    default:
      return [
        `Command not found: ${raw}`,
        "Type 'help' to see available commands.",
      ]
  }
}
