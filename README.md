# Generative Art Generator

A web-based generative art application built with Next.js that creates unique digital artworks using algorithmic processes.

## Features

- Real-time generative art creation
- Multiple algorithm options
- Customizable parameters and controls
- Export functionality (PNG, SVG)
- Responsive design
- Gallery of generated artworks

## Tech Stack

- **Framework**: Next.js 15
- **Styling**: Tailwind CSS 4
- **Canvas**: HTML5 Canvas API / p5.js
- **Package Manager**: pnpm
- **Deployment**: Vercel

## Installation

```bash
# Clone the repository
git clone https://github.com/mrkre/jitter-kit.git

# Navigate to project directory
cd jitter-kit

# Install dependencies
pnpm install

# Run development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

1. Select an algorithm from the available options
2. Adjust parameters using the control panel
3. Click "Generate" to create new artwork
4. Use "Export" to save your creation
5. Browse the gallery to view previous generations

## Algorithms

- **Uniform Grid**: Simple, uniform grid of shapes
- **Noise Displacement Grid**: Grid with elements displaced by a noise field
- **Recursive Subdivision**: A surface recursively divided into smaller shapes
- **Isometric Grid**: A grid with an isometric perspective
- **Perlin Noise Fields**: Flowing, organic patterns
- **Fractal Trees**: Recursive branching structures
- **Particle Systems**: Dynamic moving elements
- **Cellular Automata**: Grid-based evolution patterns
- **L-Systems**: Lindenmayer system generations

## Configuration

Parameters can be adjusted in real-time:

- Color palettes
- Complexity levels
- Animation speed
- Canvas dimensions
- Randomness factors

## Scripts

```bash
pnpm dev      # Start development server
pnpm build    # Create production build
pnpm start    # Start production server
pnpm lint     # Run ESLint
```

## Project Structure

```
├── components/
│   ├── ArtCanvas.js
│   ├── ControlPanel.js
│   └── Gallery.js
├── pages/
│   ├── api/
│   ├── _app.js
│   └── index.js
├── algorithms/
│   ├── perlinNoise.js
│   ├── fractals.js
│   └── particles.js
├── utils/
│   └── exportHelpers.js
└── styles/
    └── globals.css
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - see LICENSE file for details

## Credits

Built with modern web technologies and inspired by generative art pioneers.
