import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import Terminal from './components/Terminal.jsx'
import BootScreen from './components/BootScreen.jsx'

export default function App() {
  const [neon, setNeon] = useState(() => {
    try { return localStorage.getItem('portfolio:neon') === '1' } catch { return false }
  })
  const [bootDone, setBootDone] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    if (neon) {
      root.classList.add('neon')
    } else {
      root.classList.remove('neon')
    }
  }, [neon])

  useEffect(() => {
    try { localStorage.setItem('portfolio:neon', neon ? '1' : '0') } catch {}
  }, [neon])

  return (
    <>
      {!bootDone && <BootScreen onDone={() => setBootDone(true)} />}
      <div className={`min-h-screen w-full flex flex-col md:flex-row`}>
        {/* Left 30% Sidebar */}
        <aside className="hidden md:flex md:w-[30%] p-6">
          <Sidebar neon={neon} onToggleNeon={() => setNeon(v => !v)} />
        </aside>

        {/* Right 70% Terminal */}
        <main className="w-full md:w-[70%] p-3 md:p-6">
          <div className="md:hidden mb-4">
            {/* On mobile, show compact header with toggle */}
            <div className="flex items-center justify-between bg-white/5 backdrop-blur border border-white/10 rounded-xl px-4 py-3">
              <div className="text-sm text-white/70">Niyaz Khan</div>
              <button
                onClick={() => setNeon(v => !v)}
                className={`px-3 py-1 text-xs rounded-md border ${neon ? 'border-emerald-400 text-emerald-300' : 'border-white/20 text-white/70'}`}
              >
                {neon ? '☀️' : '🌙'}
              </button>
            </div>
          </div>
          <Terminal neon={neon} onToggleTheme={() => setNeon(v => !v)} />
        </main>
      </div>
    </>
  )
}
