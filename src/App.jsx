import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Section from './components/Section'

function useResume() {
  const [data, setData] = React.useState(null)
  const [error, setError] = React.useState(null)
  React.useEffect(() => {
    const root = document.documentElement
    const stored = typeof window !== 'undefined' ? localStorage.getItem('theme') : null
    const preferred = stored || 'dark'
    if (preferred === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')
  }, [])
  React.useEffect(() => {
    const resumeUrl = `${import.meta.env.BASE_URL}resume.json`
    fetch(resumeUrl)
      .then((r) => r.json())
      .then(setData)
      .catch((e) => setError(e))
  }, [])
  return { data, error }
}

function CompanyLogo({ logo, company }) {
  const [hidden, setHidden] = React.useState(false)
  if (!logo || hidden) return null
  return (
    <img
      src={logo}
      alt={`${company} logo`}
      onError={() => setHidden(true)}
      className="h-10 w-10 rounded-full object-contain bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex-shrink-0"
    />
  )
}

export default function App() {
  const { data, error } = useResume()

  if (error) {
    return <div className="mx-auto max-w-5xl p-6 text-red-600">Failed to load resume.</div>
  }
  if (!data) {
    return <div className="mx-auto max-w-5xl p-6">Loading…</div>
  }

  const { personal, profile, experience, education, skills, projects, languages, personality, interests } = data

  return (
    <div className="pt-16">
      <Navbar personal={personal} />
      <Hero personal={personal} profile={profile} />

      {experience?.length ? (
        <Section id="experience" title="Work Experience">
          <ul className="space-y-6">
            {experience.map((item, idx) => {
              const initials = (item.company || '')
                .split(/\s+/)
                .map((s) => s[0])
                .filter(Boolean)
                .slice(0, 2)
                .join('')
                .toUpperCase()
              const isLast = idx === (experience?.length || 0) - 1
              return (
                <li key={idx}>
                  <div className="grid grid-cols-[40px,1fr] gap-4 w-full">
                    <div className="relative">
                      <CompanyLogo logo={item.logo} company={item.company} />
                      {!isLast && (
                        <span className="absolute top-10 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-300 dark:bg-slate-700/50"></span>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium">{item.company}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{item.role}</div>
                        {item.summary && (
                          <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-300/90">{item.summary}</p>
                        )}
                        {item.highlights?.length ? (
                          <ul className="mt-2 list-disc pl-5 text-sm space-y-1 text-slate-700 dark:text-slate-200">
                            {item.highlights.map((h, i) => (
                              <li key={i}>{h}</li>
                            ))}
                          </ul>
                        ) : null}
                        {item.skills?.length ? (
                          <div className="mt-3 flex flex-wrap gap-2 text-xs">
                            {item.skills.map((s, i) => (
                              <span key={i} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{s}</span>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap mt-1">{item.period}</div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </Section>
      ) : null}

      {projects?.length ? (
        <Section id="projects" title="Projects">
          <div className="grid md:grid-cols-2 gap-4">
            {projects.map((p, idx) => (
              <a key={idx} href={p.link || '#'} target={p.link ? '_blank' : undefined} rel={p.link ? 'noreferrer' : undefined} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow">
                <div className="font-medium">{p.name}</div>
                {p.status && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{p.status}</div>}
                {p.period && <div className="text-xs text-slate-500 dark:text-slate-400">{p.period}</div>}
                {p.description && <p className="mt-2 text-sm leading-6 text-slate-700 dark:text-slate-200">{p.description}</p>}
                {p.tech?.length && (
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    {p.tech.map((t, i) => (
                      <span key={i} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{t}</span>
                    ))}
                  </div>
                )}
              </a>
            ))}
          </div>
        </Section>
      ) : null}

      {skills?.length ? (
        <Section id="skills" title="Skills">
          <div className="flex flex-wrap gap-2">
            {skills.map((s, i) => (
              <span key={i} className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm">{s}</span>
            ))}
          </div>
        </Section>
      ) : null}

      {(languages?.length || personality?.length || interests?.length) ? (
        <Section id="extras" title="More">
          <div className="grid grid-cols-[120px,1fr] gap-x-6 gap-y-4">
            {languages?.length ? (
              <>
                <div className="text-slate-500 dark:text-slate-400 text-sm">Languages</div>
                <div className="text-sm text-slate-700 dark:text-slate-200">
                  {languages.map((l) => `${l.name} — ${l.level}`).join(' · ')}
                </div>
              </>
            ) : null}
            {personality?.length ? (
              <>
                <div className="text-slate-500 dark:text-slate-400 text-sm">Personality</div>
                <div className="flex flex-wrap items-center gap-2">
                  {personality.map((p, i) => (
                    <span key={i} className="px-2 py-1 rounded-md text-xs bg-slate-100 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/60">{p}</span>
                  ))}
                </div>
              </>
            ) : null}
            {interests?.length ? (
              <>
                <div className="text-slate-500 dark:text-slate-400 text-sm">Interests</div>
                <div className="flex flex-wrap items-center gap-2">
                  {interests.map((it, i) => (
                    <span key={i} className="px-2 py-1 rounded-md text-xs bg-slate-100 border border-slate-200 dark:bg-slate-800/40 dark:border-slate-700/60">{it}</span>
                  ))}
                </div>
              </>
            ) : null}
          </div>
        </Section>
      ) : null}

      {education?.length ? (
        <Section id="education" title="Education">
          <ul className="space-y-6">
            {education.map((e, idx) => {
              const isLast = idx === (education?.length || 0) - 1
              return (
                <li key={idx}>
                  <div className="grid grid-cols-[40px,1fr] gap-4 w-full">
                    <div className="relative">
                      {e.logo ? (
                        <img src={e.logo} alt={`${e.institution} logo`} className="h-10 w-10 rounded-full object-contain bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex-shrink-0" />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-slate-800 text-slate-100 grid place-items-center border border-slate-700 flex-shrink-0">
                          <span className="text-xs font-semibold">ED</span>
                        </div>
                      )}
                      {!isLast && (
                        <span className="absolute top-10 bottom-0 left-1/2 -translate-x-1/2 w-px bg-slate-700/50"></span>
                      )}
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="font-medium">{e.institution}</div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">{e.degree}{e.location ? ` • ${e.location}` : ''}</div>
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap mt-1">{e.period}</div>
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </Section>
      ) : null}

      <Section id="contact" title="Contact">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          {personal?.email && (
            <a href={`mailto:${personal.email}`} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow flex items-center gap-2">✉️ {personal.email}</a>
          )}
          {personal?.phone && (
            <a href={`tel:${personal.phone}`} className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow flex items-center gap-2">📞 {personal.phone}</a>
          )}
          {personal?.linkedin && (
            <a href={personal.linkedin} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow flex items-center gap-2">
              <img src="/logos/linkedin-logo.png" alt="LinkedIn" className="h-5 w-5" />
              LinkedIn
            </a>
          )}
          {personal?.github && (
            <a href={personal.github} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 hover:shadow flex items-center gap-2">
              <img src="/logos/github-logo.png" alt="GitHub" className="h-5 w-5" />
              GitHub
            </a>
          )}
        </div>
      </Section>

      <footer className="mx-auto max-w-5xl px-4 py-10 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center justify-between">
          <div>© {new Date().getFullYear()} {personal?.name}</div>
        </div>
      </footer>
    </div>
  )
}