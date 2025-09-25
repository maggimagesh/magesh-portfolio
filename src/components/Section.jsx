import React from 'react'

export default function Section({ id, title, children }) {
  return (
    <section id={id} className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
      <h2 className="text-lg sm:text-xl font-semibold tracking-tight mb-4 sm:mb-6">{title}</h2>
      <div className="space-y-6">{children}</div>
    </section>
  )
}


