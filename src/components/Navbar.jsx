import React from 'react'

export default function Navbar({ personal }) {
  const [mobileOpen, setMobileOpen] = React.useState(false)

  const handleThemeToggle = () => {
    const root = document.documentElement
    const isDark = root.classList.contains('dark')
    if (isDark) root.classList.remove('dark')
    else root.classList.add('dark')
    try {
      localStorage.setItem('theme', isDark ? '' : 'dark')
    } catch {}
  }

  React.useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 640) setMobileOpen(false)
    }
    const onHashChange = () => setMobileOpen(false)
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false)
    }
    window.addEventListener('resize', onResize)
    window.addEventListener('hashchange', onHashChange)
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('resize', onResize)
      window.removeEventListener('hashchange', onHashChange)
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <header id="navbar" className="fixed top-0 left-0 right-0 z-50 w-full backdrop-blur bg-white/60 dark:bg-[#0b1220]/60 border-b border-slate-200/60 dark:border-slate-700/50">
      <nav className="mx-auto max-w-5xl px-4 h-14 flex items-center justify-between">
        <a href="#home" className="font-semibold tracking-tight">
          {personal?.name || 'Portfolio'}
        </a>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md p-2 sm:hidden border border-slate-300 dark:border-slate-700"
            aria-label="Open menu"
            aria-controls="mobile-menu"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">Toggle navigation</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              {mobileOpen ? (
                <path fillRule="evenodd" d="M6.225 4.811a1 1 0 011.414 0L12 9.172l4.361-4.361a1 1 0 111.414 1.414L13.414 10.586l4.361 4.361a1 1 0 11-1.414 1.414L12 12l-4.361 4.361a1 1 0 11-1.414-1.414l4.361-4.361-4.361-4.361a1 1 0 010-1.414z" clipRule="evenodd" />
              ) : (
                <path fillRule="evenodd" d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
              )}
            </svg>
          </button>
          <div className="hidden sm:flex items-center gap-5 text-sm">
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
        </div>
      </nav>
      {/* Mobile menu */}
      {mobileOpen && (
        <div id="mobile-menu" className="sm:hidden border-t border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-[#0b1220]/90 backdrop-blur">
          <div className="mx-auto max-w-5xl px-4 py-2">
            <div className="flex flex-col py-2 text-sm">
              <a onClick={() => setMobileOpen(false)} href="#home" className="px-2 py-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">About</a>
              <a onClick={() => setMobileOpen(false)} href="#experience" className="px-2 py-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Experience</a>
              <a onClick={() => setMobileOpen(false)} href="#projects" className="px-2 py-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Projects</a>
              <a onClick={() => setMobileOpen(false)} href="#skills" className="px-2 py-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Skills</a>
              <a onClick={() => setMobileOpen(false)} href="#education" className="px-2 py-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Education</a>
              <a onClick={() => setMobileOpen(false)} href="#contact" className="px-2 py-3 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">Contact</a>
              {personal?.resumePdf && (
                <a onClick={() => setMobileOpen(false)} href={personal.resumePdf} target="_blank" rel="noreferrer" className="mt-2 px-3 py-2 rounded-md bg-slate-900 text-white text-center dark:bg-slate-100 dark:text-slate-900 hover:opacity-90">
                  Resume
                </a>
              )}
              <button onClick={() => { handleThemeToggle(); }} className="mt-2 px-3 py-2 rounded-md border border-slate-300 dark:border-slate-700">Toggle theme</button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}


