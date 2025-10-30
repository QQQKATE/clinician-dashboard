# Clinician Dashboard (Templates + Calendar + Pathways)

A minimal React + Vite + Tailwind app that demonstrates:
- Template Library (Module/Quiz/Consent/Reminder)
- Drag-and-drop scheduling to a weekly calendar
- Schedule Drawer (edit/delete + weekly RRULE)
- Pathway Builder (apply templates relative to a reference date)
- Patient Preview and simple Analytics tiles
- Audit logging of key actions

## Dev
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Deploy (Vercel)
- Import this repo into Vercel
- Framework: Vite
- Build command: `npm run build`
- Output: `dist`

## Notes
- State is in-memory for demos. For persistence, add a localStorage adapter later.
