interface ParameterConfig {
  key: string
  label: string
  type: 'slider' | 'select' | 'text'
  min?: number
  max?: number
  step?: number
  options?: { value: string; label: string }[]
  defaultValue: number | string
  formatValue?: (value: number) => string
}

export const algorithmParameters: Record<string, ParameterConfig[]> = {
  uniform: [
    {
      key: 'density',
      label: 'Grid Density',
      type: 'slider',
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 10,
    },
    {
      key: 'shapeVariety',
      label: 'Shape Variety',
      type: 'slider',
      min: 1,
      max: 8,
      step: 1,
      defaultValue: 1,
    },
    {
      key: 'sizeVariation',
      label: 'Size Variation',
      type: 'slider',
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 3,
    },
  ],

  noise: [
    {
      key: 'density',
      label: 'Grid Density',
      type: 'slider',
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 15,
    },
    {
      key: 'noiseScale',
      label: 'Noise Scale',
      type: 'slider',
      min: 0.001,
      max: 0.1,
      step: 0.001,
      defaultValue: 0.01,
      formatValue: (value) => `${(value * 1000).toFixed(0)}‰`,
    },
    {
      key: 'octaves',
      label: 'Octaves',
      type: 'slider',
      min: 1,
      max: 8,
      step: 1,
      defaultValue: 4,
    },
    {
      key: 'gutter',
      label: 'Spacing',
      type: 'slider',
      min: 0,
      max: 20,
      step: 1,
      defaultValue: 5,
    },
    {
      key: 'displacementIntensity',
      label: 'Displacement Intensity',
      type: 'slider',
      min: 0.1,
      max: 3,
      step: 0.1,
      defaultValue: 1,
      formatValue: (value) => `${value.toFixed(1)}x`,
    },
  ],

  recursive: [
    {
      key: 'orientation',
      label: 'Grid Orientation',
      type: 'select',
      options: [
        { value: 'vertical', label: 'Vertical' },
        { value: 'horizontal', label: 'Horizontal' },
        { value: 'both', label: 'Both' },
      ],
      defaultValue: 'vertical',
    },
    {
      key: 'numColumns',
      label: 'Number of Columns',
      type: 'slider',
      min: 5,
      max: 30,
      step: 1,
      defaultValue: 15,
    },
    {
      key: 'numRows',
      label: 'Number of Rows',
      type: 'slider',
      min: 5,
      max: 30,
      step: 1,
      defaultValue: 15,
    },
    {
      key: 'solidBarCountX',
      label: 'Solid Bar Count X',
      type: 'slider',
      min: 0,
      max: 15,
      step: 1,
      defaultValue: 0,
    },
    {
      key: 'solidBarCountY',
      label: 'Solid Bar Count Y',
      type: 'slider',
      min: 0,
      max: 15,
      step: 1,
      defaultValue: 0,
    },
    {
      key: 'subdivisionMode',
      label: 'Subdivision Mode',
      type: 'select',
      options: [
        { value: 'linear', label: 'Linear' },
        { value: 'exponential', label: 'Exponential' },
      ],
      defaultValue: 'linear',
    },
    {
      key: 'cellPadding',
      label: 'Cell Padding',
      type: 'slider',
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 0,
    },
  ],

  isometric: [
    {
      key: 'density',
      label: 'Grid Density',
      type: 'slider',
      min: 1,
      max: 30,
      step: 1,
      defaultValue: 12,
    },
    {
      key: 'perspective',
      label: 'Perspective',
      type: 'slider',
      min: 0,
      max: 2,
      step: 0.1,
      defaultValue: 0.5,
      formatValue: (value) => `${value.toFixed(1)}`,
    },
    {
      key: 'shape',
      label: 'Shape Type',
      type: 'select',
      options: [
        { value: 'cubes', label: 'Cubes' },
        { value: 'pillars', label: 'Pillars' },
        { value: 'pyramids', label: 'Pyramids' },
        { value: 'mixed', label: 'Mixed' },
      ],
      defaultValue: 'cubes',
    },
    {
      key: 'heightVariation',
      label: 'Height Variation',
      type: 'slider',
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 1,
    },
  ],

  perlin: [
    {
      key: 'density',
      label: 'Field Resolution',
      type: 'slider',
      min: 5,
      max: 100,
      step: 5,
      defaultValue: 20,
    },
    {
      key: 'fieldStrength',
      label: 'Field Strength',
      type: 'slider',
      min: 0.1,
      max: 5,
      step: 0.1,
      defaultValue: 1,
      formatValue: (value) => `${value.toFixed(1)}x`,
    },
    {
      key: 'flowSpeed',
      label: 'Flow Speed',
      type: 'slider',
      min: 0.001,
      max: 0.05,
      step: 0.001,
      defaultValue: 0.01,
      formatValue: (value) => `${(value * 1000).toFixed(0)}‰`,
    },
  ],

  fractal: [
    {
      key: 'treeCount',
      label: 'Number of Trees',
      type: 'slider',
      min: 1,
      max: 12,
      step: 1,
      defaultValue: 3,
    },
    {
      key: 'iterations',
      label: 'Iterations',
      type: 'slider',
      min: 3,
      max: 14,
      step: 1,
      defaultValue: 10,
    },
    {
      key: 'branchAngle',
      label: 'Branch Angle',
      type: 'slider',
      min: 5,
      max: 90,
      step: 5,
      defaultValue: 30,
      formatValue: (value) => `${value}°`,
    },
    {
      key: 'branchLength',
      label: 'Branch Length',
      type: 'slider',
      min: 0.3,
      max: 1.2,
      step: 0.05,
      defaultValue: 0.8,
      formatValue: (value) => `${Math.round(value * 100)}%`,
    },
    {
      key: 'scalingExponent',
      label: 'Scaling Exponent (α)',
      type: 'slider',
      min: 1.0,
      max: 3.0,
      step: 0.05,
      defaultValue: 2.0,
      formatValue: (value) => value.toFixed(2),
    },
  ],

  particles: [
    {
      key: 'particleCount',
      label: 'Particle Count',
      type: 'slider',
      min: 10,
      max: 1000,
      step: 10,
      defaultValue: 200,
    },
    {
      key: 'gravity',
      label: 'Gravity',
      type: 'slider',
      min: -2,
      max: 2,
      step: 0.1,
      defaultValue: 0.2,
      formatValue: (value) => `${value.toFixed(1)}`,
    },
    {
      key: 'friction',
      label: 'Friction',
      type: 'slider',
      min: 0.8,
      max: 1,
      step: 0.01,
      defaultValue: 0.95,
      formatValue: (value) => `${Math.round(value * 100)}%`,
    },
  ],

  cellular: [
    {
      key: 'density',
      label: 'Grid Size',
      type: 'slider',
      min: 10,
      max: 100,
      step: 5,
      defaultValue: 40,
    },
    {
      key: 'generations',
      label: 'Generations',
      type: 'slider',
      min: 1,
      max: 50,
      step: 1,
      defaultValue: 10,
    },
    {
      key: 'survivalRules',
      label: 'Survival Rules',
      type: 'select',
      options: [
        { value: '23/3', label: "Conway's Life (23/3)" },
        { value: '125/36', label: 'Maze (125/36)' },
        { value: '1357/1357', label: 'Replicator (1357/1357)' },
        { value: '02468/1357', label: 'Fredkin (02468/1357)' },
      ],
      defaultValue: '23/3',
    },
  ],

  lsystem: [
    {
      key: 'iterations',
      label: 'Iterations',
      type: 'slider',
      min: 1,
      max: 8,
      step: 1,
      defaultValue: 4,
    },
    {
      key: 'angle',
      label: 'Turn Angle',
      type: 'slider',
      min: 15,
      max: 180,
      step: 15,
      defaultValue: 90,
      formatValue: (value) => `${value}°`,
    },
    {
      key: 'pattern',
      label: 'L-System Pattern',
      type: 'select',
      options: [
        { value: 'koch', label: 'Koch Curve (F=F+F-F-F+F)' },
        { value: 'dragon', label: 'Dragon Curve (X=X+YF+, Y=-FX-Y)' },
        {
          value: 'sierpinski',
          label: 'Sierpinski Triangle (F=F-G+F+G-F, G=GG)',
        },
        { value: 'plant', label: 'Plant Growth (X=F+[[X]-X]-F[-FX]+X, F=FF)' },
        { value: 'tree', label: 'Binary Tree (F=F[+F]F[-F]F)' },
        { value: 'levy', label: 'Levy C Curve (F=+F--F+)' },
        {
          value: 'hilbert',
          label: 'Hilbert Curve (A=-BF+AFA+FB-, B=+AF-BFB-FA+)',
        },
        {
          value: 'gosper',
          label: 'Gosper Island (A=A-B--B+A++AA+B-, B=+A-BB--B-A++A+B)',
        },
      ],
      defaultValue: 'koch',
    },
  ],
}

export function getParametersForAlgorithm(
  algorithm: string
): ParameterConfig[] {
  return algorithmParameters[algorithm] || algorithmParameters.uniform
}

export function getDefaultParamsForAlgorithm(
  algorithm: string
): Record<string, any> {
  const params = getParametersForAlgorithm(algorithm)
  const defaults: Record<string, any> = {}

  params.forEach((param) => {
    defaults[param.key] = param.defaultValue
  })

  return defaults
}
