# Jitter Kit - Generative Art Engine

A sophisticated web-based generative art application built with Next.js 15 that creates unique digital artworks using advanced algorithmic processes and layer-based composition.

## ✨ Features

- **9 Advanced Generative Algorithms** - From simple grids to complex L-Systems
- **Multi-Layer Canvas System** - Create complex compositions with multiple interactive layers
- **Real-time Parameter Control** - Instant visual feedback with sophisticated parameter systems
- **Layer Management** - Add, remove, reorder, and blend layers with visibility controls
- **Performance Optimized** - Efficient rendering with p5.js and optimized algorithms
- **Export Capabilities** - High-quality PNG and SVG export functionality
- **Responsive Design** - Works seamlessly across desktop and mobile devices
- **Fullscreen Mode** - Immersive creation experience with keyboard shortcuts

## 🎨 Generative Algorithms

### Basic Algorithms
- **Uniform Grid** - Structured grids with customizable shapes and variations
- **Noise Displacement** - Organic blob patterns using multi-octave Perlin noise
- **Recursive Subdivision** - Complex grid patterns with linear/exponential subdivision
- **Isometric Grid** - 3D-style isometric shapes (cubes, pyramids, cylinders)

### Advanced Algorithms
- **Perlin Noise Fields** - Dynamic flow field visualizations
- **Fractal Trees** - Recursive branching structures with customizable parameters
- **Particle Systems** - Physics-based particle simulations with gravity and friction
- **Cellular Automata** - Conway's Game of Life and other cellular evolution patterns
- **L-Systems** - Lindenmayer systems for organic pattern generation (Koch curves, Dragon curves, etc.)

## 🚀 Tech Stack

- **Framework**: Next.js 15+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 4+
- **Canvas Rendering**: p5.js with React integration
- **State Management**: React Context + Zustand
- **UI Components**: Custom component library with Radix UI primitives
- **Package Manager**: pnpm
- **Deployment**: Vercel

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/mrkre/jitter-kit.git

# Navigate to project directory
cd jitter-kit

# Install dependencies using pnpm
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🎯 Usage

### Basic Workflow
1. **Select Algorithm** - Choose from 9 available generative algorithms
2. **Adjust Parameters** - Use the unified control panel to fine-tune generation
3. **Layer Management** - Add multiple layers for complex compositions
4. **Real-time Preview** - See changes instantly on the canvas
5. **Export Artwork** - Save your creation in high quality

### Layer System
- **Add Layers** - Create multiple layers with different algorithms
- **Layer Controls** - Toggle visibility, lock layers, adjust parameters per layer
- **Layer Removal** - Delete unwanted layers with confirmation dialogs
- **Layer Ordering** - Reorder layers for different compositional effects

### Advanced Features
- **Fullscreen Mode** - Press `F` or use the fullscreen button for immersive creation
- **Keyboard Shortcuts** - Efficient workflow with keyboard controls
- **Parameter Presets** - Save and load parameter configurations
- **Performance Monitoring** - Built-in performance optimization and monitoring

## 📁 Project Structure

```
jitter-kit/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # Root layout
│   └── page.tsx                 # Main application page
├── components/                   # React components
│   ├── ui/                      # Base UI components
│   │   ├── Button.tsx
│   │   ├── Slider.tsx
│   │   ├── Select.tsx
│   │   ├── ColorPicker.tsx
│   │   └── index.ts
│   ├── AppShell.tsx             # Main application layout
│   ├── Canvas.tsx               # Canvas wrapper with fullscreen
│   ├── P5Sketch.tsx             # p5.js integration component
│   ├── JitterContext.tsx        # Global state management
│   ├── UnifiedControlPanel.tsx  # Parameter control interface
│   └── Header.tsx               # Application header
├── lib/                         # Core library code
│   ├── engine/                  # Generative algorithm engine
│   │   ├── index.ts            # Main engine dispatcher
│   │   ├── basicAlgorithms.ts  # Basic pattern algorithms
│   │   ├── advancedAlgorithms.ts # Complex algorithms
│   │   ├── algorithmUtils.ts   # Shared algorithm utilities
│   │   ├── optimizedBasicAlgorithms.ts # Performance optimized versions
│   │   └── performanceTest.ts  # Performance testing framework
│   ├── algorithmConfig.ts       # Algorithm parameter definitions
│   ├── types.ts                 # TypeScript type definitions
│   └── store.ts                 # State management utilities
├── hooks/                       # Custom React hooks
│   └── useWelcomeVisibility.ts
├── styles/                      # Global styles
│   └── globals.css
├── .taskmaster/                 # Project task management
│   └── tasks/                   # Task definitions and tracking
├── CLAUDE.md                    # Development guidelines and conventions
└── README.md                    # This file
```

