import React, { useEffect, useMemo, useRef, useState } from 'react'
import { getResponse, getSuggestions, COMMANDS } from './CommandHandler.jsx'
import { motion } from 'framer-motion'
import '../styles/terminal.css'
import { PROJECTS, EXPERIENCE, EDUCATION, SOCIALS } from '../data/commands.js'

const MatrixRain = React.lazy(() => import('./MatrixRain.jsx'))

function Typewriter({ text = '', speed = 12, className = '' }) {
  const [out, setOut] = useState('')
  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setOut(text)
      return
    }
    let i = 0
    const id = setInterval(() => {
      setOut(prev => (i < text.length ? text.slice(0, ++i) : prev))
      if (i >= text.length) clearInterval(id)
    }, speed)
    return () => clearInterval(id)
  }, [text, speed])
  return <span className={className}>{out}</span>
}

export default function Terminal({ neon, onToggleTheme = () => {} }) {
  const [lines, setLines] = useState([]) // displayed output lines
  const [input, setInput] = useState('')
  const [history, setHistory] = useState([])
  const [historyIndex, setHistoryIndex] = useState(-1) // -1 means not browsing history
  const scrollRef = useRef(null)
  const inputRef = useRef(null)
  const [matrixOn, setMatrixOn] = useState(false)
  const [lastList, setLastList] = useState(null) // { type: 'projects'|'experience'|'education', items: [] }

  const suggestion = useMemo(() => {
    if (!input) return ''
    const matches = getSuggestions(input)
    return matches.length ? matches[0] : ''
  }, [input])

  const suggestionsList = useMemo(() => {
    if (!input) return []
    return getSuggestions(input).slice(0, 5)
  }, [input])

  useEffect(() => {
    // Initial welcome text
    const welcome = [
      "Welcome to Niyaz's Portfolio Terminal",
      "Type 'help' to see available commands.",
    ]
    setLines(welcome)
  }, [])

  useEffect(() => {
    const n = scrollRef.current
    if (!n) return
    n.scrollTop = n.scrollHeight
  }, [lines])

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    // load persisted history
    try {
      const saved = JSON.parse(localStorage.getItem('portfolio:history') || '[]')
      if (Array.isArray(saved)) setHistory(saved)
    } catch {}
  }, [])

  useEffect(() => {
    // persist history
    try { localStorage.setItem('portfolio:history', JSON.stringify(history)) } catch {}
  }, [history])

  function onSubmit(cmd) {
    const raw = cmd.trim()
    if (!raw) return

    const updated = [...lines, `> ${raw}`]
    const resp = getResponse(raw)
    const lower = raw.toLowerCase()

    // track last list context for open/details
    if (lower === 'projects') setLastList({ type: 'projects', items: PROJECTS })
    if (lower === 'experience') setLastList({ type: 'experience', items: EXPERIENCE })
    if (lower === 'education') setLastList({ type: 'education', items: EDUCATION })

    // clear handling
    if (resp.length === 1 && resp[0] === '__CLEAR__') {
      setLines([])
      setLastList(null)
    } else {
      // handle special actions
      if (resp.includes('__THEME_TOGGLE__')) {
        onToggleTheme()
        const without = resp.filter(r => r !== '__THEME_TOGGLE__')
        setLines([...updated, ...without, 'Theme toggled.'])
      } else if (resp.some(r => r.startsWith('__THEME_SET__'))) {
        const token = resp.find(r => r.startsWith('__THEME_SET__'))
        const mode = token.split(':')[1]
        if (mode === 'neon') {
          // ensure neon on
          if (!neon) onToggleTheme()
          setLines([...updated, `Theme set: neon`])
        } else if (mode === 'dark') {
          if (neon) onToggleTheme()
          setLines([...updated, `Theme set: dark`])
        } else {
          setLines([...updated, `Unsupported theme: ${mode}`])
        }
      } else if (resp.includes('__MATRIX_TOGGLE__')) {
        const turnOn = !matrixOn
        setMatrixOn(turnOn)
        const without = resp.filter(r => r !== '__MATRIX_TOGGLE__')
        setLines([...updated, ...without, turnOn ? 'Matrix rain enabled.' : 'Matrix rain disabled.'])
      } else if (resp.includes('__MATRIX_ON__')) {
        setMatrixOn(true)
        setLines([...updated, 'Matrix rain enabled.'])
      } else if (resp.includes('__MATRIX_OFF__')) {
        setMatrixOn(false)
        setLines([...updated, 'Matrix rain disabled.'])
      } else if (resp.some(r => r.startsWith('__OPEN__'))) {
        const token = resp.find(r => r.startsWith('__OPEN__'))
        const n = parseInt(token.split(':')[1], 10)
        if (!lastList) {
          setLines([...updated, 'Nothing to open. Run projects/experience/education first.'])
        } else {
          const idx = n - 1
          const item = lastList.items[idx]
          if (!item) {
            setLines([...updated, `Invalid index: ${n}`])
          } else if (lastList.type === 'projects') {
            const url = item.live || item.github
            if (url) {
              try { window.open(url, '_blank', 'noreferrer') } catch {}
              setLines([...updated, `Opening: ${url}`])
            } else {
              setLines([...updated, 'No link available for this project.'])
            }
          } else {
            setLines([...updated, 'Open is supported for projects only. Use details <n>.'])
          }
        }
      } else if (resp.some(r => r.startsWith('__DETAILS__'))) {
        const token = resp.find(r => r.startsWith('__DETAILS__'))
        const n = parseInt(token.split(':')[1], 10)
        if (!lastList) {
          setLines([...updated, 'Nothing to show. Run projects/experience/education first.'])
        } else {
          const idx = n - 1
          const item = lastList.items[idx]
          if (!item) {
            setLines([...updated, `Invalid index: ${n}`])
          } else if (lastList.type === 'projects') {
            const out = [
              `${n}) ${item.title} — ${item.description}`,
              item.github ? `GitHub: ${item.github}` : null,
              item.live ? `Live: ${item.live}` : null,
            ].filter(Boolean)
            setLines([...updated, ...out])
          } else if (lastList.type === 'experience') {
            setLines([...updated, `${n}) ${item.role} @ ${item.company} — ${item.period}`, item.details])
          } else if (lastList.type === 'education') {
            setLines([...updated, `${n}) ${item.degree} — ${item.institute} (${item.period})`])
          }
        }
      } else if (resp.some(r => r.startsWith('__COPY__'))) {
        const token = resp.find(r => r.startsWith('__COPY__'))
        const key = token.split(':')[1]
        let text = ''
        if (key === 'email') text = SOCIALS.email
        else if (key === 'phone') text = SOCIALS.phone
        if (!text) {
          setLines([...updated, 'Nothing to copy.'])
        } else {
          try {
            navigator.clipboard?.writeText(text)
            setLines([...updated, `Copied: ${text}`])
          } catch {
            setLines([...updated, `Copy failed. Email: ${text}`])
          }
        }
      } else {
        setLines([...updated, ...resp])
      }
    }

    const nextHistory = [...history]
    if (raw && (nextHistory.length === 0 || nextHistory[nextHistory.length - 1] !== raw)) {
      nextHistory.push(raw)
    }
    setHistory(nextHistory)
    setHistoryIndex(-1)
    setInput('')
  }

  function onKeyDown(e) {
    // shortcuts
    if (e.ctrlKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault()
      setLines([])
      return
    }
    if (e.ctrlKey && (e.key === 'u' || e.key === 'U')) {
      e.preventDefault()
      setInput('')
      return
    }
    if (e.key === 'Enter') {
      e.preventDefault()
      onSubmit(input)
      return
    }

    if (e.key === 'Tab') {
      e.preventDefault()
      if (suggestion) setInput(suggestion)
      return
    }

    if (e.key === 'ArrowUp') {
      e.preventDefault()
      if (!history.length) return
      const nextIndex = historyIndex < 0 ? history.length - 1 : Math.max(0, historyIndex - 1)
      setHistoryIndex(nextIndex)
      setInput(history[nextIndex])
      return
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      if (!history.length) return
      if (historyIndex < 0) return
      const nextIndex = historyIndex + 1
      if (nextIndex >= history.length) {
        setHistoryIndex(-1)
        setInput('')
      } else {
        setHistoryIndex(nextIndex)
        setInput(history[nextIndex])
      }
      return
    }
  }

  const suffix = suggestion && suggestion.startsWith(input) ? suggestion.slice(input.length) : ''

  return (
    <div className={`relative h-[80vh] md:h-[calc(100vh-3rem)] w-full flex flex-col rounded-xl border border-white/10 bg-[var(--terminal-bg)] overflow-hidden ${neon ? 'neon-glow' : ''}`}>
      {/* Terminal Header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-white/10 bg-black/30">
        <div className="w-3 h-3 rounded-full bg-red-500/80" />
        <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
        <div className="w-3 h-3 rounded-full bg-green-500/80" />
        <div className="ml-3 text-xs text-white/50">portfolio@niyaz: ~</div>
      </div>

      {/* Output Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 terminal-scrollbar">
        {lines.map((ln, i) => (
          <div key={i} className="text-[15px] leading-relaxed text-[var(--terminal-green)]">
            {renderLine(ln)}
          </div>
        ))}
      </div>

      {/* Input Area */}
      <div className="px-4 py-3 border-t border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          <span className="text-[var(--terminal-green)]">$</span>
          <div className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              spellCheck={false}
              className="w-full bg-transparent outline-none text-[15px] text-[var(--terminal-green)] caret-emerald-400 placeholder:text-white/30"
              placeholder="Type a command (help, about, skills, projects, contact, social, theme, quote, matrix, clear)"
            />
            {suffix && (
              <div className="pointer-events-none absolute inset-0 text-[15px] text-white/25">
                <span className="opacity-0 select-none">{input}</span>
                <span>{suffix}</span>
              </div>
            )}
            {suggestionsList.length > 1 && (
              <div className="absolute z-10 mt-1 w-64 rounded-md border border-white/10 bg-black/80 backdrop-blur">
                {suggestionsList.map(s => (
                  <div
                    key={s}
                    onMouseDown={() => setInput(s)}
                    className="px-2 py-1 text-xs text-white/70 hover:bg-white/10 cursor-pointer"
                  >
                    {s}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="mt-2 text-xs text-white/40">
          Tips: Press Tab to auto-complete, ↑/↓ to navigate history. Try 'niyaz'.
        </div>
      </div>

      {matrixOn && (
        <React.Suspense fallback={null}>
          <MatrixRain />
        </React.Suspense>
      )}
    </div>
  )
}

function renderLine(ln) {
  // detect links and mailto, render as clickable; otherwise typewriter
  const linkRegex = /(https?:\/\/[^\s]+|mailto:[^\s]+|tel:[^\s]+)/gi
  const hasLink = linkRegex.test(ln)
  if (!hasLink) {
    return <Typewriter text={ln} />
  }
  // Reset regex lastIndex for reuse
  linkRegex.lastIndex = 0
  const parts = []
  let lastIndex = 0
  let m
  while ((m = linkRegex.exec(ln)) !== null) {
    const url = m[0]
    const start = m.index
    if (start > lastIndex) {
      parts.push(<span key={`t-${start}`}>{ln.slice(lastIndex, start)}</span>)
    }
    parts.push(
      <a key={`a-${start}`} href={url} target="_blank" rel="noreferrer" className="text-[var(--terminal-cyan)] underline">
        {url}
      </a>
    )
    lastIndex = start + url.length
  }
  if (lastIndex < ln.length) {
    parts.push(<span key={`t-end`}>{ln.slice(lastIndex)}</span>)
  }
  return <span>{parts}</span>
}
