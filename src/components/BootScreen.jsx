import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

export default function BootScreen({ onDone = () => {} }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setStep(3)
      const t = setTimeout(() => onDone(), 500)
      return () => clearTimeout(t)
    }
    const t1 = setTimeout(() => setStep(1), 350)
    const t2 = setTimeout(() => setStep(2), 900)
    const t3 = setTimeout(() => setStep(3), 1500)
    const t4 = setTimeout(() => onDone(), 2200)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4) }
  }, [onDone])

  const messages = [
    'Initializing portfolio system...',
    'Loading Niyaz Khan\u2019s profile...',
    "Type 'help' to get started.",
  ]

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-[#05080a]">
      <div className="w-[90%] max-w-xl rounded-2xl border border-white/10 bg-black/40 backdrop-blur px-6 py-8">
        <div className="text-[var(--terminal-green)] font-mono space-y-2">
          {messages.slice(0, step).map((m, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              {m}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
