# 🎬 Cinematic Lyric Video Studio

A 60 FPS HTML5 Canvas & Web Audio API visualizer for generating lyric music videos with daylight scenery, stable camera optics, and box-free typography.

Featured showcase song: **Bohona (বহনা)** by **Abhi Saikia ft. Pinki Medhi & Sens3i**.

---

## ✨ Features

- **Scenic Assam Landscape Composition**:
  - **Middle Floating River**: Realistic daylight flow of the Brahmaputra with sunbeam reflection path, water ripples, and sparkles.
  - **Bamboo Palings & Bamboo Hedges**: Traditional rural Assamese bamboo fences (*Banh-or ches / bera*) lining both riverbanks with green posts, horizontal rails, and living foliage.
  - **Fields of Kash Grass (*Kohua Bon*)**: Dense waving wild sugarcane stalks with feathery white plumes (*Kohua phool*) on both sides.
  - **Traditional Country Boat (*Naao*)**: Wooden boat with boitha (oar) drifting gracefully in the central river channel.
- **100% Box-Free Floating Typography**:
  - Multi-font support: *Cinzel*, *Playfair Display*, *Caveat (Handwritten)*, *Syne*, and *Outfit*.
  - Multi-language lyrics: Romanized, Assamese Lipi (অসমীয়া), and English translation.
  - Real-time golden sweep karaoke highlight with deep contrast drop shadows.
- **Rock-Solid Camera Stability**:
  - Stable daylight visualizer with zero jitter, customizable lighting, and optional 2.39:1 anamorphic letterbox.
- **Aspect Ratio Switcher**:
  - **16:9 Cinema / YouTube** (1920×1080)
  - **9:16 Mobile / Reels / TikTok** (1080×1920)
- **Audio Reactivity**:
  - Real-time Web Audio API frequency analysis for river surface reflections.
  - Byte-range streaming support (HTTP 206) for smooth timeline scrubbing.
- **Recording & Snapshot**:
  - Built-in video recording to WebM / MP4 via MediaRecorder.
  - High-res frame snapshot capture.

---

## 🚀 Quick Start

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)

### 2. Run Locally
```bash
git clone https://github.com/KISHOR403/-Cinematic-Lyric-Studio.git
cd -Cinematic-Lyric-Studio
node server.js
```

Open your browser at:
```
http://localhost:3000
```

---

## 📁 Project Structure

```
├── index.html           # Studio layout & control dock
├── style.css            # Dark glassmorphic studio UI styling
├── app.js               # Audio player, analyzer, transport controls & recording
├── canvas-engine.js     # 60 FPS Canvas rendering engine (River, Kash grass, Bamboo, Boat)
├── lyrics-data.js       # Synchronized lyric timestamps, Lipi & translations
├── server.js            # Node HTTP server with HTTP 206 audio byte-range streaming
└── assets/              # Meadow & landscape backdrop references
```

---

## 📜 License
MIT License.
