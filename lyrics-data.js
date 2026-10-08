// Bohona - Complete Lyrics, Timestamps, Scene Data & Directorial Storyboard
// Song: Bohona by Abhi Saikia ft. Pinki Medhi & Sens3i | Lyrics: Somiran Malay

const BOHONA_DATA = {
  title: "Bohona (বহনা)",
  artists: "Abhi Saikia, Pinki Medhi, Sens3i",
  lyricist: "Somiran Malay",
  audioSrc: "Abhi Saikia, Pinki Medhi, Sens3i - Bohona (Visualizer).mp3",
  bpm: 104,
  durationEstimate: 305, // ~5:05
  scenes: [
    {
      id: "scene-1",
      name: "River of Longing (Brahmaputra Morning Daylight)",
      startTime: 0,
      endTime: 42,
      style: "daylight-river",
      mood: "Bright Morning, Nostalgic Longing, Scenic",
      visualDescription: "Sunny blue skies, radiant sunbeams, lush green bamboo groves swaying by the sparkling Brahmaputra river, distant emerald hills.",
      cameraMove: "stable-wide",
      colorPalette: {
        skyTop: "#1e60c6",
        skyBottom: "#8ec5fc",
        water: "#1a5fb4",
        waterDeep: "#0f3a73",
        hillFar: "#4384a1",
        hillNear: "#1b7340",
        paddy: "#65a30d",
        sun: "#fff5cc",
        accent: "#38bdf8"
      }
    },
    {
      id: "scene-2",
      name: "The Courtyard Gate (Sunny Poduli / Golden Afternoon)",
      startTime: 42,
      endTime: 90,
      style: "sunny-courtyard",
      mood: "Warm Sunlight, Restless Youth, Heartfelt",
      visualDescription: "Golden afternoon sunshine, rural village courtyard gate (poduli), blooming trees, fluttering leaves, gentle warm breeze.",
      cameraMove: "stable-medium",
      colorPalette: {
        skyTop: "#2563eb",
        skyBottom: "#fed7aa",
        water: "#2563eb",
        waterDeep: "#1d4ed8",
        hillFar: "#3b82f6",
        hillNear: "#15803d",
        paddy: "#eab308",
        sun: "#fef08a",
        accent: "#f59e0b"
      }
    },
    {
      id: "scene-3",
      name: "The Whistle & Village Trail (Scenic Sunshine)",
      startTime: 90,
      endTime: 135,
      style: "sunny-trail",
      mood: "Playful, Breezy, Scenic Assam",
      visualDescription: "Lush green countryside pathway, swaying betel palms and bamboo groves, tea garden hills, flowing Brahmaputra, country boat.",
      cameraMove: "stable-pan",
      colorPalette: {
        skyTop: "#0284c7",
        skyBottom: "#bae6fd",
        water: "#0369a1",
        waterDeep: "#075985",
        hillFar: "#0e7490",
        hillNear: "#166534",
        paddy: "#84cc16",
        sun: "#fffbeb",
        accent: "#10b981"
      }
    },
    {
      id: "scene-4",
      name: "Spring Awakening & Champa Blossoms (Daylight Spring)",
      startTime: 135,
      endTime: 195,
      style: "spring-blossom-day",
      mood: "Radiant, Spring Bloom, Passionate",
      visualDescription: "Sunlit spring sky, cuckoo bird soaring over green riverbanks, white and golden Champa flower petals drifting across the river.",
      cameraMove: "stable-orbit",
      colorPalette: {
        skyTop: "#38bdf8",
        skyBottom: "#fef08a",
        water: "#0284c7",
        waterDeep: "#0369a1",
        hillFar: "#0284c7",
        hillNear: "#15803d",
        paddy: "#a3e635",
        sun: "#fef9c3",
        accent: "#fbbf24"
      }
    },
    {
      id: "scene-5",
      name: "Sens3i Electronic Drop (Vibrant Daylight Groove)",
      startTime: 195,
      endTime: 245,
      style: "electric-daylight",
      mood: "High Energy, Vibrant Daylight, Hypnotic Rhythm",
      visualDescription: "Radiant sunshine, emerald green rolling hills, sunburst flares, swaying bamboo, smooth audio wave reflections.",
      cameraMove: "stable-groove",
      colorPalette: {
        skyTop: "#1d4ed8",
        skyBottom: "#93c5fd",
        water: "#1e40af",
        waterDeep: "#172554",
        hillFar: "#2563eb",
        hillNear: "#16a34a",
        paddy: "#4ade80",
        sun: "#ffffff",
        accent: "#06d6a0"
      }
    },
    {
      id: "scene-6",
      name: "Boundless Heart (Golden Sun Horizon & Country Boat)",
      startTime: 245,
      endTime: 310,
      style: "golden-horizon",
      mood: "Eternal Love, Majestic Assam, Serene",
      visualDescription: "Magnificent open daylight horizon, golden sunbeams streaming across the wide Brahmaputra, wooden boat gliding gracefully with reflection.",
      cameraMove: "stable-wide-pullback",
      colorPalette: {
        skyTop: "#1e40af",
        skyBottom: "#fde047",
        water: "#1d4ed8",
        waterDeep: "#1e3a8a",
        hillFar: "#1d4ed8",
        hillNear: "#15803d",
        paddy: "#eab308",
        sun: "#fef08a",
        accent: "#f59e0b"
      }
    }
  ],
  lyrics: [
    {
      start: 5.0,
      end: 14.5,
      assamese: "নৈলৈ হালিলে ন ডালি ঐ ভলুকা",
      romanized: "Noiloi halile no dali oi bholuka",
      english: "The fresh young bamboo stalk bends towards the river",
      sceneId: "scene-1"
    },
    {
      start: 14.5,
      end: 23.5,
      assamese: "হালে পথাৰলৈ কাক মোৰে বহনা",
      romanized: "Haale potharoloi kak more bohona",
      english: "It sways toward the open fields, yearning and pining",
      sceneId: "scene-1"
    },
    {
      start: 23.5,
      end: 32.5,
      assamese: "বুকুৰ কামিহাড়ে হ'লেনো ডালি ডালি",
      romanized: "Bukur kamihare h'leno dali dali",
      english: "My ribs tremble and branch like tender boughs",
      sceneId: "scene-1"
    },
    {
      start: 32.5,
      end: 42.0,
      assamese: "কালৈ চিন্তা কৰি থাকনো ৰাতি ৰাতি",
      romanized: "Kaloi sinta kori thakno rati rati",
      english: "For whom do I keep thinking and staying awake, night after night?",
      sceneId: "scene-1"
    },
    {
      start: 42.5,
      end: 51.5,
      assamese: "নৈলৈ হালিলে ন ডালি ঐ ভলুকা",
      romanized: "Noiloi halile no dali oi bholuka",
      english: "The fresh young bamboo stalk bends towards the river",
      sceneId: "scene-2"
    },
    {
      start: 51.5,
      end: 60.5,
      assamese: "হালে পথাৰলৈ কাক মোৰে বহনা",
      romanized: "Haale potharoloi kak more bohona",
      english: "It sways toward the open fields, yearning and pining",
      sceneId: "scene-2"
    },
    {
      start: 60.5,
      end: 69.5,
      assamese: "বুকুৰ কামিহাড়ে হ'লেনো ডালি ডালি",
      romanized: "Bukur kamihare h'leno dali dali",
      english: "My ribs tremble and branch like tender boughs",
      sceneId: "scene-2"
    },
    {
      start: 69.5,
      end: 78.5,
      assamese: "কালৈ চিন্তা কৰি থাকনো ৰাতি ৰাতি",
      romanized: "Kaloi sinta kori thakno rati rati",
      english: "For whom do I keep thinking and staying awake, night after night?",
      sceneId: "scene-2"
    },
    {
      start: 79.0,
      end: 87.5,
      assamese: "ৰিঙ ৰিঙ ৰাঙ ৰাঙ কৰে দেহা মন কেনেবাখন লাগে",
      romanized: "Ring ring rang rang kore deha mon kenebakhan lage",
      english: "A restless buzzing stirs within my body, my heart feels strange and fluttery",
      sceneId: "scene-2"
    },
    {
      start: 87.5,
      end: 96.0,
      assamese: "পিলিঙা মনৰে তোৰো সোণ একেই গতি চাগে",
      romanized: "Pilinga monore toro xun ekei goti sage",
      english: "In your youthful, wild heart, my beloved, perhaps the same tremor beats",
      sceneId: "scene-3"
    },
    {
      start: 96.0,
      end: 104.5,
      assamese: "আবেলি গধূলি থাকোগৈ পদূলিত ৰৈ",
      romanized: "Abeli godhuli thakogoi podulit roi",
      english: "Through late afternoon till dusk, I wait by the courtyard gate",
      sceneId: "scene-3"
    },
    {
      start: 104.5,
      end: 113.0,
      assamese: "অহা যোৱা কৰ সোনাই মোকে চাবলৈ",
      romanized: "Oha jowa kor xunai moke saboloi",
      english: "Keep passing back and forth, my darling, just to catch a glimpse of me",
      sceneId: "scene-3"
    },
    {
      start: 113.0,
      end: 121.5,
      assamese: "সুহুৰিয়াই যাৱ চেনাই বুজি পোৱাকৈ",
      romanized: "Suhuriyai jabi senai buji puwakoi",
      english: "Whistle softly as you stroll past, so only I understand the signal",
      sceneId: "scene-3"
    },
    {
      start: 121.5,
      end: 129.5,
      assamese: "অহা যোৱা কৰ সোনাই মোকে চাবলৈ",
      romanized: "Oha jowa kor xunai moke saboloi",
      english: "Keep passing back and forth, my darling, just to see me",
      sceneId: "scene-3"
    },
    {
      start: 129.5,
      end: 138.0,
      assamese: "সুহুৰিয়াই যাৱ চেনাই বুজি পোৱাকৈ",
      romanized: "Suhuriyai jabi senai buji puwakoi",
      english: "Whistle softly as you stroll past, so our hearts connect",
      sceneId: "scene-3"
    },
    {
      start: 138.5,
      end: 147.0,
      assamese: "কুলিয়ে মাতে বসন্তত জান জুৰি নৈৰ সিপাৰত",
      romanized: "Kuliye mate bosonotot jaan juri noir siparot",
      english: "The cuckoo calls with spring's arrival across the shimmering riverbank",
      sceneId: "scene-4"
    },
    {
      start: 147.0,
      end: 155.5,
      assamese: "কেলৈ মৰম দিছিলি মোৰ কুমলীয়া অন্তৰত",
      romanized: "Keloi morom disili mur kumoliya ontorot",
      english: "Why did you bestow such boundless love into my tender, fragile heart?",
      sceneId: "scene-4"
    },
    {
      start: 155.5,
      end: 164.0,
      assamese: "নয়া নদী নয়া কুল ফুলি আছে চম্পা ফুল",
      romanized: "Noya nodi noya kul phuli ase sampa phul",
      english: "A new river, uncharted shores, and the fragrant Champa blossoms in full bloom",
      sceneId: "scene-4"
    },
    {
      start: 164.0,
      end: 173.0,
      assamese: "অন্তৰৰে মৰমে মোৰ নিবিচাৰে জাতি কুল",
      romanized: "Ontorore morome mur nibisare jati kul",
      english: "The true devotion of my soul seeks no caste, religion, or lineage",
      sceneId: "scene-4"
    },
    {
      start: 173.5,
      end: 182.0,
      assamese: "কুলিয়ে মাতে বসন্তত জান জুৰি নৈৰ সিপাৰত",
      romanized: "Kuliye mate bosonotot jaan juri noir siparot",
      english: "The cuckoo calls with spring's arrival across the shimmering riverbank",
      sceneId: "scene-4"
    },
    {
      start: 182.0,
      end: 190.5,
      assamese: "কেলৈ মৰম দিছিলি মোৰ কুমলীয়া অন্তৰত",
      romanized: "Keloi morom disili mur kumoliya ontorot",
      english: "Why did you bestow such boundless love into my tender, fragile heart?",
      sceneId: "scene-4"
    },
    {
      start: 190.5,
      end: 199.0,
      assamese: "নয়া নদী নয়া কুল ফুলি আছে চম্পা ফুল",
      romanized: "Noya nodi noya kul phuli ase sampa phul",
      english: "A new river, uncharted shores, and the fragrant Champa blossoms in full bloom",
      sceneId: "scene-5"
    },
    {
      start: 199.0,
      end: 209.0,
      assamese: "অন্তৰৰে মৰম মোৰ নিবিচাৰে জাতি কুল",
      romanized: "Ontorore morom mur nibisare jati kul",
      english: "The true devotion of my soul recognizes no divide or boundary",
      sceneId: "scene-5"
    },
    {
      start: 209.5,
      end: 228.0,
      assamese: "কলীয়া লতা... (Sens3i Electronic Drop & Bassline)",
      romanized: "Koliya lota... [Sens3i 808 Bass Groove & Drop]",
      english: "Tangled creeper vine... [Folk electronic fusion breakdown]",
      sceneId: "scene-5"
    },
    {
      start: 228.0,
      end: 247.0,
      assamese: "নৈলৈ হালিলে ন ডালি ঐ ভলুকা হালে পথাৰলৈ...",
      romanized: "Noiloi halile no dali oi bholuka haale potharoloi...",
      english: "As the bamboo bends to the river, as it sways to the open fields...",
      sceneId: "scene-5"
    },
    {
      start: 247.0,
      end: 265.0,
      assamese: "সুহুৰিয়াই যাৱ চেনাই বুজি পোৱাকৈ...",
      romanized: "Suhuriyai jabi senai buji puwakoi...",
      english: "Whistle softly as you pass, so our hearts resonate together...",
      sceneId: "scene-6"
    },
    {
      start: 265.0,
      end: 285.0,
      assamese: "অন্তৰৰে মৰমে মোৰ নিবিচাৰে জাতি কুল",
      romanized: "Ontorore morome mur nibisare jati kul",
      english: "For true love knows no boundaries across the stars and rivers",
      sceneId: "scene-6"
    },
    {
      start: 285.0,
      end: 305.0,
      assamese: "কলীয়া... বহনা (Outro Fade)",
      romanized: "Koliya... Bohona [Cinematic Celestial Outro]",
      english: "Koliya... Bohona — eternal echo across the Brahmaputra",
      sceneId: "scene-6"
    }
  ]
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = BOHONA_DATA;
}