## ⚙️ Configuration

### Algorithm Parameters
Each algorithm supports extensive customization:

- **Density Controls** - Adjust complexity and element count
- **Color Palettes** - Multiple color schemes and custom color selection
- **Animation Settings** - Speed, duration, and animation types
- **Pattern Variations** - Shape variety, size variation, displacement intensity
- **Advanced Options** - Algorithm-specific parameters (noise octaves, branch angles, etc.)

### Performance Settings
- **Element Limits** - Automatic performance safeguards (max 10,000 elements)
- **Subdivision Caps** - Prevents exponential complexity explosions
- **Memory Management** - Efficient cleanup and resource management
- **Frame Rate Optimization** - Adaptive quality based on performance

## 🛠️ Development

### Available Scripts

```bash
pnpm dev          # Start development server
pnpm build        # Create production build
pnpm start        # Start production server
pnpm lint:check   # Run ESLint (check only)
pnpm lint         # Run ESLint with auto-fix
```

### Development Guidelines

- Follow the coding standards defined in `CLAUDE.md`
- Use **named exports** for all components (no default exports)
- Implement proper TypeScript typing throughout
- Follow the existing component architecture and patterns
- Ensure accessibility compliance (ARIA labels, keyboard navigation)

### Task Management

This project uses a structured task management system in `.taskmaster/tasks/`. Current major tasks include:
- Canvas rendering layer implementation
- UI controls integration
- Advanced layer compositing and clipping
- Performance optimizations
- Future Three.js migration for advanced blending modes

## 🎛️ Algorithm Details

### Recursive Subdivision
Supports three orientation modes:
- **Vertical**: Columns with increasing subdivision
- **Horizontal**: Rows with increasing subdivision  
- **Both**: 2D grid with quadrant-based subdivision

### L-Systems
Includes 8 pre-configured L-System patterns:
- Koch Curve, Dragon Curve, Sierpinski Triangle
- Plant Growth, Binary Tree, Levy C Curve
- Hilbert Curve, Gosper Island

### Cellular Automata
Multiple rule sets supported:
- Conway's Game of Life (23/3)
- Maze generation (125/36)
- Replicator (1357/1357)
- Fredkin (02468/1357)

## 🔮 Future Roadmap

### Planned Features
- **Three.js Migration** - Advanced shader-based layer blending and effects
- **Custom Shader Support** - User-defined GLSL shaders for unique effects
- **Advanced Export Options** - High-resolution rendering, animation export
- **Collaborative Features** - Share and remix community creations
- **Plugin System** - Extensible algorithm and effect architecture

### Performance Enhancements
- **WebGL Acceleration** - GPU-accelerated rendering for complex patterns
- **Web Workers** - Background processing for intensive computations
- **Layer Caching** - Intelligent caching for static layer content

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Follow the development guidelines in `CLAUDE.md`
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Credits

Built with modern web technologies and inspired by generative art pioneers. Special thanks to the p5.js community and the broader creative coding ecosystem.

---

**Jitter Kit** - Where algorithms meet artistry. Create, explore, and discover the beauty of generative art.