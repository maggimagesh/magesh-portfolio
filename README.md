# Magesh Kumar A T — Resume Webapp

A responsive, resume webapp built with React + Vite and Tailwind CSS. Data is sourced from `public/resume.json` so you can edit content without touching components.

## Tech Stack
- React 18 + Vite
- Tailwind CSS
- PostCSS + Autoprefixer

## Local Development
```bash
npm install
npm run dev
```
Visit `http://localhost:5173`.

## Build & Preview
```bash
npm run build
npm run preview
```

## Theming
- Dark mode is the default (set on `<html>`). Toggle via the sun button in the navbar.
- If adjusting colors, prefer Tailwind utility classes and keep contrast high for light mode.

## Structure
```
src/
  components/
    Navbar.jsx  // theme toggle
    Hero.jsx    // name, title, location, links, avatar
    Section.jsx // section wrapper
  App.jsx       // sections: Experience, Projects, Skills, More, Education, Contact
public/
  resume.json   // all resume data
  logos/        // company/school/social/portrait images
```

## Deploy
Any static host works (Vercel/Netlify/GitHub Pages). Serve the `dist/` directory after `npm run build`.
