# 🐍 Neon Snake

> *Classic Snake meets Tron. A retro arcade experience with neon aesthetics, power-ups, and particle effects.*

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green)

## 🎮 Play

Arrow keys, WASD, or swipe on mobile. That's it. You know what to do.

## ✨ Features

- **🕹️ Smooth Movement** — Fluid canvas-based rendering, not grid-snapping
- **💡 Neon Glow Effects** — Cyan snake, pink food, purple walls — all glowing
- **🌀 Glowing Trails** — The snake leaves a fading neon trail behind it
- **📺 CRT Overlay** — Subtle scanlines and vignette for that retro feel
- **⚡ Power-ups** — Speed boost, slow-mo, double points, shield — each with unique glowing colors
- **🎆 Particle Effects** — Burst of particles when eating food or dying
- **📳 Screen Shake** — Impact feedback on death
- **🏆 High Scores** — Persisted per difficulty in localStorage
- **🎚️ 4 Difficulty Levels** — Easy → Insane, with high scores tracked per level
- **⏸️ Pause Menu** — Resume, restart, or quit mid-game
- **💀 Game Over Stats** — Score, food eaten, length, time survived, and more
- **📱 Mobile Support** — Swipe controls for touch devices
- **⌨️ Multiple Input** — Arrow keys + WASD + touch swipe

## 🛡️ Power-up Guide

| Power-up | Color | Effect | Duration |
|----------|-------|--------|----------|
| ⚡ Speed | Orange | 1.6x movement speed | 5s |
| 🐌 Slow-Mo | Blue | 0.5x movement speed | 6s |
| ✨ Double Points | Yellow | 2x score per food | 8s |
| 🛡️ Shield | Green | Survive one wall/self collision | 7s |

## 🚀 Getting Started

```bash
git clone https://github.com/Sanjays2402/neon-snake.git
cd neon-snake
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start playing.

## 🏗️ Tech Stack

- **React 19** — UI framework
- **Vite 8** — Build tool
- **Tailwind CSS v4** — Styling
- **Canvas API** — Game rendering with custom glow/particle systems
- **localStorage** — High score persistence

## 📁 Structure

```
src/
├── game/
│   ├── constants.js    # Colors, sizes, difficulty configs
│   ├── engine.js       # Core game logic (movement, collision, powerups)
│   ├── particles.js    # Particle system for effects
│   └── renderer.js     # Canvas drawing (snake, food, CRT, trails)
├── components/
│   ├── GameCanvas.jsx  # Canvas component with game loop
│   ├── StartScreen.jsx # Difficulty selection
│   ├── HUD.jsx         # Score display
│   ├── PauseOverlay.jsx
│   └── GameOverScreen.jsx
├── App.jsx
├── main.jsx
└── index.css
```

## 📝 License

MIT

## Terms & Disclaimer

By using this project you agree to the following.

- **No warranty.** This software is provided "as is", without warranty of any kind, express or implied, including merchantability, fitness for a particular purpose, and non-infringement.
- **No liability.** To the maximum extent permitted by law, the author and contributors are not liable for any claim, loss, or damage (direct, indirect, incidental, or consequential, including lost data or profits) arising from its use.
- **Your responsibility.** You use it at your own risk and are responsible for complying with the laws that apply to you.
- **Third parties.** Names, logos, APIs, and services of others belong to their owners and are used for identification only; no affiliation or endorsement is implied.
- **Your statutory rights.** Nothing here limits rights that cannot be waived by agreement, including under consumer-protection laws in the USA, Canada (including Quebec), and India (Consumer Protection Act, 2019).
- **License.** Use, copying, and distribution are governed by the [LICENSE](LICENSE) file; if anything here conflicts with it, the license controls.
