# 🌌 Owen Yaku Pers — Personal Bio Card

> 🇷🇺 [Читать на русском / Read in Russian](./README-ru.md)

Hi there! This is the source code for my personal "link-in-bio" page. 

There are no heavy frameworks like Next.js here — just React, Vite, and a bit of Canvas magic. The main highlight is the live Discord presence and an interactive background that reacts to mouse movements. At the same time, I tried to squeeze out maximum performance and accessibility (A11y) so the page flies even on weak devices.

## ✨ Cool Features

- **Live Discord Presence:** Online, Idle, DND, and Offline statuses update in real-time thanks to the [Lanyard API](https://github.com/Phineas/lanyard).
- **Interactive Constellation:** The background is drawn on a `<canvas>`. Particles float, connect with lines, and are attracted to the cursor.
- **Performance Care:** 
  - Animation pauses if the tab is hidden.
  - WebSocket and Canvas properly clean up memory on unmount (no leaks).
  - Heavy `backdrop-blur` filters were removed where they made the GPU suffer.
- **Accessibility (A11y):** 
  - Tabs are keyboard navigable (`←`, `→`, `Home`, `End`).
  - Screen readers announce Discord status changes.
  - Animation is disabled if the user has `prefers-reduced-motion` enabled.
- **Modularity:** All logic is separated into custom hooks and small components, not dumped into one giant file.

## 🛠️ Tech Stack

- **Core:** [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Integration:** Lanyard (WebSocket)

## 🚀 How to Run Locally

Make sure you have Node.js installed (version 18 or higher).

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/bio.git
   cd bio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.

## ⚙️ How to Connect Your Discord

If you want to use this template for yourself:
1. Join the official [Lanyard Discord Server](https://discord.gg/lanyard) (this is mandatory, otherwise the API won't see your status).
2. Enable "Developer Mode" in Discord settings, right-click your avatar, and select "Copy ID".
3. Open `src/App.jsx` and replace the constant:
   ```javascript
   const DISCORD_USER_ID = 'YOUR_ID_HERE';
   ```

## 📂 Project Structure

```text
src/
├── assets/            # Images (avatars, etc.)
├── components/        # UI components (Tabs, Avatar, Icons)
├── hooks/             # Custom hooks
│   ├── useConstellation.js # Canvas physics and rendering
│   └── useLanyard.js       # WebSocket and Discord logic
├── App.jsx            # Page layout
├── index.css          # Global styles (Tailwind)
└── main.jsx           # Entry point
```

---

## 📄 License (MIT)

This project is distributed under the **MIT** License. 

**What this means in plain English:**
You can freely use this code, copy it, modify it, merge it with other code, publish, and distribute it. The only condition is to preserve the attribution (a link to this repository or my nickname). 

The code is provided "as is", without any warranties. If something breaks or the Lanyard server goes down — I am not responsible for it.

*(For the full official text, see the [LICENSE](./LICENSE) file in the repository root).*