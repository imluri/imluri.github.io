// ============================================================
//  Portfolio Data — edit this file to update projects/tools/designs
// ============================================================

const PROJECTS = [
  {
    slug: "chessist",
    title: "Chessist",
    description: "A Chrome extension providing real-time Stockfish evaluation on Chess.com with live eval bar, best move arrows, and configurable auto-move features.",
    tags: ["JavaScript", "Chrome Extension", "Chess Engine"],
    link: "https://github.com/imluri/Chessist",
    image: "https://raw.githubusercontent.com/imluri/Chessist/main/logo.png",
    imageAlt: "Chessist Logo",
    details: {
      year: "2026",
      status: "Active",
      summary: "Chessist is a Chrome extension that runs a full Stockfish WASM engine inside Chess.com, giving you a live evaluation bar, best-move arrow overlays, and optional auto-move — all without leaving the browser.",
      highlights: [
        "Real-time Stockfish evaluation running entirely in the browser via WebAssembly",
        "Live eval bar that updates move-by-move",
        "Best move arrow overlays rendered directly on the Chess.com board",
        "Configurable auto-move with depth and time controls",
        "Zero server-side dependency — fully client-side",
      ],
      tech: ["JavaScript", "WebAssembly", "Chrome Extensions API", "Stockfish"],
    },
  },
  {
    slug: "apktoolkit",
    title: "APK Toolkit",
    description: "A comprehensive toolkit for Android APK modification and customization, making app modding easier and more accessible.",
    tags: ["Batchfile", "Python", "Android"],
    link: "https://github.com/imluri/apktoolkit",
    image: "https://raw.githubusercontent.com/imluri/apktoolkit/main/logo.png",
    imageAlt: "APK Toolkit Logo",
    details: {
      year: "2026",
      status: "Active",
      summary: "APK Toolkit is a Windows batch + Python workflow that wraps apktool, baksmali, smali, and uber-apk-signer into a numbered step-by-step pipeline — extract, decompile, patch, build, sign, install.",
      highlights: [
        "Numbered batch scripts for each stage of the APK mod pipeline",
        "Python scripts for patching smali bytecode and AndroidManifest.xml",
        "Bundles apktool, baksmali, smali, and uber-apk-signer — no separate installs",
        "Full flow script to run the entire pipeline in one command",
        "Designed for repeatability — easy to integrate into mod workflows",
      ],
      tech: ["Batchfile", "Python", "apktool", "smali / baksmali", "uber-apk-signer"],
    },
  },
  {
    slug: "iyai",
    title: "IYAI",
    description: "An AI-powered plugin for Infinite Yield, bringing intelligent automation and enhanced capabilities to the platform.",
    tags: ["Lua", "AI", "Plugin"],
    link: "https://github.com/imluri/IYAI",
    image: "https://raw.githubusercontent.com/imluri/IYAI/main/logo.png",
    imageAlt: "IYAI Logo",
    details: {
      year: "2026",
      status: "Active",
      summary: "IYAI is a Lua plugin for the Infinite Yield Roblox admin script that adds a full AI assistant layer. It can explore the instance tree, read and set properties, write and run Lua code, search the web, and execute IY commands — all from a chat interface.",
      highlights: [
        "Chat interface with full AI agent loop — tool calls, reasoning, and responses",
        "Explore the Roblox instance tree and read/set properties on any instance",
        "Write, edit, and execute Lua scripts directly from the plugin",
        "Supports OpenRouter, Mistral, Groq, Google AI Studio, Pollinations, HuggingFace, and Ollama",
        "Live model picker that fetches available models from the provider's API",
        "Rate-limit retry, inline error display, stop button, and session chat history",
        "GUI parented to gethui to avoid game detection",
        "Auto-updates — fetches latest version from GitHub on each run",
      ],
      tech: ["Lua", "Roblox API", "OpenRouter", "Groq", "Google AI Studio", "DuckDuckGo Search"],
    },
  },
];

const TOOLS = [
  {
    title: "Network Utilities",
    description: "Local tools and scripts for testing connectivity, performance, and network diagnostics.",
    tags: ["Networking", "Tools", "Diagnostics"],
    icon: "mdi:server-network",
    link: null,
  },
  {
    title: "Performance Tools",
    description: "Utilities for measuring latency, response time, and optimization impact across projects.",
    tags: ["Performance", "Monitoring", "Analysis"],
    icon: "mdi:speedometer",
    link: null,
  },
  {
    title: "3D Experiments",
    description: "Explorations in interactive 3D viewing, browser rendering, and visual prototypes.",
    tags: ["3D", "Visualization", "Interactive"],
    icon: "mdi:cube-scan",
    link: null,
  },
  {
    title: "Game Prototypes",
    description: "A showcase of game development ideas and browser-based interactive experiences.",
    tags: ["Games", "Prototype", "Browser"],
    icon: "mdi:gamepad-square",
    link: null,
  },
];

// Web design mockups — opened in an iframe modal
const DESIGNS = [
  {
    title: "Nasi Kandar Express",
    description: "Mamak restaurant website concept with vibrant colors, bold typography, and a warm modern layout.",
    tags: ["UI/UX", "HTML", "CSS"],
    preview: "https://raw.githubusercontent.com/imluri/imluri.github.io/main/assets/NKE_web.png",
    src: "designs/NKE.html",
  },
  {
    title: "BROWNIEMUNCH",
    description: "Artisanal bakery website concept with warm chocolate tones, product showcase, and approachable layout.",
    tags: ["UI/UX", "HTML", "CSS"],
    preview: "https://raw.githubusercontent.com/imluri/imluri.github.io/main/assets/BROWNIEMUNCH_web.png",
    src: "designs/browniemunch.html",
  },
  {
    title: "Nexus.AI",
    description: "Futuristic SaaS landing page concept with glowing cyan accents, typewriter hero, and a dark sci-fi aesthetic.",
    tags: ["UI/UX", "HTML", "Tailwind"],
    preview: null,
    src: "designs/nexus.html",
  },
];

// Hobby projects — personal stuff outside work
const HOBBIES = [
  {
    title: "Unity Game Mods & Cheats",
    description: "C# mods and cheat tools for Unity games — memory patching, internal hooks, custom overlays, and gameplay automation.",
    tags: ["C#", "Unity", "Reverse Engineering"],
    icon: "mdi:sword-cross",
    link: null,
  },
  {
    title: "Game Development",
    description: "Personal game projects and prototypes built in Unity. From mechanics experiments to small complete experiences.",
    tags: ["C#", "Unity", "Game Dev"],
    icon: "mdi:controller-classic",
    link: null,
  },
  {
    title: "Roblox / Luau Scripting",
    description: "Games and scripts built on Roblox using Luau — multiplayer systems, admin tools, and gameplay experiences.",
    tags: ["Luau", "Roblox", "Games"],
    icon: "mdi:gamepad-variant",
    link: null,
  },
];
