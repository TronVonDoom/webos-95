# WebOS-95 v2

A Windows 95 style web desktop environment with drag-and-drop file management.

## Features

- 🖥️ Authentic Windows 95 UI styling
- 📁 Drag-and-drop file management between desktop, A: drive (floppy), and C: drive
- 🪟 Window management with minimize, close, drag, and resize
- 🎵 Retro sound effects
- 🖼️ Screensaver after inactivity
- 💾 Floppy drive (A:) simulation
- 💿 My Computer with C: drive navigation

## Project Structure

```
src/
├── types/              # TypeScript type definitions
│   └── index.ts
├── config/             # Configuration and initial data
│   ├── icons.ts        # Icon URL constants
│   └── initialData.ts  # Initial files, windows, etc.
├── contexts/           # React Context providers
│   ├── FileSystemContext.tsx   # File management state
│   ├── WindowManagerContext.tsx # Window state
│   └── SystemContext.tsx       # Boot, sound, screensaver
├── services/           # Service modules
│   └── sounds.ts       # Sound effect system
├── components/
│   ├── ui/             # Reusable UI components
│   │   ├── RetroButton.tsx
│   │   ├── ContextMenu.tsx
│   │   └── WindowFrame.tsx
│   ├── desktop/        # Desktop-level components
│   │   ├── DesktopIcon.tsx
│   │   ├── DesktopArea.tsx
│   │   ├── Taskbar.tsx
│   │   └── StartMenu.tsx
│   ├── system/         # System-level screens
│   │   ├── SoundPrompt.tsx
│   │   ├── BootScreen.tsx
│   │   └── Screensaver.tsx
│   └── apps/           # Application components
│       ├── FloppyDrive.tsx
│       ├── MyComputer.tsx
│       └── PlaceholderApps.tsx
└── App.tsx             # Main app component
```

## Drag and Drop

Files can be dragged between:
- Desktop
- A: Drive (Floppy)
- C: Drive (in My Computer)

The system uses HTML5 Drag and Drop API with a custom MIME type for file data.

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Technologies

- React 18
- TypeScript
- Vite
- TailwindCSS
- Web Audio API (for sounds)
- HTML5 Drag and Drop API
