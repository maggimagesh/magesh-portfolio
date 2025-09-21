import React from 'react'

export default function Hero({ personal, profile }) {
  return (
    <section id="home" className="mx-auto max-w-5xl px-4 pt-16 pb-8 md:pt-20 md:pb-10">
      <div className="grid md:grid-cols-3 gap-6 items-start">
        <div className="md:col-span-2">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            {personal?.name}
          </h1>
          <p className="mt-2 text-slate-600 dark:text-slate-300">
            {personal?.title} • {personal?.location}
          </p>
          <div className="mt-3 inline-flex items-center gap-2 text-xs">
            <span className="rounded-full bg-slate-800 text-white px-2 py-0.5 border border-slate-700">Hire me!</span>
          </div>
          <p className="mt-4 leading-relaxed text-slate-700 dark:text-slate-200">
            {profile}
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
            {personal?.location && (
              <span className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400"><span>🌐</span>{personal.location}</span>
            )}
            {personal?.email && (
              <a href={`mailto:${personal.email}`} className="inline-flex items-center gap-2 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">✉️ Email</a>
            )}
            {personal?.linkedin && (
              <a href={personal.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                <img src="/logos/linkedin-logo.png" alt="LinkedIn" className="h-4 w-4" />
                <span>LinkedIn</span>
              </a>
            )}
            {personal?.github && (
              <a href={personal.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-2 py-1 rounded-md border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800">
                <img src="/logos/github-logo.png" alt="GitHub" className="h-4 w-4" />
                <span>GitHub</span>
              </a>
            )}
          </div>
        </div>
        {personal?.avatar && (
          <div className="md:justify-self-end">
            <div className="h-28 w-28 md:h-32 md:w-32 rounded-xl overflow-hidden border border-slate-700/60 shadow-sm">
              <img src={personal.avatar} alt={personal.name} className="h-full w-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </section>
  )
}


