import React from 'react'
import { FaGithub, FaLinkedin, FaInstagram } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'
import { SOCIALS } from '../data/commands.js'

export default function Sidebar({ neon, onToggleNeon }) {
  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="w-full max-w-xs bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 text-center shadow-glow">
        <ProfileAvatar />
        <h1 className="mt-4 text-2xl font-semibold">Niyaz Khan</h1>
        <p className="mt-1 text-white/60">Full-Stack Developer | Tech Explorer</p>

        <div className="mt-5 flex items-center justify-center gap-4">
          <SocialLink href={SOCIALS.github} label="GitHub"><FaGithub /></SocialLink>
          <SocialLink href={SOCIALS.linkedin} label="LinkedIn"><FaLinkedin /></SocialLink>
          <SocialLink href={SOCIALS.instagram} label="Instagram"><FaInstagram /></SocialLink>
          <SocialLink href={`mailto:${SOCIALS.email}`} label="Email"><MdEmail /></SocialLink>
        </div>

        <button
          onClick={onToggleNeon}
          className={`mt-6 w-full py-2 rounded-lg border transition ${neon ? 'border-emerald-400 text-emerald-300 shadow-glow' : 'border-white/15 text-white/70 hover:border-white/30'}`}
        >
          Toggle {neon ? 'Neon' : 'Dark'} Mode
        </button>
      </div>
    </div>
  )
}

function ProfileAvatar() {
  // Try to load a public/profile.jpg. If it fails, render fallback initials.
  const [showImg, setShowImg] = React.useState(true)
  const src = '/profile.jpg'

  return (
    <div className="relative w-32 h-32 mx-auto will-change-transform transition-transform duration-300 hover:-translate-y-1">
      {showImg ? (
        <img
          src={src}
          alt="Profile"
          className="w-32 h-32 rounded-full object-cover border border-white/15 shadow-glow"
          onError={() => setShowImg(false)}
        />
      ) : (
        <div className="w-32 h-32 rounded-full grid place-content-center border border-white/15 bg-gradient-to-br from-emerald-500/20 to-cyan-500/10">
          <span className="text-3xl font-semibold text-white/80">NK</span>
        </div>
      )}
      <div className="absolute inset-0 rounded-full pointer-events-none" />
    </div>
  )
}

function SocialLink({ href, label, children }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label={label}
      className="text-white/70 hover:text-emerald-300 transition drop-shadow-[0_0_6px_rgba(57,255,20,0.35)]"
    >
      <span className="text-2xl">{children}</span>
    </a>
  )
}
