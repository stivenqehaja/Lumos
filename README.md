# 🎬 Lumos — Frontend

This branch contains only the React frontend (the public marketing site plus admin/client UI) for the Lumos casting management platform, deployed as a static site to Cloudflare Pages. Backend logic (Express API, database, etc.) lives on other branches and is not part of this deployment.

## 🏗️ Tech Stack

- **Frontend**: React 19 + Vite
- **Routing**: React Router
- **HTTP Client**: Axios (calls an external API — see below)

## 📁 Project Structure

```
project-root/
└── client/
    ├── src/
    │   ├── components/     # Shared, admin, and client UI components
    │   ├── contexts/       # Auth and Toast context providers
    │   ├── pages/          # Public, admin, and client pages
    │   └── services/       # API client (axios)
    ├── public/
    ├── index.html
    └── vite.config.js
```

## 🚀 Local Development

```bash
cd client
npm install
npm run dev
```

## 📦 Build

```bash
cd client
npm run build
```

Outputs a static site to `client/dist`.

## ☁️ Deploying to Cloudflare Pages (Wrangler)

```bash
cd client
npm run build
npx wrangler pages deploy dist --project-name=lumos
```

Note: admin and client-portal pages in this build call a backend API (`/api/...`, see `client/src/services/api.js`). Without that backend deployed and reachable, those pages will not function — only the public marketing pages (Home/About/Contact) work standalone.

## 📝 License

ISC
