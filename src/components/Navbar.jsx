import React from 'react'

export default function Navbar({ personal }) {
  const handleThemeToggle = () => {
    const root = document.documentElement
    const isDark = root.classList.contains('dark')
    if (isDark) root.classList.remove('dark')
    else root.classList.add('dark')
    try {
      localStorage.setItem('theme', isDark ? '' : 'dark')
    } catch {}
  }

  return (
    <header id="navbar" className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur bg-white/60 dark:bg-[#0b1220]/60 border-b border-slate-200/60 dark:border-slate-700/50">
      <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <a href="#home" className="font-semibold tracking-tight">
          {personal?.name || 'Portfolio'}
        </a>
        <div className="flex items-center gap-5 text-sm">
          <a href="#home" className="hover:opacity-80">About</a>
          <a href="#experience" className="hover:opacity-80">Experience</a>
          <a href="#projects" className="hover:opacity-80">Projects</a>
          <a href="#skills" className="hover:opacity-80">Skills</a>
          <a href="#education" className="hover:opacity-80">Education</a>
          <a href="#contact" className="hover:opacity-80">Contact</a>
          {personal?.resumePdf && (
            <a href={personal.resumePdf} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-md bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 hover:opacity-90">
              Resume
            </a>
          )}
          <button onClick={handleThemeToggle} aria-label="Toggle theme" className="px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700">☼</button>
        </div>
      </nav>
    </header>
  )
}


