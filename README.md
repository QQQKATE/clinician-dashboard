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

## Deploy

### GitHub Pages

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that automatically builds and deploys to GitHub Pages on every push to the `main` branch.

**Setup Instructions:**
1. Push this repo to GitHub
2. Go to **Settings** > **Pages**
3. Under **Source**, select **GitHub Actions**
4. The workflow will automatically trigger on the next push to `main` and deploy your site

**Permissions Required:**
The workflow requires the following permissions (already configured in the workflow file):
- `contents: read` - to checkout the repository
- `pages: write` - to deploy to GitHub Pages
- `id-token: write` - for OIDC authentication
- `actions: read` - to read workflow artifacts

**Viewing Your Site:**
After successful deployment, your site will be available at:
`https://<your-username>.github.io/clinician-dashboard/`

### Vercel
- Import this repo into Vercel
- Framework: Vite
- Build command: `npm run build`
- Output: `dist`

### Netlify
- Connect GitHub repo to Netlify
- Build command: `npm run build`
- Publish directory: `dist`

## Notes
- State is in-memory for demos. For persistence, add a localStorage adapter later.
